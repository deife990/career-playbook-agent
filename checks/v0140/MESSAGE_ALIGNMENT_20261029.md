# 서안 개인 메시지 좌우 정렬 — 2026-10-29

UI/UX v1.1 · 게임 v0.14.0-dev · 로컬 적용

- 주인공의 발신 답장은 오른쪽, 서안의 수신 메시지는 왼쪽에 정렬했다. 기존 발신 스타일의 고정 왼쪽 여백 20px를 자동 여백으로 변경하는 서안 대화 전용 규칙을 추가했다. 작은 가로 화면의 마지막 답장 선택에서 적용되는 기존 margin 축약 규칙도 좌우 정렬을 덮어쓰지 못하게 했다.
- `lesson-ui.js`의 이모티콘 그룹에는 기존 메시지의 발신/수신 방향을 표시하고, 이모티콘도 같은 방향으로 맞췄다. 서안 이모티콘은 기존 이미지 속성의 128px 크기로 표시해 왼쪽에 배치했다.
- 대사·화자·발신자·메시지 색·이야기 순서·분기·저장 스키마는 유지했다. 다른 메시지 관계에는 서안 전용 정렬 규칙을 적용하지 않았다. 확정 시안은 보존했다.
- Playwright Chromium 1440×900/18px, 390×844/18px, 320×667/24px, 800×450/18px에서 실제 대화의 발신/수신 위치와 이름, 마지막 답장 선택 중 발신 정렬을 확인했다. E05에서 집으로 정상 진행해 서안의 수신 이모티콘 정렬도 확인했다. 실기기·Safari는 미검증이다.
- `node checks/v0140/message-alignment.cjs` 통과. [검사 결과](output/message-alignment/result.json).
- [변경 전](output/message-alignment/before.png) · [변경 후 PC](output/message-alignment/after-1440x900.png) · [모바일](output/message-alignment/after-390x844.png) · [이모티콘](output/message-alignment/after-sticker.png).
- 변경 전 소스는 `output/message-alignment/*.before`에 보존했다.
