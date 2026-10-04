"""Actual synthetic rc.2 export shape, not a golden career-evidence sample.

The captured pack has a known unsupported documentation claim (see native report).
Structural validation and lossless transport must not be mistaken for factual integrity.
"""
import copy
import pytest
from scripts.common import ROOT, load
from scripts.context_pack import validate, export, import_pack

def test_native_export_path_identity_regression():
    pack=load(ROOT/'fixtures/native/rc2-observed-export.json')
    validate(pack)
    original_shape=copy.deepcopy(pack)
    for file in original_shape['manifest.json']['files']:
        if file['path'].startswith('applications/opp-'):
            old=file['path'];file['path']=old.replace('applications/opp-','applications/')
            original_shape[file['path']]=original_shape.pop(old)
    with pytest.raises(ValueError,match='Opportunity/file mismatch'):
        validate(original_shape)

def test_native_three_round_transport_and_scope():
    pack=load(ROOT/'fixtures/native/rc2-observed-export.json')
    restored=import_pack(export(pack))
    for path in pack:
        if path!='manifest.json':assert restored[path]==pack[path]
    alpha=restored['applications/opp-alpha-analyst.json'];beta=restored['applications/opp-beta-marketing-analyst.json']
    assert len(alpha['interviews'])==2 and len(beta['interviews'])==1
    assert alpha['interviews'][0]['debriefs'][0]['followups']==['How did you report the defects?']
    for file in restored['manifest.json']['files']:file['sha256']=None
    beta['interviews'][0]['answers'][0]['question_id']=alpha['interviews'][0]['questions'][0]['id']
    with pytest.raises(ValueError,match='Cross-company'):
        validate(restored)
