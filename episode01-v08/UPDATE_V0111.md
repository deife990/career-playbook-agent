# v0.11.1 · 검토 피드백 반영 결과

2026-10-23. 요청 순서대로 수정했습니다. 아래의 **세 크기**는 1280×720 · 800×450 · 375×812입니다. 일반 Chrome 실제 클릭 검증과 격리 브라우저의 보조 검사를 구분해 기록합니다.
> 이 정리본은 이전 검수 기록입니다. 용량 최적화를 위해 v0.11.1 화면 캡처와 보조 검사 산출물은 제외했습니다. 최신 화면 증거는 [v0.12.0 검수 갤러리](review/v0120/)에서 확인할 수 있습니다.

| ID | 변경 파일 | 확인 크기 | 변경·확인 결과 | 남은 문제·확인 범위 |
|---|---|---|---|---|
| U-02 · P0 | [game.js](game.js) · [review-ui.js](review-ui.js) | 일반 Chrome 실제 창 + 세 크기 | clipboard 프로미스 시작 → 빈 탭 열기 → await. 복사 실패·저장 실패에도 탭을 닫지 않고 서비스로 이동. 실패한 요청 전체 선택, 돌아온 뒤 재선택. 팝업 차단 시 직접 열기 링크를 펼침. | 실제 Chrome 실패는 클립보드 API를 제공하지 않는 HTTP 로컬 주소. 정확한 Document is not focused 비동기 거부는 보조 검사로 별도 확인. |
| V-03 · P1 | [review-ui.js](review-ui.js) · [review-update.css](review-update.css) | 세 크기 | F5/F9 제거. Q 퀵세이브 · L 퀵로드로 변경하고 성공·실패 토스트 표시. 입력창·열린 메뉴·대화상자에서 단축키 비활성. 저장 후 한 줄 진행, 퀵로드로 같은 위치 복원 확인. | 없음 |
| V-04 · P1 | [review-ui.js](review-ui.js) | 세 크기 | 링크·input·textarea·select·편집 가능 요소 또는 선택 영역이 있으면 contextmenu를 취소하지 않음. 일반 무대에서는 기존 UI 숨기기 유지. | 기본 메뉴 이벤트를 보존하는지 검사. 운영체제별 메뉴 모양까지 자동 검증하지는 않음. |
| FIRST_REQUEST · P2 | [request-data.js](request-data.js) · [cards.js](cards.js) · [tutorial.js](tutorial.js) · [lesson-ui.js](lesson-ui.js) · [linear-tutorial.js](linear-tutorial.js) · [review-ui.js](review-ui.js) · [index.html](index.html) · [checks/source-check.cjs](checks/source-check.cjs) | 세 크기 + 소스 검사 | 내 삶과 커리어에서가 포함된 원문을 FIRST_REQUEST 하나로 통일. Claude 명령 접두사만 별도 결합. 원문 보호 검사는 상수와 소비 위치를 대조하고 중복 리터럴을 금지. | 없음 |
| V-07 · (b) | [game.js](game.js) · [linear-tutorial.js](linear-tutorial.js) · [review-ui.js](review-ui.js) · [review-update.css](review-update.css) | 세 크기 | 설치 단계의 고정 하단과 첫 사용 6장에 나중에 보기 제공. 서비스·안내 종류·단계를 저장하고 스토리 E04로 진행. 새로고침·이어하기 후 엔딩에서 원래 단계 다시 열기 확인. | 안내를 미룬 것은 설치 완료로 처리하지 않음. 실제 설치 여부는 감지하지 않음. |
| J-03 · (a) | [request-data.js](request-data.js) · [linear-tutorial.js](linear-tutorial.js) · [review-ui.js](review-ui.js) · [review-update.css](review-update.css) | 세 크기 + 일반 Chrome 클릭 | 서비스 선택·설치 시작·막힘 도움말·첫 요청의 다른 선택에서 일반 대화용 맛보기 진입. U-02의 동일한 복사·열기 함수를 재사용. CareerPilot 저장·복원·지원 기록·파일 기능이 없음을 표시. | 외부 서비스에 요청을 실제 전송하거나 답변 품질을 측정하지 않음. |
| V-06 · (a) | [index.html](index.html) · [review-update.css](review-update.css) | 세 크기 | 기존 호숫가 배경 + 서안 큰 이미지 + 이서·윤 팀장·나리 작은 동료 프로필로 변경. 1화 · 서안과의 이야기 표시. 낮은 화면과 모바일에서 이어하기를 포함한 메뉴가 보이도록 높이 조정. | 새 원화 생성 없이 기존 인물 에셋을 재배치. |

## 일반 Chrome 실제 클릭 검증 · U-02

평소 실행 중인 Chrome 창에서 버튼을 실제 클릭했습니다. Chrome 원격 디버깅, 격리 프로필, Playwright 클릭으로 대체하지 않았습니다.

1. **성공 1회:** http://127.0.0.1:8774/ → 첫 요청 패널 → 요청 복사하고 ChatGPT 열기. 실제 chatgpt.com 탭이 열리고, 게임으로 돌아왔을 때 복사 성공 문구를 확인했습니다.
2. **실패 1회:** 같은 서버의 http://0.0.0.0:8774/ → 동일 버튼. 이 주소에서는 Clipboard API를 쓸 수 없어 복사가 실패했습니다. 실제 chatgpt.com 탭은 닫히지 않았고, 게임으로 돌아온 후 요청 전체가 선택됐습니다. 실패 안내도 접근성 화면에서 확인했습니다. 이 주소는 실패 재현용이며 게임 플레이 주소는 127.0.0.1을 사용합니다.
3. **보조 검사:** Clipboard 프로미스가 비동기로 `Document is not focused`를 거부하고 저장도 실패하는 경우를 별도 격리 검사했습니다. 호출 순서 `copy → open`을 검증했고, 서비스 URL 이동·탭 유지·요청 전체 선택을 확인했습니다. 실제 Chrome에서 이 오류 문구 자체를 재현했다고 주장하지 않습니다.
4. 점검 중 살펴본 localhost 클립보드 사이트 설정은 원래의 `요청(기본값)`으로 복원했습니다. 외부 서비스에 메시지를 보내지는 않았습니다.

`review/v0111/chrome-copy-success.png` · `review/v0111/chrome-copy-failure.png`

## 보조 검사와 저장 호환

- 세 크기에서 타이틀(새 게임·이어하기), 맛보기, Q/L 저장 복원, 우클릭 예외, 설치 안내 미루기·새로고침·이어하기·다시 보기, 첫 사용 6장 모두 미루기, 엔딩 다시 보기를 확인했습니다. 짧은 화면에서도 설치의 나중에 보기와 맛보기의 주버튼이 처음부터 화면 안에 보이는지 검사했습니다.
- 비동기 복사 실패와 저장 실패가 동시에 발생해도 서비스로 이동하며 탭을 닫지 않는지 검사했습니다.
- 실행 오류와 가로 넘침은 없었습니다. 키보드 검사는 Q/L이며, F5는 더 이상 게임에서 가로채지 않습니다.
- 저장 스키마 `ep01-script-v10`과 대본 61개 라벨·진행 위치는 유지했습니다. 새 `deferredTutorial`은 선택적 상태라 기존 저장에 없어도 동작합니다. 기존 v8/v9 저장 이식 처리는 유지했습니다. 퀵세이브 슬롯 번호와 저장 데이터 형식도 바꾸지 않았습니다.
- 원문 보호 검사 통과: 기존 주인공 원문 25개·선택 9개, 곁가지 요청 21개, 설치 ZIP 2개 해시·크기 유지. 첫 요청의 비교 기준만 FIRST_REQUEST로 변경했습니다.
- 실제 Claude/ChatGPT 설치 메뉴 경로는 이번 작업에서 변경하지 않았습니다. 기존 E-03의 계정별 검증 한계는 그대로입니다.
- 이 기록은 이번 후속 요청 범위의 검증입니다. 59개 전체 항목을 새로 완전 플레이한 결과로 확대하지 않습니다.

`checks/v0111/followup.cjs` · `review/v0111/followup.json` · `review/v0111/source-check.json`

## 화면 증거

- `review/v0111/800-title-resume.png` — 800×450 · 이어하기 포함 타이틀
- `review/v0111/375-title-resume.png` — 375×812 · 모바일 타이틀
- `review/v0111/800-install-defer.png` — 800×450 · 설치 안내 나중에 보기
- `review/v0111/800-taste.png` — 800×450 · 설치 없이 맛보기
