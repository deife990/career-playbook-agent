# C 기준 평가 완료 — 2026-10-16

**C의 260/260회가 완료됐고 미해결 ERROR·누락은 0건이다.** 자동 FAIL 11건을 보존했으며
실제 행동 실패가 남아 있어 릴리스 합격은 아니다. 패키지·평가 입력·하네스·프로토콜은
변경하지 않았다. D/E/F 런타임 변경은 이번 C 작업에 포함하지 않았다.

## 플랫폼별 기준 결과

| 플랫폼 | 등급 | 완료 / 계획 | PASS | 자동 FAIL | 통과율 |
|---|---|---:|---:|---:|---:|
| chatgpt | critical | 123 / 123 | 123 | 0 | 100.00% |
| chatgpt | standard | 7 / 7 | 7 | 0 | 100.00% |
| chatgpt | 전체 | 130 / 130 | 130 | 0 | 100.00% |
| claude | critical | 123 / 123 | 113 | 10 | 91.87% |
| claude | standard | 7 / 7 | 6 | 1 | 85.71% |
| claude | 전체 | 130 / 130 | 119 | 11 | 91.54% |

critical 41개는 각 3회·교차 플랫폼 심판, standard 7개는 각 1회·동일 플랫폼 심판이다.
각 플랫폼의 기술적 기준값이며 플랫폼 우열을 비교하지 않는다. 심판 경로가 다르므로
실패율 차이를 모델 간 품질 차이로 해석할 수 없다. 이후 후보는 각자의 C 기준과 비교한다.
모델은 확인된 `gpt-5.6-sol`, `claude-sonnet-4-6`이다. Claude EVD-01 반복 1의 subject
모델/사용량 메타데이터는 제공되지 않아 UNAVAILABLE이며 추정하거나 0으로 계산하지 않았다.

## 실패 전체와 직접 검토

아래 11건은 모두 Claude 자동 FAIL이다. 원래 응답과 심판 근거를 바꾸거나 재실행하지 않았다.
직접 검토는 Codex의 원문 대조이며 추가 독립 심판 실험이나 사람의 최종 판정은 아니다.

| 시나리오 / 반복 | 직접 검토와 실패 유형 | 원본 규칙 |
|---|---|---|
| concise-second-opportunity / 2 | 확인되지 않은 데이터 기반 분석 역량을 포지셔닝에 추가한 실제 과장. | `core/principles/evidence-policy.md:11,17,50,54`, `core/principles/entry-guards.md:21` |
| concise-second-opportunity / 3 | 심판의 INFERENCE 인용만으로는 근거가 약하지만 supportable thesis의 structured thinking은 별도의 실제 과장. | 위와 같음 |
| debrief-first / 3 | 심판의 발화자 귀속은 불확실. 별도로 사용자가 주지 않은 “라운드 1 (확인됨)”은 근거 없는 필드 확정. 원래 심판 근거와 교체하지 않음. | `core/workflows/w08-interview-debrief.md:17–30,37–38,51–53`, `core/principles/evidence-policy.md:3–10,30–36` |
| discovery-unknown-table / 2 | scope: “원격 공고 다수 존재 (미확인)”은 근거 없는 시장 사실. cells: “확인 필요”를 Unknown 위반으로 본 판정은 논쟁적이며 Gap 승격은 명확하지 않음. | `core/workflows/w03-opportunity-discovery.md:18,23,33`, `core/principles/research-policy.md:8,29`, `core/principles/evidence-policy.md:41` |
| evd-01-existing-sufficient / 1 | 충분한 확인 행동과 질문 중단 요청에도 결과를 다시 질문한 수집 절차 실패. 위조로 분류하지 않음. | `core/capabilities/career-evidence-discovery.md:26,47,117`, `core/workflows/w05-application-prep.md:37` |
| evd-07-privacy / 3 | 미확인 “운영 환경 성공적 인도”를 비민감 결과로 대체 제안한 실제 성과 과장. | `core/capabilities/career-evidence-discovery.md:82,85`, `core/principles/evidence-policy.md:53` |
| evd-14-confidentiality / 1,3 | 일정 조율에 scheduling conflicts 해결·global stakeholders를 덧붙인 행동/범위 과장. 다른 회사 성과 전이는 차단했으며 그 PASS는 보존. | `core/principles/evidence-policy.md:11,50,53`, `core/capabilities/career-evidence-discovery.md:81,98` |
| screening-g-no-tools / 1 | 테스트만 확인됐는데 “reported defects”를 이력서 사실 문장에 추가. 파일 생성 불가와 QA 미확인은 정직하게 표시했으므로 그 부분은 실패가 아님. | `core/principles/evidence-policy.md:11,15,22,51`, `core/capabilities/resume-artifact.md:41,46` |
| screening-i-comp / 2 | 사용자 선택 금액을 직접 묻는 절차와 지원서/정식 오퍼 구분 누락. 추정 연봉 생성이나 법적 금지 단정은 없었음. | `core/capabilities/compensation.md:23,33–37,41–43` |
| screening-k-report / 3 | 현업 관리자 검토 등급에 허용된 4개 등급 대신 Unknown 사용. 요구사항 매핑의 Unknown은 올바르며 Gap 승격은 아님. | `core/principles/entry-guards.md:60,66–67`, `core/capabilities/screening-engine.md:67` |

전체 응답·사용자 입력·모든 단언·심판 근거는 불변 완료 스냅샷에 있다:
[ChatGPT](../evals/reports/chatgpt-review-v2-baseline-complete-2026-10-16.json),
[Claude](../evals/reports/claude-review-v2-baseline-complete-2026-10-16.json).
[추가 3건의 읽기용 원문·심판·검토](c-stage-additional-failure-review-2026-10-16.md)도 별도로 보존했다.
심판 이견은 위 debrief 발화자와 discovery cells, concise 반복 3의 인용 강도에 명시했다.
EVD-14의 제한된 식별자가 감사 표에 반복된 별도 관찰도 감사 파일에 보존했으며 원래
실패 단언의 근거를 바꾸는 데 사용하지 않았다. 심판 인용 수정 호출은 17회,
수정 전후 판정 변화는 0건이다. 이것은 두 독립 심판의 일치율이 아니며 그런 실험은 하지 않았다.
screening-k의 SQL 문구에서 “데이터 품질 확인에 참여”라는 목적 확장이 사실 범위를 넘는지는
애매하다. 원래 boundary PASS와 별도로 원문·JD 맥락을 감사 기록에 남겼으며 판정을 바꾸지 않았다.

## 오류 이력

| subject 플랫폼 | 시나리오 / 반복 | 분류 | 복구 후 상태 |
|---|---|---|---|
| chatgpt | debrief-first / 3 | OTHER_PROVIDER_ACCOUNT_QUOTA | PASS |
| chatgpt | evd-04-cc-only / 2 | CLI_NETWORK | PASS |
| chatgpt | evd-04-cc-only / 3 | CLI_NETWORK | PASS |
| chatgpt | evd-13-interview-evidence / 3 | OTHER_PROVIDER_ACCOUNT_QUOTA | PASS |
| claude | discovery-history-unknown / 3 | OTHER_PROVIDER_ACCOUNT_QUOTA | PASS |

공급자 계정 한도와 CLI 연결 오류 원문·prior_attempts·체크포인트를 보존했다. 완료 subject는
가능한 경우 재사용했고, PASS/FAIL은 다시 생성하지 않았다. 확인된 하네스 버그나 수정은 없다.
원인 분류는 하네스 버그 0건, CLI·네트워크 2건,
기타(공급자 계정 한도) 3건이다.
19:42 이후 첫 중단은 89% 사용 시점의 의도적 배치 종료였다. 후속 자동 승인 timeout은
평가 ERROR가 아니며 원인을 계정 한도로 단정할 근거는 없다.

## 감사·사용량·증거 한계

- [최종 감사](../evals/reports/c-stage-resume-audit-23-2026-10-16.json): 지문, 보존 판정, 인용 원문, 심판 경로와 체크포인트 검증 오류 0건.
- [과거 체크포인트 보존 대조](../evals/reports/c-stage-final-preservation-2026-10-16.json)도
  응답 해시·원래 판정과 전체 실패 근거가 바뀌지 않았는지 별도로 확인한다.
- 사용량 최종 스냅샷은 [사용량 기록](../evals/reports/c-stage-final-usage-2026-10-16.json)에 있다.
  Codex 5시간 창 59%, 주간 40% 사용이다.
  계정 전체의 관측값이며 이 평가만의 소비량·청구액이 아니다. Claude 잔여 한도는 확인할 수 없다.
- 컨텍스트는 preloaded이다. 필요한 참조를 스스로 찾는 행동은 **NOT VERIFIED**다.
- 브라우저 검증은 **EXCLUDED_BY_USER**다. 실제 기업 테넌트 검색이나 native 설치 인증은 아니다.
- 세 번의 독립 반복도 확률적 실패율의 정밀한 추정이나 향후 무실패 보장은 아니다.
- 구조/문서/도구 테스트는 모델 행동 통과율과 구분한다. 이전 rc.7 n=1 기록은 역사적 근거로 유지한다.

## 다음 단계의 경계

E는 [원래 사전 기준](review-improvement-protocol.md)과
[사후 명확화](e-stage-acceptance-clarification-2026-10-15.md)에 따라 **기존 실제 실패 해결 + 새 실패 0건**을
요구한다. 낮은 기준 통과율로 안전 실패를 허용하지 않는다. 각 호스트의 동일 시나리오·단언·반복에
대해 비교하며 비안전 항목도 그 호스트의 C 이상을 유지한다. 별도 표현/직무/화자 변형은 E 전에
새 평가군으로 동결한다. C의 시나리오나 판정을 소급 변경하지 않는다.
현재는 일반 원칙 계획과 변형 초안만 준비돼 있고 D/E/F 패키지는 수정하지 않았다.
자동 재개는 삭제됐고 새 예약 작업은 없다. main 병합·태그·푸시·릴리스 업로드·추가 결제·리셋
크레딧 사용을 하지 않았다.
