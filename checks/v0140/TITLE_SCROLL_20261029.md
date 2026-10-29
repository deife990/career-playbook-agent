# 타이틀 스크롤 경계 수정 — 2026-10-29

UI/UX v1.1 · 게임 v0.14.0-dev · 로컬 적용

- 원인: `#welcome` 자체가 스크롤되면서 뷰포트 크기의 어두운 레이어가 위로 이동했다. 하단 -7%에 배치한 원화도 스크롤 높이에 포함되어, 내용이 들어가는 PC 화면에서도 하단 68px가 노출됐다.
- 수정: 타이틀 배경·인물·어두운 레이어는 화면 크기에 고정하고 바깥으로 나온 원화는 잘랐다. 메뉴·문구만 별도 영역에서 스크롤한다. 하단 안내는 내용의 마지막에 배치해 긴 메뉴와 겹치지 않게 했다.
- 보존: 원화·문구·메뉴 기능, 확정 시안 폴더. 작업 직전 HTML/CSS는 `output/title-scroll/*.before`에 보존했다.
- 확인: Playwright Chromium 1920×960, 1440×900, 390×844, 320×667, 800×450. 배경 레이어가 스크롤 전후 화면 전체를 덮고, 인물 위치가 변하지 않으며 가로 넘침이 없다. 모든 메뉴의 키보드 포커스, 하단 안내 접근, 환경설정과 처음부터 시작을 확인했다. 실기기·Safari는 미검증이다.
- 실행: `node checks/v0140/title-scroll.cjs` 통과. [계측 결과](output/title-scroll/result.json).
- [수정 전 PC](output/title-scroll/before-1920x960-bottom.png) · [수정 후 PC](output/title-scroll/after-1920x960-bottom.png) · [수정 후 모바일](output/title-scroll/after-390x844-bottom.png).
