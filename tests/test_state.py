import copy, json, pytest
from scripts.common import ROOT, load
from scripts.context_pack import validate, export, import_pack
def fixture(): return load(ROOT/'fixtures/state/two-opportunities.json')
def test_roundtrip():
    p=fixture(); restored=import_pack(export(p)); assert restored['career-profile.json']==p['career-profile.json']; assert restored['applications/beta.json']==p['applications/beta.json']
def test_scope_isolation():
    p=fixture(); p['applications/alpha.json']['opportunity']['opportunity_id']='beta'
    with pytest.raises(ValueError,match='scope'): validate(p)
def test_missing_and_duplicate_paths():
    p=fixture(); del p['applications/beta.json']
    with pytest.raises(ValueError): validate(p)
    p=fixture(); p['manifest.json']['files'].append(p['manifest.json']['files'][0])
    with pytest.raises(ValueError): validate(p)
def test_bad_hash_and_stale_revision():
    p=json.loads(export(fixture())); p['career-profile.json']['name']='Changed'
    with pytest.raises(ValueError,match='Hash'): validate(p)
    old=fixture(); old['manifest.json']['revision']=3
    with pytest.raises(ValueError,match='Stale'): import_pack(export(fixture()),old)
def test_resume_requires_confirmed_evidence():
    p=fixture(); p['applications/alpha.json']['resume_versions']=[{'id':'resume-a','opportunity_id':'alpha','bullets':[{'text':'Tested 12 cases','evidence_ids':['e-1'],'action':'KEEP'}]}]
    validate(p); p['career-profile.json']['evidence'][0]['user_confirmed']=False
    with pytest.raises(ValueError,match='Unconfirmed'): validate(p)
def test_dangling_and_foreign_references():
    p=fixture(); p['applications/alpha.json']['claims']=[{'id':'claim-a','opportunity_id':'alpha','source_ids':['unknown']}]
    with pytest.raises(ValueError,match='Dangling'): validate(p)
def test_community_cannot_verify_fact():
    p=fixture(); app=p['applications/alpha.json']
    app['sources']=[{'id':'src-a','opportunity_id':'alpha','url':'https://example.org/thread','kind':'COMMUNITY','access_status':'ACCESSED'}]
    app['claims']=[{'id':'claim-a','opportunity_id':'alpha','text':'Team restructuring','classification':'VERIFIED FACT','verification':'VERIFIED','source_ids':['src-a']}]
    with pytest.raises(ValueError,match='Weak'): validate(p)
def test_lifecycle_needs_actual_event():
    p=fixture(); p['applications/alpha.json']['opportunity']['status']='OFFER'
    with pytest.raises(ValueError,match='event'): validate(p)
def test_debriefs_are_preserved():
    p=fixture(); p['applications/alpha.json']['interviews']=[{'id':'interview-a','opportunity_id':'alpha','round':{'id':'round-a','opportunity_id':'alpha'},'questions':[],'answers':[],'debriefs':[{'id':'debrief-a','opportunity_id':'alpha','round_id':'round-a','collection_complete':False}]}]
    validate(p); incoming=copy.deepcopy(p); incoming['manifest.json']['revision']=1; incoming['applications/alpha.json']['interviews']=[]
    with pytest.raises(ValueError,match='Debrief'): import_pack(export(incoming),p)
def test_invalid_import_is_atomic():
    p=fixture(); before=copy.deepcopy(p)
    with pytest.raises(ValueError): import_pack('{}',p)
    assert p==before
