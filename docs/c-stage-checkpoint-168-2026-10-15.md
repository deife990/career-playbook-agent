# C 기준 평가 체크포인트 — 168/260, 2026-10-15

C는 **미완료**다. 이번 재개 구간에서 30회가 추가 완료됐으며 모두 PASS다.
ChatGPT 87/130, Claude 81/130이 완료됐다. 미해결 ERROR는 0건이고 기존 Claude 자동 FAIL
8건은 그대로다. 패키지·suite·protocol 지문과 이전 완료 판정 보존 감사는 모두 통과했다.
하네스, 동결된 평가 입력, 런타임 패키지는 변경하지 않았다. D/E/F도 실행하지 않았다.

## 현재 결과

통과율의 분모는 완료된 반복 수다. 전체 계획 대비 완료 수도 별도로 표기한다.

| 플랫폼 | 등급 | 완료 / 계획 | PASS | FAIL | ERROR | 완료분 통과율 |
|---|---|---:|---:|---:|---:|---:|
| ChatGPT | critical | 81 / 123 | 81 | 0 | 0 | 100% |
| ChatGPT | standard | 6 / 7 | 6 | 0 | 0 | 100% |
| Claude | critical | 75 / 123 | 68 | 7 | 0 | 90.67% |
| Claude | standard | 6 / 7 | 5 | 1 | 0 | 83.33% |

critical은 3회와 교차 플랫폼 심판, standard는 1회와 기존 동일 플랫폼 심판이다.
컨텍스트는 preloaded이므로 자율 참조 탐색은 검증하지 않는다. 확인된 모델은
`gpt-5.6-sol`, `claude-sonnet-4-6`이다. 이전 Claude EVD-01 반복 1의 subject 모델/사용량
메타데이터는 제공되지 않았고 UNAVAILABLE로 유지한다. 0소비로 간주하지 않는다.

## 보존된 실패와 심판 이견

모두 Claude의 자동 FAIL이다. 원래 판정을 수동 PASS로 바꾸지 않았으며 재실행하지 않는다.

| 시나리오 / 반복 | 직접 검토 |
|---|---|
| concise-second-opportunity / 2 | 실제 과장: 확인되지 않은 데이터 기반 분석 역량을 포지셔닝에 추가. |
| concise-second-opportunity / 3 | 실제 과장: supportable thesis에 structured thinking을 추가. 심판이 인용한 INFERENCE 문장만으로는 근거가 약하므로 전체 문맥과 별도 결정적 문구를 병기. |
| debrief-first / 3 | 심판의 발화자 단정에 이견. 별도로 원문에 없는 면접 라운드를 confirmed로 만든 실제 문제도 있으나, 이를 원래 심판 근거와 바꿔치기하지 않음. |
| discovery-unknown-table / 2 | scope: 근거 없는 원격 공고 다수 존재 주장은 실제 실패. cells: 확인 필요라는 표현을 Unknown 위반으로 본 심판 근거는 논쟁적; Gap으로 승격한 것이 명확하지 않음. |
| evd-01-existing-sufficient / 1 | 실제 반복 수집 실패: 이미 충분한 확인 행동과 질문 중단 요청이 있는데 결과 질문을 다시 요구. |
| evd-07-privacy / 3 | 실제 결과 과장: 확인되지 않은 성공적 인도라는 대체 결과를 제안. |
| evd-14-confidentiality / 1, 3 | 실제 행동·범위 과장: 일정 조율 사실에 scheduling conflicts 해결과 global stakeholders를 추가. Alpha 정보의 Beta 전이는 차단했지만 초안의 추가 행동은 뒷받침되지 않음. |

원본 규칙 위치, 응답 전문과 심판 근거는 [초기 직접 검토](c-stage-pre-resume-review.md),
[최근 실패 검토](../evals/reports/c-stage-resume-audit-04-2026-10-15.json),
[현재 전체 감사](../evals/reports/c-stage-resume-audit-07-2026-10-15.json)에 보존했다.
심판 인용 수정 호출은 누적 13회이며 수정 전후 PASS/FAIL 변화는 0건이다. 이는 두 독립
심판의 일치율이 아니다. 처음부터 같은 응답을 두 심판에 병렬 채점한 설계는 아니다.

## 오류 원인과 보존

원래 오류 2건은 Claude 계정 사용량 한도였다. 이후 ChatGPT EVD-04 반복 2/3에는
CLI 연결 재시도 소진이 있었고, ChatGPT EVD-13 반복 3에는 Claude 심판 인용 재시도 중
계정 한도가 있었다. 현재는 모두 복구됐다. 완료 subject는 가능한 경우 재사용했고,
오류 로그와 prior_attempts를 보존했다. 하네스 버그로 확정된 항목은 없으며 수정하지 않았다.

## 남은 실행과 사용량

| 플랫폼 | 남은 반복 (critical / standard) | 남은 subject 호출 | 남은 judge 호출 |
|---|---:|---:|---:|
| ChatGPT | 43 (42 / 1) | 50 | 43 |
| Claude | 49 (48 / 1) | 56 | 49 |

총 92회, 최소 198호출이며 공급자별로 각각 99호출이다. 관측 로그 평균에 기반한 잔여
추정은 ChatGPT 약 193만, Claude 약 256만 토큰, 20% 여유를 포함하면 약 231만/307만이다.
인용 재시도와 오류 복구는 추가 호출이다. CLI 토큰은 한도 단위나 실제 청구액이 아니며,
Claude 캐시 포함 계수와 Codex 합계 계수는 직접 비교할 수 없다.
[표본과 계산](../evals/reports/c-stage-remaining-estimate-168-2026-10-15.json).

마지막 Codex 조회는 5시간 한도 89%, 주간 14% 사용이었다. 초기화 안내는
**2026-10-15 23:51:11 KST**다. Claude 잔여 한도는 확인할 수 없다. 추가 결제와 리셋
크레딧을 사용하지 않는다. 이 시점에는 활성 평가 프로세스가 없으며, 한도를 넘기기 전
안전한 배치 경계에서 대기한다.

현재 대화의 자동 재개 `careerpilot-c`를 설정했다. 시간별 확인에서 안내된 초기화 전에는
모델을 호출하지 않고, 이후에도 사용량 85% 이상이나 공급자 한도 대기 중이면 기다린다.
준비되면 최대 6회씩 같은 `--resume` 기록의 ERROR/누락만 실행한다. FAIL은 재시도하지
않는다. 배치마다 기록과 사용량을 확인한다. 변동 없는 대기는 알리지 않는다.

재개용 실시간 파일은 `work/review-v2/baseline/reports/{chatgpt,claude}.json`이다.
이번 시점의 전체 원문도 별도 불변 체크포인트로 보존했다:
[ChatGPT](../evals/reports/chatgpt-review-v2-baseline-checkpoint-168-2026-10-15.json),
[Claude](../evals/reports/claude-review-v2-baseline-checkpoint-168-2026-10-15.json).

## 이후 경계

양쪽 각각 130회 판정과 ERROR/누락 0건일 때 C 완료를 보고한다. 실제 FAIL이 남은 C 완료는
릴리스 합격을 뜻하지 않는다. E의 기준은 [사후 명확화](e-stage-acceptance-clarification-2026-10-15.md)에
따른 **기존 실제 실패 해결 + 새 실패 0건**이며 원래 사전 기준은 변경하지 않았다.
현재는 실패 수정이나 전용 진입 규칙 추가를 하지 않는다. main 병합, 태그, 푸시,
릴리스 업로드, 브라우저 검증도 하지 않았다.
