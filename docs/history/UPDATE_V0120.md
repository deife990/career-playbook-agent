# v0.12.0 — 튜토리얼·실습 UI 개편

2026-10-24 · 1차(공통 패널·튜토리얼), 2차(E03Actual 실습 연동 Phase 1) 구현 완료.

실행: http://127.0.0.1:8774/?v=0.12.0

화면 갤러리: http://127.0.0.1:8774/review/v0120/

## ID별 결과

확인 크기 **4종**: 1280×720 / 800×450 / 600×800 / 375×812. 아래의 모바일 검수는 격리 Chromium의 창 크기 검사이며 실기기 결과와 구분합니다.

| ID | 변경 파일 | 확인 크기 | 결과 · 남은 문제 |
|---|---|---|---|
| 1–3 · 공통 패널·튜토리얼 | `guide-panel.js`, `guide-panel.css`, `linear-tutorial.js`, `index.html` | 4종 | 오른쪽 40% / 하단 45% 패널, 단일 4구간 진행 표시, 원본 캡처·복사·가상 채팅. 2차 뒤 설치→첫 질문 회귀 검사 통과. |
| 4-1 · 공통 실행 경로 | **신규** `ai-handoff.js`, `request-data.js`, `cards.js` | 4종 + 경로 표 | 복사 프로미스 시작→빈 탭 예약→opener 분리→복사 결과 대기→주소 이동→저장. 복사 실패해도 탭 유지. 요청은 고정 허용 목록에서만 선택. 일반 사용자 Chrome 권한 설정은 미확인. |
| 4-2 · E03Actual 대기 | `story.js`, `game.js`, **신규** `practice-ui.js` | 4종 | 진입 시 ready 저장, 서비스 이름을 반영한 서안 대사. 대사 클릭·Space·Enter·advance로 우회 진행 불가. E03Actual의 구버전 대사 인덱스 0 보존. |
| 4-3 · 네 실습 화면 | `practice-ui.js`, `guide-panel.js`, `guide-panel.css` | 4종 | 제안 / 실습 중 / 다녀온 뒤 / 새 탭 차단. 실패 화면의 실제 서비스 링크는 푸터 주 동작으로 고정. 큰 창의 제안 카드 352px·여백 24px. 작은 창 실습 중에는 접힌 카드가 기본이고 펼침·접기 가능. 800×450은 본문 스크롤 필요. |
| 4-4 · 상태·복귀·저장 | `practice-ui.js`, `ai-handoff.js`, `game.js` | 4종 + 새로고침 | 여섯 상태 저장, launching은 화면 상태로만 사용. hidden→visible·pageshow 복귀 처리, external_opened 저장은 이어하기 시 returned로 복원. 직접 완료/건너뛰기를 골라야 E04 이동. 구버전 저장 필드 누락 허용. |
| 4-5 · 내 준비·맛보기·엔딩 | `review-ui.js`, `game.js`, `cards.js` | 기존 패널 + 실습 4종 | 첫 요청·다른 요청·전문 카드·맛보기·엔딩이 CP_HANDOFF.launch 사용. 예전 return-report는 표시하지 않고 실습 복귀 화면으로 통합. 스토리 밖 요청 열기는 이야기 위치를 바꾸지 않음. |

## 변경 파일 목록

2차 신규: `ai-handoff.js`, `practice-ui.js`, `checks/v0120/handoff.cjs`, `checks/v0120/practice.cjs`.

2차 수정: `game.js`, `story.js`, `request-data.js`, `cards.js`, `review-ui.js`, `guide-panel.js`, `guide-panel.css`, `index.html`, `README.md`, 이 보고서, `checks/v0120/save-compat.cjs`, `checks/v0120/interaction.cjs`, `review/v0120/index.html` 및 검수 결과·화면.

설치 ZIP·provenance, 설치 경로 안내 배열, 기존 요청 원문, 타이틀 4인 이미지, 기존 저장 단축키는 변경하지 않았습니다. 스토리는 E03Actual의 안내 한 줄만 서안의 실습 제안으로 바꿨고, 해당 라벨의 구버전 대사 위치를 보존했습니다.

## 테스트 결과

- `checks/v0120/handoff.cjs`: 순수 resolve 표 11개 통과. Windows/Mac/Linux, 작은 데스크톱 창, iPhone, iPad 데스크톱 UA, Android, 기본값·기능 플래그 확인. 잘못된 저장 상태/요청/서비스 거부.
- `checks/v0120/practice.cjs`: 두 서비스 목적지, 복사 시작 후 탭 열기 순서, opener=null, 복귀→다녀온 뒤→완료→E04, returned 새로고침, external_opened 새로고침, 복사 거부 시 탭 유지·문장 전체 선택, 차단 모의 후 실제 대체 링크 클릭, 설치 도움말 후 ready 복원, 예시 이동, 건너뛰기, 내 준비의 다른 요청·전문 카드·맛보기·엔딩 요청 실행 통과. 기능 플래그의 sessionStorage 유지와 허용 목록 검사 통과.
- 네 크기에서 실습 4화면 + 작은 창 접힌 카드 검수. 가로 넘침 없음, 안내 글자 14px 이상, 주 버튼 50px/58px 이상, 작은 창 패널 45% 이하. 일반 실습 화면 3종의 주 버튼 좌표 이동 0px. **넓은 창의 ready는 명세대로 별도의 352px 구석 카드이므로 좌표 비교에서 제외**했습니다.
- `checks/v0120/layout.cjs`: 1차 튜토리얼 128개 화면 관측 회귀 검사. 설치·첫 질문의 단일 진행 표시와 주 버튼 좌표 유지.
- `checks/v0120/save-compat.cjs`: 1차 때 보관한 v0.11.9 실행 구조의 실제 저장 픽스처 2개(설치 중간·E03 직전) 복원·재저장. 추가로 이전 E03Actual의 인덱스 0 형태를 재현한 저장에서 ready 기본값 복원. 완료/건너뛰기를 저장한 직후 중단된 경우에도 새로고침 후 E04 복구 통과.
- `checks/source-check.cjs`: 보호 대사 25개, 선택지 9개, 주인공 대사 46개, 라벨 61개, 요청 원문, 설치 ZIP 2개의 SHA-256 검사 통과.

테스트 결과: `review/v0120/handoff.json`, `practice.json`, `layout.json`, `save-compat.json`, `source-check.json`. 1차의 복사·모션·다운로드 검사 결과는 `interaction.json`, ChatGPT 설치 화면 결과는 `chatgpt.json`에 있습니다.

외부 서비스 페이지는 격리 테스트에서 고정 응답으로 대체했습니다. **실제 AI 상담이나 설치 성공을 테스트한 결과는 아닙니다.** 복귀 이벤트와 팝업 차단은 결정적으로 재현해 처리 경로를 검사했습니다. 사용자의 일반 브라우저 저장·계정에는 접근하지 않았습니다.

## 기능 플래그와 범위

- 기본: `HANDOFF_STANDARD_WEB=on`, `HANDOFF_CLAUDE_DESKTOP=on`(데스크톱 OS·Claude에서만 보조 링크 노출).
- 테스터 예: `?ff=HANDOFF_STANDARD_WEB=off,HANDOFF_CLAUDE_DESKTOP=off`. 같은 탭의 sessionStorage에만 유지합니다. 지원하지 않는 기능 플래그는 활성화하지 않습니다.
- 작은 창이어도 데스크톱 OS면 수동 앱 링크를 표시할 수 있습니다. 창 폭만으로 앱 실행을 자동 선택하지 않습니다.
- 서비스 웹 URL은 ai-handoff.js의 고정 표에서만 선택합니다. Claude의 수동 데스크톱 앱 링크에만 명세의 q 요청을 넣으며, 웹 URL에는 요청을 미리 채우지 않습니다.
- AI 대화 내용을 읽거나 저장하는 기능, 자동 전송, 관계 점수·보상 연동, 계측, Split View 확장, MCP App, State Capsule은 없습니다.

## 확인하지 못한 것

| 환경 / 항목 | 결과 |
|---|---|
| 격리 Playwright Chromium · 네 창 크기와 모의 예외 상황 | PASS |
| iOS Safari 실기기 | NOT VERIFIED |
| Android Chrome 실기기 | NOT VERIFIED |
| 빈 탭 / 대체 링크가 ChatGPT·Claude 모바일 앱을 여는지 | NOT VERIFIED |
| Claude 수동 데스크톱 링크의 실제 앱 실행 | NOT VERIFIED |
| 일반 Chrome 창의 실제 클립보드·팝업 권한 조합 | NOT VERIFIED |
| 실제 서비스 로그인·설치·첫 질문 결과 | NOT VERIFIED · 게임은 대화를 읽지 않음 |
