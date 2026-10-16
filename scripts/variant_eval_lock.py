"""Content/execution locks for the isolated post-C evaluation; no model calls."""
import hashlib
import json
from pathlib import Path

import yaml

from scripts.common import ROOT
from scripts.run_model_evals import fingerprint
from scripts.package_inventory import inventory

BASE = 'evals/variants/e-stage/'
MANIFESTS = {'development': BASE + 'development-manifest-v1.json',
             'final': BASE + 'holdout-manifest-v1.json'}
MODELS = {'chatgpt': 'gpt-5.6-sol', 'claude': 'claude-sonnet-4-6'}
PINNED = {'development': '665bbe2d6a2fbbfc3c521e7bc1f387fc579dee28a05823acdcb7feb908d8fe10',
          'final': '895695d7ab6b22e9fe9a01fbcab7643335478a650a7efb6fd0ef703eaae83ed7'}


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':'),
                                     ensure_ascii=False).encode()).hexdigest()


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def safe_file(relative, root=ROOT):
    path = root / relative
    if Path(relative).is_absolute() or '..' in Path(relative).parts:
        raise ValueError('Unsafe evaluation path')
    if any(p.is_symlink() for p in [path, *path.parents] if p.is_relative_to(root)):
        raise ValueError('Evaluation symlink forbidden')
    if not path.resolve().is_relative_to(root.resolve()) or not path.is_file():
        raise ValueError('Missing/unsafe evaluation file: ' + relative)
    return path


def content_manifest(mode, root=ROOT):
    document = json.loads(safe_file(MANIFESTS[mode], root).read_text())
    payload = document['payload']
    if digest(payload) != document['content_fingerprint'] or document['content_fingerprint'] != PINNED[mode]:
        raise ValueError('Content fingerprint mismatch')
    if mode == 'development':
        if payload.get('release_evidence') is not False or payload.get('scope') != 'DIAGNOSTIC_ONLY':
            raise ValueError('Development must be diagnostic only')
    elif payload['phase'] != 'final-only':
        raise ValueError('Holdout is final-only')
    seen = set()
    cases = {}
    bound = payload['bound_files']
    for relative, expected in bound.items():
        if sha(safe_file(relative, root)) != expected:
            raise ValueError('Bound dependency changed: ' + relative)
    for row in payload['scenarios']:
        if row['id'] in seen:
            raise ValueError('Duplicate scenario')
        seen.add(row['id'])
        path = safe_file(row['path'], root)
        allowed = (row['path'].startswith(BASE + 'development/') or
                   row['path'].startswith('evals/scenarios/')) if mode == 'development' else row['path'].startswith(BASE + 'holdout/')
        if not allowed or (mode == 'development' and row['id'].startswith('holdout-')):
            raise ValueError('Scenario outside approved mode')
        case = yaml.safe_load(path.read_text())
        if sha(path) != row['sha256'] or case['id'] != row['id'] or len(case['turns']) != row['turns']:
            raise ValueError('Scenario content mismatch')
        if mode == 'development' and row['runs'] != 1:
            raise ValueError('Development runs must be one')
        if mode == 'final' and (row['runs'], row['judge']) != ((3, 'cross') if row['tier'] == 'critical' else (1, 'same')):
            raise ValueError('Invalid final tier routing')
        dependencies = [f"evals/personas/{case['persona']}.yaml"]
        if case.get('context_fixture'):
            dependencies.append(case['context_fixture'])
        for dep in dependencies:
            if dep not in bound or sha(safe_file(dep, root)) != bound[dep]:
                raise ValueError('Unbound scenario dependency: ' + dep)
        cases[row['id']] = case
    return document, cases


def execution_payload(mode, platform, package, root=ROOT):
    manifest, _ = content_manifest(mode, root)
    if platform not in MODELS:
        raise ValueError('Unknown platform')
    if package.is_symlink() or any(p.is_symlink() for p in package.rglob('*')):
        raise ValueError('Package symlink forbidden')
    expected = set(inventory(package, platform))
    extras = {p.relative_to(package).as_posix() for p in package.rglob('*') if p.is_file()} - expected
    if extras - ({'README.md', 'host.md'} if platform == 'chatgpt' else set()):
        raise ValueError('Unfingerprinted package content')
    # Bind all Python implementation dependencies conservatively, including the wrapper itself.
    files = list((root / 'scripts').glob('*.py')) + [
        root / 'docs/rc8-candidate-revision-limit-2026-10-16.md',
        root / 'docs/rc8-evaluation-policy-2026-10-16.md',
        root / 'evals/variants/e-stage/holdout-lexicon-v1.json',
        root / 'evals/reports/rc8-g2-text-review/rule-migration.json']
    return {'version': 1, 'mode': mode, 'platform': platform, 'context': 'preloaded',
            'release_evidence': False, 'reference_discovery_verified': False,
            'manifest_fingerprint': manifest['content_fingerprint'],
            'package_fingerprint': fingerprint(package), 'expected_models': MODELS,
            'dependencies': {p.relative_to(root).as_posix(): sha(p) for p in sorted(files)}}


def write_lock(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    value = {'payload': payload, 'execution_fingerprint': digest(payload)}
    with path.open('x') as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    return value


def validate_lock(path, mode, platform, package, root=ROOT):
    value = json.loads(path.read_text())
    if (digest(value['payload']) != value['execution_fingerprint'] or
            value['payload'] != execution_payload(mode, platform, package, root)):
        raise ValueError('Execution lock changed/stale')
    return value
