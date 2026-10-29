# 「퇴사할 건데, 좋아해도 될까요?」 — AI 작업 규칙

이 파일은 이 게임을 수정하는 모든 AI(GPT, Claude 등)와 사람이 **작업 전에 반드시** 읽는다.
목표: 고칠 때마다 덧칠(override)이 쌓여 화면 스타일이 흩어지는 것을 막는다.

## 1. 어디를 고치나 — 모듈 지도

| 바꾸려는 것 | 정본(여기만 고친다) | 안내서 |
|---|---|---|
| 대사·흐름·선택지·플롯 | `src/content/story.js` + 편집 원고 `docs/story/*.md` | [docs/STORY.md](docs/STORY.md) |
| 인물 이름·이름표 색·표정 이미지·배경 | `src/content/cast.js` (+ `assets/`) | [docs/ART.md](docs/ART.md) |
| 색·글꼴·간격·모션 값 | `styles/tokens/semantic.css` (원색은 `palette.css`) | [docs/UIUX.md](docs/UIUX.md) |
| 화면 컴포넌트 모양 | `styles/components/<컴포넌트>.css` | [docs/UIUX.md](docs/UIUX.md) |
| 튜토리얼 문구·단계 | `src/content/tutorial-content.js`, `src/content/cards.js`, `src/content/request-data.js` | [docs/TUTORIAL.md](docs/TUTORIAL.md) |
| 튜토리얼 동작 | `src/tutorial/*.js` | [docs/TUTORIAL.md](docs/TUTORIAL.md) |
| 진행·저장·엔진 | `src/engine/*.js` | 저장 스키마 변경은 사용자 승인 필요 |

`src/ui/*.js`는 장면 표현 계층, `styles/patches/*.css`는 **동결된 과거 덧칠**이다.

## 2. 금지 규칙 (lint가 막는다)

1. **새 패치 CSS 파일 금지.** `revision-*.css`, `*-update.css`, `v12-ui.css` 같은 버전 이름 파일을 만들지 않는다. 해당 컴포넌트 파일을 직접 고친다.
2. **색 리터럴 금지.** CSS에 `#hex`, `rgb()`, `hsl()`를 쓰지 않는다. `semantic.css`의 토큰을 쓰고, 없으면 토큰을 추가한다.
3. **`!important`·원색 토큰(`--p-*`) 사용 수는 늘릴 수 없다.** 줄이는 것만 허용한다(ratchet).
4. **루트에 `.js`/`.css` 금지.** 코드는 `src/`, 스타일은 `styles/`. 새 파일은 `index.html`에 정확히 한 번 등록한다.
5. **이미지 파일명을 코드에 흩뿌리지 않는다.** 인물·배경은 `cast.js`에서만 바꾼다.
6. **대사를 JS 여러 곳에 복붙하지 않는다.** 첫 요청 문구는 `FIRST_REQUEST` 하나만 쓴다(`source-check`가 검사).
7. **`UPDATE_V*.md` 같은 버전별 보고서 파일을 루트에 만들지 않는다.** 변경 기록은 `CHANGELOG.md` 한 곳에 남긴다.
8. 확정 UI/UX 시안 폴더(`../planning/2026-10-27/full-ui-redesign/ui-ux-v1.1*`)는 수정하지 않는다.

## 3. 작업 순서 (모든 변경 공통)

```bash
python3 -m http.server 8922 --bind 127.0.0.1      # 실행: http://127.0.0.1:8922/
node checks/visual/snap.cjs before                 # 1) 고치기 전 전체 화면 촬영
# 2) 위 모듈 지도의 정본만 수정
node checks/lint-structure.cjs                     # 3) 구조·디자인 규칙
node checks/source-check.cjs                       #    대사·선택지·요청 문구 보존
node checks/v0141/regression.cjs && node checks/v0140/tutorial-flow.cjs && node checks/v0140/save-compat.cjs
node checks/visual/snap.cjs after && node checks/visual/compare.cjs before after   # 4) 의도한 화면만 바뀌었는지
```

- 화면이 바뀌지 않아야 하는 정리 작업은 `compare` 결과가 **0 different**여야 한다.
- 의도한 변경이면 바뀐 화면 목록이 의도와 일치하는지 확인하고 `CHANGELOG.md`에 적는다.
- `!important`나 원색 토큰을 줄였다면 `node checks/lint-structure.cjs --tighten`으로 기준을 낮춘다.
- 알려진 기존 실패: `checks/v0140/layout-a11y.cjs`(2026-10-29 정리 이전부터 실패). 고치면 이 줄을 지운다.

## 4. 버전·결정

- 게임 버전(`src/engine/game.js`의 `Version`, `index.html`의 `?v=`)과 UI/UX 기준 버전은 다르다.
- 현재 UI/UX 기준: **v1.1.1** — `../planning/2026-10-27/full-ui-redesign/UI_UX_BASELINE.md`.
- 디자인 기준을 바꾸려면 새 UI/UX 버전 문서를 먼저 만들고 승인받은 뒤, 토큰·컴포넌트에 반영한다.
- 제품 결정은 `DECISIONS.md`, 과거 버전 보고서는 `docs/history/`, 과거 검사는 `checks/archive/`.
- 실제 서비스 호출·설치·전송은 하지 않는다. 시안의 복사·AI 실행은 미리보기용이다.
