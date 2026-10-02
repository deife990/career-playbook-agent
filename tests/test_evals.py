import pytest, yaml
from scripts.common import ROOT
from scripts.run_model_evals import grade, extract_json
def test_ten_personas_and_every_scenario_binding():
    personas={yaml.safe_load(p.read_text())['id'] for p in (ROOT/'evals/personas').glob('*.yaml')}
    cases=[yaml.safe_load(p.read_text()) for p in (ROOT/'evals/scenarios').glob('*.yaml')]
    assert len(personas)>=10; assert {c['persona'] for c in cases}==personas
    assert len(cases)>=15 and len({c['id'] for c in cases})==len(cases)
def test_judge_cannot_omit_or_fabricate_evidence():
    transcript=[{'role':'assistant','content':'어느 회사인가요?'}]
    with pytest.raises(ValueError): grade({'scope':'clarify'},'{"assertions":[]}',transcript)
    bad='{"assertions":[{"id":"scope","pass":true,"reason":"ok","evidence_quote":"fake"}]}'
    with pytest.raises(ValueError): grade({'scope':'clarify'},bad,transcript)
def test_fenced_json(): assert extract_json('```json\n{"x":1}\n```')=={'x':1}

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
