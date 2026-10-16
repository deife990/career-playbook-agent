"""Build G2 text-review artifacts and an exhaustive entry-rule relocation ledger. No calls."""
import difflib
import hashlib
import json
import re
import subprocess

from scripts.common import ROOT

BASELINE = 'e52b59d'
TARGET = ROOT/'evals/reports/rc8-g2-text-review'
POLICY = 'core/principles/evidence-policy.md'
GUARDS = 'core/principles/entry-guards.md'
THEMES = ['Unknown/Gap across every surface', 'Application history', 'Goal/inference/scope boundary',
          'Gross/net compensation', 'One question in active mock', 'Debrief evidence and intent',
          'W06 invitation and prepared state', 'Lossless re-export and immutable recall',
          'Export member identity and history', 'Exact reference reads and disclosure',
          'Employer criteria separate from candidate and relationship claims',
          'Match/reviewer/file-QA vocabularies and confirmed exposure',
          'Positive exposure and actual-submission handoff', 'Useful partial output without tools',
          'Consent/memory/simulation isolation', 'Discovery, provenance, privacy and W08 promotion']


def before(path):
    return subprocess.check_output(['git', 'show', f'{BASELINE}:{path}'], cwd=ROOT, text=True)


def blocks(text, regex):
    matches = list(re.finditer(regex, text, re.M))
    result = []
    for i, match in enumerate(matches):
        end = matches[i+1].start() if i+1 < len(matches) else len(text)
        result.append({'line': text[:match.start()].count('\n')+1, 'text': text[match.start():end].rstrip()})
    return result


def build():
    TARGET.mkdir(parents=True, exist_ok=True)
    entries = ['adapters/claude/careerpilot/SKILL.md'] + sorted(
        p.relative_to(ROOT).as_posix() for p in (ROOT/'adapters/chatgpt/skills').glob('*/SKILL.md'))
    files = [POLICY, GUARDS, *entries]
    patches = []
    inventory = []
    for path in files:
        old, new = before(path), (ROOT/path).read_text()
        for side, text in [('before', old), ('after', new)]:
            # Text snapshots are evidence, not standalone installable Markdown packages.
            legacy = TARGET/side/path
            legacy.unlink(missing_ok=True)
            output = TARGET/side/(path+'.txt')
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(text)
        patches.extend(difflib.unified_diff(old.splitlines(True), new.splitlines(True),
                                            fromfile='before/'+path, tofile='after/'+path))
        inventory.append({'path': path, 'before_sha256': hashlib.sha256(old.encode()).hexdigest(),
                          'after_sha256': hashlib.sha256(new.encode()).hexdigest()})
    (TARGET/'entry-policy-guards.patch').write_text(''.join(patches))
    contract_paths = subprocess.check_output(['git', 'diff', '--name-only', BASELINE, '--',
                                             'core/', 'templates/'], cwd=ROOT, text=True).splitlines()
    (TARGET/'all-source-contracts.patch').write_text(subprocess.check_output(
        ['git', 'diff', '--no-ext-diff', BASELINE, '--', 'core/', 'templates/'], cwd=ROOT, text=True))
    old_guards, new_guards = blocks(before(GUARDS), r'^- '), blocks((ROOT/GUARDS).read_text(), r'^- ')
    if len(old_guards) != len(new_guards) or len(old_guards) != len(THEMES):
        raise ValueError('Every original entry guard must have a reviewed destination')
    old_policy = blocks(before(POLICY), r'^## ')
    new_policy = blocks((ROOT/POLICY).read_text(), r'^## ')
    rows = []
    for index, (old, new, theme) in enumerate(zip(old_guards, new_guards, THEMES)):
        destinations = [{'path': GUARDS, **new}]
        if index in [0, 2, 10, 11, 12, 15]:
            destinations.append({'path': POLICY, **new_policy[-1]})
        rows.append({'id': f'guard-{index+1:02}', 'theme': theme,
                     'original': {'path': GUARDS, **old}, 'destinations': destinations,
                     'disposition': ('삭제→복원: one-question parenthetical restored verbatim in entry'
                                     if index == 4 else 'preserved; wording compressed/generalized or examples moved')})
    for old in old_policy:
        new = next(b for b in new_policy if b['text'].splitlines()[0] == old['text'].splitlines()[0])
        destinations = [{'path': POLICY, **new}]
        if old['text'].startswith('## Classification'):
            destinations.append({'path': POLICY, **new_policy[-1]})
        rows.append({'id': 'policy-'+str(len(rows)), 'theme': old['text'].splitlines()[0][3:],
                     'original': {'path': POLICY, **old}, 'destinations': destinations,
                     'disposition': 'preserved; Classification cases moved; outcome support clarified'})
    ledger = {'baseline_commit': BASELINE, 'generated_entry_count': len(entries),
              'files': inventory, 'original_guard_blocks': len(old_guards),
              'original_policy_sections': len(old_policy), 'mapping': rows,
              'author_review': 'G2 correction: mock parenthetical was deleted, now restored verbatim. Other explicit omissions and paraphrases are accounted for in the sentence-level review.',
              'limitation': 'Block accounting can miss deleted parentheticals/examples within a surviving block. It proves neither sentence preservation, semantic equivalence nor model compliance. See sentence-level review; real behavior remains separately evaluated.'}
    (TARGET/'rule-migration.json').write_text(json.dumps(ledger, ensure_ascii=False, indent=2)+'\n')
    markdown = ['# G2 규칙 이동 대응표', '', f'기준 `{BASELINE}` → E 원본. 진입 가드 16개 블록과 기존 정책 5개 절을 전수 대조했다.',
                'G2 정정: 모의면접 괄호 예시는 이동이 아닌 삭제였으며 진입부에 원문 그대로 복원했다.',
                '블록 자동 대조는 살아 있는 블록 안의 괄호·예시 삭제를 놓칠 수 있다. 문장 보존·의미 동등성·모델 준수의 증거가 아니다.',
                '[문장 단위 재대조와 다른 예시 생략 기록](../../../docs/rc8-g2-sentence-review-2026-10-16.md)을 함께 본다.', '',
                '| 규칙 | 원래 위치 | 새 위치 | 처리 |', '|---|---|---|---|']
    for row in rows:
        old = row['original']
        dest = '; '.join(f"`{d['path']}:{d['line']}`" for d in row['destinations'])
        disposition = '삭제→복원: 괄호 원문 진입부 유지' if row['id'] == 'guard-05' else '유지/압축 또는 사례 이동; 문장별 예외는 재대조 기록 참조'
        markdown.append(f"| {row['theme']} | `{old['path']}:{old['line']}` | {dest} | {disposition} |")
    markdown += ['', '## 계약 명확화와 유지 사항', '',
                 '- 종료: discovery Coverage + W05 단계 2. 기존 sufficient/user stop 규칙의 우선순위와 즉시 부분 산출 명시.',
                 '- 금액: compensation Numeric application-field decision contract. 기존 선택액 질문을 실행 순서로 명시.',
                 '- 등급: screening-engine HM + Application Pack 원본/템플릿. 기존 Recruiter 4등급을 양쪽 결과에 명시.',
                 '- 필드: W08 + Debrief 원본/템플릿. 미제공 값 확정 금지와 한 번의 통합 질문.',
                 '- D021/D023/D024/D026 가드, W04 전체 섹션 목록, 필수 참조 경로/조건 유지. generator는 수정하지 않았다.',
                 '- 모의면접 괄호는 삭제→복원(25ca957에서 추가된 원문). fully remote 사례는 W05/Screening의 기존 원문에도 유지.',
                 '- 과장/방법/연관관계, Unknown 용어, 노출 경계, 대체 성과 사례는 evidence-policy Examples로 이동.',
                 '', '## 전체 텍스트', '',
                 '[진입 13개 + 정책/가드 diff](entry-policy-guards.patch) · [계약 포함 전체 원본 diff](all-source-contracts.patch) · [원문 블록 대응 JSON](rule-migration.json)',
                 '', '각 파일의 수정 전/후 전체 텍스트도 `before/`, `after/`의 `.txt` 증거 사본에 있다. 설치 패키지가 아니다.', '']
    for item in inventory:
        path = item['path']
        markdown.append(f'- `{path}`: [수정 전](before/{path}.txt) / [수정 후](after/{path}.txt)')
    (TARGET/'RULE-MAP.md').write_text('\n'.join(markdown)+'\n')
    return ledger


if __name__ == '__main__':
    ledger = build()
    print(f"G2 review: {len(ledger['files'])} files; {len(ledger['mapping'])} rule mappings")
