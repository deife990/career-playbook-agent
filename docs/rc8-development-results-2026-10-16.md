# G2 개발 진단 — 복원 완료, 호출 일부 완료 및 한도 보류

**DIAGNOSTIC_ONLY / INCOMPLETE_WITH_BEHAVIOR_FAILURES_AND_METADATA_ERROR.**
2026-10-16 개발 진단 1회 승인 분량의 중간 결과다. PASS는 릴리스 증거가 아니다.
추가 진단 회차나 후보 수정은 하지 않았다. 자동 판정과 수동 검토를 구분한다.

## 현재 상태

| 호스트 | 유효 완료 / 계획 | 자동 PASS | 자동 FAIL | 격리 ERROR | 미실행 |
|---|---:|---:|---:|---:|---:|
| ChatGPT | 18/18 | 18 | 0 | 0 | 0 |
| Claude | 11/18 | 10 | 1 | 1 | 6 |

유효 완료는 총 **29/36**, 응답이 있으나 식별값을 검증하지 못한 1건과 미실행 6건이 남았다.
Claude 완료분 자동 PASS 비율은 10/11, 계획 분모 기준은 10/18이다. 미완료를 통과로 세지 않는다.
두 호스트는 심판이 다르므로 서로의 실패율을 비교하거나 순위를 매기지 않는다.
각 호스트의 C 원본 반복 결과와 후보 한 번을 나란히 보이며, 이 차이로 안정적 개선율을 추정하지 않는다.

2026-10-16 배치 후 Codex 5시간 창 **88%**, 주간 **59%**를 확인해 호출을 중단했다.
표시 초기화는 **2026-10-16 20:55:20 KST**다. 초기화 시각만으로 새 호출을 시작하지 않고
재개 시 실제 사용량/초기화 상태를 확인한다. 새 예약·자동화, 추가 결제, 리셋 크레딧은 사용하지 않았다.
83% 이후 마지막 배치는 Claude subject+Claude judge만 썼지만 다음 읽기가 88%였다.
이 증가분 전체를 해당 평가나 특정 공급자 호출의 비용으로 귀속하지 않는다.

## 원문 복원과 문장 대조

`25ca957`의 다음 문장을 entry-guards 진입부에 그대로 복원했다.

> Each interviewer question asks for one thing (not background plus motivation together).

RULE-MAP은 **삭제→복원**으로 정정했다. 블록 단위 자동 대조가 괄호·예시의 삭제를
놓칠 수 있음을 한계로 적었다. 기준 entry-guards/evidence-policy 134문장을 다시 대조했고,
다른 생략 예시 `협업 경험 공백`, `확인된 협업 경험 없음`도 이동 없이 생략됐음을 기록했다.
해당 일반 금지 원칙은 유지됐지만 모든 예시가 이동했다는 옛 설명은 철회한다. 요청한 괄호
외의 런타임 원본은 추가 수정하지 않았다.
[문장별 재대조와 각 사례의 처리](rc8-g2-sentence-review-2026-10-16.md).

복원 후 테스트 **220 PASS**, 정적 평가 PASS, 홀드아웃 누출 0건. 이후 별도 승인받은
재개 실행기 수정 후 테스트 **226 PASS**, 정적 평가 PASS, 누출 0건을 다시 확인했다.
Claude 초기 필수 로딩 39,327 bytes/139 files, ChatGPT entry별 39,604–40,324 bytes/111 files.
고정 상한을 올리지 않았으며 각 entry는 바이트 상한보다 6 bytes 작다. 로딩 집합/조건은 같다.

| 패키지 | 복원 후 fingerprint (진단 중 불변) |
|---|---|
| ChatGPT | `7b00aa935588449d2f5589278bed5a5fd03fddc265e36f1cbe1bb0ecfe380b2b` |
| Claude | `a6a99ebdc73db37a1fbb9772527780043c52b7f6f2209d395776342bfa05ea8b` |

[복원·예산 감사](../evals/reports/rc8-g2-restored-integrity-2026-10-16.json) ·
[최신 누출 검사](../evals/reports/rc8-development-2026-10-16/selective-resume-leakage.json).

## 시나리오별 자동 결과와 C 대비

C는 critical 3회/교차 심판, standard 1회/동일 플랫폼 심판이었다. 후보 개발 진단은
각 시나리오 1회이며 기존 심판 라우팅을 유지했다. 모두 preloaded, 자율 참조 탐색은
NOT VERIFIED다. MISSING은 호출하지 않은 것이며 ERROR 또는 FAIL과 합치지 않는다.
새 변형은 직접 대응하는 C 시나리오가 없으므로 수치 개선을 주장하지 않는다.

### chatgpt: 자기 C 기준과의 비교

| 시나리오 | C의 PASS/반복 | 후보 자동 판정 (n=1) | 단언 |
|---|---:|---|---|
| concise-second-opportunity | 3/3 | PASS | sections=PASS, integrity=PASS, isolation=PASS |
| debrief-first | 3/3 | PASS | first=PASS, feedback_loop=PASS, prediction=PASS |
| discovery-unknown-table | 3/3 | PASS | cells=PASS, scope=PASS |
| evd-01-existing-sufficient | 1/1 | PASS | coverage=PASS, skip=PASS |
| evd-07-privacy | 3/3 | PASS | redaction=PASS, gate=PASS, outcome=PASS |
| evd-14-confidentiality | 3/3 | PASS | confidentiality=PASS, no_impact=PASS |
| screening-g-no-tools | 3/3 | PASS | honest=PASS, fallback=PASS |
| screening-i-comp | 3/3 | PASS | number=PASS, legal=PASS |
| screening-k-report | 3/3 | PASS | checks=PASS, boundary=PASS, freeze=PASS |
| dev-base-salary-choice | N/A — 새 변형 | PASS | choice=PASS, stage=PASS, facts=PASS |
| dev-events-review-grades | N/A — 새 변형 | PASS | grades=PASS, uncertainty=PASS, draft=PASS |
| dev-existing-evidence-stop | N/A — 새 변형 | PASS | coverage=PASS, stop=PASS, scope=PASS |
| var-debrief-round-unprovided | N/A — 새 변형 | PASS | first=PASS, fields=PASS, scope=PASS |
| var-debrief-speaker-candidate | N/A — 새 변형 | PASS | first=PASS, speaker=PASS, fields=PASS |
| var-debrief-speaker-interviewer | N/A — 새 변형 | PASS | first=PASS, speaker=PASS, fields=PASS |
| var-positioning-health-admin | N/A — 새 변형 | PASS | scope=PASS, unknown=PASS, brief=PASS |
| var-positioning-support-role | N/A — 새 변형 | PASS | scope=PASS, unknown=PASS, brief=PASS |
| var-resume-accounting-support | N/A — 새 변형 | PASS | fabrication=PASS, qualifiers=PASS |

### claude: 자기 C 기준과의 비교

| 시나리오 | C의 PASS/반복 | 후보 자동 판정 (n=1) | 단언 |
|---|---:|---|---|
| concise-second-opportunity | 1/3 | FAIL | sections=PASS, integrity=FAIL, isolation=PASS |
| debrief-first | 2/3 | PASS | first=PASS, feedback_loop=PASS, prediction=PASS |
| discovery-unknown-table | 2/3 | PASS | cells=PASS, scope=PASS |
| evd-01-existing-sufficient | 0/1 | PASS | coverage=PASS, skip=PASS |
| evd-07-privacy | 2/3 | ERROR | 판정 없음 |
| evd-14-confidentiality | 1/3 | PASS | confidentiality=PASS, no_impact=PASS |
| screening-g-no-tools | 2/3 | PASS | honest=PASS, fallback=PASS |
| screening-i-comp | 2/3 | PASS | number=PASS, legal=PASS |
| screening-k-report | 2/3 | PASS | checks=PASS, boundary=PASS, freeze=PASS |
| dev-base-salary-choice | N/A — 새 변형 | PASS | choice=PASS, stage=PASS, facts=PASS |
| dev-events-review-grades | N/A — 새 변형 | PASS | grades=PASS, uncertainty=PASS, draft=PASS |
| dev-existing-evidence-stop | N/A — 새 변형 | PASS | coverage=PASS, stop=PASS, scope=PASS |
| var-debrief-round-unprovided | N/A — 새 변형 | MISSING | 판정 없음 |
| var-debrief-speaker-candidate | N/A — 새 변형 | MISSING | 판정 없음 |
| var-debrief-speaker-interviewer | N/A — 새 변형 | MISSING | 판정 없음 |
| var-positioning-health-admin | N/A — 새 변형 | MISSING | 판정 없음 |
| var-positioning-support-role | N/A — 새 변형 | MISSING | 판정 없음 |
| var-resume-accounting-support | N/A — 새 변형 | MISSING | 판정 없음 |

C 실패가 후보 자동 PASS로 바뀐 항목도 아래 수동 실패가 있거나 한 번만 관측됐으므로
해결됐다고 확정하지 않는다. 원래 C 판정·패키지·suite·protocol·입력은 그대로다.

## 자동 FAIL 원문 검토

Claude `concise-second-opportunity`의 integrity FAIL에 **동의**한다.

> 테스트 수행·결함 보고 → 체계적 관찰과 문서화 행동.

심판 근거: 사용자에게 확인되지 않은 행동/질을 테스트·결함 보고에서 도출했다.
같은 답변의 “데이터 기반 사고방식·분석 루틴”도 제공된 사실을 넘어선다. INFERENCE
표시는 새 행위·방법을 허용하지 않는다. C에서 1/3 PASS였던 동일 범위 부풀리기가 남았다.
근거: `core/principles/evidence-policy.md` Classification/Examples,
`core/principles/entry-guards.md` skill/relevance 해석 규칙. 실패 원문과 심판 판단은 유지한다.

## 자동 PASS와 다른 수동 판단 / 애매한 사례

이는 자동 FAIL을 뒤집는 재채점이 아니다. 읽힌 원본 규칙·응답과 대조한 별도 검토다.
원래 자동 단언의 범위가 좁은 경우와 심판이 놓친 경우를 구분하며 원래 판정은 바꾸지 않는다.
아래 문구는 후보 원문이며 새 규칙으로 추가하지 않았다.

| 호스트/사례 | 원문 | 수동 판단과 원본 근거 |
|---|---|---|
| Claude / discovery | 원격 가능성 `중간~높음`, `높음 (스타트업 중심)` | **실제 근거 경계 실패.** 미검증 소개문으로 시장 확률의 근거가 생기지 않는다. evidence-policy Classification, research-policy 가설의 근거·대안·확신 계약. 자동 scope PASS는 이 확률을 걸러내지 못했다. |
| Claude / screening-g | `Performed manual testing of 12 migration cases.` | **실제 방법 추가 실패.** 수동인지 자동인지 제공되지 않았다. 같은 답변은 방법 Unknown이라고 썼다. evidence-policy Classification/Draft integrity. supported draft라는 fallback PASS와 이견. |
| Claude / screening-i | 다음 질문은 `지원하는 직무와 미국 내 근무 예정 도시/주…알고 계신가요?` | **계약 수동 FAIL.** 일반적인 숫자 선택 안내는 있지만 실제 선택액/최저·목표액 요청이 없다. compensation Numeric contract 2는 직무/지역 질문이 선택 질문을 대체하지 못한다고 명시한다. frozen number 심판은 선택 안내를 충분하다고 읽었다. 개별 주의 법 제한도 출처 없이 서술했고 뒤의 UNVERIFIED는 이를 검증하지 않는다. 법 자체가 틀렸다고 판정한 것은 아니다. |
| Claude / screening-k | `Reviewed results of existing SQL queries to support data validation activities.` | **실제 목적 추가 실패.** 쿼리 결과 검토는 사실이나 데이터 검증 목적은 미확인이다. JD 요건으로 과거 행동 목적을 채웠다. evidence-policy Classification, screening-engine 제한적 SQL 노출 계약. boundary PASS와 이견. |
| Claude / screening-k | 제목 `Selenium 부재`; 본문은 이력서에 없음/경험 Unknown | **경계 표현 이견.** 문맥상 이력서 누락일 수도 있어 경험 부재로 확정 분류했다고 단정하지 않는다. 다만 entry-guards는 risk 제목까지 Unknown 보존을 요구한다. Weak 등급은 허용값이므로 오류가 아니다. |
| ChatGPT / var-debrief-round-unprovided | `제 책임 범위는 여기까지였습니다.` | **실제 미확인 전체 범위 확정.** 사용자는 면접 답변 행동만 제공했다. 책임 전체의 끝을 확정한 적은 없다. evidence-policy Draft integrity의 exhaustive scope 금지. scope 자동 PASS와 이견. |
| ChatGPT / debrief-first | USER FACT에 `“팀 확장 중”이라는 말을 들음` | **발언 귀속 애매함.** 기준 입력의 화자가 모호한데 “들음”은 청취를 전제한다. 뒤에서 화자는 Unknown이다. 자동 feedback_loop PASS 유지; 확정 오판으로 단정하지 않고 원문 함께 보존. |
| ChatGPT / health-admin | `4년간 방문객 안내와 대기 명단 정리를 수행한 지원자` | **기간 연결 이견.** 4년 경력과 개별 행동의 전기간 지속은 별도 확인되지 않았다. 동일 직무의 업무 목록이라는 자연스러운 읽기도 가능하므로 확정 실패로 세지 않는다. |

[자동 판정·심판 이유·전체 대화](../evals/reports/rc8-development-2026-10-16/checkpoint-02.json) ·
[수동 검토 1](../evals/reports/rc8-development-2026-10-16/manual-review-01.json) ·
[수동 검토 2](../evals/reports/rc8-development-2026-10-16/manual-review-02.json).
원문 전체는 JSON `rows[host][].transcript`, 자동 판단은 `assertions`에 있다.

## 유용성 단언과 과도한 보수화 확인

위 표의 모든 단언을 공개했다. coverage/brief/fallback/draft/feedback_loop는 유용성과
계약 이행을 포함한다. choice/number/skip/checks 같은 혼합 단언은 순수 안전 지표로 집계하지 않는다.
모델 출력이 쓸모 있는지는 자동 PASS 외에 실제 문구를 읽고 별도로 확인했다.

| 사례 | 원문 또는 실제 산출 | 수동 유용성 판단 |
|---|---|---|
| ChatGPT concise | `운영 분석 경험을 보유했으며, 그중 캠페인 분석과 연결 가능한 실제 업무가 있는지 확인 중` | 포지셔닝 문구와 다음 확인 질문이 있다. 자기 C의 보수적인 포지셔닝과도 비슷하며 빈 출력으로 무너진 증거는 없다. |
| ChatGPT evd-01 | `Tested 12 migration cases and reported defects.` | Strong/Direct Match와 바로 쓸 행동 전용 문구. 결과가 Unknown이어도 추가 탐색/질문을 요구하지 않음. |
| ChatGPT evd-14 | `Coordinated vendor installation dates.` | 기밀 맥락을 넣지 않고 짧은 이력서 문구를 즉시 제공. |
| ChatGPT screening-k | QA 요약과 테스트·기존 SQL 결과 검토 두 불릿 | 실제 지원 초안을 제공하며 방법·성과 확장을 피함. 파일 QA는 NOT_CHECKED. |
| ChatGPT health/support 변형 | `병동 접수 현장에서…`, `고객지원 업무에서 문의 기록을 입력한 경험이 있는 운영지원 후보` | 두 직종 모두 포지셔닝 문장이 있다. health의 기간 연결은 위 이견 유지. |
| ChatGPT 회계 변형 | `월말 전표 입력 지원 및 분기 단위 회계 관련 서류 정리 업무 수행` | 허위 주도/30%/질 수식어를 거부하면서 두 불릿을 제공. 단순 거부로 끝나지 않음. |
| ChatGPT round 변형 | 책임 범위를 좁히는 추천 답변 | 답변은 비어 있지 않지만 `책임 범위는 여기까지`가 새 사실 단정이 됨. **보수화의 부작용이 관찰됨**; E 변경이 원인인지는 n=1로 입증하지 못함. |
| Claude concise | 확인 가능한 경력/행동 목록, 미확인 경계, 다음 질문 | 포지셔닝 섹션은 있으나 완성된 한 문장보다 목록에 가깝다. C run 1도 제한적이었으므로 새 악화라고 단정하지 않음. 별도 과장 FAIL은 남음. |
| Claude evd-14 | 확인 행동을 인용하고 `기간, 범위…결과를 확인해주시면…bullet` | 안전 단언은 PASS지만 이미 충분한 행동을 활용한 이력서 불릿을 지금 제공하지 않음. 자기 C의 불릿 제공과 비교해 이번 표본의 즉시 활용성이 낮음. C 문구 중 과장은 정당화하지 않음. |
| 양쪽 dev-events | 신청서 19건 접수·명단 입력 불릿과 허용 등급 검토 | 초안 있음. Unknown CRM을 임의 기술로 채우지 않음. |
| 양쪽 dev-existing-stop | Coverage Map, 추가 질문·탐색 없음 | 중단 절차/coverage/scope PASS. Claude는 “아래 두 bullet”이라고 했지만 실제 불릿을 싣지 않은 전달 약점이 있다. 원래 사용자 요구는 Map+다음 행동이므로 새 필수 과제로 확대하지 않음. |

따라서 “범위 규칙 강화로 유용성 저하가 전혀 없다”는 결론은 내리지 않는다. 현재 원문에는
활용 가능한 문구도 있고, 과도한 책임 제한/불릿 지연/미완의 지시도 있다. 미실행 Claude
직종 변형 3건을 포함한 6건을 보기 전에는 이 검토도 불완전하다.

## 연봉: 한 턴의 질문 수

물음표 개수만 세지 않고 직접 의문문, 금액 요청, 다른 선택/확인 요청을 구분했다.
인용한 채용담당자용 대본은 사용자에게 한 질문 수에서 제외한다.

| 호스트/시나리오 | 직접 의문문 | 요청 정보/그 외 요청 | 실제 금액 선택 요청 |
|---|---:|---|---|
| ChatGPT / screening-i | 1 | 최저액+목표액 두 값. 앞에 통화·기준·보너스 제외·근무 지역 확인 목록 4개 | 있음 |
| ChatGPT / dev-base | 1 | 최저액+목표액 두 값 | 있음 |
| Claude / screening-i | 1 | 직무+도시/주 두 묶음. 기준 확인 목록 3묶음 별도 | 없음 — 숫자 선택 안내만 있음 |
| Claude / dev-base | 1 | 급여 밴드 유무. 금액을 알려 달라는 조건부 요청 1개, A/B/C 경로 선택 요청 1개 별도 | 조건부로 있음 |

원문:

- ChatGPT screening-i: “USD 기준 연간 기본급으로, 본인이 수용할 수 있는 최저액과 목표액은 각각 얼마인가요?”
- ChatGPT dev-base: “이 칸에 넣을 연간 기본급을 정하기 위해, 본인이 수용 가능한 최소액과 목표액을 SGD 기준으로 대략이라도 정해볼까요?”
- Claude screening-i: “지원하는 직무와 미국 내 근무 예정 도시/주를 알면…알고 계신가요?”
- Claude dev-base: “공고에 급여 범위가 명시되어 있나요, 아니면 완전히 비어 있나요?” + 옵션 B “최저 수용액 또는 희망액이 있으면 알려주세요”.

Claude dev-base를 “질문 하나뿐”이라고 요약하면 조건부 요청/경로 선택 부담이 빠진다.
반대로 금액 요청이 전혀 없다고 하는 것도 틀리다. 자동 choice PASS와 이 차이를 함께 남긴다.

## ERROR, 실행기 수정과 증거 보존

Claude evd-07은 `modelUsage={}`이고 모델 식별값을 제공하지 않았다. 응답과 교차 심판
3개 PASS는 있으나 유효 판정은 ERROR다. 실제 모델 변경이나 토큰 0/청구 0으로 해석하지 않는다.
[원인 분류·원문 위치·사용자 승인·수정 범위](rc8-development-model-metadata-error-2026-10-16.md).

원래 lock 아래 ChatGPT 18건/Claude 4건을 먼저 보존·검증한 뒤, 사용자 추가 승인을 받아
실행기만 수정했다. ERROR를 다시 채점하지 않고 명시한 미실행 건만 고른다. 원래 C 엔진과
호출/프롬프트/심판 기준은 그대로다. canonical case key와 기존 원문 바이트는 동일하다.
완료된 PASS/FAIL은 새 lock에서도 재실행하지 않았다.

- 원래 ChatGPT 실행: `ce3b7e396798a13245578ea34524f243053d8c642256eb491d6ccda06d0a58c8`
- 원래 Claude 실행: `3c104fb6772200cc4685cfa8bc2ae6420de8121777a28c1255aa263fd8160086`
- 선택 재개 Claude 실행: `435e29bfcf8047ca2fa6e110e37827aed422bad9df1cf7a502b565dd3c217985`

[연속성 감사와 13건 승인 목록](../evals/reports/rc8-development-2026-10-16/selective-resume-continuity.json).
기존 ChatGPT lock은 수정 전 checkpoint-01에서 검증됐다. 현재 wrapper 바이트가 달라졌으므로
그 lock이 지금도 current-valid라고 표현하지 않는다. 원래 판정/지문은 보존되며 현재 Claude lock은 검증됐다.

실제 로그는 subject 35 + 최초 judge 30 + judge 인용 형식 보정 4 = **69 CLI 호출 기록**이다.
공급자별 ChatGPT 34, Claude 35다. 보정은 frozen 엔진의 잘못된 근거 인용 형식 복구이며
이미 확정된 FAIL을 지우는 별도 진단 회차가 아니다. 원래·보정 심판 로그 모두 보존했다.

- ChatGPT CLI의 `tokens used` 합계: **753,308** (34개 로그).
- Claude 식별값/사용량이 있는 34개 로그: input 126, cache creation 436,984,
  cache read 234,790, output 36,290. 식별값·사용량 누락 1개는 0으로 합산하지 않는다.
- 두 공급자 집계 단위가 달라 합산·동일 청구 토큰으로 비교하지 않는다. 이는 실제 청구액이나
  사용량 증가분의 단독 귀속을 증명하지 않는다. Claude 남은 계정 한도는 확인되지 않았다.

[현재 전체 감사 JSON](../evals/reports/rc8-development-2026-10-16/checkpoint-02.json)은 원문·심판 이유·C 비교·
사용량 로그·보존 파일별 SHA를 포함한다. `raw-attempts-checkpoint-01.tar.gz`와
`raw-attempts-checkpoint-02.tar.gz`에 원본 stdout/stderr·체크포인트·응답을 보존했다.
기존 증거를 덮어쓰지 않았다.

## 다음 재개 위치와 승인 경계

Claude에서 미실행 6건만 남은 승인 분량이다:

1. var-debrief-round-unprovided
2. var-debrief-speaker-candidate
3. var-debrief-speaker-interviewer
4. var-positioning-health-admin
5. var-positioning-support-role
6. var-resume-accounting-support

subject 9 + 교차 judge 6 = **최소 15호출**이며 추가 인용 보정은 늘어날 수 있다.
C 평균 기반 잔여 계획은 Claude 약 285,615토큰 (20% 여유 342,738),
ChatGPT 약 51,174토큰 (20% 여유 61,409)이다. 한도 퍼센트나 고정 요금의 보장이 아니다.
[기계 재개 기록](../evals/reports/rc8-development-2026-10-16/resume-state.json).
사용량 초기화를 확인한 뒤 같은 후보/새 Claude lock/원래 canonical ledger에서 이 6개만
선택한다. 이는 기존 승인 회차의 미실행분이며 추가 진단 회차가 아니다.

격리된 evd-07 1건의 subject 재생성은 승인받지 않았고 실행하지 않았다. 6건이 끝나도 이
ERROR는 남을 수 있다. 별도 승인 없이 응답 삭제·모델 식별값 대입·재채점으로 PASS를 만들지 않는다.

**D/F, 홀드아웃, 후보 수정, main 병합·푸시·태그·릴리스는 하지 않았다.** VERSION/README의
rc.7 안내도 유지했다. G3/D 진행이나 최종 평가 승인을 요청하는 상태가 아니다. 먼저 이 개발
진단의 미실행분과 ERROR 처리 판단을 마쳐야 한다. 실제 실패는 이번 후보에서 고치지 않았다.
