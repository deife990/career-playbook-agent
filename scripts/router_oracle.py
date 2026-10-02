"""Offline examples/precedence oracle, not the semantic runtime router."""
from scripts.common import ROOT
import yaml
CATALOG=yaml.safe_load((ROOT/'core/router/intent-catalog.yaml').read_text())
def route(text, *, active_ids=(), selected_id=None, mock_active=False, recent_workflow=None):
    text=text.lower()
    if mock_active:
        return {'workflow':'W07','action':'REVIEW' if any(x in text for x in CATALOG['explicit_mock_end']) else 'QUESTION'}
    for capability,examples in CATALOG['capabilities'].items():
        if any(x in text for x in examples): return {'capability':capability}
    workflow=next((r['workflow'] for r in CATALOG['rules'] if any(x.lower() in text for x in r['examples'])),recent_workflow or 'W01')
    scope=selected_id if selected_id in active_ids else None
    if scope is None and len(active_ids)==1: scope=active_ids[0]
    if workflow in ['W05','W06','W08','W09'] and len(active_ids)>1 and scope is None: return {'workflow':workflow,'action':'CLARIFY_OPPORTUNITY'}
    return {'workflow':workflow,'opportunity_id':scope,'action':'RUN'}
