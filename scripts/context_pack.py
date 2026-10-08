"""Development reference validator; not shipped as a runtime dependency."""
from pathlib import Path
from copy import deepcopy
import hashlib, json, re
from urllib.parse import urlparse
from scripts.common import schema_validator, load
PATH = re.compile(r'^(career-profile\.json|preferences\.json|story-bank\.json|applications/[a-z0-9-]+\.json)$')
def canonical(value): return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def nodes(value):
    if isinstance(value,dict):
        yield value
        for child in value.values(): yield from nodes(child)
    elif isinstance(value,list):
        for child in value: yield from nodes(child)
def reject(condition,message):
    if condition: raise ValueError(message)
def validate(pack):
    reject(not isinstance(pack,dict) or 'manifest.json' not in pack,'Missing manifest')
    schema_validator('context-manifest').validate(pack['manifest.json'])
    manifest=pack['manifest.json']; declared=manifest['files']
    paths=[f['path'] for f in declared]
    reject(len(set(paths))!=len(paths),'Duplicate paths')
    reject(set(pack)!={'manifest.json',*paths},'Missing or undeclared files')
    reject(not {'career-profile.json','preferences.json','story-bank.json'} <= set(paths),'Missing global context')
    index={}; contexts={}; evidence={}; sources={}; requirements={}; opportunities=set()
    typed={key:{} for key in ['source_ids','claim_ids','story_ids','question_ids','answer_ids','previous_hypothesis_ids','updated_hypothesis_ids','ideal_candidate_id']}
    typed['jd_source_ids']=typed['source_ids']
    profile=pack.get('career-profile.json',{}); stories=pack.get('story-bank.json',{})
    for key,values in [('source_ids',profile.get('sources')),('claim_ids',profile.get('claims')),('story_ids',stories.get('stories'))]:
        typed[key].update({v['id']:v for v in values or [] if isinstance(v,dict)})
    rounds={}
    for path,app in pack.items():
        if not path.startswith('applications/') or not isinstance(app,dict): continue
        for key,field in [('source_ids','sources'),('claim_ids','claims')]: typed[key].update({v['id']:v for v in app.get(field) or [] if isinstance(v,dict)})
        ideal=(app.get('opportunity') or {}).get('ideal_candidate')
        if isinstance(ideal,dict): typed['ideal_candidate_id'][ideal['id']]=ideal
        for v in (app.get('opportunity') or {}).get('hiring_hypotheses') or []:
            if isinstance(v,dict):
                typed['previous_hypothesis_ids'][v['id']]=v; typed['updated_hypothesis_ids'][v['id']]=v
        for interview in app.get('interviews') or []:
            if not isinstance(interview,dict): continue
            if interview.get('round'): rounds[interview['round']['id']]=interview['round']
            for key,field in [('question_ids','questions'),('answer_ids','answers')]: typed[key].update({v['id']:v for v in interview.get(field) or [] if isinstance(v,dict)})
    evidence={v['id']:v for v in profile.get('evidence') or [] if isinstance(v,dict)}
    sources=dict(typed['source_ids'])
    for file in declared:
        path=file['path']; reject(not PATH.fullmatch(path),'Unsafe path')
        expected_schema=path[:-5] if '/' not in path else 'application'
        reject(file['schema']!=expected_schema,'File/schema mismatch')
        value=pack[path]; schema_validator(file['schema']).validate(value)
        if file.get('sha256'): reject(hashlib.sha256(canonical(value)).hexdigest()!=file['sha256'],'Hash mismatch')
        scope=Path(path).stem if path.startswith('applications/') else None
        if scope:
            opportunities.add(scope)
            reject(value.get('opportunity_id')!=scope or not value.get('opportunity') or value['opportunity'].get('id')!=scope,'Opportunity/file mismatch')
        for node in nodes({k:v for k,v in value.items() if not (path=='preferences.json' and k=='requirements')}):
            if 'id' in node:
                reject(not node['id'],'Persisted entity needs ID')
                reject(node['id'] in index,'Duplicate entity ID')
                index[node['id']]=node; contexts[node['id']]=scope
                if 'opportunity_id' in node or scope:
                    reject(node.get('opportunity_id')!=scope,'Cross-company scope contamination')
            if node.get('id') in evidence:
                reject(scope is not None,'Career evidence must remain global')
                evidence[node['id']]=node
                reject(node.get('sensitive') is True,'Sensitive evidence cannot be exported')
            if 'kind' in node and 'access_status' in node: sources[node['id']]=node
        if path=='preferences.json':
            requirements={r['id']:r for r in value.get('original_requirements') or []}
    reject(manifest.get('active_opportunity_id') is not None and manifest['active_opportunity_id'] not in opportunities,'Unknown active opportunity')
    for entity_id,node in index.items():
        scope=contexts[entity_id]
        for key in ['evidence_ids','source_ids','jd_source_ids','claim_ids','story_ids','question_ids','answer_ids','previous_hypothesis_ids','updated_hypothesis_ids','original_requirement_ids']:
            for reference in node.get(key) or []:
                target=requirements if key=='original_requirement_ids' else evidence if key=='evidence_ids' else typed.get(key,index)
                reject(reference not in target,f'Dangling {key}: {reference}')
                if key!='original_requirement_ids': reject(contexts.get(reference) not in [None,scope],'Cross-company reference')
        for key in ['round_id','question_id','followup_to_id','previous_round_id','ideal_candidate_id','previous_id','supersedes_id']:
            ref_id=node.get(key)
            if ref_id:
                reject(ref_id not in (rounds if key in ['round_id','previous_round_id'] else typed['question_ids'] if key in ['question_id','followup_to_id'] else typed['ideal_candidate_id'] if key=='ideal_candidate_id' else index),f'Dangling {key}')
                reject(contexts[ref_id]!=scope,'Cross-company reference')
        if 'text' in node and 'classification' in node:
            if node['classification']=='VERIFIED FACT':
                refs=node.get('source_ids') or []
                reject(not refs or node.get('verification')!='VERIFIED','Unsupported verified claim')
                support=[sources.get(s) for s in refs]
                reject(any(s is None or s.get('access_status')!='ACCESSED' for s in support),'Unread source as fact')
                reject(not any(s.get('kind') in ['OFFICIAL','PRIMARY','INSTITUTIONAL','REPORTING','PROFESSIONAL_PROFILE'] for s in support),'Weak sources cannot verify organization fact')
        if node.get('classification')=='INFERENCE': reject(node.get('verification')=='VERIFIED','Inference promoted to fact')
        if 'url' in node and node.get('url'):
            parsed=urlparse(node['url']); reject(parsed.scheme not in ['http','https'] or not parsed.netloc or parsed.username is not None,'Unsafe source URL')
        if 'status_history' in node:
            history=node['status_history'] or []; current=None
            for event in history:
                reject(not event.get('event') or event.get('confirmed_by') not in ['USER','VERIFIED_SOURCE'],'Inferred lifecycle transition')
                reject(event.get('confirmed_by')=='VERIFIED_SOURCE' and not event.get('source_ids'),'Transition lacks source')
                if event.get('confirmed_by')=='VERIFIED_SOURCE':
                    reject(any(sources.get(s,{}).get('access_status')!='ACCESSED' or sources.get(s,{}).get('kind') in ['COMMUNITY','CANDIDATE_REPORT','USER_SUPPLIED'] for s in event['source_ids']),'Transition source not verified')
                if current is not None: reject(event['from']!=current,'Discontinuous lifecycle')
                current=event['to']
            reject(node.get('status') not in [None,'DISCOVERED'] and not history,'Status lacks event history')
            if history: reject(node.get('status')!=current,'Status/history mismatch')
    # Validate nested artifact links (resume bullets, mappings, answers, offers).
    for path,value in pack.items():
        if path=='manifest.json': continue
        scope=Path(path).stem if path.startswith('applications/') else None
        for node in nodes(value):
            for key in ['evidence_ids','source_ids','jd_source_ids','claim_ids','story_ids','original_requirement_ids']:
                for reference in node.get(key) or []:
                    target=requirements if key=='original_requirement_ids' else evidence if key=='evidence_ids' else typed.get(key,index)
                    reject(reference not in target,f'Dangling artifact {key}')
                    if key!='original_requirement_ids': reject(contexts.get(reference) not in [None,scope],'Cross-company artifact reference')
            if 'text' in node and 'action' in node and node.get('action')!='REMOVE':
                reject(not node.get('evidence_ids'),'Resume bullet without evidence')
                for e in node.get('evidence_ids') or []: reject(evidence[e].get('user_confirmed') is not True,'Unconfirmed resume evidence')
            if 'question_id' in node and node.get('question_id'):
                question=index.get(node['question_id'])
                reject(question is None or question.get('round_id')!=node.get('round_id'),'Answer/round mismatch')
            if node.get('round_id'): reject(node['round_id'] not in rounds or contexts.get(node['round_id'])!=scope,'Round scope mismatch')
    from scripts.submission_oracle import validate_submissions
    validate_submissions(pack)
    return deepcopy(pack)
def export(pack):
    result=deepcopy(pack)
    for file in result['manifest.json']['files']:
        file['sha256']=hashlib.sha256(canonical(result[file['path']])).hexdigest()
    validate(result)
    return json.dumps(result,indent=2,ensure_ascii=False)
def preserved(old,new):
    # Partial collection may fill unknowns and append observations, never change prior observations.
    if old is None: return True
    if isinstance(old,dict): return isinstance(new,dict) and all(k in new and (k=='collection_complete' and old[k] is False and type(new[k]) is bool or preserved(v,new[k])) for k,v in old.items())
    if isinstance(old,list): return isinstance(new,list) and len(new)>=len(old) and all(preserved(v,new[i]) for i,v in enumerate(old))
    return old==new
def import_pack(text,current=None):
    incoming=validate(json.loads(text))
    if current is not None:
        validate(current)
        old=current['manifest.json']; new=incoming['manifest.json']
        reject(old['pack_id']!=new['pack_id'],'Different pack: explicit merge decision required')
        reject(new['revision']<old['revision'],'Stale revision')
        original=current['preferences.json'].get('original_requirements')
        reject(original is not None and original!=incoming['preferences.json'].get('original_requirements'),'Original requirements changed')
        if new['revision']==old['revision']:
            left=deepcopy(current); right=deepcopy(incoming)
            for p in [left,right]:
                for f in p['manifest.json']['files']: f['sha256']=None
            reject(left!=right,'Revision conflict')
        old_debriefs={d['id']:d for n in nodes(current) for d in n.get('debriefs') or [] if isinstance(d,dict)}
        new_debriefs={d['id']:d for n in nodes(incoming) for d in n.get('debriefs') or [] if isinstance(d,dict)}
        for k,v in old_debriefs.items():
            candidate=new_debriefs.get(k)
            reject(candidate is None,'Debrief loss or destructive overwrite')
            reject(not preserved(v,candidate) if not v.get('collection_complete') else candidate!=v,'Debrief loss or destructive overwrite')
        old_actual={n['id']:n for n in nodes(current) if n.get('origin')=='ACTUAL_USER_RECALL' or n.get('recalled') is True}
        new_actual={n['id']:n for n in nodes(incoming) if n.get('origin')=='ACTUAL_USER_RECALL' or n.get('recalled') is True}
        reject(any(new_actual.get(k)!=v for k,v in old_actual.items()),'Actual interview record loss')
        from scripts.submission_oracle import preserve_submissions
        preserve_submissions(current,incoming)
    return incoming
def read_directory(root):
    root=Path(root).resolve(); manifest=load(root/'manifest.json'); schema_validator('context-manifest').validate(manifest)
    pack={'manifest.json':manifest}
    for f in manifest['files']:
        path=(root/f['path']).resolve(); reject(not path.is_relative_to(root),'Escaping pack path')
        pack[f['path']]=load(path)
    return validate(pack)
