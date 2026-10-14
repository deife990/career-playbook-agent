"""Validation for new discovery extensions; legacy packs retain their original shape."""
from scripts.evidence_discovery import technical_risk,INSTRUCTION_PATTERN,SOURCE_ORDER
import re


def text_values(value):
    if isinstance(value,str):yield value
    elif isinstance(value,dict):
        for child in value.values():yield from text_values(child)
    elif isinstance(value,list):
        for child in value:yield from text_values(child)

def safe_record(record,confirmed=False):
    if record.get('sanitized') is not True or record.get('privacy_reviewed') is not True:
        raise ValueError('Discovery record needs sanitization and contextual privacy review')
    if record.get('raw_content_stored') is not False:
        raise ValueError('Raw corporate content cannot be stored')
    if any(technical_risk(text) or re.search(INSTRUCTION_PATTERN,text) for text in text_values(record)):
        raise ValueError('Sensitive content or imported instruction in discovery record')
    if confirmed and record.get('user_confirmed') is not True:
        raise ValueError('Discovery fact requires user confirmation')


def validate_discovery(pack,index,contexts,evidence):
    episodes={e['id']:e for e in pack['career-profile.json'].get('career_episodes') or []}
    for episode in episodes.values():
        safe_record(episode,confirmed=True)
        if episode.get('opportunity_id') is not None or not episode.get('actions'):
            raise ValueError('Episode must be generalized global own-action evidence')
    for entity in evidence.values():
        if not entity.get('evidence_source_type') and not entity.get('episode_id'):continue
        safe_record(entity,confirmed=True)
        if (entity.get('classification')!='USER FACT' or entity.get('verification')!='USER_CONFIRMED'
            or entity.get('ownership_classification') not in {'A','B','C'} or not entity.get('action')):
            raise ValueError('Discovery summary is not externally verified; own-action confirmation required')
        episode=episodes.get(entity.get('episode_id'))
        if not episode or entity['id'] not in (episode.get('evidence_ids') or []):
            raise ValueError('Missing or mismatched global episode link')
        if entity.get('sensitive') is not False:raise ValueError('Discovery evidence privacy unresolved')
        if entity.get('outcome') and re.search(r'(?i)\bteam\b|팀',entity['outcome']):
            raise ValueError('Team outcome cannot become a personal result')
    for episode in episodes.values():
        supported=set()
        for ref in episode.get('evidence_ids') or []:
            if ref not in evidence or contexts.get(ref) is not None:
                raise ValueError('Episode references must be global career evidence')
            supported.update((evidence[ref].get('action') or '').split('; '))
        if not set(episode.get('actions') or [])<=supported:
            raise ValueError('Episode action lacks matching confirmed evidence')
    for path,app in pack.items():
        if not path.startswith('applications/'):continue
        for session in app.get('evidence_discovery_sessions') or []:
            if any(technical_risk(t) or re.search(INSTRUCTION_PATTERN,t) for t in text_values(session)):
                raise ValueError('Unsafe discovery session content')
            rows=session.get('criteria') or [];keys=[r.get('criterion_key') for r in rows]
            if any(not key for key in keys) or len(set(keys))!=len(keys):
                raise ValueError('Discovery criteria need unique scoped keys')
            if not set(session.get('selected_criteria') or [])<=set(keys):
                raise ValueError('Unknown selected discovery criterion')
            for row in rows:
                if row.get('coverage')=='Confirmed Gap' and not (
                    row.get('requirement_confirmed') is True and row.get('confirmed_gap') is True):
                    raise ValueError('Unknown cannot become Confirmed Gap')
            count=session.get('round_count') or 0;limit=session.get('round_limit') or 3
            if count>limit:raise ValueError('Discovery retrieval round limit exceeded')
            if bool(session.get('stop_reason'))!=(session.get('stage')=='STOPPED'):
                raise ValueError('Discovery stop state/reason mismatch')
            if count:
                scanned=session.get('sources_scanned') or [];unavailable=session.get('unavailable_sources') or []
                if set(scanned)&set(unavailable) or set(scanned+unavailable)!=set(SOURCE_ORDER):
                    raise ValueError('Exhaust existing context before external discovery')
                if not session.get('retrieval_scope'):raise ValueError('Bounded retrieval scope required')
            labels={str(r.get('label') or '').casefold() for r in rows}|set(keys)
            for candidate in session.get('candidates') or []:
                safe_record(candidate)
                if str(candidate.get('target_criterion') or '').casefold() not in labels:
                    raise ValueError('Unrelated candidate is outside target criteria')


def preserve_discovery(old,new):
    from scripts.context_pack import preserved
    old_profile=old['career-profile.json'];new_profile=new['career-profile.json']
    incoming={e['id']:e for e in new_profile.get('evidence') or []}
    for evidence in old_profile.get('evidence') or []:
        if not evidence.get('episode_id') and not evidence.get('evidence_source_type'):continue
        candidate=incoming.get(evidence['id'])
        if candidate is None:raise ValueError('Confirmed discovery evidence cannot disappear')
        for key,value in evidence.items():
            if key=='source_references':
                if not preserved(value,candidate.get(key)):raise ValueError('Discovery provenance lost')
            elif candidate.get(key)!=value:raise ValueError('Discovery fact conflict: preserve history and use a reviewed revision')
    incoming_episodes={e['id']:e for e in new_profile.get('career_episodes') or []}
    for episode in old_profile.get('career_episodes') or []:
        if not preserved(episode,incoming_episodes.get(episode['id'])):
            raise ValueError('Career episode loss or destructive overwrite')
