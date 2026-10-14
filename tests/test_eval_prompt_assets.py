import ast
import subprocess
from scripts.common import ROOT
from scripts.run_model_evals import prompt_asset, suite_fingerprint


def test_extracted_prompts_preserve_original_bytes():
    original = subprocess.check_output(['git', 'show', '0f45d34:scripts/run_model_evals.py'], cwd=ROOT, text=True)
    prefixes = {
        'judge.txt': 'You are an independent behavioral judge',
        'subject-preloaded.txt': 'You are executing the supplied CareerPilot',
        'judge-repair-prefix.txt': '\nPrevious output failed validation: ',
        'judge-repair-suffix.txt': '. For this fresh verdict use evidence_line',
    }
    strings = [n.value for n in ast.walk(ast.parse(original)) if isinstance(n, ast.Constant) and isinstance(n.value, str)]
    for asset, prefix in prefixes.items():
        assert prompt_asset(asset) == next(s for s in strings if s.startswith(prefix))


def test_prompt_and_tier_changes_invalidate_suite(tmp_path):
    import shutil
    for folder in ['evals/prompts', 'evals/scenarios', 'evals/personas', 'fixtures']:
        if (ROOT / folder).exists():
            shutil.copytree(ROOT / folder, tmp_path / folder)
    shutil.copyfile(ROOT / 'evals/tier-policy.json', tmp_path / 'evals/tier-policy.json')
    paths = sorted((tmp_path / 'evals/scenarios').glob('*.yaml'))
    before = suite_fingerprint(paths, tmp_path)
    asset = tmp_path / 'evals/prompts/judge.txt'
    asset.write_text(asset.read_text() + ' Changed rubric.')
    assert suite_fingerprint(paths, tmp_path) != before
    before = suite_fingerprint(paths, tmp_path)
    tier = tmp_path / 'evals/tier-policy.json'
    tier.write_text(tier.read_text() + '\n')
    assert suite_fingerprint(paths, tmp_path) != before
