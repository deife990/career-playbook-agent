import hashlib
from scripts.generate_adapters import generate, core_hashes
from scripts.common import ROOT, load, validate_skill
def test_generated_core_parity():
    for platform in ['chatgpt','claude']:
        dest=generate(platform)
        assert load(dest/'core-index.json')==core_hashes()
        for path,digest in core_hashes().items(): assert hashlib.sha256((dest/'references'/path).read_bytes()).hexdigest()==digest
def test_chatgpt_all_entries_have_structured_contract():
    dest=generate('chatgpt'); paths=list((dest/'skills').glob('*/SKILL.md'))
    assert len(paths)==12
    for path in paths: validate_skill(path,True)
def test_claude_single_progressive_entry():
    dest=generate('claude'); assert len(list(dest.rglob('SKILL.md')))==1
    assert len((dest/'SKILL.md').read_text().splitlines())<500
    assert all((dest/f'references/w{i:02}.md').exists() for i in range(1,10))

def test_regeneration_preserves_directory_identity_and_removes_generated_duplicates():
    dest=generate('chatgpt');tracked=dest/'references/schemas';before=tracked.stat().st_ino
    duplicate=dest/'skills/career-strategy 2';duplicate.mkdir(exist_ok=True)
    (duplicate/'SKILL.md').write_text('stale generated duplicate')
    generate('chatgpt');assert tracked.stat().st_ino==before and not duplicate.exists()

def test_generator_rejects_external_symlink(tmp_path):
    import pytest
    from scripts.generate_adapters import sync_tree
    source=tmp_path/'source';source.mkdir();(source/'link.md').symlink_to(ROOT/'README.md')
    with pytest.raises(ValueError,match='symlink'):sync_tree(source,tmp_path/'destination')

def test_unchanged_generation_does_not_rewrite_runtime_files():
    from scripts.package_inventory import inventory
    for platform in ['chatgpt','claude']:
        root=generate(platform);before={p:(root/p).stat().st_mtime_ns for p in inventory(root,platform)}
        generate(platform);assert before=={p:(root/p).stat().st_mtime_ns for p in inventory(root,platform)}

def test_portable_only_manifest_cannot_pass_chatgpt_upload_gate(tmp_path):
    import json,pytest
    from scripts.validate_manifest import validate_manifest
    manifest=load(generate('chatgpt')/'plugin.json')
    del manifest['author']
    (tmp_path/'plugin.json').write_text(json.dumps(manifest))
    with pytest.raises(ValueError,match='author.name'):validate_manifest(tmp_path)
    manifest['author']={'name':'deife990'}
    del manifest['extensions']['com.openai']['interface']['displayName']
    (tmp_path/'plugin.json').write_text(json.dumps(manifest))
    with pytest.raises(ValueError,match='displayName'):validate_manifest(tmp_path)
