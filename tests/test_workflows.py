from scripts.validate_workflows import main
from scripts.common import ROOT, frontmatter
def test_workflow_contracts(): main()
def test_workflow_artifact_templates():
    for p in (ROOT/'core/workflows').glob('w*.md'):
        meta,_=frontmatter(p)
        assert (ROOT/f"templates/artifacts/{meta['artifact']}.md").is_file()
