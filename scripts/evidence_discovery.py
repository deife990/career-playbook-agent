"""Development oracle for the Markdown discovery contract; never shipped to consumers."""
import re

FIELDS={'Target Criterion':'target_criterion','Project / Event':'project','Period':'period',
        'Situation':'situation','My Actions':'my_actions',"Other People's / Team Actions":'team_actions',
        'Systems / Technologies':'systems','Scope':'scope','Outcome':'outcome',
        'Evidence References':'source_references','Uncertainties':'uncertainties',
        'Sensitive Information Removed':'sensitive_information_removed'}
LIST_FIELDS={'my_actions','team_actions','systems','source_references','uncertainties'}
UNKNOWN={'unknown','none','n/a','모름','미확인','-',''}
SOURCE_ORDER=('profile','evidence','master_resume','story_bank','tailored_resumes',
              'applications','debriefs','interview_answers','supplied_files','project_records')


def coverage(criterion,mappings,evidence):
    """Use reviewed criterion links, never keyword similarity or resume omissions."""
    indexed={e['id']:e for e in evidence}
    links=[m for m in mappings if m['criterion_key']==criterion['criterion_key']]
    supported=[(m,indexed[m['evidence_id']]) for m in links if m.get('evidence_id') in indexed]
    own=[(m,e) for m,e in supported if e.get('user_confirmed') is True and e.get('action')]
    direct=[e for m,e in own if m['match']=='DIRECT']
    if criterion.get('requirement_confirmed') is True and criterion.get('confirmed_absence') is True:
        return 'Unknown' if direct else 'Confirmed Gap'
    if any(all(e.get(k) for k in criterion.get('requires',['action'])) for e in direct):return 'Strong'
    if any(m['match']=='TRANSFERABLE' for m,e in own):return 'Usable'
    if supported or any(m.get('hint') for m in links):return 'Thin'
    return 'Unknown'


def discovery_priority(criterion,label):
    if label not in {'Thin','Unknown'}:return 'SKIP'
    if criterion.get('must_have') or criterion.get('hiring_impact')=='HIGH':return 'HIGH'
    if criterion.get('differentiation') is True and criterion.get('retrievable') is True:return 'MEDIUM'
    return 'LOW'


def parse_exchange(text,opportunity_id=None,*,session_id=None):
    """Parse transient untrusted candidates. Parsing confers no confirmation or privacy approval."""
    if not isinstance(text,str) or len(text)>65536:raise ValueError('Invalid exchange size')
    text=text.strip()
    if text.startswith('```'):
        fenced=re.fullmatch(r'```(?:markdown|md)?\n(.*?)\n```',text,flags=re.S)
        if not fenced:raise ValueError('Invalid exchange fence')
        text=fenced[1]
    blocks=re.split(r'^## Evidence Candidate (\d+)\s*$',text.strip(),flags=re.M)
    if blocks[0].strip() or len(blocks)<3 or (len(blocks)-1)//2>20:raise ValueError('Expected candidate blocks')
    namespace=session_id or opportunity_id or 'transient'
    if not re.fullmatch(r'[a-z0-9-]+',namespace):raise ValueError('Unsafe candidate namespace')
    candidates=[];seen=set()
    for number,body in zip(blocks[1::2],blocks[2::2]):
        number=str(int(number))
        if number in seen:raise ValueError('Duplicate candidate number')
        seen.add(number);values={};active=None
        for line in body.splitlines():
            label_line=line
            bold=re.match(r'^\*\*([^*]+)\*\*(.*)$',line)
            if bold:label_line=bold[1]+bold[2]
            header=re.match(r"^([A-Za-z][A-Za-z /'’]+):\s*(.*)$",label_line)
            if header:
                label=header[1].replace('’',"'").strip()
                if label not in FIELDS:raise ValueError('Unknown exchange field')
                active=FIELDS[label]
                if active in values:raise ValueError('Duplicate exchange field')
                values[active]=[header[2]] if header[2] else []
            elif line.strip():
                if active is None:raise ValueError('Content outside a field')
                values[active].append(line.strip())
        if set(values)!=set(FIELDS.values()):raise ValueError('Missing exchange field')
        candidate={'id':f'candidate-{namespace}-{number}','opportunity_id':opportunity_id,'user_confirmed':False}
        for key,lines in values.items():
            items=[re.sub(r'^[-*]\s+','',line).strip() for line in lines]
            items=[x for x in items if x.lower() not in UNKNOWN]
            candidate[key]=(items or None) if key in LIST_FIELDS else ('\n'.join(items) or None)
        if candidate['sensitive_information_removed'] not in {'Yes','No','Unsure'}:
            raise ValueError('Privacy declaration must be Yes, No or Unsure')
        candidates.append(candidate)
    return candidates


TECHNICAL_PATTERNS=(
    r'(?i)\b(?:password|passwd|api[_ -]?key|api[_ -]?token|secret|authorization)\s*[:=]\s*(?:"[^"]*"|\S+)',
    r'(?i)\bBearer\s+[A-Za-z0-9._-]+',
    r'(?i)\b(?:https?://|www\.)\S+',
    r'\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b',
    r'\b\d{1,3}(?:\.(?:\d{1,3}|x)){3}\b',
    r'(?i)\b[\w-]+(?:\.[\w-]+)*\.(?:internal|corp|local|lan)\b',
    r'\b[A-Z]{2,}\d+-[A-Z]+\d+\b',
    r'(?i)\bhostname\s*[:=]\s*\S+',
    r'(?<!\d)(?:\+\d{1,3}[ -])?\d{2,3}[ -]\d{3,4}[ -]\d{4}(?!\d)',
)
INSTRUCTION_PATTERN=r'(?i)ignore (?:all|previous|the) (?:rules|instructions)|system prompt|<system>|override (?:the )?policy'


IPV6_PATTERN=r'(?<![\w])(?:[0-9A-Fa-f]{0,4}:){2,}[0-9A-Fa-f:]+(?:%[\w-]+)?'

def ipv6_addresses(text):
    import ipaddress
    found=[]
    for match in re.finditer(IPV6_PATTERN,text):
        try:
            if ipaddress.ip_address(match[0]).version==6:found.append(match[0])
        except ValueError:pass
    return found

def technical_risk(text):
    return any(re.search(p,text) for p in TECHNICAL_PATTERNS) or bool(ipv6_addresses(text)) or bool(re.search(r'(?m)^(?:From|To|Subject):',text))


def sanitize_candidate(candidate,*,sensitive_terms=(),privacy_reviewed=False):
    """Technical removal plus explicit contextual review; never trust a pasted Yes flag."""
    from copy import deepcopy
    value=deepcopy(candidate)
    def scrub(item):
        if isinstance(item,str):
            if re.search(INSTRUCTION_PATTERN,item):raise ValueError('Imported instruction is not career evidence')
            for address in ipv6_addresses(item):item=item.replace(address,'[sensitive detail removed]')
            for pattern in TECHNICAL_PATTERNS:item=re.sub(pattern,'[sensitive detail removed]',item)
            for term in sensitive_terms:
                if not term.strip():raise ValueError('Empty sensitive term')
                item=re.sub(re.escape(term),'[business detail generalized]',item,flags=re.I)
            if re.search(r'(?m)^(?:From|To|Subject):',item):raise ValueError('Raw email bodies are not an exchange')
            return item
        if isinstance(item,list):return [scrub(x) for x in item]
        if isinstance(item,dict):return {k:scrub(v) for k,v in item.items()}
        return item
    value=scrub(value)
    if value.get('outcome')!=candidate.get('outcome'):value['outcome']=None
    references=[]
    for ref in value.get('source_references') or []:
        if isinstance(ref,dict):references.append(ref);continue
        match=re.match(r'^(\d{4}-\d{2}-\d{2})\s*[—–-]\s*(.+)$',ref)
        references.append({'date':match[1] if match else None,'title':match[2] if match else ref,'scope':None})
    value.update(source_references=references or None,sanitized=True,
                 privacy_reviewed=privacy_reviewed is True,raw_content_stored=False,
                 sensitive_information_removed='Yes' if privacy_reviewed is True else 'Unsure')
    return value


def classify_ownership(*,direct=False,assigned=False,executed=False,corroborated=False,
                       participation=False,context=False,conflict=False):
    """Reviewed record attributes, not keyword guesses or a supplied ownership label."""
    if any(type(x) is not bool for x in (direct,assigned,executed,corroborated,participation,context,conflict)):
        raise ValueError('Ownership attributes must be reviewed booleans')
    if conflict:return 'UNKNOWN'
    if assigned and executed:return 'B'
    if direct:return 'A'
    if corroborated:return 'C'
    if assigned:return 'UNKNOWN'
    if participation:return 'D'
    if context:return 'E'
    return 'UNKNOWN'


def candidate_fingerprint(candidate):
    import hashlib
    from scripts.context_pack import canonical
    return hashlib.sha256(canonical({k:v for k,v in candidate.items() if k!='user_confirmed'})).hexdigest()


def confirm_candidate(candidate,confirmation):
    from copy import deepcopy
    if (confirmation.get('confirmed') is not True or confirmation.get('candidate_id')!=candidate.get('id')
        or confirmation.get('fingerprint')!=candidate_fingerprint(candidate)):
        raise ValueError('Exact candidate confirmation required; changes invalidate it')
    if candidate.get('sanitized') is not True or candidate.get('privacy_reviewed') is not True:
        raise ValueError('Contextual privacy review required')
    if candidate.get('raw_content_stored') is not False or technical_risk(str(candidate)):
        raise ValueError('Sensitive or raw content cannot be persisted')
    if candidate.get('ownership_classification') not in {'A','B','C'} or not candidate.get('my_actions'):
        raise ValueError('Own-action evidence required; participation/context is insufficient')
    value=deepcopy(candidate);value['user_confirmed']=True
    return value


def cluster_candidates(candidates,reviewed_groups=None):
    """Propose compatible episodes; unknown identity needs a reviewed grouping, not keywords."""
    groups={}
    for c in candidates:
        if reviewed_groups and c['id'] in reviewed_groups:key=('reviewed',reviewed_groups[c['id']])
        elif all(c.get(k) for k in ('project','period','scope')):
            key=tuple(c[k].strip().casefold() for k in ('project','period','scope'))
        else:key=('unresolved',c['id'])
        groups.setdefault(key,[]).append(c)
    result=[]
    for records in groups.values():
        def unique(field):
            values=[]
            for r in records:
                value=r.get(field);items=value if isinstance(value,list) else [value] if value else []
                for item in items:
                    if item not in values:values.append(item)
            return values
        outcomes=unique('outcome');scopes=unique('scope')
        result.append({'candidate_ids':[r['id'] for r in records],
                       'actions':unique('my_actions'),'source_references':unique('source_references'),
                       'outcomes':outcomes,'scopes':scopes,
                       'conflicts':[k for k,v in [('outcome',outcomes),('scope',scopes)] if len(v)>1]})
    return result


def promote(pack,candidate,confirmation,*,evidence_id,episode_id,story_id=None,
            source_type='manual',bridge_source=None,retrieval_scope=None):
    """Append safe global evidence atomically; keep original applications and recall untouched."""
    import json
    from copy import deepcopy
    from scripts.context_pack import validate,export
    validate(pack);c=confirm_candidate(candidate,confirmation);updated=deepcopy(pack)
    profile=updated['career-profile.json']
    own_outcome=c.get('outcome') if c.get('outcome_owner')=='SELF' else None
    if own_outcome and re.search(r'(?i)\bteam\b|팀',own_outcome):
        raise ValueError('Team outcome cannot become an individual outcome')
    evidence={'id':evidence_id,'opportunity_id':None,'description':'; '.join(c['my_actions']),
              'own_role':'Contributor','context':c.get('situation'),'action':'; '.join(c['my_actions']),
              'scope':c.get('scope'),'outcome':own_outcome,'scale':None,'skills':None,
              'classification':'USER FACT','source_ids':None,'user_confirmed':True,'sensitive':False,
              'verification':'USER_CONFIRMED','responsibility':'CONTRIBUTOR',
              'evidence_source_type':source_type,'bridge_source':bridge_source,
              'ownership_classification':c['ownership_classification'],'episode_id':episode_id,
              'sanitized':True,'privacy_reviewed':True,'raw_content_stored':False,
              'retrieval_scope':retrieval_scope,'source_references':c.get('source_references')}
    existing=next((e for e in profile.get('career_episodes') or [] if e['id']==episode_id),None)
    if existing:
        old=next(e for e in profile.get('evidence') or [] if e['id'] in (existing.get('evidence_ids') or []))
        if (old.get('action')!=evidence['action'] or old.get('scope')!=evidence['scope'] or old.get('outcome')!=own_outcome
            or any(existing.get(k)!=c.get(k) for k in ('project','period','situation'))):
            raise ValueError('Episode conflict needs explicit reconciliation; preserve existing facts')
        for record in (old,existing):
            refs=list(record.get('source_references') or [])
            for ref in c.get('source_references') or []:
                if ref not in refs:refs.append(ref)
            record['source_references']=refs or None
    else:
        profile['evidence']=list(profile.get('evidence') or [])+[evidence]
        episode={'id':episode_id,'opportunity_id':None,'project':c.get('project'),'period':c.get('period'),
                 'situation':c.get('situation'),'own_role':'Contributor','actions':list(c['my_actions']),
                 'team_actions':c.get('team_actions'),'systems':c.get('systems'),'scope':c.get('scope'),
                 'outcome':c.get('outcome') if c.get('outcome_owner') in {'SELF','TEAM'} else None,
                 'outcome_owner':c.get('outcome_owner') or 'UNKNOWN','evidence_ids':[evidence_id],
                 'uncertainties':c.get('uncertainties'),'user_confirmed':True,'evidence_source_type':source_type,
                 'bridge_source':bridge_source,'sanitized':True,'privacy_reviewed':True,'raw_content_stored':False,
                 'retrieval_scope':retrieval_scope,'source_references':c.get('source_references')}
        profile['career_episodes']=list(profile.get('career_episodes') or [])+[episode]
        if story_id:
            bank=updated['story-bank.json']
            bank['stories']=list(bank.get('stories') or [])+[{'id':story_id,'opportunity_id':None,
                'title':c.get('project'),'evidence_ids':[evidence_id],'situation':c.get('situation'),
                'task':None,'action':evidence['action'],'result':own_outcome,'reflection':None}]
    updated['manifest.json']['revision']=(updated['manifest.json'].get('revision') or 0)+1
    return json.loads(export(updated))


def scan_existing(pack,*,selected_opportunity=None,prior_applications=(),supplied_files=None,project_records=None):
    """Read only candidate-authored material from explicitly selected contexts; return global proof IDs."""
    from scripts.context_pack import validate
    validate(pack);profile=pack['career-profile.json'];bank=pack['story-bank.json']
    selected=[]
    for identifier in dict.fromkeys([selected_opportunity,*prior_applications]):
        if identifier is None:continue
        path=f'applications/{identifier}.json'
        if path not in pack:raise ValueError('Selected prior context is not loaded')
        selected.append(pack[path])
    masters=[r for r in profile.get('resume_versions') or [] if r.get('kind')=='MASTER'] if profile.get('resume_versions') is not None else None
    tailored=[r for a in selected for r in a.get('resume_versions') or []]
    interviews=[i for a in selected for i in a.get('interviews') or []]
    actual_answers=[a for i in interviews for a in i.get('answers') or []
                    if a.get('recalled') is True]
    records={'profile':[profile],'evidence':profile.get('evidence'),'master_resume':masters,
             'story_bank':bank.get('stories'),'tailored_resumes':tailored if selected else None,'applications':selected or None,
             'debriefs':[d for i in interviews for d in i.get('debriefs') or []] if selected else None,
             'interview_answers':actual_answers if selected else None,
             'supplied_files':list(supplied_files) if supplied_files is not None else None,
             'project_records':list(project_records) if project_records is not None else None}
    # Old resume/answer wording is a hint to verify, never independent truth or employer intelligence.
    evidence=[e for e in profile.get('evidence') or [] if e.get('user_confirmed') is True and e.get('sensitive') is not True]
    return {'evidence':evidence,'scan':[{'source':name,'status':'READ' if records[name] is not None else 'NOT_PROVIDED'} for name in SOURCE_ORDER],
            'potential_record_ids':[a['id'] for a in actual_answers if not a.get('evidence_ids')]}


def memory_cue(criterion):
    text=criterion.lower()
    if 'vendor' in text or '업체' in text:return '업체 방문이나 설치 일정이 달라졌을 때, 일정·작업 범위를 직접 조율한 사례가 있었나요?'
    if 'regional' in text or 'global' in text or '협업' in text:return '다른 지역 팀과 현장 조건을 설명하거나 일정·우선순위 의견을 맞췄던 사례가 있나요?'
    if 'sql' in text:return '데이터 결과가 예상과 달라 직접 쿼리 조건을 확인하거나 바꿔 검증했던 사례가 있나요?'
    return f'{criterion}와 관련해 문제를 발견하고 직접 처리하거나 다른 사람과 작업 순서를 맞췄던 상황 하나가 떠오르나요?'


def bridge_prompt(criteria,scope,*,stage='BROAD',episode=None,provider='m365'):
    if not criteria or len(criteria)>3 or not scope.get('period') or not scope.get('sources'):
        raise ValueError('Choose one to three target criteria and an agreed period/source scope')
    if stage not in {'BROAD','FOCUSED'} or (stage=='FOCUSED' and not episode):
        raise ValueError('Focused search requires a selected episode')
    import json
    text=json.dumps([criteria,scope,episode],ensure_ascii=False)
    if technical_risk(text) or re.search(INSTRUCTION_PATTERN,text):raise ValueError('Unsafe prompt inputs')
    if re.search(r'(?i)all (?:mail|email|messages)|entire mailbox',text):raise ValueError('Unbounded source scope')
    platform='회사 Microsoft 365 Copilot' if provider=='m365' else '회사에서 승인된 AI assistant'
    focus=f"선택한 사건 {episode}에서 본인이 직접 조율·결정·실행한 행동, 할당 후 실제 실행, 결과 근거를 집중 확인하세요." if stage=='FOCUSED' else '이 기준에 관련된 실제 업무 사건 후보를 찾으세요.'
    labels='\n'.join('- '+c for c in criteria)
    fields='\n'.join(label+':\n'+(criteria[0] if label=='Target Criterion' and len(criteria)==1 else 'Unknown') for label in FIELDS if label!='Sensitive Information Removed')+'\nSensitive Information Removed:\nYes / No / Unsure'
    return (f'{platform} 안에서 승인된 접근 범위만 검색하세요.\n기간: {scope["period"]}\n자료: {", ".join(scope["sources"])}\n'
            f'찾을 기준:\n{labels}\n{focus}\nCC·초대·참석은 직접 행동의 근거가 아닙니다. 할당만으로 실행을 추정하지 마세요. '
            '팀 행동과 본인 행동을 분리하고, 감사/확인 기록은 제3자 보강 근거로 표시하세요. 숫자·효과를 추정하지 마세요. '
            '비밀번호·토큰·IP·호스트명·내부 URL·고객/직원 정보·계약/가격·보안 설계·미공개 사업정보는 제거하거나 일반화하세요. '
            '메일 본문 전체를 복제하지 마세요. 불명확한 행동/결과는 Unknown으로 남기세요.\n'
            f'각 사건을 아래 Markdown 형식으로 반환하세요. 여러 자료가 같은 사건이면 중복 성과로 세지 마세요.\n## Evidence Candidate 1\n{fields}')


def retrieval_state(session,labels,*,new_evidence=True,user_stop=False,privacy_risk=False,confirmed_gap=False):
    from copy import deepcopy
    result=deepcopy(session);reason=None
    if user_stop:reason='USER_STOP'
    elif privacy_risk:reason='PRIVACY_RISK'
    elif labels and all(v in {'Strong','Usable'} for v in labels):reason='SATURATION'
    elif confirmed_gap and labels and all(v=='Confirmed Gap' for v in labels):reason='CONFIRMED_GAP'
    elif not new_evidence and (session.get('round_count') or 0)>0:reason='NO_NEW_EVIDENCE'
    elif (session.get('round_count') or 0)>=(session.get('round_limit') or 3):reason='SCOPE_LIMIT'
    if reason:result.update(stage='STOPPED',stop_reason=reason)
    else:result.update(stage='FOCUSED' if (session.get('round_count') or 0)>0 else 'BROAD',stop_reason=None)
    return result
