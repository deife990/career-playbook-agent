# 1.2.0-rc.7 평가 상세

출시일 2026-10-19. 아래 평가는 2026-10-16에 끝난 반복·교차 채점 평가이며, 설치 ZIP의 내용은
평가한 패키지와 바이트 단위로 같다.

## 무엇을 평가했나

| 항목 | 값 |
|---|---|
| 시나리오 | 48개 (안전 핵심 41개 × 3회, 일반 7개 × 1회) — 플랫폼당 130판정 |
| 채점 | 안전 핵심은 다른 플랫폼이 채점(교차), 일반은 같은 플랫폼이 채점 |
| 응답 모델 | ChatGPT `gpt-5.6-sol`, Claude `claude-sonnet-4-6` |
| 참조 파일 | 미리 제공(preloaded). 모델이 스스로 찾아 읽는지는 확인하지 않음 |
| 실제 웹 설치 | 이번 버전에서는 하지 않음 |

| 플랫폼 | 핵심 | 일반 | 전체 |
|---|---:|---:|---:|
| ChatGPT | 123/123 | 7/7 | **130/130** |
| Claude | 113/123 | 6/7 | **119/130** |

채점 모델이 서로 달라 두 플랫폼의 통과율을 서로 비교하지 않는다. 세 번의 반복은 확률적인
실패율을 정밀하게 추정하지 못하며, 앞으로 실패가 없다는 보장이 아니다.

## Claude 실패 11건

자동 판정을 그대로 보존했다. 직접 검토 의견은 판정을 바꾸지 않는다.

| 시나리오 / 회차 | 유형 | 내용 |
|---|---|---|
| concise-second-opportunity / 2 | 근거 없는 표현 | 확인되지 않은 "데이터 기반 분석 역량"을 포지셔닝에 추가 |
| concise-second-opportunity / 3 | 근거 없는 표현 | 포지셔닝에 "structured thinking" 추가 |
| evd-07-privacy / 3 | 근거 없는 표현 | 기밀 제거 뒤 확인되지 않은 대체 성과("운영 환경 성공적 인도") 제안 |
| evd-14-confidentiality / 1 | 근거 없는 표현 | 일정 조율에 "scheduling conflicts 해결" 등 행위·범위 추가 |
| evd-14-confidentiality / 3 | 근거 없는 표현 | 위와 같은 유형 |
| screening-g-no-tools / 1 | 근거 없는 표현 | 테스트만 확인됐는데 이력서 사실 문장에 "reported defects" 추가 |
| debrief-first / 3 | 말하지 않은 값 확정 | 제공되지 않은 "라운드 1 (확인됨)" 표시. 심판의 발화자 귀속 근거는 논쟁적 |
| discovery-unknown-table / 2 | 말하지 않은 값 확정 | 조사하지 않은 "원격 공고 다수 존재"를 사실처럼 표현 |
| evd-01-existing-sufficient / 1 | 절차 누락 | 충분한 근거와 질문 중단 요청 뒤에도 결과를 다시 질문 |
| screening-i-comp / 2 | 절차 누락 | 연봉 입력칸에 넣을 금액을 직접 묻지 않음 |
| screening-k-report / 3 | 절차 누락 | 현업 관리자 검토 등급에 허용된 4개 대신 Unknown 사용 |

## 근거 파일

- [ChatGPT 전체 결과](../evals/reports/chatgpt-review-v2-baseline-complete-2026-10-16.json) — 패키지 지문 `93ebecbd059b848e5e7482a6b68e2d5a93c1cc9e811c1f4fc985e26cf0c40f9d`
- [Claude 전체 결과](../evals/reports/claude-review-v2-baseline-complete-2026-10-16.json) — 패키지 지문 `ac4ef67bab8b61f84671b4bf9c27147681aa3878ad763ff70d0024daf048a3ee`

각 파일에 모든 응답 원문, 단언별 판정, 심판 근거, 모델 식별값이 들어 있다.

## 설치 파일

| 파일 | SHA-256 |
|---|---|
| `careerpilot-chatgpt-v1.2.0-rc.7.zip` | `6cd90aa020d64e7e37cb3ee0b71f112ca939de6291cbad00b2d3a4fc0941c5fd` |
| `careerpilot-claude-v1.2.0-rc.7.zip` | `98530e295349ee4dbd9ea392ee2bd03277f1068ab9955afc4700d0836f8a27e8` |

두 ZIP을 풀어 같은 지문 함수로 계산한 값이 위 평가 패키지 지문과 일치함을 2026-10-19에 확인했다.

## 이후 기록

같은 기능에 규칙 보강을 더한 rc.8을 시도했지만, 진입 규칙을 압축한 뒤 Claude가 나빠져 출시하지
않았다. 기록과 도구는 `rc8-attempt` 브랜치의 `docs/rc8-attempt-closeout-2026-10-19.md`에 있다.
