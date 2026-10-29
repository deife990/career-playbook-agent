# Offlook 회사 공지 중앙 배치 — 2026-10-29

UI/UX v1.1 · v0.14.0-dev 로컬 구현 수정

- 사용자 지시: 회사 공지 Offlook 창을 좌측 상단에서 중앙으로 옮긴다.
- `scene-ui.css`에서 회사 공지에만 화면 가로 중앙·하단 대사 영역을 제외한 공간의 세로 중앙을 적용했다. 작은 가로 화면의 공지/대사 좌우 분할도 해제했다. 화면 높이에 따른 대사 여유 공간을 기준으로 하므로 대사 전환 때문에 창이 움직이지 않는다.
- 공지 원문, Offlook 디자인과 발신 주체, 급여·이서 알림 위치, 달력 알림은 유지했다. 확정 시안은 수정하지 않았다.
- Playwright Chromium 1440×900, 390×844, 320×667, 800×450에서 각각 18/24px, 8조건 확인. 가로 중앙, 대사와 비겹침, 공지 전문의 스크롤 접근, 다음 대사에서도 동일 위치를 확인했다. 실기기·Safari는 미검증이다.
- [검수 결과](output/offlook-center/result.json) · [변경 전](output/offlook-center/before.png) · [변경 후 PC](output/offlook-center/after-1440x900-18.png) · [변경 후 모바일](output/offlook-center/after-390x844-18.png).
- 작업 직전 CSS는 `output/offlook-center/scene-ui.css.before`에 보존했다.
