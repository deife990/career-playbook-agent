from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[1]
def test_specification_and_skeleton():
    assert re.fullmatch(r'\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?',ROOT.joinpath('VERSION').read_text().strip())
    assert 'Full V1' in ROOT.joinpath('product/PRODUCT_DEFINITION.md').read_text()
    for folder in ['core/principles','core/router','core/workflows','schemas','adapters/chatgpt','adapters/claude','evals','fixtures','scripts','tests','docs']:
        assert ROOT.joinpath(folder).is_dir()
