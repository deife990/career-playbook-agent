import pytest
from scripts.resume_audit import audit_bullets
def test_invented_numeric_result_rejected():
    evidence=[{'id':'e1','user_confirmed':True,'own_role':'Tested 12 cases','outcome':'Reported defects'}]
    assert audit_bullets([{'text':'Tested 12 cases','evidence_ids':['e1'],'action':'KEEP'}],evidence)
    with pytest.raises(ValueError,match='number'): audit_bullets([{'text':'Reduced defects 40%','evidence_ids':['e1'],'action':'REWRITE'}],evidence)
def test_unconfirmed_and_dangling_evidence_rejected():
    for evidence in [[],[{'id':'e1','user_confirmed':False}]]:
        with pytest.raises(ValueError): audit_bullets([{'text':'Led project','evidence_ids':['e1']}],evidence)
