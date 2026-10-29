# 알림 카드 · 이서 메시지 장면 수정

2026-10-28 · 게임 v0.14.0-dev · UI/UX v1 · 로컬 구현 · 미배포

사용자의 이번 장면별 지시를 UI/UX v1 위에 적용했다. 상위 AGENTS.md와 UI_UX_BASELINE.md·UI_UX_VERSIONS.json을 확인했고, 확정 시안 `ui-ux-v1/`은 수정하지 않았다. 이전 미커밋 구현·QC 보완을 보존했다. 이전 [QC 기록](QC_20261028.md)은 당시 결과로 유지한다.

## 변경

- `#message-arrival`을 급여·회사 공지·면접 일정·이서 도착 알림이 함께 사용하는 카드로 정리했다. `notification-ui.js`에서 현재 장면의 원문과 표시 역할로 모델을 결정한다. 이서 전용 코드가 카드 내용을 덮어쓰지 않는다.
- 출처 → 제목 → 본문 순서로 표시한다. 급여는 기존 은행 설정인 토즈의 원화 기호·입금 표시, 회사 공지는 노스윈드 레저 그룹이 발신 주체다. 연봉 동결·일부 사업장 매각·조직 축소·신규 투자 계획 조정·추후 안내 문장을 원문 그대로 표시한다.
- 큰 휴대폰·시계·상대 헤더·말풍선은 시스템 카드에 표시하지 않는다. 속마음은 하단 서사 영역에 유지한다. 알림은 필요한 만큼 높이가 늘어나고, 화면에 들어가지 않는 경우 내부 스크롤로 전문을 읽는다. 낮은 가로 화면은 카드와 서사를 좌우로 배치한다.
- 알림에는 종료 타이머나 별도 열기 버튼이 없다. 자동 진행·읽은 문장 스킵도 알림에 도착하면 정지한다. 카드에서 클릭·스크롤·키보드 읽기를 해도 대사가 진행되지 않는다.
- Start의 급여·회사 공지와 E05의 면접 일정만 시스템 정보로 구분했다. 실제 운영팀 대화, 엔딩의 서안 메시지, 윤 팀장이 직접 보낸 회상 속 메일은 각 장면의 대화·메일 표현을 유지한다.
- 이서 도착 알림은 고정 장면 번호 대신 **첫 이서 수신 메시지 전까지** 표시한다. 대본에 삽입되는 표정 명령 때문에 서안의 “이서 언니한테 연락왔네?”에서 알림이 일찍 숨겨지는 문제를 함께 해소했다.
- PC 메시지 왼쪽은 기존 대화, 오른쪽은 이서 원화다. 서안용 착석 프레임을 제거하고 이미지 고유 비율과 `object-fit: contain`을 사용하는 이서 전용 프레임을 적용했다. front/concerned/smile 전환과 표정별 대체 텍스트를 유지한다.
- 모바일은 큰 오른쪽 인물을 숨기고 메시지 읽기를 우선한다. 이름·프로필은 이서, 수신은 이서, 발신 답장은 서안이다. 메시지별 접근성 이름에도 발신자를 구분했다. 대화 후에는 기존 펍 서안 원화로 복귀한다.
- 카드 상태를 새 저장 필드로 만들지 않았다. 저장한 대본 위치에서 화면을 다시 계산한다. 대본·선택지·요청 전문·설치 ZIP·저장 스키마는 변경하지 않았다.

## 실제 검수

macOS 로컬 서버 `http://127.0.0.1:8922/`, Playwright Chromium의 CSS 화면 크기 시뮬레이션. 기본 캡처는 동작 줄이기 설정을 사용했다. 사용자 브라우저의 실제 저장 기록은 건드리지 않는 별도 브라우저 컨텍스트로 검사했다.

| 화면 | 글자 크기 | 결과 |
|---|---|---|
| 1440×900 | 18 / 24px | 통과 |
| 390×844 | 18 / 24px | 통과 |
| 320×667 | 18 / 24px | 통과 |
| 800×450 | 18 / 24px | 통과 |

각 조합에서 급여·회사 공지·일정 카드의 화면 내 위치, 알림/속마음/진행 버튼 비겹침, 회사 공지 본문 완전 일치, 속마음 전체 읽기 폭, 급여 전후 카드 높이 유지, 이서 도착 알림과 세 표정, 수신·발신 구분, PC 인물 비율/위치, 모바일 프로필, 펍 복귀를 검사했다. 알림 클릭·스크롤·키보드 입력, 시간 경과, 알림 중 창 크기 변경, 자동 저장 후 새로고침·이어하기, 수동 저장·불러오기, 이서 대화 중 저장 복원·PC↔모바일 전환 후에도 다른 장면 표시가 남지 않는지 검사했다. 활성 자동 진행이 알림에 도착할 때 정지하는 경우도 별도 확인했다.

실행 결과:

- `node checks/source-check.cjs` — 보호 대사·선택지·요청·설치 ZIP 검사 통과.
- `node checks/v0140/alerts-iseo.cjs` — 위 8개 조합의 알림·대화·저장·창 크기 변경 검사 통과.
- `node checks/v0140/qc-regressions.cjs` — 기존 메뉴·원화 보기·설치 자료·진행 버튼 검사 8개 조합 통과. 과거 잠금 화면/메일 창 검사만 이번 카드 요구사항으로 갱신했다.
- `content-state.cjs`, `handoff.cjs`, `save-compat.cjs`, `tutorial-flow.cjs`, `practice.cjs`, `interaction.cjs`, `chatgpt.cjs`, `ui-v1.cjs`, `followup.cjs`, `layout-a11y.cjs` — 기존 기능 회귀 검사 통과. 외부 AI 열기 검사는 모의 환경이다.
- 변경 JS 구문 검사 및 `git diff --check` 통과.
- `python3 ../../../full-ui-redesign/verify-uiux.py` — 확정 시안 44개 파일의 누락·추가·변경 없음.

## 전후 화면

수정 전 96장과 수정 후 96장을 별도로 보관했다. 네 화면 × 두 글자 크기 × 급여 전후·공지·팀 채팅·일정·이서 도착/정면/서안 답장/걱정/미소·펍 복귀·엔딩의 12개 상태다. 전체 파일과 위치/스크롤 측정은 [수정 전](output/alerts-iseo/before/measurements.json), [수정 후](output/alerts-iseo/after/measurements.json)에 있다.

| 대표 화면 | 수정 전 | 수정 후 |
|---|---|---|
| PC 급여·속마음 | [전](output/alerts-iseo/before/1440x900-18px-salary-after.png) | [후](output/alerts-iseo/after/1440x900-18px-salary-after.png) |
| PC 회사 공지 | [전](output/alerts-iseo/before/1440x900-18px-notice.png) | [후](output/alerts-iseo/after/1440x900-18px-notice.png) |
| 390×844 회사 공지 | [전](output/alerts-iseo/before/390x844-18px-notice.png) | [후](output/alerts-iseo/after/390x844-18px-notice.png) |
| 320×667 큰 글자 공지 | [전](output/alerts-iseo/before/320x667-24px-notice.png) | [후](output/alerts-iseo/after/320x667-24px-notice.png) |
| 800×450 큰 글자 공지 | [전](output/alerts-iseo/before/800x450-24px-notice.png) | [후](output/alerts-iseo/after/800x450-24px-notice.png) |
| PC 이서 대화 | [전](output/alerts-iseo/before/1440x900-18px-iseo-front.png) | [후](output/alerts-iseo/after/1440x900-18px-iseo-front.png) |
| 모바일 서안의 답장 | [전](output/alerts-iseo/before/390x844-18px-seoan-reply.png) | [후](output/alerts-iseo/after/390x844-18px-seoan-reply.png) |
| 이서 대화 후 펍 복귀 | [전](output/alerts-iseo/before/1440x900-18px-pub-return.png) | [후](output/alerts-iseo/after/1440x900-18px-pub-return.png) |

캡처 중 PC 이서 대화, PC/모바일 공지, 모바일 발신 답장, 낮은 가로 화면의 이서 미소 등을 직접 눈으로 확인했다. 나머지 캡처는 위치·내용·이미지 비율 검사를 자동으로 수행했다.

## 검증의 한계

실제 iPhone·Android·태블릿, Safari/Firefox, 화면 낭독기, 일반 동작 설정의 애니메이션 전체 구간, 실제 ChatGPT/Claude 계정에서 설치·외부 대화 실행, 신규 사용자 관찰은 이번 작업에서 검증하지 않았다. 브라우저 크기 시뮬레이션 통과를 실기기 검수 완료로 기록하지 않는다.

입력과 변경 파일 해시는 [이번 작업의 소스 기록](ALERTS_ISEO_20261028_SOURCE.json), 이전 QC 당시 소스는 [기존 기록](QC_20261028_SOURCE.json)을 참고한다.
