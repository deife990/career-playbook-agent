# G2 규칙 이동 대응표

기준 `e52b59d` → E 원본. 진입 가드 16개 블록과 기존 정책 5개 절을 전수 대조했다.
규범 규칙 삭제는 없으며, 사례를 상세 예시 절로 옮기거나 일반화했다. 아래는 작성자의 원문 대조 결과다.
자동 검사는 블록 누락·파일 해시를 확인하며 의미 동등성이나 모델 준수를 증명하지 않는다. G2 사용자 검토는 별도다.

| 규칙 | 원래 위치 | 새 위치 | 처리 |
|---|---|---|---|
| Unknown/Gap across every surface | `core/principles/entry-guards.md:5` | `core/principles/entry-guards.md:4`; `core/principles/evidence-policy.md:56` | 유지/압축, 구체 사례는 Examples |
| Application history | `core/principles/entry-guards.md:18` | `core/principles/entry-guards.md:12` | 유지/압축, 구체 사례는 Examples |
| Goal/inference/scope boundary | `core/principles/entry-guards.md:21` | `core/principles/entry-guards.md:14`; `core/principles/evidence-policy.md:56` | 유지/압축, 구체 사례는 Examples |
| Gross/net compensation | `core/principles/entry-guards.md:29` | `core/principles/entry-guards.md:20` | 유지/압축, 구체 사례는 Examples |
| One question in active mock | `core/principles/entry-guards.md:33` | `core/principles/entry-guards.md:24` | 유지/압축, 구체 사례는 Examples |
| Debrief evidence and intent | `core/principles/entry-guards.md:37` | `core/principles/entry-guards.md:28` | 유지/압축, 구체 사례는 Examples |
| W06 invitation and prepared state | `core/principles/entry-guards.md:42` | `core/principles/entry-guards.md:35` | 유지/압축, 구체 사례는 Examples |
| Lossless re-export and immutable recall | `core/principles/entry-guards.md:46` | `core/principles/entry-guards.md:39` | 유지/압축, 구체 사례는 Examples |
| Export member identity and history | `core/principles/entry-guards.md:49` | `core/principles/entry-guards.md:41` | 유지/압축, 구체 사례는 Examples |
| Exact reference reads and disclosure | `core/principles/entry-guards.md:51` | `core/principles/entry-guards.md:43` | 유지/압축, 구체 사례는 Examples |
| Employer criteria separate from candidate and relationship claims | `core/principles/entry-guards.md:53` | `core/principles/entry-guards.md:45`; `core/principles/evidence-policy.md:56` | 유지/압축, 구체 사례는 Examples |
| Match/reviewer/file-QA vocabularies and confirmed exposure | `core/principles/entry-guards.md:59` | `core/principles/entry-guards.md:49`; `core/principles/evidence-policy.md:56` | 유지/압축, 구체 사례는 Examples |
| Positive exposure and actual-submission handoff | `core/principles/entry-guards.md:69` | `core/principles/entry-guards.md:58`; `core/principles/evidence-policy.md:56` | 유지/압축, 구체 사례는 Examples |
| Useful partial output without tools | `core/principles/entry-guards.md:77` | `core/principles/entry-guards.md:66` | 유지/압축, 구체 사례는 Examples |
| Consent/memory/simulation isolation | `core/principles/entry-guards.md:81` | `core/principles/entry-guards.md:69` | 유지/압축, 구체 사례는 Examples |
| Discovery, provenance, privacy and W08 promotion | `core/principles/entry-guards.md:87` | `core/principles/entry-guards.md:75`; `core/principles/evidence-policy.md:56` | 유지/압축, 구체 사례는 Examples |
| Classification | `core/principles/evidence-policy.md:2` | `core/principles/evidence-policy.md:2`; `core/principles/evidence-policy.md:56` | 유지/압축, 구체 사례는 Examples |
| Career evidence | `core/principles/evidence-policy.md:19` | `core/principles/evidence-policy.md:18` | 유지/압축, 구체 사례는 Examples |
| Opportunity claims | `core/principles/evidence-policy.md:30` | `core/principles/evidence-policy.md:30` | 유지/압축, 구체 사례는 Examples |
| Mapping | `core/principles/evidence-policy.md:38` | `core/principles/evidence-policy.md:38` | 유지/압축, 구체 사례는 Examples |
| Draft integrity | `core/principles/evidence-policy.md:50` | `core/principles/evidence-policy.md:50` | 유지/압축, 구체 사례는 Examples |

## 계약 명확화와 유지 사항

- 종료: discovery Coverage + W05 단계 2. 기존 sufficient/user stop 규칙의 우선순위와 즉시 부분 산출 명시.
- 금액: compensation Numeric application-field decision contract. 기존 선택액 질문을 실행 순서로 명시.
- 등급: screening-engine HM + Application Pack 원본/템플릿. 기존 Recruiter 4등급을 양쪽 결과에 명시.
- 필드: W08 + Debrief 원본/템플릿. 미제공 값 확정 금지와 한 번의 통합 질문.
- D021/D023/D024/D026 가드, W04 전체 섹션 목록, 필수 참조 경로/조건 유지. generator는 수정하지 않았다.
- 모의면접 한 질문의 괄호 예시는 한 질문 원칙으로 압축. fully remote 사례는 W05/Screening의 기존 원문에도 유지.
- 과장/방법/연관관계, Unknown 용어, 노출 경계, 대체 성과 사례는 evidence-policy Examples로 이동.

## 전체 텍스트

[진입 13개 + 정책/가드 diff](entry-policy-guards.patch) · [계약 포함 전체 원본 diff](all-source-contracts.patch) · [원문 블록 대응 JSON](rule-migration.json)

각 파일의 수정 전/후 전체 텍스트도 `before/`, `after/`의 `.txt` 증거 사본에 있다. 설치 패키지가 아니다.

- `core/principles/evidence-policy.md`: [수정 전](before/core/principles/evidence-policy.md.txt) / [수정 후](after/core/principles/evidence-policy.md.txt)
- `core/principles/entry-guards.md`: [수정 전](before/core/principles/entry-guards.md.txt) / [수정 후](after/core/principles/entry-guards.md.txt)
- `adapters/claude/careerpilot/SKILL.md`: [수정 전](before/adapters/claude/careerpilot/SKILL.md.txt) / [수정 후](after/adapters/claude/careerpilot/SKILL.md.txt)
- `adapters/chatgpt/skills/application-prep/SKILL.md`: [수정 전](before/adapters/chatgpt/skills/application-prep/SKILL.md.txt) / [수정 후](after/adapters/chatgpt/skills/application-prep/SKILL.md.txt)
- `adapters/chatgpt/skills/career-setup/SKILL.md`: [수정 전](before/adapters/chatgpt/skills/career-setup/SKILL.md.txt) / [수정 후](after/adapters/chatgpt/skills/career-setup/SKILL.md.txt)
- `adapters/chatgpt/skills/career-state/SKILL.md`: [수정 전](before/adapters/chatgpt/skills/career-state/SKILL.md.txt) / [수정 후](after/adapters/chatgpt/skills/career-state/SKILL.md.txt)
- `adapters/chatgpt/skills/career-strategy/SKILL.md`: [수정 전](before/adapters/chatgpt/skills/career-strategy/SKILL.md.txt) / [수정 후](after/adapters/chatgpt/skills/career-strategy/SKILL.md.txt)
- `adapters/chatgpt/skills/careerpilot-router/SKILL.md`: [수정 전](before/adapters/chatgpt/skills/careerpilot-router/SKILL.md.txt) / [수정 후](after/adapters/chatgpt/skills/careerpilot-router/SKILL.md.txt)
- `adapters/chatgpt/skills/experience-mining/SKILL.md`: [수정 전](before/adapters/chatgpt/skills/experience-mining/SKILL.md.txt) / [수정 후](after/adapters/chatgpt/skills/experience-mining/SKILL.md.txt)
- `adapters/chatgpt/skills/interview-debrief/SKILL.md`: [수정 전](before/adapters/chatgpt/skills/interview-debrief/SKILL.md.txt) / [수정 후](after/adapters/chatgpt/skills/interview-debrief/SKILL.md.txt)
- `adapters/chatgpt/skills/interview-prep/SKILL.md`: [수정 전](before/adapters/chatgpt/skills/interview-prep/SKILL.md.txt) / [수정 후](after/adapters/chatgpt/skills/interview-prep/SKILL.md.txt)
- `adapters/chatgpt/skills/job-intelligence/SKILL.md`: [수정 전](before/adapters/chatgpt/skills/job-intelligence/SKILL.md.txt) / [수정 후](after/adapters/chatgpt/skills/job-intelligence/SKILL.md.txt)
- `adapters/chatgpt/skills/mock-interview/SKILL.md`: [수정 전](before/adapters/chatgpt/skills/mock-interview/SKILL.md.txt) / [수정 후](after/adapters/chatgpt/skills/mock-interview/SKILL.md.txt)
- `adapters/chatgpt/skills/offer-decision/SKILL.md`: [수정 전](before/adapters/chatgpt/skills/offer-decision/SKILL.md.txt) / [수정 후](after/adapters/chatgpt/skills/offer-decision/SKILL.md.txt)
- `adapters/chatgpt/skills/opportunity-discovery/SKILL.md`: [수정 전](before/adapters/chatgpt/skills/opportunity-discovery/SKILL.md.txt) / [수정 후](after/adapters/chatgpt/skills/opportunity-discovery/SKILL.md.txt)
