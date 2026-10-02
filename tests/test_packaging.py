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
            manifest=json.loads((root/'.agents/plugins/marketplace.json').read_text())
            assert manifest['plugins'][0]['source']['path']=='./'

def test_missing_native_evidence_blocks_release():
    with pytest.raises(ValueError,match='Native'): check()

def test_build_link_validation_actually_checks_dist(tmp_path):
    root=tmp_path/'dist'/'package';root.mkdir(parents=True)
    (root/'bad.md').write_text('[broken](missing.md)')
    with pytest.raises(ValueError,match='Broken'): validate_links(root)
