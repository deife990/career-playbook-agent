"""Compare preregistered baseline and candidate without averaging away regressions."""
import argparse
import json
from pathlib import Path
from scripts.common import load
from scripts.eval_protocol import summarize, protocol_fingerprint, judge_platform, expected_runs
from scripts.run_model_evals import grade


def assertion_rates(report):
    config = report['protocol']
    summarize(report)
    if {(r['id'], r['run']) for r in report['cases']} != expected_runs(config) or any(r['status'] not in ['PASS', 'FAIL'] for r in report['cases']):
        raise ValueError('Comparison requires every planned run; ERROR/omitted is incomplete')
    result = {}
    for tier in config['scenarios']:
        rows = [r for r in report['cases'] if r['id'] == tier['id']]
        names = {v['id'] for v in rows[0]['assertions']}
        counts = {name: 0 for name in names}
        for row in rows:
            if row.get('judge_platform') != judge_platform(report['platform'], tier) or not row.get('model_ids') or not row.get('judge_model'):
                raise ValueError('Missing actual subject/cross-judge identity')
            verdicts = [v for v in row['assertions'] if v['id'] != 'deterministic-roundtrip']
            grade({v['id']: 'Frozen scenario assertion' for v in verdicts}, json.dumps({'assertions': verdicts}), row['transcript'])
            if {v['id'] for v in row['assertions']} != names:
                raise ValueError('Assertion inventory changed between repeats')
            for verdict in row['assertions']:
                counts[verdict['id']] += verdict['pass'] is True
        result[tier['id']] = {name: count / tier['runs'] for name, count in counts.items()}
        for name in tier.get('safety_assertions', names):
            if result[tier['id']].get(name) != 1:
                raise ValueError(f"Safety failure: {report['platform']}/{tier['id']}/{name}")
        if 'deterministic-roundtrip' in names and result[tier['id']]['deterministic-roundtrip'] != 1:
            raise ValueError('Lossless recovery failure')
    return result


def compare(baseline, candidate):
    for key in ['platform', 'suite_fingerprint', 'protocol_fingerprint', 'protocol']:
        if baseline.get(key) != candidate.get(key):
            raise ValueError('Baseline/candidate protocol mismatch: ' + key)
    if candidate.get('protocol_fingerprint') != protocol_fingerprint(candidate['protocol']) or candidate['protocol']['context_mode'] != 'preloaded':
        raise ValueError('Invalid comparison protocol')
    before, after = assertion_rates(baseline), assertion_rates(candidate)
    if before.keys() != after.keys():
        raise ValueError('Scenario inventory changed')
    for case in before:
        if before[case].keys() != after[case].keys():
            raise ValueError('Assertion inventory changed')
        if candidate['rates'][case]['pass_rate'] < baseline['rates'][case]['pass_rate']:
            raise ValueError('Scenario pass-rate regression: ' + case)
        for assertion, rate in before[case].items():
            if after[case][assertion] < rate:
                raise ValueError('Assertion pass-rate regression: ' + case + '/' + assertion)
    return {'status': 'PASS', 'platform': candidate['platform'],
            'baseline_package': baseline['package_fingerprint'], 'candidate_package': candidate['package_fingerprint'],
            'suite_fingerprint': candidate['suite_fingerprint'], 'protocol_fingerprint': candidate['protocol_fingerprint'],
            'release_certified': False, 'note': 'Comparison only; every actual failure still blocks release readiness.'}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--baseline', type=Path, required=True)
    parser.add_argument('--candidate', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(compare(load(args.baseline), load(args.candidate)), indent=2))
