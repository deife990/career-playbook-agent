# rc.8 시도 마감 — 2026-10-19

**결론: rc.8은 출시하지 않는다. 공개 버전은 평가를 마친 1.2.0-rc.7(`0f45d34`)로 한다.**
이 브랜치(`rc8-attempt`)는 이후 작업을 위한 기록과 도구를 보존한다.

## 무엇을 확인했나

| 대상 | Claude `bare-action-resume` | 설정 |
|---|---|---|
| rc.7 (`0f45d34`) | 3/3 PASS (10-16 C 기준) + 2/2 PASS (10-19, 새 CLI) | claude-sonnet-4-6, thinking 0, 심판 gpt-5.6-sol |
| rc.8 후보 (E 압축 + 복사 문장 점검) | 0/3 FAIL | 같음 |
| rc8-rev1 (rc.7 진입 문구 복원 + 추가분) | 1/3 PASS | 같음 |

- rc.8 실패 문장은 E단계에서 진입부 → Examples로 옮긴 rc.7 가드와 정확히 대응한다
  ("12 operational tests", "defects identified during testing").
- rev1은 일부 회복했지만 rc.7 수준이라고 할 근거가 없다. 남은 원인(복사 문장 점검 계약,
  추가 문장)을 분리하려면 반복 수정·확인이 필요하고, 계정 사용 한도 때문에 비용이 크다.
- rc.8 최종 C는 ChatGPT 23/130(실패 0), Claude 16/130(실패 4)에서 중단했다. 완료 평가가 아니다.
- 표본이 작다(n=2~5). 원인 판단은 실패 문장과 제거된 가드의 일치에 기대고 있다.

## 교훈

1. **진입부의 구체적 금지 문장을 일반 원칙으로 압축하면 Claude가 그 규칙을 놓친다.** 사례 규칙이
   많아 보여도 실제 실패에서 나온 것이면 진입부에 그대로 둔다. 압축은 별도 후보로, 해당
   시나리오를 먼저 확인한 뒤에만 한다.
2. **변경은 하나씩 더하고, 관련 시나리오를 바로 3회 확인한다.** 여러 변경을 묶어 큰 평가로
   확인하면 원인을 분리할 수 없다.
3. **평가 CLI가 업데이트되면 기본 모델과 생각(thinking) 설정이 조용히 바뀐다.** 10-18에 Codex
   0.146.0→0.160.1(gpt-5.6-sol→gpt-6.1-sol), Claude CLI(claude-sonnet-4-6→claude-sonnet-5,
   haiku 보조 호출, thinking 켜짐)를 관측했다. 평가 전에 `evals/tools/rc8/pin-bin/`으로
   모델과 설정을 고정하고, 판정마다 관측 모델과 thinkingTokens·reasoning effort를 확인한다.
4. **사용 한도가 실제 병목이다.** 두 플랫폼 병렬 실행은 Claude 세션 한도에 9분 만에 닿았다.
   전체 C(260판정)는 여러 날이 걸린다고 보고 계획한다.

## 보존한 것

- `evals/tools/rc8/rc8_final_runner.py` — 동결 엔진 `run_case`를 그대로 호출하고 모델·설정 검증,
  중단 규칙, 격리·재분류, 무결성 확인, 마감 시각을 더한 실행기
- `evals/tools/rc8/pin-bin/{codex,claude}` — rc.7 기준 모델·설정 고정 래퍼
- `evals/reports/rc8-attempt-2026-10-19/` — 최종 C 진행분, rc.7 진단, rev1 빠른 확인 결과
- `evals/reports/rc8-rev1-2026-10-19.json`, `evals/reports/rc8-release-2026-10-17/opus-resume-audit-2026-10-18.json`
- rev1 원본 변경(`core/`, `adapters/`, 예산·테스트 갱신) — 이 브랜치에만 있다

## rc.8에서 다시 가져올 만한 것

절차 계약 보강(질문 중단 처리, 검토 등급 4개 명시, 연봉 숫자 칸 결정 절차, 복기 필드 출처)은
개발 진단에서 효과가 보였다. 다음 버전에서 rc.7 진입 문구를 그대로 둔 채 하나씩 추가하고,
각각 해당 시나리오를 3회 확인한 뒤 전체 평가로 간다.

`dist/releases/_superseded/`의 `RC8-CANDIDATE-NOT-RC7__*` ZIP은 rc.8 후보를 rc.7 이름으로 빌드한
파일이다. 배포하지 않는다. 실제 rc.7 ZIP은 `dist/distribution/v1.2.0-rc.7/`에 있고 평가 패키지와
지문이 일치한다(ChatGPT `93ebecbd…`, Claude `ac4ef67b…`).
