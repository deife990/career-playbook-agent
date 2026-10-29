# 출입게이트 캐릭터 외형 보정 — 2026-10-29

UI/UX v1.1 · 게임 v0.14.0-dev · 로컬 적용

사용자 요청에 따라 기존 출입게이트 장면을 서안·주인공 캐릭터 시트를 참조해 편집했다. 내장 imagegen으로 기존 원화를 편집했으며 결과는 별도 버전 `assets/gate-together-v0141-sheets.png`에 저장했다.

- 편집 대상: `assets/gate-together-v0102.png`.
- 외형 참고: `assets/characters-v02/seoan.png`, `assets/characters-v02/player.png`.
- 서안: 시트의 갈색 단발과 얼굴·머리 디테일, 크림색 니트와 청록 외투, 검정 가방의 질감과 금속 장식을 참고했다. 시트의 네이비 정장 시안은 사용하지 않았다.
- 주인공: 남성의 짧고 층진 짙은 갈색 머리, 베이지 재킷의 후면·주름, 어두운 바지와 신발을 참고했다. 기존처럼 뒷모습이며 새 정면 얼굴을 드러내지 않았다.
- 편집 지시에서 기존 배경·구도·두 사람의 위치·자세·거리·저녁 조명을 유지하도록 요청했다. 생성 편집이므로 배경의 픽셀 단위 동일성을 보장하지 않는다. 입력/결과 해상도는 모두 1672×941이다.
- `linear-tutorial.js`의 P02 장면 및 `review-ui.js`의 장면 감상 참조를 새 원화로 연결했다. 기존 원화, 캐릭터 시트와 확정 UI 시안은 보존했다. 대사·분기·저장 스키마 변경은 없다.
- Playwright Chromium 1440×900, 390×844, 320×667, 800×450에서 새 원화 로드와 대사/진행 표시, 감상 이미지 연결, 다음 펍 장면에서 게이트 이미지가 사라짐을 확인했다. 실제 기기·Safari는 미검증이다.

[검사 결과](output/gate-characters/result.json) · [원화 및 시트 해시](output/gate-characters/assets.json) · [변경 전](output/gate-characters/before-1440x900.png) · [변경 후 PC](output/gate-characters/after-1440x900.png) · [변경 후 모바일](output/gate-characters/after-390x844.png).

변경 전 연결 코드는 `output/gate-characters/*.before`에 보존했다.
