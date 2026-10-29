# 스토리 모듈 (대사·흐름·플롯)

## 정본
- **편집 원고**: `docs/story/` — `STORY_BIBLE.md`(세계관·톤), `CHARACTERS.md`(인물), `EPISODES.md`(회차 구성),
  `PILOT_SCRIPT.md`(프롤로그+1화 대본), `MAIN_SCRIPT.md`, `SIDE_STORIES.md`.
- **실행 대본**: `src/content/story.js`의 `CP_STORY.script` — 라벨(장면) → 문장 배열.

원고가 먼저, 실행 대본이 나중이다. 대사를 바꾸면 두 곳을 같이 고치고 `node checks/source-check.cjs`로
원고의 주인공 대사·선택지가 실행 대본에 모두 남아 있는지 확인한다.

## 실행 대본 문법
- `'s 안녕'` — 화자 id + 대사. 화자 id·이름·이름표 색은 `src/content/cast.js`.
- `'show scene cafe'` — 배경(`cast.js`의 scenes 키). `'show character s smile at center'` — 인물 표정(sprites 키)과 위치.
- `'jump E02'` — 라벨 이동. 존재하지 않는 라벨은 `source-check`가 잡는다.
- `choose('c1', 대사, [A,B,C])` — 선택지. 선택값은 `c1`~`c3`에 저장되고 `callback('c1')`로 회수한다.
- `{Function:{Apply:…}}` — 연출 전환. 새 연출은 `src/ui/`에 함수로 만들고 대본에서는 호출만 한다.

## 재사용 규칙
- 같은 문구를 여러 화면에서 쓰면 `src/content/request-data.js` 같은 상수로 한 번만 정의한다.
- 새 회차는 새 라벨 묶음(`E06…`)으로 추가하고, 기존 라벨 이름·순서를 바꾸지 않는다. 저장 위치가
  라벨+순번이라 기존 저장을 깨뜨린다. 바꿔야 하면 `src/engine/save-*.js`의 이전 앵커를 함께 갱신한다.
- 톤·호칭·말투 기준은 `docs/story/STORY_BIBLE.md`와 기획 폴더의 `DIALOGUE_STYLE.md`를 따른다.
