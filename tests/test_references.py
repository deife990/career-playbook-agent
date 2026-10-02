import pytest
from scripts.common import ROOT, validate_links, validate_skill
def test_source_links(): validate_links(ROOT)
def test_missing_and_escaping_links(tmp_path):
    for link in ['missing.md','../escaped.md']:
        (tmp_path/'file.md').write_text(f'[x]({link})')
        with pytest.raises(ValueError): validate_links(tmp_path)
def test_frontmatter(tmp_path):
    skill=tmp_path/'valid'; skill.mkdir(); path=skill/'SKILL.md'
    path.write_text('---\nname: valid\ndescription: Use for testing.\n---\n')
    validate_skill(path)
    path.write_text('---\nname: mismatch\ndescription: Use for testing.\n---\n')
    with pytest.raises(ValueError): validate_skill(path)
