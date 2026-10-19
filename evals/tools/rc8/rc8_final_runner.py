"""rc.8 final C runner (Claude Opus 5.5 work agent, 2026-10-18).

Calls the FROZEN scripts.run_model_evals.run_case unchanged. Adds only:
  * a separate valid report (final-valid/HOST.json); the original final/HOST.json is never written;
  * the approved quarantine of one provenance-less raw PASS (kept verbatim in prior_attempts);
  * observed subject/judge model verification on every verdict (mismatch/missing -> stop);
  * stop on any error, quota/timeout, or release-criterion exceedance (ChatGPT FAIL>0, Claude FAIL>11);
  * an integrity check of pre-existing verdicts after every batch of 6 new verdicts.
No prompt, scenario, tier, package, judge routing or engine logic is changed.
"""
import argparse, copy, fcntl, hashlib, json, os, shutil, sys, tempfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(os.environ.get('CP_RC8_ROOT') or Path(__file__).resolve().parents[4])
BASE = Path(os.environ.get('CP_RC8_BASE') or ROOT / 'work/review-v2/rc8-release-2026-10-17')
sys.path.insert(0, str(ROOT))
import yaml  # noqa: E402
from scripts.common import load  # noqa: E402
import scripts.run_model_evals as engine  # noqa: E402
from scripts.package_inventory import inventory  # noqa: E402
from scripts.eval_protocol import protocol, protocol_fingerprint, judge_platform, summarize  # noqa: E402

EXPECTED_MODEL = {'chatgpt': 'gpt-5.6-sol', 'claude': 'claude-sonnet-4-6'}
FAIL_LIMIT = {'chatgpt': 0, 'claude': 11}  # docs/rc8-release-policy-2026-10-17.md
PACKAGE_FP = {'chatgpt': 'ff1fca874ba35211687794eb0fbe97e173b6310de155ad1b88136503107ba571',
              'claude': 'd36f87dfa7ce4882cedb915d967f1923664b065cfdee4203b704bc7fcc7cb249'}
SUITE_FP = 'a24b18e47ed0ee3c0ba972cd08ab1265ce7a62d4a1d1b4617c49e2dda732ef3e'
PROTOCOL_FP = '4515ea6c278005b2221531e763dedefcd4512df25f19471a30c94982141453c9'
ENGINE_SHA = 'c2056f98d4896a6325350672dc34b5bde9c6c589f63e0519aa4b4ee599246807'
QUARANTINE = {('claude', 'context-model-roundtrip', 1):
              'MODEL_PROVENANCE_UNVERIFIED: original raw PASS has modelUsage={} and all-zero tokens '
              '(duration_api_ms 537532); no independent model identifier in linked logs. '
              'User approved one fresh subject + one judge on 2026-10-18; original kept in prior_attempts.'}
BATCH = 6
# Verdicts produced before the thinking/auxiliary-model setting was pinned (both raw PASS).
RECLASSIFY = {
    ('chatgpt', 'debrief-first', 1, 'attempt-2'): 'CONFIG_MISMATCH: Claude judge ran with extended thinking (thinkingTokens>0); rc.7 baseline had none. Rerun under pinned setting.',
    ('claude', 'bare-action-resume', 1, 'attempt-2'): 'CONFIG_MISMATCH: Claude subject ran with extended thinking (thinkingTokens>0); rc.7 baseline had none. Rerun under pinned setting.',
    ('claude', 'bare-action-resume', 1, 'attempt-3'): 'CONFIG_MISMATCH: judged a subject transcript resumed from attempt-2 (thinking on). Regenerate the subject fresh.',
}


class Stop(Exception):
    pass


def now():
    return datetime.now(timezone.utc).isoformat()


def sha(data):
    return hashlib.sha256(data if isinstance(data, bytes) else data.encode()).hexdigest()


def canon(row):
    return sha(json.dumps(row, ensure_ascii=False, sort_keys=True))


def verified(host, row, tier):
    judge = judge_platform(host, tier)
    return row.get('model_ids') == [EXPECTED_MODEL[host]] and row.get('judge_model') == EXPECTED_MODEL[judge]


def config_problems(folder, prefix=''):
    """Observed setting must match the rc.7 baseline: no Claude thinking, Codex reasoning effort none."""
    problems = []
    for path in sorted(Path(folder).glob(prefix + '*.stdout.txt')):
        try:
            data = json.loads(path.read_text())
        except Exception:
            continue
        for model, usage in (data.get('modelUsage') or {}).items():
            if usage.get('thinkingTokens'):
                problems.append(f'{path.name}: {model} thinkingTokens={usage["thinkingTokens"]}')
    for path in sorted(Path(folder).glob(prefix + '*.stderr.txt')):
        text = path.read_text(errors='replace')
        if 'OpenAI Codex' in text and 'reasoning effort: none' not in text:
            problems.append(f'{path.name}: Codex reasoning effort is not none')
    return problems


def reclassify(report, host):
    changed = False
    for i, row in enumerate(report['cases']):
        attempt = Path(row.get('attempt_path', '')).name
        message = RECLASSIFY.get((host, row['id'], row['run'], attempt))
        if message and row['status'] in ('PASS', 'FAIL'):
            report['cases'][i] = {'id': row['id'], 'persona': row['persona'], 'status': 'ERROR', 'error': message,
                                  'run': row['run'], 'tier': row['tier'], 'attempt_path': row['attempt_path'],
                                  'reclassified': True,
                                  'prior_attempts': row.get('prior_attempts', []) + [{k: v for k, v in row.items() if k != 'prior_attempts'}]}
            changed = True
    return changed


def write(path, report):
    tmp = path.with_suffix('.json.tmp')
    tmp.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    os.replace(tmp, path)


def fails(report):
    return sum(1 for r in report['cases'] if r.get('status') == 'FAIL')


def other_exceeded(host):
    other = 'claude' if host == 'chatgpt' else 'chatgpt'
    path = BASE / 'final-valid' / f'{other}.json'
    if not path.exists():
        return False
    return fails(load(path)) > FAIL_LIMIT[other]


def initialise(host, config, tiers):
    source = BASE / 'final' / f'{host}.json'
    original_bytes = source.read_bytes()
    report = json.loads(original_bytes)
    for key, value in [('package_fingerprint', PACKAGE_FP[host]), ('suite_fingerprint', SUITE_FP),
                       ('protocol_fingerprint', PROTOCOL_FP)]:
        if report.get(key) != value:
            raise Stop(f'{host}: original report {key} mismatch')
    if report['protocol'] != config:
        raise Stop(f'{host}: original protocol differs from frozen protocol')
    rows = []
    for row in report['cases']:
        key = (host, row['id'], row['run'])
        tier = tiers[row['id']]
        if key in QUARANTINE:
            if verified(host, row, tier):
                raise Stop(f'{key}: quarantine target unexpectedly has verified models; stop for review')
            original = {k: v for k, v in row.items() if k != 'prior_attempts'}
            rows.append({'id': row['id'], 'persona': row['persona'], 'status': 'ERROR', 'error': QUARANTINE[key],
                         'run': row['run'], 'tier': row['tier'], 'attempt_path': row['attempt_path'],
                         'prior_attempts': row.get('prior_attempts', []) + [original]})
        elif row['status'] in ('PASS', 'FAIL') and not verified(host, row, tier):
            raise Stop(f'{key}: completed verdict without verified models is not in the approved quarantine')
        else:
            rows.append(row)
    report['cases'] = rows
    report['derived_from'] = {'path': os.path.relpath(source, ROOT), 'sha256': sha(original_bytes),
                              'created_at': now(), 'tool': 'tools/rc8_final_runner.py',
                              'tool_sha256': sha(Path(__file__).read_bytes())}
    summarize(report)
    return report


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', choices=['chatgpt', 'claude'], required=True)
    parser.add_argument('--max-new', type=int, default=0, help='0 = until complete or stop condition')
    parser.add_argument('--stop-at', help='ISO time with offset; no new slot starts after it (running slot finishes)')
    parser.add_argument('--allow-provenance-retry', action='store_true',
                        help='retry a slot that stopped on MODEL_PROVENANCE_MISMATCH (needs a human decision)')
    args = parser.parse_args(argv)
    host = args.host
    deadline = datetime.fromisoformat(args.stop_at) if args.stop_at else None
    if deadline and deadline.tzinfo is None:
        raise Stop('--stop-at needs a UTC offset, e.g. 2026-10-19T08:00+09:00')

    if sha((ROOT / 'scripts/run_model_evals.py').read_bytes()) != ENGINE_SHA:
        raise Stop('Frozen engine hash mismatch')
    config = protocol()
    if protocol_fingerprint(config) != PROTOCOL_FP:
        raise Stop('Protocol fingerprint mismatch')
    suite = sorted((ROOT / 'evals/scenarios').glob('*.yaml'))
    if engine.suite_fingerprint(suite) != SUITE_FP:
        raise Stop('Suite fingerprint mismatch')
    definitions = {yaml.safe_load(p.read_text())['id']: yaml.safe_load(p.read_text()) for p in suite}
    tiers = {t['id']: t for t in config['scenarios']}

    out = BASE / 'final-valid'
    out.mkdir(parents=True, exist_ok=True)
    lock = open(out / f'.{host}.lock', 'w')
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        raise Stop(f'{host}: another runner holds the lock')

    report_path = out / f'{host}.json'
    if report_path.exists():
        report = load(report_path)
        if report['protocol'] != config or report['package_fingerprint'] != PACKAGE_FP[host]:
            raise Stop('Valid report identity mismatch')
        if reclassify(report, host):
            summarize(report)
            write(report_path, report)
    else:
        report = initialise(host, config, tiers)
        write(report_path, report)

    for row in report['cases']:
        if row['status'] in ('PASS', 'FAIL') and not verified(host, row, tiers[row['id']]):
            raise Stop(f"{host} {row['id']} run {row['run']}: unverified completed verdict in valid report")
    baseline = {(r['id'], r['run']): canon(r) for r in report['cases'] if r['status'] in ('PASS', 'FAIL')}

    source = BASE / 'packages' / host
    with tempfile.TemporaryDirectory(prefix='careerpilot-package-') as isolated:
        root = Path(isolated) / 'careerpilot'
        for relative in inventory(source, host):
            path = root / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source / relative, path)
        if engine.fingerprint(root) != PACKAGE_FP[host]:
            raise Stop('Package fingerprint mismatch')

        new = 0
        for tier in config['scenarios']:
            case = definitions[tier['id']]
            for run in range(1, tier['runs'] + 1):
                old = next((r for r in report['cases'] if (r['id'], r['run']) == (case['id'], run)), None)
                if old and old['status'] in ('PASS', 'FAIL'):
                    continue
                if fails(report) > FAIL_LIMIT[host] or other_exceeded(host):
                    raise Stop('RELEASE_CRITERION_EXCEEDED: no further calls')
                if old and str(old.get('error', '')).startswith(('MODEL_PROVENANCE_MISMATCH', 'CONFIG_MISMATCH')) and not old.get('reclassified') and not args.allow_provenance_retry:
                    raise Stop(f"{case['id']} run {run} stopped on model provenance; decide before retrying "
                               '(--allow-provenance-retry)')
                if deadline and datetime.now(timezone.utc) >= deadline:
                    print(f'{now()} {host}: stop-at {args.stop_at} reached; rerun the same command to resume', flush=True)
                    return 0
                if args.max_new and new >= args.max_new:
                    print(f'{host}: --max-new {args.max_new} reached', flush=True)
                    return 0
                quarantined = bool(old) and (host, case['id'], run) in QUARANTINE and old.get('error') == QUARANTINE[(host, case['id'], run)]
                if quarantined or (old and old.get('reclassified')):  # audit reclassification, not a new attempt
                    prior = old.get('prior_attempts', [])
                else:
                    prior = (old.get('prior_attempts', []) + [{k: v for k, v in old.items() if k != 'prior_attempts'}]) if old else []
                number = len(prior) + 1
                orphans = []
                while (out / 'runs' / host / case['id'] / f'run-{run}' / f'attempt-{number}').exists():
                    orphans.append(f'attempt-{number}')  # interrupted run without a verdict: keep, never reuse
                    number += 1
                folder = out / 'runs' / host / case['id'] / f'run-{run}' / f'attempt-{number}'
                resume = None
                if (old and (host, case['id'], run) not in QUARANTINE and not old.get('reclassified')
                        and old.get('attempt_path')):
                    source_folder = Path(old['attempt_path'])
                    checkpoint = source_folder / 'subject-checkpoint.json'
                    # Resume only from a subject generated in that same folder under the pinned setting.
                    if (checkpoint.is_file() and load(checkpoint).get('model_ids') == [EXPECTED_MODEL[host]]
                            and (source_folder / 'turn-1.stdout.txt').is_file()
                            and not config_problems(source_folder, 'turn-')):
                        resume = old['attempt_path']
                judge = judge_platform(host, tier)
                print(f"{now()} {host}: {case['id']} run {run}/{tier['runs']} judge={judge} resume={bool(resume)}", flush=True)
                stop = None
                try:
                    row = engine.run_case(root, host, case, folder, judge_platform=judge,
                                          context_mode='preloaded', resume_from=resume)
                    problems = config_problems(folder)
                    if problems and verified(host, row, tier):
                        stop = 'CONFIG_MISMATCH ' + '; '.join(problems)
                        row = {'id': case['id'], 'persona': case['persona'], 'status': 'ERROR', 'error': stop,
                               'unverified_result': row}
                    elif not verified(host, row, tier):
                        stop = (f"MODEL_PROVENANCE_MISMATCH subject={row.get('model_ids')} "
                                f"judge={row.get('judge_model')}")
                        row = {'id': case['id'], 'persona': case['persona'], 'status': 'ERROR', 'error': stop,
                               'unverified_result': row}
                except (engine.RateLimitError, engine.ModelTimeoutError) as error:
                    stop = str(error)
                    row = {'id': case['id'], 'persona': case['persona'], 'status': 'ERROR', 'error': stop}
                except Exception as error:  # unresolved error: preserve and stop
                    stop = f'{type(error).__name__}: {error}'
                    row = {'id': case['id'], 'persona': case['persona'], 'status': 'ERROR', 'error': stop}
                row.update(run=run, tier=tier['tier'], attempt_path=str(folder), prior_attempts=prior)
                if quarantined:
                    row['quarantine'] = QUARANTINE[(host, case['id'], run)]
                if orphans:
                    row['interrupted_attempts_without_verdict'] = orphans
                report['cases'] = [r for r in report['cases'] if (r['id'], r['run']) != (case['id'], run)] + [row]
                summarize(report)
                report['updated_at'] = now()
                write(report_path, report)
                new += 1
                print(f"{now()} {host}: {case['id']} run {run}: {row['status']} | FAIL total {fails(report)}", flush=True)
                if stop:
                    raise Stop(f'{host}: stopped on {stop}')
                if new % BATCH == 0:
                    current = {(r['id'], r['run']): canon(r) for r in report['cases']}
                    changed = [k for k, v in baseline.items() if current.get(k) != v]
                    if changed:
                        raise Stop(f'Integrity failure: pre-existing verdicts changed {changed}')
                    done = sum(1 for r in report['cases'] if r['status'] in ('PASS', 'FAIL'))
                    print(f'{now()} {host}: batch ok, {done} verdicts, integrity ok', flush=True)
    done = sum(1 for r in report['cases'] if r['status'] in ('PASS', 'FAIL'))
    print(f'{now()} {host}: COMPLETE {done} verdicts, FAIL {fails(report)} (limit {FAIL_LIMIT[host]})', flush=True)
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except Stop as stop:
        print(f'{now()} STOP: {stop}', flush=True)
        sys.exit(2)
