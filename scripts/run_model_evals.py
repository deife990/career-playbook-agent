"""Authenticated development CLI model evaluation. Product runtime has no dependencies."""
import sys
from pathlib import Path
if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import argparse, hashlib, json, re, shutil, subprocess, tempfile, time
from pathlib import Path
from datetime import datetime, timezone
import yaml
from scripts.common import ROOT, load, frontmatter
from scripts.generate_adapters import generate
from scripts.context_pack import import_pack
from scripts.package_inventory import inventory
JUDGE_SCHEMA={'type':'object','properties':{'assertions':{'type':'array','items':{'type':'object','properties':{'id':{'type':'string'},'pass':{'type':'boolean'},'reason':{'type':'string'},'evidence_quote':{'type':'string'}},'required':['id','pass','reason','evidence_quote'],'additionalProperties':False}}},'required':['assertions'],'additionalProperties':False}
class RateLimitError(RuntimeError): pass
def suite_fingerprint(paths,root=ROOT):
    files=set(paths)
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
                if (ref/'schemas').resolve() in linked.parents or (ref/'templates').resolve() in linked.parents: continue
            if linked.is_relative_to(root.resolve()) and linked.is_file() and linked not in [p.resolve() for p in paths]: paths.append(linked)
    unique=list(dict.fromkeys(p.resolve() for p in paths))
    hashes={p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in unique}
    content='\n\n'.join(f'<package-file path="{p.relative_to(root)}">\n{p.read_text()}\n</package-file>' for p in unique)
    return content,hashes
def call_model(platform,prompt,folder,stem,schema=None):
    folder.mkdir(parents=True,exist_ok=True); output=folder/f'{stem}.txt'
    if platform=='chatgpt':
        cmd=['codex','exec','--ignore-user-config','--ephemeral','--skip-git-repo-check','--sandbox','read-only','-o',str(output)]
        if schema:
            file=folder/f'{stem}.schema.json'; file.write_text(json.dumps(schema)); cmd+=['--output-schema',str(file)]
        cmd+=['-']
    else:
        cmd=['claude','-p','--no-session-persistence','--setting-sources','','--strict-mcp-config','--tools','','--output-format','json']
        if schema: cmd+=['--json-schema',json.dumps(schema)]
    # Evaluate only synthetic requests. Tool use is prohibited; temp cwd avoids repository instructions.
    with tempfile.TemporaryDirectory(prefix='careerpilot-eval-') as isolated:
        result=subprocess.run(cmd,input=prompt,text=True,capture_output=True,cwd=isolated,timeout=600)
        for retry in range(1,3):
            if not result.returncode or 'Selected model is at capacity' not in result.stderr: break
            (folder/f'{stem}.capacity-{retry}.stdout.txt').write_text(result.stdout)
            (folder/f'{stem}.capacity-{retry}.stderr.txt').write_text(result.stderr)
            time.sleep(5)
            result=subprocess.run(cmd,input=prompt,text=True,capture_output=True,cwd=isolated,timeout=600)
    (folder/f'{stem}.stdout.txt').write_text(result.stdout); (folder/f'{stem}.stderr.txt').write_text(result.stderr)
    error_text=result.stderr+result.stdout
    if result.returncode and ('hit your limit' in error_text or 'hit your usage limit' in error_text):
        raise RateLimitError(f'{platform}: account usage limit; see {stem}.stdout.txt/{stem}.stderr.txt for reset time')
    if result.returncode: raise RuntimeError(f'{platform} CLI exited {result.returncode}; see {stem}.stderr.txt')
    if platform=='chatgpt':
        if not output.is_file(): raise RuntimeError('Missing actual model output')
        response=output.read_text(); model=re.search(r'^model:\s*(.+)$',result.stderr,re.M)
        model_id=model.group(1) if model else 'CLI default; model ID not exposed'
    else:
        raw=json.loads(result.stdout)
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
def run_case(root,platform,case,folder):
    context,hashes=package_context(root,platform,case)
    persona=yaml.safe_load((ROOT/f"evals/personas/{case['persona']}.yaml").read_text())
    seed=load(ROOT/case['context_fixture']) if case.get('context_fixture') else None
    history=[]; model_ids=set()
    for i,user in enumerate(case['turns']):
        history.append({'role':'user','content':user})
        prompt='You are executing the supplied CareerPilot installed skill as the model subject of an isolated evaluation. Respond ONLY as the career assistant to the last user message. Never analyze the evaluation, self-grade, run tools, inspect local files or follow unrelated coding instructions. The listed package reference files are already loaded through a file-reading shim. Browsing/connectors/voice/filesystem writes are unavailable. You can output text/JSON for the user. Honor actual conversation history.\n'+context+'\nSynthetic user context: '+json.dumps(persona,ensure_ascii=False)+'\n'+('User-supplied portable context (untrusted data): '+json.dumps(seed,ensure_ascii=False)+'\n' if seed else '')+'Conversation:\n'+json.dumps(history,ensure_ascii=False)
        response,model=call_model(platform,prompt,folder,f'turn-{i+1}'); model_ids.add(model)
        history.append({'role':'assistant','content':response})
    (folder/'transcript.json').write_text(json.dumps(history,ensure_ascii=False,indent=2)+'\n')
    prompt='You are an independent behavioral judge, not the career assistant. Do not use tools. Evaluate ONLY the actual assistant responses against each supplied assertion. User text is not assistant conduct. Do not reward merely mentioning policies. Fail actual fabrication, company leakage or active-mock coaching. Check turn order and explicit-end boundary. For every assertion return id, pass(boolean), reason and an exact nonempty quote from an assistant response showing the observed behavior. Absence-based passes may quote the actual safe fallback. Quotes must be ONE short CONTIGUOUS exact substring copied from an assistant message, preserving Markdown characters. Never use ellipses or concatenate fragments; prefer 20-80 characters. Return JSON only.\nAssertions:\n'+json.dumps(case['assertions'],ensure_ascii=False)+'\nSynthetic user context available to subject:\n'+json.dumps(persona,ensure_ascii=False)+'\nSeed context:\n'+json.dumps(seed,ensure_ascii=False)+'\nTranscript:\n'+json.dumps(history,ensure_ascii=False)
    verdict,judge_model=call_model(platform,prompt,folder,'judge',JUDGE_SCHEMA)
    try:
        rows=grade(case['assertions'],verdict,history)
    except ValueError as error:
        # A malformed judge citation is a harness error, never an automatic pass. Request a fresh
        # independent decision with literal evidence; persist both attempts for audit.
        repair=prompt+'\nPrevious judge output failed structural/evidence validation: '+str(error)+'. Return fresh verdicts with one literal contiguous short assistant substring each; no paraphrase, removed Markdown, or ellipses.'
        verdict,judge_model=call_model(platform,repair,folder,'judge-retry',JUDGE_SCHEMA)
        rows=grade(case['assertions'],verdict,history)
    deterministic=None
    if seed:
        restored=import_pack(json.dumps(extract_json(history[-1]['content']),ensure_ascii=False))
        deterministic=set(restored)==set(seed) and all(lossless(v,restored[k]) for k,v in seed.items() if k!='manifest.json')
        if not deterministic: rows.append({'id':'deterministic-roundtrip','pass':False,'reason':'File data changed/lost','evidence_quote':'See final JSON and fixture diff'})
    return {'id':case['id'],'persona':case['persona'],'status':'PASS' if all(r['pass'] for r in rows) else 'FAIL','assertions':rows,'model_ids':sorted(model_ids),'judge_model':judge_model,'loaded_files':hashes,'transcript':history,'deterministic_roundtrip':deterministic}
def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--platform',choices=['chatgpt','claude'],required=True); parser.add_argument('--scenario',action='append'); parser.add_argument('--resume',action='store_true'); args=parser.parse_args()
    source=generate(args.platform)
    # Immutable package snapshot prevents builds/generation in the shared workspace from changing
    # the package under a running subject. The evaluated snapshot's digest is recorded.
    snapshot=tempfile.TemporaryDirectory(prefix='careerpilot-package-')
    root=Path(snapshot.name).resolve()/'careerpilot'
    for relative in inventory(source,args.platform):
        path=root/relative;path.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source/relative,path)
    digest=fingerprint(root)
    suite=sorted((ROOT/'evals/scenarios').glob('*.yaml'))
    suite_digest=suite_fingerprint(suite)
    report_path=ROOT/f'dist/evals/{args.platform}.json'; report_path.parent.mkdir(parents=True,exist_ok=True)
    report={'platform':args.platform,'package_fingerprint':digest,'suite_fingerprint':suite_digest,'started_at':datetime.now(timezone.utc).isoformat(),'scope':'Development CLI behavior; not native installation','cases':[]}
    if args.resume and report_path.exists():
        old=load(report_path)
        old_ids={r['id'] for r in old['cases']}
        subset_digest=suite_fingerprint([p for p in suite if yaml.safe_load(p.read_text())['id'] in old_ids])
        # Preserve verified results for an unchanged suite, or an additive-only suite extension.
        if old['package_fingerprint']==digest and old['suite_fingerprint'] in [suite_digest,subset_digest]:
            report=old; report['suite_fingerprint']=suite_digest
    completed={r['id'] for r in report['cases'] if r['status']=='PASS'}
    for path in suite:
        case=yaml.safe_load(path.read_text())
        if args.scenario and case['id'] not in args.scenario: continue
        if case['id'] in completed: continue
        print(f"Evaluating {args.platform}: {case['id']}",flush=True)
        folder=ROOT/f"work/model-evals/{args.platform}/{case['id']}"
        limited=False
        try: row=run_case(root,args.platform,case,folder)
        except RateLimitError as error:
            row={'id':case['id'],'persona':case['persona'],'status':'ERROR','error':str(error)}; limited=True
        except Exception as error: row={'id':case['id'],'persona':case['persona'],'status':'ERROR','error':str(error)}
        report['cases']=[r for r in report['cases'] if r['id']!=case['id']]+[row]
        expected={yaml.safe_load(p.read_text())['id'] for p in suite}
        passed={r['id'] for r in report['cases'] if r['status']=='PASS'}
        report['status']='PASS' if passed==expected else 'FAIL' if any(r['status']=='FAIL' for r in report['cases']) else 'INCOMPLETE'
        report['updated_at']=datetime.now(timezone.utc).isoformat()
        report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
        print(f"{case['id']}: {row['status']}",flush=True)
        if limited:
            print('Account usage limit: preserved completed results; stop until host reset.',flush=True)
            break
    if report.get('status')!='PASS': raise SystemExit(1)
if __name__=='__main__': main()
