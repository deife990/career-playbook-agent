import json
import pytest
import yaml
import scripts.release_readiness as readiness

@pytest.fixture
def scoped_reports(tmp_path,monkeypatch):
    (tmp_path/'VERSION').write_text('1.1.0-rc.5\n')
    (tmp_path/'instruction.md').write_text('User excluded further browser validation.')
    cases=tmp_path/'evals/scenarios';cases.mkdir(parents=True)
    (cases/'case.yaml').write_text(yaml.safe_dump({'id':'case','assertions':{'truth':'Do not invent'}}))
    scope={'requested_by':'USER','requested_at':'2026-10-12','version':'1.1.0-rc.5',
           'excluded_checks':['native_browser'],'evidence_path':'instruction.md',
           'package_fingerprints':{'chatgpt':'digest','claude':'digest'}}
    scope_path=tmp_path/'scope.json';scope_path.write_text(json.dumps(scope))
    reports={host:{'platform':host,'status':'PASS','package_fingerprint':'digest',
        'suite_fingerprint':readiness.suite_fingerprint([cases/'case.yaml'],tmp_path),
        'cases':[{'id':'case','status':'PASS','model_ids':['actual-model'],'judge_model':'judge',
            'assertions':[{'id':'truth','pass':True,'reason':'No invention','evidence_quote':'Unknown'}],
            'transcript':[{'role':'assistant','content':'Unknown'}]}]} for host in ['chatgpt','claude']}
    original_load=readiness.load
    def load(path):
        if path.name=='native-install.json':return {'status':'PENDING','platforms':{}}
        if path.parent.name=='evals' and path.stem in reports:return reports[path.stem]
        return original_load(path)
    monkeypatch.setattr(readiness,'ROOT',tmp_path)
    monkeypatch.setattr(readiness,'load',load)
    monkeypatch.setattr(readiness,'generate',lambda host:tmp_path)
    monkeypatch.setattr(readiness,'fingerprint',lambda root:'digest')
    return scope_path,scope,reports

def test_explicit_exclusion_certifies_only_scope(scoped_reports,capsys):
    path,_,_=scoped_reports
    readiness.check(native_exclusion=path)
    assert 'EXCLUDED, not certified' in capsys.readouterr().out

@pytest.mark.parametrize('mutation', ['version','fingerprint','requester','extra_exclusion','missing_evidence'])
def test_scope_cannot_be_reused_or_expanded(scoped_reports,mutation):
    path,scope,_=scoped_reports
    if mutation=='version':scope['version']='1.2.0'
    if mutation=='fingerprint':scope['package_fingerprints']['claude']='stale'
    if mutation=='requester':scope['requested_by']='ASSISTANT'
    if mutation=='extra_exclusion':scope['excluded_checks'].append('model_evals')
    if mutation=='missing_evidence':scope['evidence_path']='missing.md'
    path.write_text(json.dumps(scope))
    with pytest.raises(ValueError):readiness.check(native_exclusion=path)

@pytest.mark.parametrize('mutation',['missing_case','failed_assertion','stale_suite','missing_model'])
def test_browser_exclusion_never_waives_model_failures(scoped_reports,mutation):
    path,_,reports=scoped_reports;report=reports['claude']
    if mutation=='missing_case':report['cases']=[]
    if mutation=='failed_assertion':report['cases'][0]['assertions'][0]['pass']=False
    if mutation=='stale_suite':report['suite_fingerprint']='stale'
    if mutation=='missing_model':report['cases'][0]['model_ids']=[]
    with pytest.raises(ValueError):readiness.check(native_exclusion=path)

def test_default_still_requires_native_signoff(scoped_reports):
    with pytest.raises(ValueError,match='Native'):readiness.check()
