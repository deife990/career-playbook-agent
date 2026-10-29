# 알림 위치 고정 — 2026-10-29

UI/UX v1.1 · v0.14.0-dev 로컬 구현 수정

- 증상: 급여 알림이 내레이션→속마음→내레이션으로 바뀔 때 대사창 실측 높이(`--dialog-reserve`)에 따라 이동했다. 수정 전 1440×900에서 알림 위쪽 좌표가 542.2→531.2→542.2px였다.
- 수정: 급여·이서 도착 배너의 아래쪽 위치를 화면 높이 기준의 고정 읽기 여유 공간(`clamp(200px,26dvh,280px)`)과 간격으로 계산한다. 대사 길이·타이핑·속마음 전환에 따라 배너가 이동하지 않는다. 아래 대사는 여유 공간 안에서 스크롤해 읽을 수 있다. 배너는 화면 상단 안전 영역에 맞춰 최대 높이를 제한하고 넘치는 내용은 배너 안에서 읽는다.
- 기존 알림 내용·중앙 하단 배치·회사 Offlook 공지·장면별 표시와 저장 상태는 유지했다. 확정 시안 폴더는 수정하지 않았다.
- 검수: Playwright Chromium에서 1920×960, 1440×900, 390×844, 320×667, 800×450의 세 대사 위치와 긴 대사 스크롤을 확인했다. 동일 크기에서 세 대사의 알림 좌표가 동일했다. 기존 알림/이서 검사도 1440×900, 390×844, 320×667, 800×450 × 글자 18/24px, 총 8조건 통과했다. 회사 공지 전문, 이서 수신/서안 발신, 화면 크기 변경, 중간 저장 복원과 장면 종료 정리를 포함한다. 실기기·Safari는 미검증이다.
- 검사: `node checks/v0140/alert-anchor.cjs`, `node checks/v0140/alerts-iseo.cjs alert-anchor`.
- [좌표/긴 대사 검사](output/alert-anchor/positions.json) · [기존 기능 검사](output/alert-anchor.json).
- [수정 전 내레이션](output/alert-anchor/before-0.png) · [수정 전 속마음](output/alert-anchor/before-1.png) · [수정 후 내레이션](output/alert-anchor/after-1440x900-0.png) · [수정 후 속마음](output/alert-anchor/after-1440x900-1.png).
- 작업 시작 CSS는 `output/alert-anchor/scene-ui.css.before`에 보존했다. 이번 수정은 `scene-ui.css` 및 관련 검사/기록에 한정한다.
