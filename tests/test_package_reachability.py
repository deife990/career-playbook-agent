import json
import shutil
import pytest
from scripts.generate_adapters import generate
from scripts.package_reachability import unreachable


def test_canonical_registry_preserves_non_markdown_assets():
    assert unreachable(generate('chatgpt'), 'chatgpt') == []
    # Diagnostic before D: precisely the 13 aliases and 28 duplicate templates.
    unused=unreachable(generate('claude'), 'claude')
    assert len(unused) == 41
    assert sum(p.startswith('templates/') for p in unused)==28
    assert 'references/w04.md' in unused


def test_missing_schema_reference_is_not_mistaken_for_external_url(tmp_path):
    root=tmp_path/'package'
    shutil.copytree(generate('chatgpt'),root)
    path=root/'references/schemas/preferences.schema.json'
    value=json.loads(path.read_text());value['$ref']='https://careerpilot.local/schemas/missing.schema.json'
    path.write_text(json.dumps(value))
    with pytest.raises(ValueError,match='Missing local schema'):unreachable(root,'chatgpt')


def test_unreferenced_entry_sidecar_is_detected(tmp_path,monkeypatch):
    import scripts.package_reachability as reachability
    root=tmp_path/'package';shutil.copytree(generate('chatgpt'),root)
    (root/'references/unused.md').write_text('Old alias')
    original=reachability.inventory
    monkeypatch.setattr(reachability,'inventory',lambda root,platform:original(root,platform)+['references/unused.md'])
    assert reachability.unreachable(root,'chatgpt')==['references/unused.md']
