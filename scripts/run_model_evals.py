"""Authenticated development CLI model evaluation. Product runtime has no dependencies."""
import sys
from pathlib import Path
if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import argparse, hashlib, json, re, shutil, subprocess, tempfile, time
from copy import deepcopy
from pathlib import Path
from datetime import datetime, timezone
import yaml
from scripts.common import ROOT, load, frontmatter
from scripts.generate_adapters import generate
from scripts.context_pack import import_pack
from scripts.package_inventory import inventory
JUDGE_SCHEMA={'type':'object','properties':{'assertions':{'type':'array','items':{'type':'object','properties':{'id':{'type':'string'},'pass':{'type':'boolean'},'reason':{'type':'string'},'evidence_quote':{'type':'string'}},'required':['id','pass','reason','evidence_quote'],'additionalProperties':False}}},'required':['assertions'],'additionalProperties':False}
JUDGE_LINE_SCHEMA=deepcopy(JUDGE_SCHEMA)
_line_row=JUDGE_LINE_SCHEMA['properties']['assertions']['items']
_line_row['properties'].pop('evidence_quote')
_line_row['properties']['evidence_line']={'type':'integer','minimum':0}
_line_row['required']=['id','pass','reason','evidence_line']
class RateLimitError(RuntimeError): pass
class ModelTimeoutError(RuntimeError): pass
def prompt_asset(name):
    return (ROOT/'evals/prompts'/name).read_text()

def suite_fingerprint(paths,root=ROOT):
    files=set(paths)
    files.update((root/'evals/prompts').glob('*.txt'))
    for relative in ['evals/tier-policy.json', 'scripts/run_model_evals.py', 'scripts/eval_protocol.py', 'docs/review-improvement-protocol.md', 'evals/assertions/release-blockers.yaml']:
        if (root/relative).is_file(): files.add(root/relative)
    for path in paths:
        case=yaml.safe_load(path.read_text())
        if case.get('persona'): files.add(root/f"evals/personas/{case['persona']}.yaml")
        if case.get('context_fixture'): files.add(root/case['context_fixture'])
    return hashlib.sha256(''.join(p.relative_to(root).as_posix()+hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(files)).encode()).hexdigest()
def fingerprint(root):
    platform='chatgpt' if (root/'plugin.json').is_file() else 'claude'
    return hashlib.sha256(''.join(relative+hashlib.sha256((root/relative).read_bytes()).hexdigest() for relative in inventory(root,platform)).encode()).hexdigest()
def lossless(original,restored):
    # Optional schema knowledge fields may be materialized as null; existing values stay exact.
    # Schema validation is performed separately before this comparator.
    if isinstance(original,dict):
        return isinstance(restored,dict) and all(k in restored and lossless(v,restored[k]) for k,v in original.items()) and all(v is None for k,v in restored.items() if k not in original)
    if isinstance(original,list):
        return isinstance(restored,list) and len(original)==len(restored) and all(lossless(a,b) for a,b in zip(original,restored))
    return type(original) is type(restored) and original==restored

def extract_json(text):
    fenced=re.search(r'```(?:json)?\s*\n(.*?)\n```',text,re.S)
    return json.loads(fenced.group(1) if fenced else text)
def package_context(root,platform,case):
    root=Path(root).resolve()
    ref=root/'references'; paths=[ref/'host.md',ref/'core/router/routing.md',ref/'core/router/intent-catalog.yaml',ref/'core/state/state.md',*sorted((ref/'core/principles').glob('*.md'))]
    if case.get('workflow'):
        workflow=next(p for p in (ref/'core/workflows').glob('w*.md') if frontmatter(p)[0]['id']==case['workflow'])
        paths.append(workflow); meta,_=frontmatter(workflow)
        paths.append(ref/f"core/artifacts/{meta['artifact']}.md")
        paths.extend(ref/f'core/capabilities/{c}.md' for c in meta['capabilities'])
        if case['workflow']=='W06': paths.append(ref/'core/artifacts/interview-cheat-sheet.md')
    else:
        paths.extend(sorted((ref/'schemas').glob('*.json')))
        paths.extend(sorted((ref/'templates').glob('*.json')))
    if platform=='claude': paths.insert(0,root/'SKILL.md')
    else:
        config=load(ROOT/'adapters/skills.json')
        name=case.get('capability') or next(e['name'] for e in config if e['workflow']==case['workflow'])
        paths.insert(0,root/f'skills/{name}/SKILL.md')
    # Include linked capability/artifact contracts recursively, as a deterministic file-reading shim.
    i=0
    while i<len(paths):
        path=paths[i]; i+=1
        for relative in re.findall(r'\[[^\]]*\]\(([^)]+)\)',path.read_text()):
            if ':' in relative or relative.startswith('#'): continue
            linked=(path.parent/relative.split('#')[0]).resolve()
            if case.get('workflow'):
                # Entry links are a menu, not an instruction to preload all nine workflows.
                if linked.parent==ref.resolve()/'core/workflows' and linked.name!=workflow.name: continue
                if (ref/'schemas').resolve() in linked.parents: continue
                if (ref/'templates').resolve() in linked.parents and linked.suffix!='.md': continue
            if linked.is_relative_to(root.resolve()) and linked.is_file() and linked not in [p.resolve() for p in paths]: paths.append(linked)
    unique=list(dict.fromkeys(p.resolve() for p in paths))
    hashes={p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in unique}
    content='\n\n'.join(f'<package-file path="{p.relative_to(root)}">\n{p.read_text()}\n</package-file>' for p in unique)
    return content,hashes
def call_model(platform,prompt,folder,stem,schema=None):
    folder.mkdir(parents=True,exist_ok=True); output=folder/f'{stem}.txt'
    # The caller archives prior runs. A fresh invocation must never consume an old response/log.
    for path in (output,folder/f'{stem}.stdout.txt',folder/f'{stem}.stderr.txt'):
        path.unlink(missing_ok=True)
    if platform=='chatgpt':
        cmd=['codex','exec','--ignore-user-config','--ephemeral','--skip-git-repo-check','--sandbox','read-only','-o',str(output)]
        if schema:
            file=folder/f'{stem}.schema.json'; file.write_text(json.dumps(schema)); cmd+=['--output-schema',str(file)]
        cmd+=['-']
    else:
        cmd=['claude','-p','--no-session-persistence','--setting-sources','','--strict-mcp-config','--tools','','--output-format','json']
        if schema: cmd+=['--json-schema',json.dumps(schema)]
    def invoke(isolated):
        output.unlink(missing_ok=True)
        try:
            return subprocess.run(cmd,input=prompt,text=True,capture_output=True,cwd=isolated,timeout=600)
        except subprocess.TimeoutExpired as error:
            def decoded(value):
                return value.decode('utf-8',errors='replace') if isinstance(value,bytes) else value or ''
            (folder/f'{stem}.stdout.txt').write_text(decoded(error.stdout))
            (folder/f'{stem}.stderr.txt').write_text(decoded(error.stderr)+'\nModel invocation timed out after 600 seconds.\n')
            output.unlink(missing_ok=True)
            raise ModelTimeoutError(f'{platform}: model invocation timed out; partial logs preserved in {stem}.stdout.txt/{stem}.stderr.txt') from error
    # Evaluate only synthetic requests. Tool use is prohibited; temp cwd avoids repository instructions.
    with tempfile.TemporaryDirectory(prefix='careerpilot-eval-') as isolated:
        result=invoke(isolated)
        for retry in range(1,3):
            if not result.returncode or 'Selected model is at capacity' not in result.stderr: break
            (folder/f'{stem}.capacity-{retry}.stdout.txt').write_text(result.stdout)
            (folder/f'{stem}.capacity-{retry}.stderr.txt').write_text(result.stderr)
            time.sleep(5)
            result=invoke(isolated)
    (folder/f'{stem}.stdout.txt').write_text(result.stdout); (folder/f'{stem}.stderr.txt').write_text(result.stderr)
    error_text=result.stderr+result.stdout
    raw=json.loads(result.stdout) if platform=='claude' and not result.returncode else None
    model_error=bool(result.returncode) or bool(raw and raw.get('is_error'))
    if model_error and ('hit your limit' in error_text or 'hit your usage limit' in error_text):
        raise RateLimitError(f'{platform}: account usage limit; see {stem}.stdout.txt/{stem}.stderr.txt for reset time')
    service_error=result.stderr if platform=='chatgpt' else (result.stdout if result.returncode else str((raw or {}).get('result','')))+result.stderr
    if model_error and re.search(r'\b429\b|Too Many Requests',service_error,re.I):
        raise RateLimitError(f'{platform}: model service rate limit (429); see {stem}.stdout.txt/{stem}.stderr.txt; resume after service recovery')
    if result.returncode: raise RuntimeError(f'{platform} CLI exited {result.returncode}; see {stem}.stderr.txt')
    if platform=='chatgpt':
        if not output.is_file(): raise RuntimeError('Missing actual model output')
        response=output.read_text(); model=re.search(r'^model:\s*(.+)$',result.stderr,re.M)
        model_id=model.group(1) if model else 'CLI default; model ID not exposed'
    else:
        if raw.get('is_error'): raise RuntimeError('Claude model error')
        response=json.dumps(raw['structured_output']) if 'structured_output' in raw else raw.get('result','')
        model_id=','.join(raw.get('modelUsage',{})) or 'CLI default; model ID not exposed'
        output.write_text(response)
    if not response.strip(): raise RuntimeError('Empty model response')
    return response,model_id
def grade(assertions,raw,transcript):
    value=extract_json(raw); rows=value.get('assertions',[])
    if len(rows)!=len(assertions) or {r['id'] for r in rows}!=set(assertions): raise ValueError('Judge omitted/duplicated assertions')
    answer_text='\n'.join(t['content'] for t in transcript if t['role']=='assistant')
    for row in rows:
        if type(row.get('pass')) is not bool or not row.get('reason'): raise ValueError('Invalid judge verdict')
        quote=row.get('evidence_quote','')
        if not quote or quote not in answer_text: raise ValueError('Judge evidence is not an actual assistant quote')
    return rows
def assistant_lines(history):
    return [line for turn in history if turn['role']=='assistant'
            for line in turn['content'].splitlines() if line.strip()]

def grade_lines(assertions,raw,history):
    lines=assistant_lines(history); value=extract_json(raw)
    if not isinstance(value,dict) or not isinstance(value.get('assertions'),list):
        raise ValueError('Invalid line-selected verdict')
    rows=[]
    for row in value['assertions']:
        if not isinstance(row,dict): raise ValueError('Invalid line-selected assertion')
        selected=row.get('evidence_line')
        if type(selected) is not int or not 0<=selected<len(lines):
            raise ValueError('Judge selected a nonexistent assistant line')
        rows.append({'id':row.get('id'),'pass':row.get('pass'),'reason':row.get('reason'),
                     'evidence_quote':lines[selected]})
    return grade(assertions,json.dumps({'assertions':rows}),history)

def judge_transcript(platform,case,history,persona,seed,folder,stem='judge'):
    prompt=prompt_asset('judge.txt')+json.dumps(case['assertions'],ensure_ascii=False)+'\nSynthetic user context available to subject:\n'+json.dumps(persona,ensure_ascii=False)+'\nSeed context:\n'+json.dumps(seed,ensure_ascii=False)+'\nTranscript:\n'+json.dumps(history,ensure_ascii=False)
    verdict,judge_model=call_model(platform,prompt,folder,stem,JUDGE_SCHEMA)
    try:
        rows=grade(case['assertions'],verdict,history)
    except ValueError as error:
        # A malformed judge citation is a harness error, never an automatic pass. Request a fresh
        # independent decision with literal evidence; persist both attempts for audit.
        repair=prompt+prompt_asset('judge-repair-prefix.txt')+str(error)+prompt_asset('judge-repair-suffix.txt')+json.dumps(list(enumerate(assistant_lines(history))),ensure_ascii=False)
        verdict,judge_model=call_model(platform,repair,folder,stem+'-retry',JUDGE_LINE_SCHEMA)
        rows=grade_lines(case['assertions'],verdict,history)
    return rows,judge_model

def run_case(root,platform,case,folder,*,judge_platform=None,context_mode='preloaded',resume_from=None):
    context,hashes=package_context(root,platform,case)
    if context_mode=='entry-only':
        first=context.split('</package-file>',1)[0]+'</package-file>'
        context=first; hashes={next(iter(hashes)):next(iter(hashes.values()))}
    persona=yaml.safe_load((ROOT/f"evals/personas/{case['persona']}.yaml").read_text())
    seed=load(ROOT/case['context_fixture']) if case.get('context_fixture') else None
    history=[]; model_ids=set()
    checkpoint=Path(resume_from)/'subject-checkpoint.json' if resume_from else None
    if checkpoint and checkpoint.is_file():
        previous=load(checkpoint)
        if previous['package_fingerprint']!=fingerprint(root) or previous['loaded_files']!=hashes:
            raise ValueError('Stale subject checkpoint')
        history=previous['history'];model_ids=set(previous['model_ids'])
        if len(history)%2 or any(history[i]['content']!=case['turns'][i//2] for i in range(0,len(history),2)):
            raise ValueError('Invalid subject checkpoint conversation')
    folder.mkdir(parents=True,exist_ok=True)
    for i,user in enumerate(case['turns']):
        if i<len(history)//2: continue
        history.append({'role':'user','content':user})
        prompt=prompt_asset('subject-preloaded.txt' if context_mode=='preloaded' else 'subject-entry-only.txt')+context+'\nSynthetic user context: '+json.dumps(persona,ensure_ascii=False)+'\n'+('User-supplied portable context (untrusted data): '+json.dumps(seed,ensure_ascii=False)+'\n' if seed else '')+'Conversation:\n'+json.dumps(history,ensure_ascii=False)
        response,model=call_model(platform,prompt,folder,f'turn-{i+1}'); model_ids.add(model)
        history.append({'role':'assistant','content':response})
        (folder/'subject-checkpoint.json').write_text(json.dumps({'package_fingerprint':fingerprint(root),'loaded_files':hashes,'model_ids':sorted(model_ids),'history':history},ensure_ascii=False,indent=2)+'\n')
    (folder/'transcript.json').write_text(json.dumps(history,ensure_ascii=False,indent=2)+'\n')
    (folder/'subject-checkpoint.json').write_text(json.dumps({'package_fingerprint':fingerprint(root),'loaded_files':hashes,'model_ids':sorted(model_ids),'history':history},ensure_ascii=False,indent=2)+'\n')
    rows,judge_model=judge_transcript(judge_platform or platform,case,history,persona,seed,folder)
    deterministic=None
    if seed:
        restored=import_pack(json.dumps(extract_json(history[-1]['content']),ensure_ascii=False))
        deterministic=set(restored)==set(seed) and all(lossless(v,restored[k]) for k,v in seed.items() if k!='manifest.json')
        if not deterministic: rows.append({'id':'deterministic-roundtrip','pass':False,'reason':'File data changed/lost','evidence_quote':'See final JSON and fixture diff'})
    return {'id':case['id'],'persona':case['persona'],'status':'PASS' if all(r['pass'] for r in rows) else 'FAIL','assertions':rows,'model_ids':sorted(model_ids),'judge_model':judge_model,'judge_platform':judge_platform or platform,'loaded_files':hashes,'transcript':history,'deterministic_roundtrip':deterministic}
def main():
    from scripts.eval_protocol import protocol, protocol_fingerprint, judge_platform, summarize
    parser=argparse.ArgumentParser()
    parser.add_argument('--platform',choices=['chatgpt','claude'],required=True)
    parser.add_argument('--scenario',action='append')
    parser.add_argument('--resume',action='store_true')
    parser.add_argument('--runs',type=int,help='Override every scenario repetition count (diagnostic)')
    parser.add_argument('--judge',choices=['tiered','same','cross'],default='tiered')
    parser.add_argument('--context',choices=['preloaded','entry-only'],default='preloaded')
    parser.add_argument('--report-dir',type=Path,default=ROOT/'dist/evals')
    parser.add_argument('--package-root',type=Path,help='Existing immutable runtime package instead of regeneration')
    args=parser.parse_args()
    config=protocol(context=args.context,runs=args.runs,judge=args.judge)
    config_digest=protocol_fingerprint(config)
    source=args.package_root or generate(args.platform)
    with tempfile.TemporaryDirectory(prefix='careerpilot-package-') as isolated:
        root=Path(isolated)/'careerpilot'
        for relative in inventory(source,args.platform):
            path=root/relative;path.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source/relative,path)
        digest=fingerprint(root)
        suite=sorted((ROOT/'evals/scenarios').glob('*.yaml'))
        definitions={yaml.safe_load(p.read_text())['id']:yaml.safe_load(p.read_text()) for p in suite}
        if {r['id'] for r in config['scenarios']}!=set(definitions):
            raise ValueError('Tier policy must cover every scenario exactly once')
        if args.scenario and not set(args.scenario)<=set(definitions):
            raise ValueError('Unknown scenario selection')
        suite_digest=suite_fingerprint(suite)
        report_path=args.report_dir.resolve()/f'{args.platform}.json'
        report_path.parent.mkdir(parents=True,exist_ok=True)
        report={'platform':args.platform,'package_fingerprint':digest,'suite_fingerprint':suite_digest,
                'protocol':config,'protocol_fingerprint':config_digest,
                'started_at':datetime.now(timezone.utc).isoformat(),
                'scope':'Development CLI behavior with preloaded references; reference discovery and native install NOT VERIFIED',
                'cases':[]}
        if report_path.exists():
            if not args.resume: raise ValueError('Existing report: use --resume or a new report directory; never overwrite evidence')
            old=load(report_path)
            if any(old.get(k)!=report[k] for k in ['platform','package_fingerprint','suite_fingerprint','protocol_fingerprint','protocol']):
                raise ValueError('Resume package/suite/protocol mismatch; use a new report directory')
            report=old
        summarize(report)
        report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
        stopped=False
        for tier in config['scenarios']:
            if stopped: break
            case=definitions[tier['id']]
            if args.scenario and case['id'] not in args.scenario: continue
            for run in range(1,tier['runs']+1):
                old=next((r for r in report['cases'] if (r['id'],r['run'])==(case['id'],run)),None)
                if old and old['status'] in ['PASS','FAIL']: continue
                attempt=1+len(old.get('prior_attempts',[]))+1 if old else 1
                folder=report_path.parent/'runs'/args.platform/case['id']/f'run-{run}'/f'attempt-{attempt}'
                prior=old.get('prior_attempts',[])+[{k:v for k,v in old.items() if k!='prior_attempts'}] if old else []
                print(f"Evaluating {args.platform}: {case['id']} run {run}/{tier['runs']} judge={judge_platform(args.platform,tier)}",flush=True)
                limited=False
                try:
                    row=run_case(root,args.platform,case,folder,judge_platform=judge_platform(args.platform,tier),
                                 context_mode=args.context,resume_from=old.get('attempt_path') if old else None)
                except (RateLimitError,ModelTimeoutError) as error:
                    row={'id':case['id'],'persona':case['persona'],'status':'ERROR','error':str(error)};limited=True
                except Exception as error:
                    row={'id':case['id'],'persona':case['persona'],'status':'ERROR','error':str(error)}
                row.update(run=run,tier=tier['tier'],attempt_path=str(folder),prior_attempts=prior)
                report['cases']=[r for r in report['cases'] if (r['id'],r['run'])!=(case['id'],run)]+[row]
                summarize(report);report['updated_at']=datetime.now(timezone.utc).isoformat()
                report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
                print(f"{case['id']} run {run}: {row['status']}",flush=True)
                if limited:
                    print('Provider interruption: all evidence preserved; stop until recovery.',flush=True)
                    stopped=True;break
        if report['status']!='PASS': raise SystemExit(1)
if __name__=='__main__': main()
