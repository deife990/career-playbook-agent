# 세 항목 재확인 — 2026-10-29

UI/UX v1.1 · 게임 v0.14.0-dev · 로컬 적용

사용자 요청에 따라 이번 세션의 스크롤·알림/대사 공간·게이트 원화에 한정해 재확인했다. 전체 회귀 묶음을 반복 실행하지 않았다.

## 1. 타이틀 스크롤 — 보완 완료

낮은 창에만 적용되는 `review-update.css`의 `.welcome{overflow:auto!important}`가 남아 있었다. `title-screen.css`의 `#welcome` 외곽 넘침 차단을 명시적으로 우선 적용했다. 문구/메뉴의 내부 스크롤은 유지하고 배경·원화·음영은 움직이지 않는다.

## 2. 알림과 하단 대사 — 원인 수정 완료

직전 구현은 배너가 참조하는 여유 공간만 고정했고, 실제 대사창은 여전히 `height:auto`였다. 이번에는 일반 대화/내레이션/속마음의 **대사 영역 높이 자체**를 화면별 공통 값 `--dialogue-panel-height:clamp(200px,26dvh,280px)`로 고정했다. 알림의 여유 공간도 이 값을 공유한다. 별도 기기 화면과 지정된 한 줄 말풍선은 기존 배치를 유지한다. 기존 글자 크기와 내부 읽기 스크롤도 유지한다.

## 3. 게이트 서안 얼굴 — 문제 확인, 품질 해결 미완료

원본 `gate-together-v0102.png`, 첫 보정 `gate-together-v0141-sheets.png`, 캐릭터 시트와 펍의 서안을 같은 얼굴 영역에서 비교했다. 게이트 얼굴은 작은 영역에 단순한 이목구비가 들어 있어, 펍/시트의 성인 얼굴·입체적인 음영·선명한 묘사와 차이가 크다. 첫 보정이 그 차이를 충분히 해결하지 못했다.

내장 imagegen으로 얼굴 중심의 보정 후보를 **한 번** 추가 생성했다. 고해상도를 요청했지만 실제 결과는 기존과 같은 1672×941이다. 후보도 확대 시 기준 원화 수준에 미달하므로 게임에 다시 적용하지 않았다. 후보는 `assets/gate-together-v0142-face.png`에 비교용으로 보존했고, 현재 게임은 `gate-together-v0141-sheets.png`를 유지한다. 이 항목을 해결 완료로 기록하지 않는다.

[같은 배율 얼굴 비교](output/three-review/face-comparison.html) · [비교 화면](output/three-review/face-comparison.png).

## 한 차례 검수

Playwright Chromium에서 1440×900/18px, 390×844/18px, 320×667/24px, 800×450/24px를 한 묶음으로 실행했다. 타이틀 외곽 스크롤 0·음영 전체 덮임·원화 위치 불변, 급여의 세 대사 전환에서 실제 대사창 높이/알림 좌표 불변, 회사 공지 중앙/대사 비겹침, 일반 펍 대화 3개 높이 불변, 중간 저장 복원 후 높이 유지, 게이트 원화 표시를 확인했다. `node checks/v0140/three-review.cjs` 통과. 실기기·Safari는 미검증이다.

[계측 결과](output/three-review/result.json) · [작은 가로 창 알림](output/three-review/salary-800x450.png) · [PC 게이트](output/three-review/gate-1440x900.png).

수정 직전 소스는 `output/three-review/*.before`에 보존했다. 확정 시안·대본·저장 스키마는 수정하지 않았다.
