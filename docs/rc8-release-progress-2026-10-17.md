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
