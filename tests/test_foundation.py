from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
def test_specification_and_skeleton():
    assert ROOT.joinpath('VERSION').read_text().strip() == '1.0.0-rc.1'
    assert 'Full V1' in ROOT.joinpath('product/PRODUCT_DEFINITION.md').read_text()
    for folder in ['core/principles','core/router','core/workflows','schemas','adapters/chatgpt','adapters/claude','evals','fixtures','scripts','tests','docs']:
        assert ROOT.joinpath(folder).is_dir()
