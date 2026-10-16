import pytest, yaml
from scripts.common import ROOT
from scripts.run_model_evals import grade, extract_json
def test_ten_personas_and_every_scenario_binding():
    personas={yaml.safe_load(p.read_text())['id'] for p in (ROOT/'evals/personas').glob('*.yaml')}
    cases=[yaml.safe_load(p.read_text()) for p in (ROOT/'evals/scenarios').glob('*.yaml')]
    variant_cases=[yaml.safe_load(p.read_text()) for p in (ROOT/'evals/variants/e-stage').rglob('*.yaml')]
    assert len(personas)>=10
    assert {c['persona'] for c in cases}|{c['persona'] for c in variant_cases}==personas
    assert 'e-stage-synthetic-neutral' not in {c['persona'] for c in cases}
    assert len(cases)>=15 and len({c['id'] for c in cases})==len(cases)
def test_judge_cannot_omit_or_fabricate_evidence():
    transcript=[{'role':'assistant','content':'어느 회사인가요?'}]
    with pytest.raises(ValueError): grade({'scope':'clarify'},'{"assertions":[]}',transcript)
    bad='{"assertions":[{"id":"scope","pass":true,"reason":"ok","evidence_quote":"fake"}]}'
    with pytest.raises(ValueError): grade({'scope':'clarify'},bad,transcript)
def test_fenced_json(): assert extract_json('```json\n{"x":1}\n```')=={'x':1}

@pytest.mark.parametrize('platform,returncode,stdout,stderr',[
    ('chatgpt',1,'','ERROR: exceeded retry limit, last status: 429 Too Many Requests'),
    ('claude',0,'{"is_error":true,"result":"429 Too Many Requests"}',''),
    ('claude',1,'{"is_error":true,"result":"429 Too Many Requests"}',''),
    ('claude',0,'{"is_error":true,"result":"You have hit your limit; resets tomorrow"}',''),
])
def test_service_limits_stop_and_preserve_actual_logs(monkeypatch,tmp_path,platform,returncode,stdout,stderr):
    from subprocess import CompletedProcess
    from scripts.run_model_evals import call_model,RateLimitError
    calls=[]
    def run(cmd,**kwargs):
        calls.append(cmd)
        return CompletedProcess(cmd,returncode,stdout,stderr)
    monkeypatch.setattr('scripts.run_model_evals.subprocess.run',run)
    with pytest.raises(RateLimitError): call_model(platform,'synthetic prompt',tmp_path,'turn-1')
    assert len(calls)==1
    assert (tmp_path/'turn-1.stdout.txt').read_text()==stdout
    assert (tmp_path/'turn-1.stderr.txt').read_text()==stderr

def test_successful_text_mentioning_429_is_not_a_service_failure(monkeypatch,tmp_path):
    from subprocess import CompletedProcess
    from scripts.run_model_evals import call_model
    monkeypatch.setattr('scripts.run_model_evals.subprocess.run',lambda cmd,**kwargs:
        CompletedProcess(cmd,0,'{"is_error":false,"result":"429 is only a fictional example.","modelUsage":{"test-model":{}}}',''))
    assert call_model('claude','synthetic prompt',tmp_path,'turn-1')==('429 is only a fictional example.','test-model')

def test_missing_fresh_output_cannot_reuse_previous_response(monkeypatch,tmp_path):
    from subprocess import CompletedProcess
    from scripts.run_model_evals import call_model
    (tmp_path/'turn-1.txt').write_text('old passing answer')
    monkeypatch.setattr('scripts.run_model_evals.subprocess.run',lambda cmd,**kwargs:
        CompletedProcess(cmd,0,'','model: current-model'))
    with pytest.raises(RuntimeError,match='Missing actual model output'):
        call_model('chatgpt','synthetic prompt',tmp_path,'turn-1')
    assert not (tmp_path/'turn-1.txt').exists()

def test_capacity_retry_cannot_reuse_failed_attempt_output(monkeypatch,tmp_path):
    from subprocess import CompletedProcess
    from scripts.run_model_evals import call_model
    calls=[]
    def run(cmd,**kwargs):
        calls.append(cmd)
        if len(calls)==1:
            (tmp_path/'turn-1.txt').write_text('incomplete failed attempt')
            return CompletedProcess(cmd,1,'','Selected model is at capacity')
        return CompletedProcess(cmd,0,'','model: current-model')
    monkeypatch.setattr('scripts.run_model_evals.subprocess.run',run)
    monkeypatch.setattr('scripts.run_model_evals.time.sleep',lambda seconds:None)
    with pytest.raises(RuntimeError,match='Missing actual model output'):
        call_model('chatgpt','synthetic prompt',tmp_path,'turn-1')
    assert len(calls)==2 and not (tmp_path/'turn-1.txt').exists()
    assert 'capacity' in (tmp_path/'turn-1.capacity-1.stderr.txt').read_text()

@pytest.mark.parametrize('partial',[b'partial response','partial response'])
def test_timeout_preserves_only_current_partial_logs(monkeypatch,tmp_path,partial):
    from subprocess import TimeoutExpired
    from scripts.run_model_evals import call_model,ModelTimeoutError
    for suffix in ('txt','stdout.txt','stderr.txt'):
        (tmp_path/f'turn-1.{suffix}').write_text('old passing response/log')
    calls=[]
    def run(cmd,**kwargs):
        calls.append(cmd)
        (tmp_path/'turn-1.txt').write_text('incomplete current output')
        raise TimeoutExpired(cmd,600,output=partial,stderr=b'current provider diagnostic')
    monkeypatch.setattr('scripts.run_model_evals.subprocess.run',run)
    with pytest.raises(ModelTimeoutError):call_model('claude','synthetic prompt',tmp_path,'turn-1')
    assert len(calls)==1 and not (tmp_path/'turn-1.txt').exists()
    assert (tmp_path/'turn-1.stdout.txt').read_text()=='partial response'
    diagnostic=(tmp_path/'turn-1.stderr.txt').read_text()
    assert 'current provider diagnostic' in diagnostic and 'timed out' in diagnostic
    assert 'old passing' not in diagnostic

def test_suite_digest_tracks_persona_and_seed_changes(tmp_path):
    from scripts.run_model_evals import suite_fingerprint
    cases=tmp_path/'evals/scenarios';cases.mkdir(parents=True)
    personas=tmp_path/'evals/personas';personas.mkdir()
    case=cases/'case.yaml';case.write_text('id: case\npersona: user\ncontext_fixture: seed.json\n')
    persona=personas/'user.yaml';persona.write_text('experience: null\n')
    seed=tmp_path/'seed.json';seed.write_text('{"fact":null}')
    original=suite_fingerprint([case],tmp_path)
    persona.write_text('experience: testing\n')
    changed=suite_fingerprint([case],tmp_path);assert changed!=original
    seed.write_text('{"fact":"confirmed"}')
    assert suite_fingerprint([case],tmp_path)!=changed

def test_roundtrip_allows_only_added_unknown_nulls():
    from scripts.run_model_evals import lossless
    assert lossless({'facts':[{'number':12}]},{'facts':[{'number':12,'optional':None}],'unknown':None})
    assert not lossless({'facts':[12]},{'facts':[13]})
    assert not lossless({'facts':[12]},{'facts':[12],'invented':'outcome'})
    assert not lossless({'unknown':None},{})
    assert not lossless({'facts':[12]},{'facts':[12,13]})

def test_progressive_reference_shim_loads_only_selected_workflow():
    from scripts.generate_adapters import generate
    from scripts.run_model_evals import package_context
    for platform in ['chatgpt','claude']:
        case=yaml.safe_load((ROOT/'evals/scenarios/english-mock.yaml').read_text())
        _,hashes=package_context(generate(platform),platform,case)
        workflows=[p for p in hashes if '/core/workflows/' in p]
        assert len(workflows)==1 and 'w07' in workflows[0]

def test_shim_resolves_host_temp_directory_aliases(tmp_path):
    from scripts.generate_adapters import generate
    from scripts.run_model_evals import package_context
    target=generate('chatgpt');alias=tmp_path/'alias';alias.symlink_to(target,target_is_directory=True)
    case=yaml.safe_load((ROOT/'evals/scenarios/interview-prep-evidence.yaml').read_text())
    _,hashes=package_context(alias,'chatgpt',case)
    assert 'skills/interview-prep/SKILL.md' in hashes


def test_line_selected_judge_uses_actual_markdown_without_paraphrase():
    import json
    from scripts.run_model_evals import assistant_lines,grade_lines
    history=[{'role':'user','content':'fake proof'},
             {'role':'assistant','content':'## Review\n\n| Net pay | **Unknown** |'}]
    lines=assistant_lines(history)
    raw=json.dumps({'assertions':[{'id':'finance','pass':True,'reason':'No estimate',
                                  'evidence_line':1}]})
    rows=grade_lines({'finance':'No estimates'},raw,history)
    assert rows[0]['evidence_quote']=='| Net pay | **Unknown** |'
    assert 'fake proof' not in lines


@pytest.mark.parametrize('line_id',[99,-1,True,'1'])
def test_line_selected_judge_rejects_invalid_or_invented_reference(line_id):
    import json
    from scripts.run_model_evals import grade_lines
    raw=json.dumps({'assertions':[{'id':'truth','pass':True,'reason':'Test',
                                  'evidence_line':line_id}]})
    with pytest.raises(ValueError):
        grade_lines({'truth':'No fabrication'},raw,[{'role':'assistant','content':'Unknown'}])


def test_line_selected_judge_keeps_false_verdict_and_checks_assertion_ids():
    import json
    from scripts.run_model_evals import grade_lines
    history=[{'role':'assistant','content':'Unsupported claim'}]
    row={'id':'truth','pass':False,'reason':'Invented fact','evidence_line':0}
    assert grade_lines({'truth':'No fabrication'},json.dumps({'assertions':[row]}),history)[0]['pass'] is False
    row['id']='unrelated'
    with pytest.raises(ValueError):grade_lines({'truth':'No fabrication'},json.dumps({'assertions':[row]}),history)


def test_judge_keeps_valid_first_verdict_without_extra_request(monkeypatch,tmp_path):
    import json
    from scripts.run_model_evals import judge_transcript
    calls=[]
    def model(*args):
        calls.append(args)
        return json.dumps({'assertions':[{'id':'truth','pass':True,'reason':'Safe',
                                         'evidence_quote':'Unknown'}]}),'actual-judge'
    monkeypatch.setattr('scripts.run_model_evals.call_model',model)
    rows,_=judge_transcript('claude',{'assertions':{'truth':'No invention'}},
                          [{'role':'assistant','content':'Unknown'}],{},None,tmp_path)
    assert len(calls)==1 and rows[0]['pass'] is True


def test_bad_quote_repair_selects_original_line_and_never_changes_verdict(monkeypatch,tmp_path):
    import json
    from scripts.run_model_evals import judge_transcript,JUDGE_LINE_SCHEMA
    calls=[]
    def model(*args):
        calls.append(args)
        row={'id':'truth','pass':False,'reason':'Fabricated claim'}
        if len(calls)==1: row['evidence_quote']='not in response'
        else:
            assert args[-1]==JUDGE_LINE_SCHEMA
            row['evidence_line']=0
        return json.dumps({'assertions':[row]}),'actual-judge'
    monkeypatch.setattr('scripts.run_model_evals.call_model',model)
    rows,_=judge_transcript('claude',{'assertions':{'truth':'No invention'}},
                          [{'role':'assistant','content':'**Invented**'}],{},None,tmp_path)
    assert len(calls)==2 and rows[0]['pass'] is False
    assert rows[0]['evidence_quote']=='**Invented**'


def test_progressive_shim_loads_linked_exchange_markdown_without_unneeded_json_defaults():
    from scripts.generate_adapters import generate
    from scripts.run_model_evals import package_context
    case={'workflow':'W05'}
    for platform in ('chatgpt','claude'):
        _,hashes=package_context(generate(platform),platform,case)
        assert 'references/templates/artifacts/evidence-exchange.md' in hashes
        assert not any(p.endswith('.json') and '/templates/' in p for p in hashes)
