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
            if 'own_role' in node:
                reject(scope is not None,'Career evidence must remain global')
                evidence[node['id']]=node
                reject(node.get('sensitive') is True,'Sensitive evidence cannot be exported')
            if 'kind' in node and 'access_status' in node: sources[node['id']]=node
        if path=='preferences.json':
            requirements={r['id']:r for r in value.get('original_requirements') or []}
    reject(manifest.get('active_opportunity_id') is not None and manifest['active_opportunity_id'] not in opportunities,'Unknown active opportunity')
    for entity_id,node in index.items():
        scope=contexts[entity_id]
        for key in ['evidence_ids','source_ids','claim_ids','story_ids','question_ids','answer_ids','previous_hypothesis_ids','updated_hypothesis_ids','original_requirement_ids']:
            for reference in node.get(key) or []:
                target=requirements if key=='original_requirement_ids' else evidence if key=='evidence_ids' else index
                reject(reference not in target,f'Dangling {key}: {reference}')
                if key!='original_requirement_ids': reject(contexts.get(reference) not in [None,scope],'Cross-company reference')
        for key in ['round_id','question_id','followup_to_id','previous_round_id','ideal_candidate_id','previous_id','supersedes_id']:
            ref_id=node.get(key)
            if ref_id:
                reject(ref_id not in index,f'Dangling {key}')
                reject(contexts[ref_id]!=scope,'Cross-company reference')
        if 'text' in node and 'classification' in node:
            if node['classification']=='VERIFIED FACT':
                refs=node.get('source_ids') or []
                reject(not refs or node.get('verification')!='VERIFIED','Unsupported verified claim')
                support=[sources.get(s) for s in refs]
                reject(any(s is None or s.get('access_status')!='ACCESSED' for s in support),'Unread source as fact')
                reject(all(s.get('kind') in ['COMMUNITY','CANDIDATE_REPORT','USER_SUPPLIED'] for s in support),'Weak sources cannot verify organization fact')
        if node.get('classification')=='INFERENCE': reject(node.get('verification')=='VERIFIED','Inference promoted to fact')
        if 'url' in node and node.get('url'):
            parsed=urlparse(node['url']); reject(parsed.scheme not in ['http','https'] or not parsed.netloc or parsed.username is not None,'Unsafe source URL')
        if 'status_history' in node:
            history=node['status_history'] or []; current=None
            for event in history:
                reject(not event.get('event') or event.get('confirmed_by') not in ['USER','VERIFIED_SOURCE'],'Inferred lifecycle transition')
                reject(event.get('confirmed_by')=='VERIFIED_SOURCE' and not event.get('source_ids'),'Transition lacks source')
                if current is not None: reject(event['from']!=current,'Discontinuous lifecycle')
                current=event['to']
            reject(node.get('status') not in [None,'DISCOVERED'] and not history,'Status lacks event history')
            if history: reject(node.get('status')!=current,'Status/history mismatch')
    # Validate nested artifact links (resume bullets, mappings, answers, offers).
    for path,value in pack.items():
        if path=='manifest.json': continue
        scope=Path(path).stem if path.startswith('applications/') else None
        for node in nodes(value):
            for key in ['evidence_ids','source_ids','claim_ids','story_ids','original_requirement_ids']:
                for reference in node.get(key) or []:
                    target=requirements if key=='original_requirement_ids' else evidence if key=='evidence_ids' else index
                    reject(reference not in target,f'Dangling artifact {key}')
                    if key!='original_requirement_ids': reject(contexts.get(reference) not in [None,scope],'Cross-company artifact reference')
            if 'text' in node and 'action' in node and node.get('action')!='REMOVE':
                reject(not node.get('evidence_ids'),'Resume bullet without evidence')
                for e in node.get('evidence_ids') or []: reject(evidence[e].get('user_confirmed') is not True,'Unconfirmed resume evidence')
            if 'question_id' in node and node.get('question_id'):
                question=index.get(node['question_id'])
                reject(question is None or question.get('round_id')!=node.get('round_id'),'Answer/round mismatch')
            if node.get('round_id'): reject(contexts.get(node['round_id'])!=scope,'Round scope mismatch')
    return deepcopy(pack)
def export(pack):
    result=deepcopy(pack)
    for file in result['manifest.json']['files']:
        file['sha256']=hashlib.sha256(canonical(result[file['path']])).hexdigest()
    validate(result)
    return json.dumps(result,indent=2,ensure_ascii=False)
def import_pack(text,current=None):
    incoming=validate(json.loads(text))
    if current is not None:
        validate(current)
        old=current['manifest.json']; new=incoming['manifest.json']
        reject(old['pack_id']!=new['pack_id'],'Different pack: explicit merge decision required')
        reject(new['revision']<old['revision'],'Stale revision')
        if new['revision']==old['revision']:
            left=deepcopy(current); right=deepcopy(incoming)
            for p in [left,right]:
                for f in p['manifest.json']['files']: f['sha256']=None
            reject(left!=right,'Revision conflict')
        old_debriefs={n['id']:n for n in nodes(current) if 'collection_complete' in n}
        new_debriefs={n['id']:n for n in nodes(incoming) if 'collection_complete' in n}
        reject(any(new_debriefs.get(k)!=v for k,v in old_debriefs.items()),'Debrief loss or destructive overwrite')
    return incoming
def read_directory(root):
    root=Path(root).resolve(); manifest=load(root/'manifest.json'); schema_validator('context-manifest').validate(manifest)
    pack={'manifest.json':manifest}
    for f in manifest['files']:
        path=(root/f['path']).resolve(); reject(not path.is_relative_to(root),'Escaping pack path')
        pack[f['path']]=load(path)
    return validate(pack)
