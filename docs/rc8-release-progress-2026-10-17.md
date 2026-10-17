# rc.8 출시 진행 — 2026-10-17

새 [출시 방침](rc8-release-policy-2026-10-17.md)은 최종 평가 전에 기록했다. 수정 1회는
`a289342`: 산출물 근거 점검·행동 문장 즉시 제공·연봉 금액 질문 마지막 고정.
테스트 226 PASS, 정적 PASS, 누출 0. 로딩량·파일 수 불변, D/F 제외.

## 2. Claude 빠른 확인 (n=1, 최종 증거 아님)

| 시나리오 | rc.7 C 실패/반복 | 후보 | 실패 단언 |
|---|---:|---|---|
| concise-second-opportunity | 2/3 | FAIL | integrity |
| debrief-first | 1/3 | PASS | — |
| discovery-unknown-table | 1/3 | PASS | — |
| evd-01-existing-sufficient | 1/1 | PASS | — |
| evd-07-privacy | 1/3 | PASS | — |
| evd-14-confidentiality | 2/3 | PASS | — |
| screening-g-no-tools | 1/3 | PASS | — |
| screening-i-comp | 1/3 | PASS | — |
| screening-k-report | 1/3 | FAIL | checks |

빠른 확인의 원문·심판 근거는 [기록](../evals/reports/rc8-release-2026-10-17/quick-summary.json)에 보존한다.
동결 speaker 단언의 의도 추론 금지와 W08의 불확실한 복수 가설 허용은 알려진 평가 이슈다.

빠른 확인은 **7 PASS / 2 FAIL**이다. 두 FAIL은 기존 범위 부풀리기와 리뷰 등급 위반으로,
새 유형의 명백한 악화는 확인되지 않아 최종 C 평가로 진행한다. 연봉 선택 질문/화자 귀속/
대체 초안의 미확인 목적 문제는 자동 PASS와 별개로 남아 있으며 기존 실패 유형이다.
(2026-10-18 재개 시 보존 검토.)

## 3. 최종 C — 2026-10-18 중단, 출시 조건 확인 불가

| 플랫폼 | 유효 판정 / 예정 | PASS | FAIL | 모델 정보 오류 격리 | 미실행 | rc.7 C FAIL |
|---|---:|---:|---:|---:|---:|---:|
| ChatGPT | 15 / 130 | 15 | 0 | 0 | 115 | 0 / 130 |
| Claude | 8 / 130 | 7 | 1 | 1 | 121 | 11 / 130 |

Claude `context-model-roundtrip` 1회차는 자동 PASS지만 원본 `modelUsage={}`이고 토큰
사용량도 모두 0이며 stderr에도 모델 식별값이 없다. 현재 로그로 실제 모델을 확인할 수
없으므로 감사에서 ERROR로 격리했다. 원래 PASS 기록은 수정하지 않았으며 유효 판정에는
세지 않는다. 이웃 응답이나 기본 설정으로 모델을 추정하지 않았고 재생성도 하지 않았다.
동결 엔진의 시나리오 배치가 끝난 뒤 감사에서 발견했으며, 이후 모델 호출은 없다.
사용자 지정의 해결할 수 없는 오류 중단 조건에 따라 중단했다. 할당량 소진이 원인은 아니다
(중단 시 Codex 5시간 40%, 주간 72%; Claude 전체 잔량은 이 기록으로 확인할 수 없음).

Claude `concise-second-opportunity` 2회차의 FAIL은 실제 범위 부풀리기다. 확인된 테스트·보고
행동을 "체계적인 검토·보고 작업 경험"과 "데이터 기반" 포지셔닝으로 확장했다.
기존 C와 같은 `integrity` 실패이며, `core/principles/evidence-policy.md` 및
`core/artifacts/candidate-strategy.md`의 근거 범위/출력 전 점검 계약 위반이다. 완료된 항목에
새 실패 단언은 없지만, 미실행 236건이 있어 전체의 새 실패 유형 부재나 개선을 확정할 수 없다.

[감사·양쪽 원본 판정](../evals/reports/rc8-release-2026-10-17/final-interruption-2026-10-18.json) ·
[214개 원본 파일의 지문](../evals/reports/rc8-release-2026-10-17/final-raw-manifest-2026-10-18.json) ·
[원본 로그·실행기 보존본](../evals/reports/rc8-release-2026-10-17/final-raw-2026-10-18.tar.gz).
패키지/평가 입력/프로토콜/로드한 파일 지문과 기존 체크포인트 5개의 보존을 확인했고,
압축 보존본의 모든 원본 파일도 지문이 일치한다. 완료 PASS/FAIL 재실행은 0건이다.

**출시 조건은 아직 충족을 입증하지 못했다.** 홀드아웃 호출, rc.8 버전 변경과 ZIP 제작은
하지 않았다. README/VERSION은 rc.7 유지. D/F, 기존 개발 evd-07 재생성, 브라우저,
main 병합/푸시/태그/업로드, 추가 결제/리셋/자동화도 하지 않았다.
