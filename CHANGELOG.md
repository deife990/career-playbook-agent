# Changelog

변경은 여기에만 기록한다. v0.14 이전 기록은 `docs/history/`.

## v0.14.1-dev — 2026-10-29 구조 정리 (화면 변화 없음)
- 파일을 `src/{content,engine,tutorial,ui}`, `styles/{tokens,components,patches}`로 분리. 루트에 흩어진 41개 런타임 파일 정리.
- CSS 색 리터럴 654곳을 원색 토큰 445개(`styles/tokens/palette.css`)로 이동. 기존 의미 토큰은 원색을 가리키도록 연결.
- 인물·배경 정의를 `game.js`에서 `src/content/cast.js`(원화 레지스트리)로 분리.
- 코드에서 쓰지 않는 이전 원화 47개(약 54MB)를 `../art-archive/`로 이동.
- `checks/lint-structure.cjs`(구조·색·`!important` ratchet), `checks/visual/`(전 장면 픽셀 비교) 추가.
- 검증: 스토리 전 단계 346화면 픽셀 동일(1440×900, 390×844), A/B/C 분기 누락 파일 없음, source·content·handoff·save·tutorial·regression·compact 검사 통과. `layout-a11y`는 정리 전과 같은 위치에서 실패(기존 문제).
- 이전 v0.14.0 미커밋 작업은 `WIP: preserve v0.14 uncommitted UI changes` 커밋으로 보존.
