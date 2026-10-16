"""No-call lexical audit of E changes against source-validated holdout vocabulary.

Selectors are human annotations of frozen inputs, not a semantic independence proof.
"""
import argparse
import json
import re
import subprocess
import unicodedata

from scripts.common import ROOT
from scripts.variant_eval_lock import content_manifest, sha

BASELINE = 'e52b59d'
SELECTORS = 'evals/variants/e-stage/holdout-lexicon-v1.json'
EXAMPLE_ROLE = 'postal sorting aide'
EXAMPLE_NUMBER = '67'


def normalize(value):
    return unicodedata.normalize('NFKC', value).casefold()


def contains(text, term):
    pattern = re.escape(normalize(term))
    if re.fullmatch(r'[a-zA-Z0-9_-]+', term):
        pattern = r'(?<![a-z0-9_])' + pattern + r'(?![a-z0-9_])'
    return bool(re.search(pattern, normalize(text)))


def lexicon(root=ROOT):
    manifest, cases = content_manifest('final', root)
    selectors = json.loads((root/SELECTORS).read_text())
    if selectors['holdout_fingerprint'] != manifest['content_fingerprint'] or set(selectors['terms']) != set(cases):
        raise ValueError('Lexicon does not cover frozen holdout inventory')
    extracted = []
    for id_, terms in selectors['terms'].items():
        text = '\n'.join(cases[id_]['turns'])
        for category, term in terms:
            if not contains(text, term):
                raise ValueError('Lexicon phrase not present in frozen turns: ' + term)
            extracted.append({'scenario': id_, 'category': category, 'term': term,
                              'source_sha256': next(r['sha256'] for r in manifest['payload']['scenarios'] if r['id'] == id_)})
    return extracted


def scan_added_lines(lines, terms):
    return [{'file': path, 'line': number, 'term': row['term'], 'scenario': row['scenario']}
            for path, number, text in lines for row in terms if contains(text, row['term'])]


def diff_lines(root=ROOT):
    # Include untracked files by comparing the filesystem to the baseline, not only git diff.
    paths = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', BASELINE, '--',
                                     'core/', 'templates/', 'scripts/generate_adapters.py'], cwd=root, text=True).splitlines()
    paths = set(paths) | {p.relative_to(root).as_posix() for d in ['core', 'templates'] for p in (root/d).rglob('*') if p.is_file()}
    paths.add('scripts/generate_adapters.py')
    import difflib
    rows = []
    for path in sorted(paths):
        before = subprocess.run(['git', 'show', f'{BASELINE}:{path}'], cwd=root,
                                text=True, capture_output=True)
        if before.returncode and path in subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', BASELINE], cwd=root, text=True).splitlines():
            raise ValueError('Cannot read baseline file')
        old = before.stdout.splitlines()
        target = root/path
        if target.is_symlink():
            raise ValueError('Symlink in E diff')
        new = target.read_text().splitlines() if target.exists() else []
        matcher = difflib.SequenceMatcher(a=old, b=new, autojunk=False)
        for tag, _, _, start, end in matcher.get_opcodes():
            if tag in ['insert', 'replace']:
                rows.extend((path, i+1, new[i]) for i in range(start, end))
    return rows


def example_check(root=ROOT):
    paths = list((root/'evals/scenarios').glob('*.yaml')) + list((root/'evals/variants/e-stage').rglob('*.yaml'))
    collisions = [p.relative_to(root).as_posix() for p in paths
                  if contains(p.read_text(), EXAMPLE_ROLE) or
                  re.search(r'(?<!\d)' + EXAMPLE_NUMBER + r'(?!\d)', p.read_text()) or
                  '우편 분류' in p.read_text()]
    if collisions:
        raise ValueError('Entry example overlaps scenario role/count: ' + ', '.join(collisions))
    classification = (root/'core/principles/evidence-policy.md').read_text().split('## Classification\n')[1].split('\n## ')[0]
    if classification.count('Example:') != 1 or EXAMPLE_ROLE not in classification or EXAMPLE_NUMBER not in classification:
        raise ValueError('Entry must contain exactly the isolated representative example')
    return {'role': EXAMPLE_ROLE, 'number': EXAMPLE_NUMBER, 'scenario_files_checked': len(paths), 'collisions': []}


def audit(root=ROOT):
    terms = lexicon(root)
    additions = diff_lines(root)
    findings = scan_added_lines(additions, terms)
    return {'baseline_commit': BASELINE, 'status': 'FAIL' if findings else 'PASS',
            'scope': 'Added/replacement E lines in core/, templates/, scripts/generate_adapters.py',
            'selector_sha256': sha(root/SELECTORS), 'lexicon': terms,
            'changed_lines_checked': len(additions), 'findings': findings,
            'entry_example': example_check(root),
            'limitation': 'Human-selected literal terms only; semantic leakage and blind independence NOT VERIFIED.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output')
    args = parser.parse_args()
    report = audit()
    text = json.dumps(report, ensure_ascii=False, indent=2) + '\n'
    if args.output:
        with (ROOT/args.output).open('x') as stream:
            stream.write(text)
    else:
        print(text)
    raise SystemExit(0 if report['status'] == 'PASS' else 1)


if __name__ == '__main__':
    main()
