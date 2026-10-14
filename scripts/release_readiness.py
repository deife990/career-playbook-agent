"""Fail closed on missing, stale or failed behavioral/native evidence."""
import sys
from pathlib import Path
if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import hashlib
import argparse
from datetime import datetime
import yaml
from scripts.common import ROOT, load
from scripts.generate_adapters import generate
from scripts.run_model_evals import fingerprint, grade, suite_fingerprint
import json
CHECKS={'clean_install','activation','reference_access','full_lifecycle','mock_contract','debrief_preserved','isolation','context_roundtrip'}

def browser_exclusion(path):
    """Explicit, version-bound scope; never turn unobserved native checks into PASS."""
    resolved=(ROOT/path).resolve()
    if not resolved.is_relative_to(ROOT) or not resolved.is_file():
        raise ValueError('Invalid browser-exclusion path')
    scope=load(resolved)
    if scope.get('requested_by')!='USER' or scope.get('excluded_checks')!=['native_browser']:
        raise ValueError('Explicit user browser exclusion required')
    if scope.get('version')!=(ROOT/'VERSION').read_text().strip():
        raise ValueError('Stale browser exclusion version')
    datetime.fromisoformat(scope['requested_at'])
    evidence=(ROOT/scope.get('evidence_path','')).resolve()
    if not evidence.is_relative_to(ROOT) or not evidence.is_file() or not evidence.read_text().strip():
        raise ValueError('Missing user scope evidence')
    if set(scope.get('package_fingerprints',{}))!={'chatgpt','claude'}:
        raise ValueError('Browser exclusion requires both current package fingerprints')
    return scope

def check(*,native_exclusion=None):
    cases=sorted((ROOT/'evals/scenarios').glob('*.yaml'))
    suite=suite_fingerprint(cases,ROOT)
    expected={yaml.safe_load(p.read_text())['id'] for p in cases}
    native=load(ROOT/'evals/native-install.json')
    scope=browser_exclusion(native_exclusion) if native_exclusion else None
    if not scope and native.get('status')!='PASS': raise ValueError('Native clean-install signoff pending')
    for platform in ['chatgpt','claude']:
        digest=fingerprint(generate(platform))
        if scope and scope['package_fingerprints'][platform]!=digest:
            raise ValueError(f'{platform}: stale browser-exclusion package')
        report=load(ROOT/f'dist/evals/{platform}.json')
        if report.get('platform')!=platform or report.get('status')!='PASS' or report.get('package_fingerprint')!=digest or report.get('suite_fingerprint')!=suite:
            raise ValueError(f'{platform}: missing/failed/stale model eval')
        rows=report.get('cases',[])
        if len(rows)!=len(expected) or {r['id'] for r in rows}!=expected or any(r['status']!='PASS' or not r.get('model_ids') or not r.get('judge_model') for r in rows):
            raise ValueError(f'{platform}: incomplete actual model evidence')
        definitions={yaml.safe_load(p.read_text())['id']:yaml.safe_load(p.read_text()) for p in cases}
        for row in rows:
            case=definitions[row['id']]
            verdicts=grade(case['assertions'],json.dumps({'assertions':[r for r in row['assertions'] if r['id']!='deterministic-roundtrip']}),row['transcript'])
            if any(r['pass'] is not True for r in verdicts): raise ValueError(f'{platform}: failed assertion under passing header')
            if case.get('context_fixture') and row.get('deterministic_roundtrip') is not True: raise ValueError(f'{platform}: failed lossless roundtrip')
        if scope: continue
        observation=native['platforms'][platform]
        if observation.get('package_fingerprint')!=digest or not observation.get('observer') or not observation.get('surface'):
            raise ValueError(f'{platform}: missing/stale native observer')
        datetime.fromisoformat(observation['observed_at'])
        if set(observation.get('checks',{}))!=CHECKS or any(v is not True for v in observation['checks'].values()):
            raise ValueError(f'{platform}: native checks incomplete')
        relative=observation.get('evidence_path')
        if not relative: raise ValueError(f'{platform}: missing native evidence')
        evidence=(ROOT/relative).resolve()
        if not evidence.is_relative_to(ROOT) or not evidence.is_file() or not evidence.read_text().strip():
            raise ValueError(f'{platform}: unreadable native evidence')
    print('Release readiness PASS within user scope: actual model evidence current; native_browser EXCLUDED, not certified' if scope else 'Release readiness PASS: actual model and native evidence current')
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--native-exclusion');args=parser.parse_args()
    check(native_exclusion=args.native_exclusion)
