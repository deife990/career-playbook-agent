"""Offline state transition oracle; not the host interview implementation."""
from copy import deepcopy
def turn(session,event,text):
    result=deepcopy(session)
    if event=='END':
        if result['status']!='ACTIVE': raise ValueError('Session not active')
        result.update(status='ENDED',explicit_end=True)
        return result,'REVIEW'
    if result['status']!='ACTIVE': raise ValueError('Explicit new session required')
    if event=='ANSWER': result.setdefault('transcript',[]).append({'speaker':'USER','text':text})
    return result,'QUESTION'
