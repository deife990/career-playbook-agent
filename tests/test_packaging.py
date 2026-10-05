import hashlib, json, zipfile
import pytest
from scripts.package_release import package
from scripts.common import ROOT, validate_links
from scripts.run_model_evals import fingerprint
from scripts.generate_adapters import generate
from scripts.release_readiness import check

def test_deterministic_archives_and_clean_extract(tmp_path):
    first={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in package()}
    second=package()
    assert first=={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in second}
    for archive in second[:2]:
        platform='claude' if 'claude' in archive.name else 'chatgpt'
        dest=tmp_path/platform
        with zipfile.ZipFile(archive) as z:
            assert all(n.startswith('careerpilot/') and '..' not in n.split('/') for n in z.namelist())
            assert all(n.endswith(('.md','.json','.yaml')) for n in z.namelist())
            z.extractall(dest)
        root=dest/'careerpilot';validate_links(root)
        assert fingerprint(root)==fingerprint(generate(platform))
        if platform=='claude': assert (root/'SKILL.md').is_file()
        else:
            assert not (root/'.agents/plugins/marketplace.json').exists()
            portable=json.loads((root/'plugin.json').read_text())
            compatibility=json.loads((root/'.codex-plugin/plugin.json').read_text())
            assert compatibility['name']==portable['name']
            assert compatibility['version']==portable['version']
            assert compatibility['skills']=='./skills/'
            assert compatibility['interface']==portable['extensions']['com.openai']['interface']
            assert compatibility['extensions']['com.openai']['onboardingSkill']==portable['extensions']['com.openai']['onboardingSkill']

def test_missing_native_evidence_blocks_release(monkeypatch):
    monkeypatch.setattr('scripts.release_readiness.load',lambda path: {'status':'PENDING'})
    with pytest.raises(ValueError,match='Native'): check()

def test_build_link_validation_actually_checks_dist(tmp_path):
    root=tmp_path/'dist'/'package';root.mkdir(parents=True)
    (root/'bad.md').write_text('[broken](missing.md)')
    with pytest.raises(ValueError,match='Broken'): validate_links(root)

def test_behavior_fingerprint_excludes_incidental_generated_duplicates():
    root=generate('claude');before=fingerprint(root)
    duplicate=root/'templates/career-profile 2.json';duplicate.write_text('{"unexpected":"must not ship"}')
    try: assert fingerprint(root)==before
    finally:duplicate.unlink(missing_ok=True)

def test_failed_actual_assertion_cannot_hide_under_pass_header(tmp_path,monkeypatch):
    import hashlib,yaml
    import scripts.release_readiness as readiness
    cases=tmp_path/'evals/scenarios';cases.mkdir(parents=True)
    definition={'id':'case','assertions':{'scope':'Preserve company isolation'}}
    text=yaml.safe_dump(definition);(cases/'case.yaml').write_text(text)
    report={'platform':'chatgpt','status':'PASS','package_fingerprint':'current','suite_fingerprint':readiness.suite_fingerprint([cases/'case.yaml'],tmp_path),'cases':[{'id':'case','status':'PASS','model_ids':['actual-model'],'judge_model':'judge','assertions':[{'id':'scope','pass':False,'reason':'leaked company','evidence_quote':'Beta'}],'transcript':[{'role':'assistant','content':'Beta'}]}]}
    monkeypatch.setattr(readiness,'ROOT',tmp_path)
    monkeypatch.setattr(readiness,'generate',lambda platform:tmp_path)
    monkeypatch.setattr(readiness,'fingerprint',lambda root:'current')
    monkeypatch.setattr(readiness,'load',lambda path: {'status':'PASS'} if path.name=='native-install.json' else report)
    with pytest.raises(ValueError,match='failed assertion'):readiness.check()
