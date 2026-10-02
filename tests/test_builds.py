from scripts.build_common import build
from scripts.common import validate_links, validate_skill
def test_skeletons_build():
    for platform in ['chatgpt','claude']:
        root=build(platform); validate_links(root)
        assert list(root.rglob('SKILL.md'))
