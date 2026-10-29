# UI/UX 모듈 (디자인 시스템)

## 3단계 토큰
| 층 | 파일 | 규칙 |
|---|---|---|
| 1. Primitive(원색) | `styles/tokens/palette.css` | 실제 색 값은 여기에만. 이름 `--p-<색상>-<명도>(-a<투명도>)` |
| 2. Semantic(의미) | `styles/tokens/semantic.css` | `--cp-paper`, `--cp-ink`, `--cp-green` 등 용도 이름. 컴포넌트는 이것을 쓴다 |
| 3. Component | 각 컴포넌트 CSS 상단 `:root` 또는 선택자 | 필요할 때만 `--guide-bg: var(--cp-paper)`처럼 의미 토큰을 다시 가리킨다 |

2026-10-29 시점 원색이 **445개**다(수정할 때마다 비슷한 색이 새로 생겼던 흔적). 값은 화면 변화 없이 그대로
옮겼으므로, 앞으로는 비슷한 원색을 의미 토큰 하나로 합치며 줄인다. 진행도는 lint의 `primitiveUses`.

## 스타일 적용 순서 (index.html, 위→아래로 덮어씀)
1 palette → 2 semantic → 3 style → 4 ui-components → 5 opening → 6 lesson-ui → 7 **patches/revision-v09**
→ 8 title-screen → 9 **patches/visual-update** → 10 **patches/review-update** → 11 scene-ui → 12 guide-panel
→ 13 **patches/v11-ui** → 14 **patches/scene-qc**

`patches/`는 이전 수정에서 덧칠로 쌓인 파일이다. 새 규칙을 넣지 않는다.

## 패치 줄이기 (덧칠 걷어내기) 절차
한 번에 한 컴포넌트씩:
1. `snap.cjs before` 촬영
2. 패치 파일에서 그 컴포넌트 선택자 규칙을 찾아 컴포넌트 파일의 원래 규칙에 합치고 `!important`를 제거
3. `compare.cjs before after`가 **0 different**인지 확인, lint `--tighten`
4. 패치 파일이 비면 파일과 `index.html` 줄을 지운다(`patchFiles` 감소)

## 기준 문서
- 확정 UI/UX: v1.1.1 — `../planning/2026-10-27/full-ui-redesign/UI_UX_BASELINE.md`, 시안 `ui-ux-v1.1/`, 보완 `ui-ux-v1.1.1/`
- 레이아웃 기준 크기: 1440×900, 390×844(시각 비교), 접근성 검사는 `checks/v0140/layout-a11y.cjs`
- 모션 시간도 토큰이다: `src/engine/ui-motion.js`가 CSS 토큰을 읽는다
