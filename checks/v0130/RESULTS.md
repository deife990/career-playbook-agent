# v0.13.0 구현·검수 결과

2026-10-26 · **로컬 구현 및 Chromium 검수 완료 / 실제 환경·학습 검증 대기**

게임 버전은 `0.13.0`, 저장 스키마는 `ep01-script-v11`이다. 설치 ZIP은 기존 `1.2.0-rc.7` 그대로다. 배포·실제 계정 설치·AI 호출을 완료했다는 의미는 아니다.

## 구현 결과

- 설치를 요구하지 않는 공통 가상 시연 S01~S05를 먼저 제공한다. 이전, 조건 교정 펼침·접기, 전체 예시, 처음부터/이어서 보기를 같은 원고로 구성했다.
- 서비스 선택 P01 → 필요할 때 설치 I01~I05 → 실행 전 안내 P02로 연결했다. I04의 호출 조작은 자동 애니메이션 대신 정적인 세 단계다. 설치 안내를 읽었다는 이유로 설치 완료를 표시하지 않는다.
- 단일 native dialog가 입력을 소유한다. 배경 진행·자동 읽기·기록을 차단하고, 준비창을 일시 종료한 뒤 카드 위치와 호출 포커스를 복원한다. 낮거나 좁은 화면은 전체 읽기 흐름을 스크롤한다.
- 첫 요청과 이어가기 요청은 canonical ID를 참조한다. 첫 요청 전문, 사용 서비스, 직접 선택·붙여넣기·전송, 작은 실습 목표를 외부 실행 전에 읽을 수 있다.
- 복사와 서비스 이동은 클릭 안에서 독립적으로 시작한다. 복사는 최대 1.5초 대기하며, 시도 토큰과 취소로 늦은 응답을 무시한다. 저장 쓰기도 직렬화했다. 복사/열기 실패, 수동 복사·공식 링크, 저장 재시도, 닫기·건너뛰기를 제공한다.
- 외부 페이지 복귀는 자기보고와 구분한다. 도움말 왕복은 기존 실습 상태를 유지하고, 엔진 대사 DOM을 직접 고치지 않는다. 완료·건너뛰기 후 실제 E04 첫 문장을 검수했다.
- 내 준비의 안내 주제와 제목 재열람을 연결했다. 제목 열람은 `CPGuideProgress_v1`에 별도로 저장하며 스토리 저장이나 실제 실습 자기보고를 만들지 않는다.
- 엔딩은 누적 이력에 따라 첫 시작 / 시작했던 대화 확인 / 같은 대화 이어가기를 제공한다. 엔딩·준비창 실습을 끝내도 E04로 이동하지 않는다.

## 기준선과 저장

변경 전에 실행 대본의 변환 완료 앵커를 `save-v10-anchors.js`로 동결했다. `fixtures/v012-save-cases.json`은 그 앵커의 **275개 안정 위치를 위한 합성 저장**이다. 실제 사용자 저장이나 계정 데이터가 아니다. 관계 분기 합성값의 오류는 해당 분기와 일치하도록 보정했다.

기존 v0.11.9 실측 저장 두 개는 `review/v0120/save-v0119-*.json`에서 재사용하며 덮어쓰지 않았다. v8·v9의 동결 자료도 그대로 사용한다. 기존 저장을 복제한 뒤 v8→v9→v10→v11로 변환한다. 275개 v10 위치와 522개 v8/v9 위치의 유효성, 선택·로그·history 보존, 입력 원본 불변, 멱등성을 검사했다. 실제 불러오기에서는 S04 교정, I04 하위 단계/caller, 외부 열기→복귀, 완료 직후 중단, 자동·수동 슬롯을 확인했다.

변경 전 source-check/save-compat/practice/layout은 모두 통과했다. 기록은 [baseline](baseline/)에 있다. 기존 실습 검사는 안내가 덮어쓴 대사를 기대하고 있었으므로, 그 PASS는 E04 표시 결함이 없다는 증거가 아니다. 새 검사는 실제 실행 대본의 E04 첫 문장과 화면을 직접 비교한다.

## 수용 기준

| ID | 결과 | 증거와 경계 |
|---|---|---|
| A01 | PASS | [tutorial-flow.json](tutorial-flow.json), [interaction.json](interaction.json): 설치 없는 시연, 최초 완료 반응, 이야기 진행 |
| A02 | PASS | [content-state.txt](content-state.txt), [source-check.json](source-check.json): 가상 표시, 공통 요청 참조, 개인 입력 없음 |
| A03 | PASS | [tutorial-flow.json](tutorial-flow.json): 이전·교정·전체 예시·중간 닫기·재열람 |
| A04 | PASS | [tutorial-flow.json](tutorial-flow.json), [chatgpt.json](chatgpt.json): P01/설치/P02, 실행 전 전문·수동 행동·완료 범위 |
| A05 | PASS | [practice.json](practice.json): 완료·건너뛰기 후 실제 E04 문장, 도움말 왕복에서 상태 유지 |
| A06 | PASS | [save-compat.json](save-compat.json), [interaction.json](interaction.json): 구버전 797개 위치, 자동·수동 슬롯, 선택·로그 보존 |
| A07 | PASS | [save-compat.json](save-compat.json): S04, I04 세부 단계/caller, returned 및 terminal 재개. 자동 외부 실행 없음 |
| A08 | PASS | [layout-a11y.json](layout-a11y.json): 8개 크기 × S01/S04/S05/I04/P02/복귀, 가로 잘림·행동 접근·요청 높이 |
| A09 | PASS / 일부 NOT VERIFIED | 320 CSS px, 글자 200%, 모션 설정별 정보 동일성은 PASS. 실제 브라우저 200%/400% 확대 조작은 NOT VERIFIED |
| A10 | PASS / 일부 NOT VERIFIED | 이름 연결, 제목 포커스, Tab·Enter·Escape·복귀, 배경 정지는 PASS. 실제 화면 낭독기 청취는 NOT VERIFIED |
| A11 | PASS | [practice.json](practice.json): 복사/팝업 네 조합, 중복 클릭, 지연·타임아웃·서비스 변경·취소, 저장 실패 |
| A12 | PASS | [practice.json](practice.json): 누적 자기보고·열기 이력별 시작/확인/이어가기, 엔딩 위치 보존 |
| A13 | PASS | [source-check.json](source-check.json), [interaction.json](interaction.json): ZIP·전문 카드 12개/요청 21개, 관계 선택 9개, A/B/C 경로 엔딩 |

## 화면 증거

8개 크기: 1440×900, 1280×720, 1024×600, 800×450, 600×800, 390×844, 375×667, 320×667. 각 화면의 캡처는 이 디렉터리의 `<폭>x<높이>-<단계>.png`에 있다. 긴 단계 캡처는 주 행동에 도달하도록 스크롤한 상태도 포함한다. 화면 안에 모든 내용을 한 번에 넣는 검사가 아니다.

- [1280×720 · 실행 전 안내](1280x720-P02.png)
- [800×450 · 첫 시연의 아래쪽과 주 행동](800x450-S01.png)
- [390×844 · 교정 결과](390x844-S04.png)
- [375×667 · 실행 전 안내의 아래쪽](375x667-P02.png)
- [320px · 글자 200%의 시작 부분](320-text-200.png)

캡처 직접 검토에서 320px/200%의 헤더가 한 글자씩 줄바꿈되는 문제를 발견했다. 좁은 화면의 상단을 세로로 배치하고 헤더·본문·푸터 전체를 스크롤하도록 수정한 뒤 재검수했다. 이전 40%/45dvh 규칙과 본문 약 53px 제약은 제거했다. 본문/보조 글/주 버튼 대비 계산값은 각각 11.53:1, 7.32:1, 8.03:1이다.

## 실행한 검사

게임 루트에서 아래 명령을 실행했다. 브라우저 검사는 `CP_BASE_URL`을 지원하고 분리된 브라우저 컨텍스트와 합성 응답을 사용한다.

```sh
python3 -m http.server 8921 --bind 127.0.0.1
node checks/source-check.cjs
node checks/v0120/handoff.cjs
node checks/v0130/content-state.cjs
CP_BASE_URL=http://127.0.0.1:8921 node checks/v0130/save-compat.cjs
CP_BASE_URL=http://127.0.0.1:8921 node checks/v0130/tutorial-flow.cjs
CP_BASE_URL=http://127.0.0.1:8921 node checks/v0130/layout-a11y.cjs
CP_BASE_URL=http://127.0.0.1:8921 node checks/v0130/practice.cjs
CP_BASE_URL=http://127.0.0.1:8921 node checks/v0130/interaction.cjs
CP_BASE_URL=http://127.0.0.1:8921 node checks/v0130/chatgpt.cjs
```

모두 PASS. 최종 로컬 JS 문법 검사와 index의 정적 파일 참조 검사도 통과했다. 실제 대상 서비스에 질문을 전송하거나 외부 대화를 읽지 않았다.

### 기존 검사 변경의 대응

기존 v0120 검사 진입점은 새 계약 검사로 위임한다. 원본은 `baseline/original-*.cjs.txt`, 과거 증거는 `review/v0120`에 보존했다. 검사를 통째로 무효화하는 PASS 반환을 넣지 않았다.

| 기존 기대값 | 변경 근거·새 대응 |
|---|---|
| 사이드바 40%, 모바일 높이 45dvh, 버튼 좌표 고정 | SPEC 4절의 중앙/전체 화면과 단일 읽기 흐름. layout-a11y에서 내용·요청 전문·행동 도달 검사 |
| 설치가 먼저 나오고 TutorLinear를 진행 | SPEC 3절. tutorial-flow에서 공통 시연→P01→필요한 설치→P02 검사 |
| 대사 수마다 메시지 추가, 2.5초 호출 프레임/타이핑 | SPEC 3·5절의 명시 ID와 정적 I04. content-state/tutorial-flow/모션 동일성 검사 |
| 안내가 덮어쓴 NPC 문장 | SPEC 5.3절. practice에서 실제 E04 첫 문장과 비교 |
| 구 schema/라벨 그대로 재개 | SPEC 6절. save-compat에서 동결 앵커의 의미 위치와 필드 보존/복원 검사 |
| 복사·다운로드·수동 슬롯·일반 카드·관계 선택 | source-check/handoff/interaction에 유지. 실제 다운로드·클립보드, 수동 슬롯, 3개 전체 이야기 경로 검사 |
| 서비스별 구 가상 원고 | CONTENT의 공통 원고로 통합. chatgpt 검사는 두 서비스 설치 자료 5단계 × 4개 크기로 유지 |

## 구현 시 결정

- 임시 URL 플래그를 제품에 추가하는 대신, 별도 테스트 컨텍스트에서 공개 API로 S01을 열어 첫 기능 경로를 먼저 검수했다. 기본 이야기 순서 전환은 그 뒤 진행했다.
- 폭 600px 이하에서도 전체 단일 스크롤을 사용한다. SPEC의 높이 600px 이하 요구를 충족하며, 좁은 화면에서 글자를 키웠을 때도 헤더·푸터가 본문을 밀어내지 않도록 범위를 확장했다.
- caller에는 flow/stepId/returnTarget과 owner를 함께 검증한다. 준비창 스크롤·포커스는 메모리에서만 보관하고 저장 파일에 좌표·DOM을 넣지 않는다.
- 읽기 위치와 실제 실습 완료를 분리한다. 오래된 실제 캡처·일반 휴대폰·CP_STAGE는 보존하고, 옛 자동 호출·중복 가상 예시 경로는 제거했다.

## 실제 환경·학습 검증 — T16

| 항목 | 결과 |
|---|---|
| ChatGPT 대상 계정: ZIP 설치·메뉴 권한·선택·CareerPilot 호출·기록 재개 | NOT VERIFIED |
| Claude 대상 계정: ZIP 설치·메뉴 권한·선택·CareerPilot 호출·기록 재개 | NOT VERIFIED |
| macOS Safari | NOT VERIFIED |
| iOS Safari / Android Chrome 실기기와 앱 전환·클립보드 | NOT VERIFIED |
| 실제 브라우저 확대 및 화면 낭독기 청취 | NOT VERIFIED |
| 신규 사용자 5명 관찰과 학습 효과 | NOT VERIFIED |

이 환경의 합격이나 설치 지원 범위를 자동 검수에서 추정하지 않았다. 배포 판단 전 위 항목을 별도로 확인해야 한다. 현재 UI는 예시·이야기·수동 복사·공식 도움말·맛보기·나중에 하기 경로를 제공한다.
