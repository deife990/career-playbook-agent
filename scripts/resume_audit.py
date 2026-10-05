"""Narrow development numeric-consistency check; semantic model review remains required."""
import re
NUMBER=re.compile(r'(?<!\w)\d+(?:[,.]\d+)*(?:%|x)?')
def audit_bullets(bullets,evidence):
    index={e['id']:e for e in evidence}
    for bullet in bullets:
        if bullet.get('action')=='REMOVE': continue
        refs=bullet.get('evidence_ids') or []
        if not refs or any(r not in index or index[r].get('user_confirmed') is not True for r in refs): raise ValueError('Missing confirmed evidence')
        source=' '.join(str(v) for r in refs for k,v in index[r].items() if k in ['description','own_role','context','action','outcome','scale'])
        if not set(NUMBER.findall(bullet['text']))<=set(NUMBER.findall(source)): raise ValueError('Unsupported resume number')
    return True
