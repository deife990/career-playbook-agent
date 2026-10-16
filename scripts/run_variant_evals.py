"""Post-C wrapper. Default is a no-call plan; explicit approved lock required to execute.

Never edits the frozen C engine or combines diagnostic results with release evidence.
The canonical per-case ledger is independent of output/lock file names.
"""
import argparse
from datetime import datetime, timezone
import fcntl
import json
from pathlib import Path
import uuid

from scripts.common import ROOT
from scripts import run_model_evals as engine
from scripts.eval_protocol import judge_platform
from scripts.variant_eval_lock import (MODELS, content_manifest, digest, execution_payload,
                                       validate_lock, write_lock)

LEDGER = ROOT / 'work/review-v2/variant-ledger'


def atomic_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name(path.name + '.' + uuid.uuid4().hex + '.tmp')
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    temp.replace(path)


def case_key(lock, definition):
    p = lock['payload']
    # Manifest names, wrapper revisions and report paths cannot erase completed verdicts.
    prompts = {k: v for k, v in p['dependencies'].items() if k.startswith('evals/prompts/')}
    manifest, _ = content_manifest(p['mode'])
    prompts.update({k: v for k, v in manifest['payload']['bound_files'].items()
                    if k.startswith(('evals/prompts/', 'evals/personas/', 'evals/fixtures/'))})
    return digest({'package': p['package_fingerprint'], 'scenario': definition['sha256'],
                   'platform': p['platform'], 'judge': judge_platform(p['platform'], definition),
                   'context': p['context'], 'models': p['expected_models'], 'prompts': prompts})


def execute(lock, package, *, approved_fingerprint, resume=False, max_new=6, ledger=LEDGER):
    p = lock['payload']
    if approved_fingerprint != lock['execution_fingerprint']:
        raise ValueError('Explicit approval must bind this execution fingerprint')
    if not 1 <= max_new <= 6:
        raise ValueError('Batch must contain 1..6 new verdict attempts')
    # Revalidate immediately before any call; passing an in-memory stale lock is not enough.
    if digest(p) != lock['execution_fingerprint'] or p != execution_payload(p['mode'], p['platform'], package):
        raise ValueError('Stale execution lock')
    manifest, cases = content_manifest(p['mode'])
    ledger.mkdir(parents=True, exist_ok=True)
    with (ledger / '.execution.lock').open('a') as guard:
        fcntl.flock(guard, fcntl.LOCK_EX | fcntl.LOCK_NB)
        report = {'execution_fingerprint': lock['execution_fingerprint'], 'mode': p['mode'],
                  'platform': p['platform'], 'release_evidence': False,
                  'scope': 'DIAGNOSTIC_ONLY' if p['mode'] == 'development' else 'FINAL_COMPONENT_ONLY',
                  'reference_discovery_verified': False, 'cases': []}
        calls = 0
        stopped = False
        for definition in manifest['payload']['scenarios']:
            key = case_key(lock, definition)
            for run in range(1, definition['runs'] + 1):
                record = ledger / key / f'run-{run}.json'
                old = json.loads(record.read_text()) if record.exists() else None
                if old and old['status'] in ['PASS', 'FAIL']:
                    report['cases'].append(old)
                    continue
                if old and not resume:
                    raise ValueError('Existing incomplete attempt requires --resume')
                if stopped or calls >= max_new:
                    if old:
                        report['cases'].append(old)
                    continue
                attempt = ledger / key / f'run-{run}' / uuid.uuid4().hex
                prior = old.get('prior_attempts', []) + [{k: v for k, v in old.items() if k != 'prior_attempts'}] if old else []
                pending = {'id': definition['id'], 'run': run, 'status': 'ERROR',
                           'error': 'Interrupted before verdict; inspect attempt/checkpoint',
                           'attempt_path': str(attempt), 'prior_attempts': prior,
                           'execution_fingerprint': lock['execution_fingerprint']}
                attempt.mkdir(parents=True)
                # Copy the checkpoint forward before invocation so another interruption cannot
                # lose a previously completed subject. Prior attempts/logs remain untouched.
                checkpoint = Path(old['attempt_path']) / 'subject-checkpoint.json' if old else None
                if checkpoint and checkpoint.is_file():
                    (attempt / 'subject-checkpoint.json').write_bytes(checkpoint.read_bytes())
                atomic_json(record, pending)
                calls += 1
                try:
                    row = engine.run_case(package, p['platform'], cases[definition['id']], attempt,
                                          judge_platform=judge_platform(p['platform'], definition),
                                          context_mode='preloaded', resume_from=attempt)
                    atomic_json(attempt/'observed-result.json', row)
                    if (set(row['model_ids']) != {MODELS[p['platform']]} or
                            row['judge_model'] != MODELS[judge_platform(p['platform'], definition)]):
                        raise ValueError('Observed subject/judge model differs from approved lock')
                    if row['status'] not in ['PASS', 'FAIL']:
                        raise ValueError('Invalid completed verdict')
                    row = {**pending, **row, 'run': run}
                    row.pop('error', None)
                except Exception as error:
                    row = {**pending, 'error': f'{type(error).__name__}: {error}'}
                    stopped = True
                atomic_json(record, row)
                report['cases'].append(row)
        planned = sum(d['runs'] for d in manifest['payload']['scenarios'])
        report['planned'] = planned
        report['completed'] = sum(r['status'] in ['PASS', 'FAIL'] for r in report['cases'])
        report['status'] = ('INCOMPLETE' if report['completed'] != planned else
                            'FAIL' if any(r['status'] == 'FAIL' for r in report['cases']) else 'PASS')
        report['timestamp'] = datetime.now(timezone.utc).isoformat()
        # Each batch is a new immutable audit snapshot, never an overwritten report.
        out = ledger / 'batches' / (uuid.uuid4().hex + '.json')
        out.parent.mkdir(parents=True, exist_ok=True)
        with out.open('x') as stream:
            stream.write(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
        return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--mode', choices=['development', 'final'], required=True)
    parser.add_argument('--platform', choices=list(MODELS), required=True)
    parser.add_argument('--package-root', type=Path, required=True)
    parser.add_argument('--lock', type=Path, required=True)
    parser.add_argument('--freeze-lock', action='store_true')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--approved-fingerprint')
    parser.add_argument('--resume', action='store_true')
    parser.add_argument('--max-new', type=int, default=6)
    args = parser.parse_args()
    if args.freeze_lock and args.execute:
        parser.error('Freeze and execute must be separate approval steps')
    if args.freeze_lock:
        value = write_lock(args.lock, execution_payload(args.mode, args.platform, args.package_root))
    else:
        value = validate_lock(args.lock, args.mode, args.platform, args.package_root)
    if args.execute:
        print(json.dumps(execute(value, args.package_root, approved_fingerprint=args.approved_fingerprint,
                                 resume=args.resume, max_new=args.max_new), ensure_ascii=False, indent=2))
    else:
        manifest, _ = content_manifest(args.mode)
        print(json.dumps({'no_model_calls': True, 'execution_fingerprint': value['execution_fingerprint'],
                          'planned_verdicts': sum(r['runs'] for r in manifest['payload']['scenarios']),
                          'release_evidence': False}, indent=2))


if __name__ == '__main__':
    main()
