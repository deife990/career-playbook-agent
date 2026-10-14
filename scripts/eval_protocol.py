"""Tiered evaluation protocol, completion and immutable evidence checks."""
import hashlib
import json
from scripts.common import ROOT, load


def protocol(root=ROOT, *, context='preloaded', runs=None, judge='tiered'):
    policy = load(root / 'evals/tier-policy.json')
    rows = policy['scenarios']
    if len({row['id'] for row in rows}) != len(rows):
        raise ValueError('Duplicate tier definitions')
    if runs is not None and (type(runs) is not int or not 1 <= runs <= 10):
        raise ValueError('Runs must be 1..10')
    if context not in ['preloaded', 'entry-only'] or judge not in ['tiered', 'same', 'cross']:
        raise ValueError('Unsupported evaluation protocol')
    return {'version': 2, 'context_mode': context, 'reference_discovery_verified': False,
            'scenarios': [{**row, 'runs': runs or row['runs'],
                           'judge': row['judge'] if judge == 'tiered' else judge} for row in rows]}


def protocol_fingerprint(config):
    return hashlib.sha256(json.dumps(config, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def expected_runs(config):
    return {(row['id'], run) for row in config['scenarios'] for run in range(1, row['runs'] + 1)}


def judge_platform(platform, definition):
    return ('claude' if platform == 'chatgpt' else 'chatgpt') if definition['judge'] == 'cross' else platform


def summarize(report):
    expected = expected_runs(report['protocol'])
    rows = report['cases']
    keys = [(row['id'], row['run']) for row in rows]
    if len(keys) != len(set(keys)) or not set(keys) <= expected:
        raise ValueError('Duplicate or unexpected evaluation run')
    rates = {}
    for definition in report['protocol']['scenarios']:
        selected = [row for row in rows if row['id'] == definition['id']]
        passed = sum(row['status'] == 'PASS' for row in selected)
        rates[definition['id']] = {'planned': definition['runs'], 'completed': sum(row['status'] in ['PASS', 'FAIL'] for row in selected),
                                    'passed': passed, 'pass_rate': passed / definition['runs']}
    complete = set(keys) == expected and all(row['status'] in ['PASS', 'FAIL'] for row in rows)
    report['rates'] = rates
    report['status'] = 'FAIL' if any(row['status'] == 'FAIL' for row in rows) else 'PASS' if complete else 'INCOMPLETE'
    return report


def validate_report(report, platform, digest, suite, definitions, *, config=None):
    from scripts.run_model_evals import grade
    config = config or protocol()
    if (report.get('platform') != platform or report.get('package_fingerprint') != digest
            or report.get('suite_fingerprint') != suite or report.get('protocol') != config
            or report.get('protocol_fingerprint') != protocol_fingerprint(config)):
        raise ValueError(f'{platform}: missing/failed/stale model eval or protocol mismatch')
    if config['context_mode'] != 'preloaded':
        raise ValueError('Entry-only diagnostic does not certify reference execution')
    if {row['id'] for row in config['scenarios']} != set(definitions):
        raise ValueError('Tier inventory does not match scenario inventory')
    summarize(report)
    rows = report['cases']
    tiers = {row['id']: row for row in config['scenarios']}
    for row in rows:
        if row.get('status') not in ['PASS', 'FAIL']:
            continue
        case = definitions[row['id']]
        verdicts = grade(case['assertions'], json.dumps({'assertions': [v for v in row['assertions'] if v['id'] != 'deterministic-roundtrip']}), row['transcript'])
        if any(v['pass'] is not True for v in verdicts):
            raise ValueError(f'{platform}: failed assertion under passing header')
        if (row.get('judge_platform') != judge_platform(platform, tiers[row['id']])
                or not row.get('model_ids') or not row.get('judge_model') or not row.get('loaded_files')):
            raise ValueError(f'{platform}: missing actual model/judge/context evidence')
        if case.get('context_fixture') and row.get('deterministic_roundtrip') is not True:
            raise ValueError(f'{platform}: failed lossless roundtrip')
        if any(attempt.get('status') == 'FAIL' for attempt in row.get('prior_attempts', [])):
            raise ValueError('Prior behavioral failure cannot be replaced by a passing attempt')
    if report['status'] != 'PASS':
        raise ValueError(f'{platform}: incomplete or failed repeated evidence')
