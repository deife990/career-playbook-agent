import shutil
import pytest
from scripts.common import ROOT, load
from scripts.generate_adapters import generate
from scripts.package_budget import check_budget


@pytest.mark.parametrize('platform', ['chatgpt', 'claude'])
def test_runtime_inventory_and_initial_load_never_grow(platform):
    check_budget(generate(platform), platform)


def test_real_required_policy_growth_trips_frozen_cap(tmp_path):
    source = generate('claude')
    root = tmp_path / 'careerpilot'
    shutil.copytree(source, root)
    policy = root / 'references/core/principles/evidence-policy.md'
    policy.write_text(policy.read_text() + '\nNew mandatory text.\n')
    with pytest.raises(ValueError, match='initial bytes'):
        check_budget(root, 'claude')


def test_new_canonical_runtime_file_trips_frozen_count(tmp_path):
    source = generate('chatgpt')
    root = tmp_path / 'careerpilot'
    shutil.copytree(source, root)
    index = load(root / 'core-index.json')
    index['core/extra.md'] = 'unused-test-hash'
    import json
    (root / 'core-index.json').write_text(json.dumps(index))
    (root / 'references/core/extra.md').write_text('extra contract')
    with pytest.raises(ValueError, match='file count'):
        check_budget(root, 'chatgpt')
