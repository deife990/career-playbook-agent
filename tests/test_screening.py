import copy
import pytest
from scripts.common import ROOT, load
from scripts.context_pack import validate, export, import_pack
from scripts.screening_state import observe_vendor


def pack(): return load(ROOT/'fixtures/state/submitted-v11.json')


def test_v11_context_roundtrip_exact_and_v1_still_valid():
    p = pack(); restored = import_pack(export(p))
    for path in p:
        if path != 'manifest.json': assert restored[path] == p[path]
    validate(load(ROOT/'fixtures/state/two-opportunities.json'))


@pytest.mark.parametrize('unit,text,limit', [('CHARACTERS','가나다',2),('BYTES','가나',5),('WORDS','one two three',2)])
def test_form_limits_measured_in_actual_unit(unit,text,limit):
    p=pack();p['applications/alpha.json']['answers']=[{'question':'Test','answer':text,'limit':limit,'limit_unit':unit}]
    with pytest.raises(ValueError,match='field limit'):validate(p)
    p['applications/alpha.json']['answers'][0]['limit']=20;validate(p)


def test_motivation_not_user_approved_from_company_facts_alone():
    p=pack();p['applications/alpha.json']['answers']=[{'type':'WHY_COMPANY','answer':'I admire your product',
        'status':'USER_APPROVED','user_confirmed':True,'motivation_confirmed':False}]
    with pytest.raises(ValueError,match='motivation'):validate(p)


def test_inferred_need_and_positive_match_require_evidence():
    p=pack();app=p['applications/alpha.json']
    app['opportunity']['job_analysis']={'id':'jd-a','opportunity_id':'alpha','requirements':[
        {'key':'r-1','text':'Build team','category':'HIDDEN_INFERRED','classification':'VERIFIED FACT'}]}
    with pytest.raises(ValueError,match='Hidden'):validate(p)
    app['opportunity']['job_analysis']['requirements'][0]['classification']='INFERENCE'
    app['screening']={'resume_version_id':'resume-a','coverage':[{'requirement_key':'r-1','match':'DIRECT_MATCH'}]}
    with pytest.raises(ValueError,match='lacks evidence'):validate(p)
    app['screening']['coverage'][0]['match']='UNKNOWN';validate(p)
    app['screening']['coverage'][0]['requirement_key']='other'
    with pytest.raises(ValueError,match='requirement key'):validate(p)


def test_pending_qa_cannot_be_final_ready():
    p=pack();p['applications/alpha.json']['screening']={'ready':True,'stages':[{'name':'RENDERING','status':'PASS'}]}
    with pytest.raises(ValueError,match='readiness'):validate(p)


@pytest.mark.parametrize('url', ['https://jobs.lever.co.evil.example/a','https://example.org/jobs.lever.co/a',
    'https://jobs.lever.co@evil.example/a','file:///jobs.lever.co','https://example.oraclecloud.com/hcmui'])
def test_vendor_observation_does_not_match_paths_spoofs_or_wrong_oracle(url):
    assert observe_vendor(url)['status']=='UNKNOWN'


def test_host_without_employer_identity_is_only_likely():
    url='https://jobs.lever.co/alpha/req-1'
    assert observe_vendor(url)['status']=='LIKELY'
    assert observe_vendor(url,identity_confirmed=True)['status']=='CONFIRMED'


@pytest.mark.parametrize('path', ['../secret.pdf','/tmp/resume.pdf','a\\secret.pdf','https://example.org/resume.pdf'])
def test_unsafe_sidecar_path_rejected(path):
    p=pack();app=p['applications/alpha.json'];app['submissions']=None
    app['resume_versions'][0]['artifacts']=[{'path':path,'format':'PDF'}]
    with pytest.raises(ValueError,match='sidecar'):validate(p)


def test_cross_company_resume_derivation_rejected():
    p=pack();p['applications/beta.json']['resume_versions']=[{'id':'r-beta','opportunity_id':'beta','derived_from_id':'resume-a'}]
    with pytest.raises(ValueError,match='cross-company'):validate(p)
