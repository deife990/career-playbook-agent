# 튜토리얼 모듈

게임 안에서 LUAN(구 CareerPilot) 설치·첫 요청·실습을 안내한다. 실제 설치·전송·외부 대화 확인은 하지 않는다.

## 내용(문구) — `src/content/`
| 파일 | 내용 |
|---|---|
| `request-data.js` | `FIRST_REQUEST` 등 복사해 쓰는 요청 문구의 유일한 정의 |
| `tutorial-content.js` | 단계 화면·기록·다시 읽기에 쓰는 창작 예시(실제 AI 응답이 아님) |
| `cards.js` | 준비 카드(요청 묶음) |
| `capture-assets.js` | 실제 서비스 화면 캡처의 잘라내기 좌표(생성 파일: `tools/build-tutorial-images.cjs`) |

## 동작 — `src/tutorial/`
| 파일 | 역할 |
|---|---|
| `tutorial-state.js` | 순수 상태(허용 목록), DOM·엔진 명령 없음 |
| `guide-panel.js` | 튜토리얼 입력을 소유하는 단일 모달(GuidePanel, `CP_GUIDE`) |
| `linear-tutorial.js` | 진입 시 경로 하나 선택, 화면마다 다음 행동 하나 |
| `lesson-ui.js` | 읽기 화면·휴대폰 대화 표현 |
| `install-preview.js` | 설치 과정 미리보기(실제 업로드 없음) |
| `practice-ui.js` | 실습 진입·복귀, 완료는 사용자 자기보고 |
| `ai-handoff.js` | 요청 복사·서비스 열기(작성된 요청만, 외부 탭을 읽지 않음) |
| `tutorial.js` | 단계별 캡처 영역 정의 |

## 재사용 규칙
- 문구는 content, 동작은 tutorial로 나눈다. 같은 요청 문구를 동작 파일에 직접 쓰지 않는다.
- 서비스(ChatGPT/Claude)별 차이는 데이터(`services.ChatGPT[]`, `services.Claude[]`)로 표현하고 분기 코드를 늘리지 않는다.
- 제품 이름이 LUAN으로 바뀌었다. 게임 속 표기 변경은 원고·실행 대본·`request-data.js`를 함께 바꾸고
  `source-check`의 기대 문구도 같이 갱신하는 별도 작업으로 진행한다(현재 게임은 CareerPilot 표기 유지).
- 검사: `checks/v0140/tutorial-flow.cjs`, `checks/v0140/content-state.cjs`, `checks/v0140/handoff.cjs`.
