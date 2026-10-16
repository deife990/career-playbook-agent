"""No real providers: wrappers and the frozen checkpoint engine run against fake models."""
from copy import deepcopy
import json
from pathlib import Path
import shutil

import pytest

from scripts.common import ROOT
from scripts import run_variant_evals as runner
from scripts import variant_eval_lock as locks
from scripts.check_e_leakage import audit, contains, lexicon, scan_added_lines
from scripts.generate_adapters import generate


def setup_run(tmp_path):
    package = tmp_path/'package'
    shutil.copytree(generate('chatgpt'), package)
    payload = locks.execution_payload('development', 'chatgpt', package)
    return package, {'payload': payload, 'execution_fingerprint': locks.digest(payload)}


def test_frozen_manifests_and_routing_are_intact():
    dev, cases = locks.content_manifest('development')
    final, _ = locks.content_manifest('final')
    assert len(cases) == 18 and sum(r['runs'] for r in dev['payload']['scenarios']) == 18
    assert sum(r['runs'] for r in final['payload']['scenarios']) == 23
    assert not set(cases) & {r['id'] for r in final['payload']['scenarios']}
    assert dev['payload']['release_evidence'] is False


def test_tampering_even_with_recomputed_manifest_hash_is_rejected(tmp_path):
    target = tmp_path/locks.MANIFESTS['development']
    target.parent.mkdir(parents=True)
    doc = json.loads((ROOT/locks.MANIFESTS['development']).read_text())
    doc['payload']['scenarios'][0]['path'] = 'evals/variants/e-stage/holdout/holdout-curatorial-scope.yaml'
    doc['content_fingerprint'] = locks.digest(doc['payload'])
    target.write_text(json.dumps(doc))
    with pytest.raises(ValueError, match='Content fingerprint'):
        locks.content_manifest('development', tmp_path)


def test_scenario_bytes_and_symlink_escape_fail_closed(tmp_path):
    for relative in ['evals', 'adapters/skills.json', 'scripts',
                     'docs/review-improvement-protocol.md', 'docs/rc8-evaluation-policy-2026-10-16.md']:
        src, dst = ROOT/relative, tmp_path/relative
        dst.parent.mkdir(parents=True, exist_ok=True)
        if src.is_dir():
            shutil.copytree(src, dst)
        else:
            shutil.copyfile(src, dst)
    doc, _ = locks.content_manifest('development', tmp_path)
    changed = tmp_path/doc['payload']['scenarios'][0]['path']
    changed.write_text(changed.read_text()+'\n# changed\n')
    with pytest.raises(ValueError, match='Scenario content'):
        locks.content_manifest('development', tmp_path)
    with pytest.raises(ValueError, match='Unsafe'):
        locks.safe_file('../outside', tmp_path)
    (tmp_path/'link').symlink_to(ROOT/'README.md')
    with pytest.raises(ValueError, match='symlink'):
        locks.safe_file('link', tmp_path)


def test_completed_fail_not_rerun_with_new_lock_filename(tmp_path, monkeypatch):
    package, lock = setup_run(tmp_path)
    seen = []
    def fake(root, host, case, folder, **kwargs):
        seen.append((case['id'], kwargs['judge_platform']))
        return {'id': case['id'], 'status': 'FAIL', 'assertions': [],
                'model_ids': [locks.MODELS[host]], 'judge_model': locks.MODELS[kwargs['judge_platform']]}
    monkeypatch.setattr(runner.engine, 'run_case', fake)
    ledger = tmp_path/'ledger'
    first = runner.execute(lock, package, approved_fingerprint=lock['execution_fingerprint'], max_new=1, ledger=ledger)
    assert len(seen) == 1 and first['cases'][0]['status'] == 'FAIL'
    # A different wrapper/lock label cannot replace the completed same-package verdict.
    second = runner.execute(deepcopy(lock), package, approved_fingerprint=lock['execution_fingerprint'],
                            resume=True, max_new=1, ledger=ledger)
    assert len(seen) == 2 and seen[0][0] != seen[1][0]
    assert second['cases'][0]['status'] == 'FAIL'
    assert seen[0][1] == 'claude'


def test_approval_and_stale_package_block_before_call(tmp_path, monkeypatch):
    package, lock = setup_run(tmp_path)
    def forbidden(*args, **kwargs):
        pytest.fail('Unexpected provider invocation')
    monkeypatch.setattr(runner.engine, 'call_model', forbidden)
    with pytest.raises(ValueError, match='Explicit approval'):
        runner.execute(lock, package, approved_fingerprint=None, ledger=tmp_path/'ledger')
    with pytest.raises(ValueError, match='1..6'):
        runner.execute(lock, package, approved_fingerprint=lock['execution_fingerprint'], max_new=7)
    (package/'skills/careerpilot-router/SKILL.md').write_text('changed')
    with pytest.raises(ValueError, match='Stale'):
        runner.execute(lock, package, approved_fingerprint=lock['execution_fingerprint'], ledger=tmp_path/'ledger')


def test_real_engine_error_resume_reuses_subject_and_preserves_logs(tmp_path, monkeypatch):
    package, lock = setup_run(tmp_path)
    calls = []
    def fake(host, prompt, folder, stem, schema=None):
        calls.append(stem)
        if schema:
            raise RuntimeError('simulated network failure')
        return 'supported synthetic response', locks.MODELS[host]
    monkeypatch.setattr(runner.engine, 'call_model', fake)
    ledger = tmp_path/'ledger'
    first = runner.execute(lock, package, approved_fingerprint=lock['execution_fingerprint'], max_new=1, ledger=ledger)
    row = first['cases'][0]
    assert row['status'] == 'ERROR' and calls == ['turn-1', 'judge']
    checkpoint = Path(row['attempt_path'])/'subject-checkpoint.json'
    original = checkpoint.read_bytes()
    def judge(host, case, history, persona, seed, folder, stem='judge'):
        return ([{'id': key, 'pass': True, 'reason': 'fake only',
                  'evidence_quote': 'supported synthetic response'} for key in case['assertions']], locks.MODELS[host])
    monkeypatch.setattr(runner.engine, 'judge_transcript', judge)
    second = runner.execute(lock, package, approved_fingerprint=lock['execution_fingerprint'], resume=True, max_new=1, ledger=ledger)
    assert calls == ['turn-1', 'judge']  # No second subject invocation.
    current = second['cases'][0]
    assert current['status'] == 'PASS' and current['prior_attempts'][0]['error'].endswith('simulated network failure')
    assert checkpoint.read_bytes() == original and current['attempt_path'] != row['attempt_path']
    assert second['release_evidence'] is False and second['scope'] == 'DIAGNOSTIC_ONLY'


def test_default_cli_freezes_plan_without_any_model_calls(tmp_path, monkeypatch, capsys):
    package, _ = setup_run(tmp_path)
    monkeypatch.setattr('sys.argv', ['run_variant_evals', '--mode', 'development', '--platform',
                                   'chatgpt', '--package-root', str(package), '--lock', str(tmp_path/'lock.json'), '--freeze-lock'])
    monkeypatch.setattr(runner.engine, 'call_model', lambda *a, **k: pytest.fail('Real call forbidden'))
    runner.main()
    assert json.loads(capsys.readouterr().out)['no_model_calls'] is True


def test_immutable_lock_and_unfingerprinted_package_file(tmp_path):
    package, lock = setup_run(tmp_path)
    path = tmp_path/'lock.json'
    locks.write_lock(path, lock['payload'])
    with pytest.raises(FileExistsError):
        locks.write_lock(path, lock['payload'])
    (package/'references/core/principles/unlisted.md').write_text('unbound policy')
    with pytest.raises(ValueError, match='Unfingerprinted'):
        locks.execution_payload('development', 'chatgpt', package)


def test_model_mismatch_preserves_observed_verdict_and_stops(tmp_path, monkeypatch):
    package, lock = setup_run(tmp_path)
    def fake(root, host, case, folder, **kwargs):
        return {'id': case['id'], 'status': 'FAIL', 'assertions': [],
                'model_ids': ['unexpected-model'], 'judge_model': locks.MODELS[kwargs['judge_platform']]}
    monkeypatch.setattr(runner.engine, 'run_case', fake)
    result = runner.execute(lock, package, approved_fingerprint=lock['execution_fingerprint'], ledger=tmp_path/'ledger')
    assert len(result['cases']) == 1 and result['status'] == 'INCOMPLETE'
    row = result['cases'][0]
    assert row['status'] == 'ERROR' and 'model differs' in row['error']
    assert json.loads((Path(row['attempt_path'])/'observed-result.json').read_text())['status'] == 'FAIL'


def test_all_extracted_holdout_terms_trigger_added_line_scan():
    terms = lexicon()
    for row in terms:
        assert scan_added_lines([('core/test.md', 1, row['term'])], terms)
    assert contains('ｅｕｒ', 'EUR') and contains('erp 사용', 'ERP')
    assert not contains('superposition', 'ERP')
    assert audit()['status'] == 'PASS'


def test_required_read_paths_and_file_counts_unchanged_since_B():
    from scripts.package_budget import check_budget
    limits = json.loads((ROOT/'evals/package-budgets.json').read_text())
    for platform in ['chatgpt', 'claude']:
        current = check_budget(generate(platform), platform)
        assert current['file_count'] == limits['platforms'][platform]['file_count']
        for name, row in current['entries'].items():
            assert row['files'] == limits['platforms'][platform]['entries'][name]['files']


def test_review_artifacts_cover_every_original_rule_block_and_all_entries():
    from scripts.build_e_review import TARGET, GUARDS, POLICY, before, blocks
    ledger = json.loads((TARGET/'rule-migration.json').read_text())
    assert ledger['generated_entry_count'] == 13
    originals = {(r['original']['path'], r['original']['line'], r['original']['text']) for r in ledger['mapping']}
    for path, regex in [(GUARDS, r'^- '), (POLICY, r'^## ')]:
        for block in blocks(before(path), regex):
            assert (path, block['line'], block['text']) in originals
    for row in ledger['mapping']:
        for dest in row['destinations']:
            assert dest['text'] in (ROOT/dest['path']).read_text()
    for item in ledger['files']:
        assert locks.sha(ROOT/item['path']) == item['after_sha256']
        assert locks.sha(TARGET/'before'/(item['path']+'.txt')) == item['before_sha256']
        assert locks.sha(TARGET/'after'/(item['path']+'.txt')) == item['after_sha256']


def test_mock_question_parenthetical_remains_verbatim_in_all_entries():
    sentence = 'Each interviewer question asks for one thing (not background plus motivation together).'
    assert sentence in (ROOT/'core/principles/entry-guards.md').read_text()
    for platform in ['chatgpt', 'claude']:
        package = generate(platform)
        entries = [package/'SKILL.md'] if platform == 'claude' else package.glob('skills/*/SKILL.md')
        assert all(sentence in entry.read_text() for entry in entries)
