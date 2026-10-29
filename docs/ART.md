# 원화 모듈 (인물·배경·이미지)

## 정본
- **`src/content/cast.js`** — 배경(scenes)과 인물(characters: 이름·이름표 색·표정별 이미지)의 현재 파일.
  어떤 이미지가 "지금 쓰는 것"인지는 이 파일만 보면 된다.
- `assets/characters-v02/` — 인물 시트 v0.2(서안·이서·윤 팀장·나리·주인공). 원본은 수정하지 않고
  `src/ui/character-ui.js`가 화면에서 잘라 쓴다.
- 장면 연출용 단독 이미지(회상·펍·휴대폰 등)는 `src/ui/*.js`·`src/engine/game.js`에서 `'assets/…'`로 참조한다.
  `checks/lint-structure.cjs`가 모든 참조 파일의 존재를 검사한다.

## 파일 이름 규칙
`<인물|장소>-<포즈/표정>-v<버전>.png` 예: `seoan-laugh-v4.png`, `iseo-front-v0118.png`.
버전을 올린 새 파일을 추가하고 `cast.js`(또는 해당 참조 한 곳)만 바꾼다. 같은 이름으로 덮어쓰지 않는다.

## 교체 절차
1. 새 이미지를 `assets/`에 추가 → 2. `cast.js`의 파일명 변경 → 3. `checks/visual` 비교로 바뀐 화면 확인
→ 4. 이전 파일이 어디에서도 쓰이지 않으면 `../art-archive/`로 옮긴다(삭제하지 않음).

## 일관성 기준
- 인물 외형·표정 기준: `../planning/2026-10-27/character-sheets-v02/README.md`.
- 생성·수정 프롬프트와 이력: `ASSET_PLAN.md`, `docs/history/`.
- 동적 파일명 3곳은 검색으로 안 보이니 주의: `iseo-<pose>-v0118.png`(scene-ui),
  `seoan-sticker-<name>.svg`(lesson-ui), `characters-v02/<id>.png`(character-ui).
- 2026-10-29 정리: 코드에서 쓰지 않는 이전 버전 47개를 `../art-archive/from-source-2026-10-29/`로 옮겼다.
