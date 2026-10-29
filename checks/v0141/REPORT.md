# v0.14.1 장면 QC 수정 결과

2026-10-29 · 로컬 구현. 원격 배포 없음. UI/UX v1.1.1 기준 문서 확인, 확정 시안 폴더 미수정.

## 보존

- 변경 전 루트 소스와 해시: `before-source/`. 기존 미커밋 파일을 덮어 복원하거나 정리하지 않고 그 상태에서 수정했다.
- `story.js`는 바이트 단위 동일: 대사·label·step·선택지 변경 없음. 저장 schema `ep01-script-v12` 유지. ai-handoff.js 미변경. practice-ui.js는 주 버튼을 footer에 옮기는 DOM 배치만 변경.
- 새 이미지 0개. 기존 게이트 원화도 이번 요청에서 교체하지 않았다. 상대 인물 표시 연출 유지.

## 항목별 적용

| 항목 | 변경 및 검수 |
|---|---|
| 1-1 | 첫 등장부터 서안은 동일한 76dvh·하단 기준. 1920에서 Start#15·#16 모두 y259. 300ms 등장 확인. 다리는 화면 하단까지 이어진다. |
| 1-2 | 서안은 나리 입장 전부터 같은 자리(62%)를 유지. 작은 duo 복사본을 없애 같은 engine 스프라이트 사용. 두 인물 동일 76dvh. 입퇴장 시 서안 이동·축소 없음. |
| 1-3 | 단어 기반 pose 추론 삭제. label별 고정 CG. 이서 메시지 시작·종료의 빈 펍 전환 2회는 의도된 화면 역할 전환. |
| 1-4 | E05 전체 seated + #101626 opacity .15 조명. 표정 원화의 한계는 아래에 명시. |
| 1-5 | 실제 방문한 경로에서 show/hide/scene 명령만 재계산. 대사 되돌리기에 함수·선택·실습 실행 없음. Start 초기 cast를 명시적으로 비워 나리 잔류 제거. 저장 복원도 같은 재계산 적용. |
| 1-6 | TutorialStart·TutorRequest·TutorNext·E03까지 close-rear 유지. 새 지문 추가 없음. |
| 1-7 | Start#4에서 회사 공지, #6에서 팀 채팅 즉시 표시. Start#2~#10 주인공 걷기 레이어 유지. |
| 1-8 | 서안·나리·이서 표정 교체는 기존/새 원화 두 레이어 150ms 교차 페이드. 인물 프레임 하단 기준 통일, 이서는 고정 2:3 비율로 크기 재계산 차단. 모션 줄이기에서는 즉시 교체. |
| 1-9 | beatUntil 해제와 다음 대사 진행을 같은 클릭에서 처리. 입력 중 메시지도 클릭을 소비하지 않음. 일반 모션 전체 A 경로에서 추가 클릭 0. |
| 선택 | 1280×720 타이틀 간격 축소, 사무실 말풍선 머리 위 배치, 실습 주 버튼 고정 footer, 600×800 컵 삽입을 얼굴 아래로 이동. |
| 공통 모션 | ui-tokens.css 150/300/450ms와 곡선. ui-motion.js를 통해 JS 연출도 참조. 주요 CSS transition 정리, title-screen/visual-update 모션 줄이기 명시. 소리·진동 리듬의 지연이나 입력 중 시간은 연출 길이 토큰과 별도로 보존. |

## 실제 검수 범위

- Playwright Chromium, 실제 viewport 1920×1080·1440×900. A/B/C 각 동일 문자 분기를 끝까지 한 줄씩 진행. A 경로 일반 모션, A/B/C 모션 줄이기 검사. 선택 조합 27개 전수 검사는 아님.
- A: 텍스트 164 + 선택 5 = 169 화면, B: 168 + 5 = 173, C: 171 + 5 = 176. 사용자 QC의 168줄과 계수 방식/선택 경로가 다르므로 동일 줄 수로 간주하지 않았다. 시작 인사는 Opening부터, Finish까지 기록했다. 사용 예시 본문은 별도 튜토리얼 회귀 검사로 확인.
- 각 대사별 이미지 파일·x/y/폭/높이: `output/{after,normal,branchB,branchC}/*.json`. 총 8회 전체 경로. 이 기록에서 연속 표시 중인 같은 스프라이트 좌표가 50px 초과 이동한 경우 0, 추가 클릭 0, JS 오류 0.
- Start·E01·E02·E05Messages에서 5줄 진행 후 5줄 되돌리기: 두 크기 모두 이미지·위치·알림·메시지 내용 동일. 함수와 선택을 넘겨 실행하지 않는다.
- Start#15에 나리가 잘못 포함된 저장을 불러오는 추가 검사도 통과: 나리 제거·step 유지(`output/stale-cast-save.json`).
- 기존 save-compat 검사 통과: v8/v9/v10/v11 저장의 변환·복원, 설치/실습/튜토리얼 상태 유지. 튜토리얼·practice·message-alignment 기존 회귀도 통과.
- 작은 화면: 1280×720, 600×800, 390×844, 320×667, 800×450. 타이틀 버튼 도달과 실습 주 버튼의 화면 내 표시 자동 확인, 사무실·컵은 캡처도 확인.
- `output/comparison.html`: 두 기본 해상도의 각 장면 전후 비교. `output/rewind-*.png`, `output/compact/`에 보조 검수 화면.

## label별 서안 펍 CG 교체 횟수

Tutorial 계열·E03의 표에는 전면 close-rear 뒤에 있는 배경 CG가 기록된다. 실제 전면 원화는 close-rear로 유지된다.

label 진입 첫 그림은 교체로 세지 않음. 같은 label 안의 서안 CG끼리 바뀐 횟수. A/B/C에서 방문한 label 합집합. 이서 채팅용 빈 펍 진입/복귀는 이 표와 구분.

| label | 전(A 경로) | 후 | 후 사용 원화 |
|---|---:|---:|---|
| E01 | 2 | 0 | seoan-pub-seated-v092.png |
| C1_CALL_A | 0 | 0 | seoan-pub-seated-v092.png |
| E01Talk | 4 | 0 | seoan-pub-chin-v091.png |
| C2_A | 1 | 0 | seoan-pub-seated-v092.png |
| E02 | 6 | 0 | seoan-pub-seated-v092.png |
| TutorialStart | 0 | 0 | seoan-pub-seated-v092.png |
| TutorRequest | 0 | 0 | seoan-pub-seated-v092.png |
| TutorNext | 0 | 0 | seoan-pub-seated-v092.png |
| E03 | 0 | 0 | seoan-pub-seated-v092.png |
| E04 | 3 | 0 | seoan-pub-seated-v092.png |
| C2_CALL_A | 0 | 0 | seoan-pub-seated-v092.png |
| Promise | 1 | 0 | seoan-pub-seated-v092.png |
| C3_A | 2 | 0 | seoan-pub-seated-v092.png |
| E05 | 0 | 0 | seoan-pub-seated-v092.png |
| C1_CALL_B | A 미방문 | 0 | seoan-pub-seated-v092.png |
| C2_B | A 미방문 | 0 | seoan-pub-seated-v092.png |
| C2_CALL_B | A 미방문 | 0 | seoan-pub-seated-v092.png |
| C3_B | A 미방문 | 0 | seoan-pub-seated-v092.png |
| C1_CALL_C | A 미방문 | 0 | seoan-pub-laugh-v092.png |
| C2_C | A 미방문 | 0 | seoan-pub-seated-v092.png |
| C2_CALL_C | A 미방문 | 0 | seoan-pub-seated-v092.png |
| C3_C | A 미방문 | 0 | seoan-pub-seated-v092.png |

모든 대상 label의 내부 CG 교체가 0이므로, 내부의 4줄 미만 교체 간격도 0이다. label 경계의 웃음/이야기 주제 전환은 별도 컷이다.

## 기존 에셋의 한계 / 미검증

- 미제작 표정 목록: (1) 휴대폰을 뒤집으려다 멈춘 긴장, (2) 면접 고백 때 시선을 내렸다 올리는 표정, (3) 창밖을 보며 결정을 망설이는 조용한 측면. 기존 seated와 조명으로 분위기는 낮췄으나 해당 동작·미세 표정을 정확히 재현하지는 않는다. 새 에셋은 만들지 않았다.
- 원화 자체에 있는 고개 기울기와 몸 동작은 기존 픽셀 그대로다. 프레임 anchor를 맞췄어도 눈·입 픽셀이 완전히 동일한 자리에 있는 것은 아니다.
- 실제 Safari/Firefox·실기기·모든 폰트 크기/27개 선택 조합·외부 AI 서비스의 실제 설치/응답·원격 배포 미검증.
- UI/UX v1.1.1 E03 A안 전체 적용을 이번 장면 QC에서 새로 완료한 것으로 기록하지 않는다.

## 변경 파일

- `linear-tutorial.js`
- `ui-motion.js`
- `practice-ui.js`
- `game.js`
- `scene-qc.js`
- `v11-ui.js`
- `scene-ui.js`
- `lesson-ui.js`
- `notification-ui.js`
- `title-screen.css`
- `visual-update.css`
- `review-update.css`
- `scene-qc.css`
- `ui-tokens.css`
- `revision-v09.css`
- `opening.css`
- `scene-ui.css`
- `v11-ui.css`
- `index.html`

추가 기록 파일: `full-ui-redesign/UI_UX_VERSIONS.json`의 로컬 구현 버전·QC 보고 경로와 `UI_UX_CHANGELOG.md` 갱신. 배포 버전·확정 시안 내용은 보존.
