# G2 문장·괄호·예시 재대조

사용자 검토에 따라 G2의 “예시를 이동/일반화했으며 삭제 없음” 설명을 정정한다.
블록 수와 블록 목적지를 모두 대조해도, 그 안의 괄호/예시 삭제를 놓칠 수 있었다.
이전에 한 “규범 규칙 삭제 없음” 판단은 예시까지 보존됐다는 뜻으로 확대하면 틀린다.
자동 블록 대조는 문장·예시 보존 검사가 아니며 의미/모델 행동도 증명하지 않는다.

## 요청한 복원

`25ca957`에서 추가된 다음 문장을 `core/principles/entry-guards.md` 진입부에 원문 그대로 복원했다.

> Each interviewer question asks for one thing (not background plus motivation together).

처리는 **삭제→복원**이다. evidence-policy로 옮긴 것이 아니다. 해당 커밋은 문장의 추가를
증명하지만, 이 예시 하나의 추가 원인이 된 실제 실패까지 커밋 diff만으로 확정하지 않는다.

## 다른 예시·괄호의 재대조

기준 `e52b59d`의 entry-guards와 evidence-policy 전 문장을 현재 원본/상세 계약과 대조했다.
문장별 원문, 목적지 블록, 그대로 남았는지 여부는
[문장 재대조 원문 JSON](../evals/reports/rc8-g2-sentence-review-2026-10-16.json)에 있다.
문장 분할/문자 일치 결과는 대조 보조 자료이며 아래 처리는 작성자의 원문 검토다.

| 원문 예시/괄호 | 실제 처리와 현재 위치 | 이번 조치 |
|---|---|---|
| `(not background plus motivation together)` | entry에서 삭제됐고 다른 곳으로 이동하지 않았음 | **진입부 삭제→복원** |
| `협업 경험 공백`, `확인된 협업 경험 없음` | 부정 표현 예시 2개는 문자 그대로 이동 없이 생략. guards의 Unknown/Gap 원칙과 evidence-policy의 “협업 사례 미확인, not confirmed absence”는 유지 | 이전 “모든 예시 이동” 설명을 정정. 요청 범위 밖 런타임 추가 수정 없음 |
| `(e.g. fully remote)` | entry의 괄호는 생략. 동일 work-condition 예시는 기존 W05 Steps 1, screening pipeline 4에 여전히 존재 | “새로 이동”이 아니라 “진입부 생략, 기존 상세 계약에서 유지”로 기록 |
| `may be adjacent experience` | 긴 예시 표현은 단축됐고 evidence-policy Examples의 `Adjacent`와 누락 전제 금지에 같은 사례가 있음 | 직역 보존이 아닌 단축·일반화로 기록 |
| `I personally tested 12 cases`, `Performed 12 tests and reported defects` | evidence-policy Examples의 personal testing/테스트·결함 보고 사례로 의역 통합 | 숫자·행동 사례 유지, 원문 문자열은 동일하지 않음 |
| 결함 발견/문서/도구/구조적 절차/테스트와의 관계 | evidence-policy Examples의 reporting 사례와 guards의 행위·질·방법·관계 금지 | 상세 예시 이동/통합 |
| 분석 경력 3년 + 테스트 12개 | evidence-policy Examples에 같은 기간·행동 간 관계 금지 사례 유지 | 의역 이동 |
| SQL-only JD, Unknown SQL 금지 표현, Partial SQL 결과 검토, Selenium | evidence-policy Examples와 기존 screening-engine에 유지 | 사례 이동/통합 |
| `reviewed results of existing SQL queries` | evidence-policy Examples에 원문 유지 | 사례 이동 |
| `operational readiness` | evidence-policy Examples에 원문 유지 | 사례 이동 |
| `지원 이력 없음`/`not applied`, 불합격·기회 해석 금지 표현, 실제 제출 후 고정 문구 | 진입 guards에 유지 | 보존 |
| policy Career evidence의 support→project lead, Mapping의 small/large, Draft integrity의 확인/문서화→성과 예시 | 원래 policy 절에 유지 | 보존 |

괄호 복원 외에 런타임 원본·템플릿·생성기를 추가로 바꾸지 않았다. 기존 초기 로딩 바이트
상한도 유지한다. 새로운 문장 대조 자료 역시 의미 동등성이나 행동 성공의 자동 증명이 아니다.
승인된 개발 진단 n=1에서 유용성·질문 수·실패 원문을 별도로 검토한다.
