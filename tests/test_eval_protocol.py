import json
from pathlib import Path
import pytest
from scripts.eval_protocol import protocol, protocol_fingerprint, summarize, validate_report
from scripts.common import ROOT


def small_report():
    config={'version':2,'context_mode':'preloaded','reference_discovery_verified':False,
            'scenarios':[{'id':'safety','runs':3,'tier':'critical','judge':'cross'}]}
    rows=[{'id':'safety','run':i,'status':'PASS','model_ids':['subject'], 'judge_model':'judge',
           'judge_platform':'claude','loaded_files':{'SKILL.md':'hash'},
           'transcript':[{'role':'assistant','content':'Unknown'}],
           'assertions':[{'id':'unknown','pass':True,'reason':'no invented gap','evidence_quote':'Unknown'}]}
          for i in range(1,4)]
    return {'platform':'chatgpt','package_fingerprint':'pkg','suite_fingerprint':'suite',
            'protocol':config,'protocol_fingerprint':protocol_fingerprint(config),'cases':rows}


def verify(report):
    validate_report(report,'chatgpt','pkg','suite',{'safety':{'assertions':{'unknown':'Unknown stays Unknown'}}},config=report['protocol'])


def test_frozen_tiers_have_exact_complete_scenario_coverage():
    import yaml
    config=protocol()
    ids={yaml.safe_load(p.read_text())['id'] for p in (ROOT/'evals/scenarios').glob('*.yaml')}
    assert ids=={r['id'] for r in config['scenarios']}
    assert sum(r['runs'] for r in config['scenarios'])==130
    assert all(r['runs']==3 and r['judge']=='cross' for r in config['scenarios'] if r['tier']=='critical')


def test_every_repeat_and_exact_cross_judge_required():
    report=small_report();verify(report)
    report['cases'].pop()
    with pytest.raises(ValueError,match='incomplete'):verify(report)
    assert report['rates']['safety']['pass_rate']==2/3
    report=small_report();report['cases'][0]['judge_platform']='chatgpt'
    with pytest.raises(ValueError,match='judge'):verify(report)


def test_duplicate_error_and_failure_cannot_hide_in_pass_header():
    report=small_report();report['cases'][2]=report['cases'][0]
    with pytest.raises(ValueError,match='Duplicate'):verify(report)
    report=small_report();report['cases'][0]['status']='ERROR';report['status']='PASS'
    with pytest.raises(ValueError,match='incomplete'):verify(report)
    report=small_report();report['cases'][0]['assertions'][0]['pass']=False
    with pytest.raises(ValueError,match='failed assertion'):verify(report)
    report=small_report();report['cases'][0]['prior_attempts']=[{'status':'FAIL'}]
    with pytest.raises(ValueError,match='Prior'):verify(report)


def test_diagnostic_and_protocol_changes_do_not_certify_release():
    report=small_report();report['protocol']['context_mode']='entry-only'
    report['protocol_fingerprint']=protocol_fingerprint(report['protocol'])
    with pytest.raises(ValueError,match='diagnostic'):verify(report)
    report=small_report();report['protocol_fingerprint']='stale'
    with pytest.raises(ValueError,match='protocol'):verify(report)


def test_completed_subject_is_reused_after_judge_interruption(tmp_path,monkeypatch):
    from scripts.generate_adapters import generate
    import scripts.run_model_evals as runner
    import yaml
    case=yaml.safe_load((ROOT/'evals/scenarios/setup-no-invention.yaml').read_text())
    calls=[]
    def model(platform,prompt,folder,stem,schema=None):
        calls.append((platform,stem))
        if schema: raise runner.ModelTimeoutError('judge interrupted')
        return 'Unknown. 어떤 경험이 있으신가요?', 'actual-subject'
    monkeypatch.setattr(runner,'call_model',model)
    first=tmp_path/'first'
    with pytest.raises(runner.ModelTimeoutError):runner.run_case(generate('claude'),'claude',case,first,judge_platform='chatgpt')
    assert (first/'subject-checkpoint.json').is_file()
    calls.clear()
    def judge(platform,prompt,folder,stem,schema=None):
        assert schema is not None
        return json.dumps({'assertions':[{'id':key,'pass':True,'reason':'safe','evidence_quote':'Unknown'} for key in case['assertions']]}),'actual-judge'
    monkeypatch.setattr(runner,'call_model',judge)
    second=tmp_path/'second'
    result=runner.run_case(generate('claude'),'claude',case,second,judge_platform='chatgpt',resume_from=first)
    assert result['model_ids']==['actual-subject'] and result['judge_platform']=='chatgpt'
    assert (second/'subject-checkpoint.json').is_file()


def test_comparison_does_not_pool_regressions_or_allow_safety_failures():
    from copy import deepcopy
    from scripts.compare_model_evals import compare
    before=small_report();after=deepcopy(before)
    after['package_fingerprint']='candidate'
    assert compare(before,after)['release_certified'] is False
    after['cases'][0]['assertions'][0]['pass']=False
    after['cases'][0]['status']='FAIL'
    with pytest.raises(ValueError,match='Safety'):compare(before,after)
    before=small_report();after=deepcopy(before)
    for report in [before,after]:report['protocol']['scenarios'][0]['safety_assertions']=[];report['protocol_fingerprint']=protocol_fingerprint(report['protocol'])
    after['cases'][0]['assertions'][0]['pass']=False;after['cases'][0]['status']='FAIL'
    with pytest.raises(ValueError,match='regression'):compare(before,after)
    before=small_report();after=deepcopy(before);after['cases'].pop()
    with pytest.raises(ValueError,match='incomplete'):compare(before,after)


def test_resume_never_replaces_a_real_failed_run(tmp_path,monkeypatch):
    import sys
    import scripts.run_model_evals as runner
    calls=[]
    def failed(root,platform,case,folder,**kwargs):
        calls.append(folder)
        return {'id':case['id'],'persona':case['persona'],'status':'FAIL'}
    monkeypatch.setattr(runner,'run_case',failed)
    args=['run_model_evals','--platform','chatgpt','--scenario','setup-no-invention','--report-dir',str(tmp_path)]
    monkeypatch.setattr(sys,'argv',args)
    with pytest.raises(SystemExit):runner.main()
    assert len(calls)==3
    original=json.loads((tmp_path/'chatgpt.json').read_text())
    monkeypatch.setattr(sys,'argv',args+['--resume'])
    with pytest.raises(SystemExit):runner.main()
    assert len(calls)==3
    assert json.loads((tmp_path/'chatgpt.json').read_text())['cases']==original['cases']
    monkeypatch.setattr(sys,'argv',args)
    with pytest.raises(ValueError,match='never overwrite'):runner.main()


def test_resume_retains_error_attempt_and_refuses_protocol_change(tmp_path,monkeypatch):
    import sys
    import scripts.run_model_evals as runner
    def interrupted(root,platform,case,folder,**kwargs):
        folder.mkdir(parents=True,exist_ok=True)
        (folder/'actual.stderr.txt').write_text('429 interrupted')
        raise runner.RateLimitError('429 interrupted')
    monkeypatch.setattr(runner,'run_case',interrupted)
    args=['run_model_evals','--platform','claude','--scenario','setup-no-invention','--report-dir',str(tmp_path)]
    monkeypatch.setattr(sys,'argv',args)
    with pytest.raises(SystemExit):runner.main()
    old=json.loads((tmp_path/'claude.json').read_text())['cases'][0]
    monkeypatch.setattr(sys,'argv',args+['--resume','--judge','same'])
    with pytest.raises(ValueError,match='mismatch'):runner.main()
    def passed(root,platform,case,folder,**kwargs):
        return {'id':case['id'],'persona':case['persona'],'status':'PASS'}
    monkeypatch.setattr(runner,'run_case',passed)
    monkeypatch.setattr(sys,'argv',args+['--resume'])
    with pytest.raises(SystemExit):runner.main()
    rows=json.loads((tmp_path/'claude.json').read_text())['cases']
    assert rows[0]['prior_attempts']==[{k:v for k,v in old.items() if k!='prior_attempts'}]
    assert (Path(old['attempt_path'])/'actual.stderr.txt').read_text()=='429 interrupted'


def test_baseline_failure_is_preserved_but_never_relaxes_candidate_safety():
    from copy import deepcopy
    from scripts.compare_model_evals import compare
    baseline=small_report();candidate=deepcopy(baseline)
    baseline['cases'][0]['status']='FAIL'
    baseline['cases'][0]['assertions'][0]['pass']=False
    baseline['protocol']['scenarios'][0]['safety_assertions']=['unknown']
    candidate['protocol']=deepcopy(baseline['protocol'])
    for report in [baseline,candidate]:report['protocol_fingerprint']=protocol_fingerprint(report['protocol'])
    assert compare(baseline,candidate)['status']=='PASS'
    assert baseline['cases'][0]['status']=='FAIL'
    candidate['cases'][0]['assertions'][0]['pass']=False;candidate['cases'][0]['status']='FAIL'
    with pytest.raises(ValueError,match='Safety'):compare(baseline,candidate)
