import json
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
