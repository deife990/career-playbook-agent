# 알림 위치·Offlook·이서 인물 후속 수정

2026-10-28 · v0.14.0-dev · UI/UX v1 유지 · 로컬 워크트리 · 미배포

사용자의 후속 지시를 [직전 알림/이서 수정](ALERTS_ISEO_20261028.md)보다 우선 적용했다. 기존 미커밋 작업과 확정 시안은 보존했다. 직전 보고서와 캡처는 당시 기록으로 남긴다.

## 이번 변경

- **이서 도착 알림**: 현재 카드 스타일은 유지하고, 이전의 **화면 중앙 하단·서사 대사 위** 위치로 복원했다. 별도 열기 단계나 타이머를 추가하지 않았다.
- **토즈 급여 알림**: 이서 알림과 동일한 카드·위치·여백·글자 위계를 사용한다. 토즈 표시와 은행 아이콘, ‘지금’, 원문의 ‘급여가 입금되었습니다.’, ‘레이크포트 파크 · 급여 입금’을 담는다. 중복 입금 문장은 제목에 한 번 표시하고 기기 면·잠금 화면 시계는 표시하지 않는다.
- **회사 공지**: 윤 팀장의 메일과 같은 Offlook 상단 바·창 표시·메일 검색·받은 편지함·발신자 구성으로 변경했다. 공지 발신자는 노스윈드 레저 그룹이며 윤 팀장 개인의 메시지로 바꾸지 않았다. 본문은 연봉 동결·일부 사업장 매각·조직 축소·투자 계획 조정·추후 안내를 모두 원문대로 유지한다. 화면 높이 안에서 메일 전문을 스크롤해 읽을 수 있다.
- **오른쪽 이서**: 장식 테두리·모서리·색 배경·상자 그림자를 제거했다. 비율을 위한 투명한 배치 영역만 유지하며 기존 원화와 front/concerned/smile 전환을 사용한다. 모바일은 계속 메시지 우선이다. 수신 이서·발신 서안, 이후 펍 서안 복귀를 유지한다.
- 회사/일정의 낮은 가로 창 좌우 배치와, 중앙 하단의 급여/이서 알림 배치를 종류별로 구분했다. 공유 상태와 저장 위치 복원은 기존 장면 모델을 사용한다.

## 검수

Playwright Chromium, 로컬 `http://127.0.0.1:8922/`. 1440×900 / 390×844 / 320×667 / 800×450에서 각각 18·24px 글자로 확인했다. 사용자 브라우저와 분리된 컨텍스트로 검사했다.

- `node checks/v0140/alerts-iseo.cjs alert-style-followup`: 8개 조합 통과. 중앙 정렬, 화면 이탈·대사/버튼 겹침 없음, 회사 메일과 윤 팀장 메일 상단 바 스타일 일치, 공지 원문 일치, 읽기 스크롤, 자동 진행 정지, 저장·새로고침·수동 슬롯 복원, 창 크기 변경, 이서의 무테·투명 배치와 비율, 발신/수신·표정·펍 복귀·팀/엔딩 메시지를 검사했다.
- `node checks/v0140/qc-regressions.cjs`: 8개 조합 통과. 메뉴·원화 보기·설치 안내 등 기존 QC 검사 유지.
- `node checks/v0140/ui-v1.cjs`: 기존 UI/UX v1 화면 이동과 프로필 검사 통과.
- `node checks/source-check.cjs`: 대사·선택지·요청·설치 ZIP 검증 통과.
- JS 구문 검사와 `git diff --check` 통과. 확정 시안 검증은 44개 파일 변경·누락·추가 없음.

실기기·Safari/Firefox·화면 낭독기·일반 모션 전체 구간·실제 ChatGPT/Claude 계정 설치 및 실행은 이번 후속 작업에서 미검증이다.

## 전후 화면

이번 후속 수정 전 96장과 수정 후 96장을 [별도 폴더](output/alert-style-followup/)에 저장했다. 직전 작업의 캡처를 덮어쓰지 않았다. 전체 측정: [전](output/alert-style-followup/before/measurements.json) / [후](output/alert-style-followup/after/measurements.json).

| 화면 | 변경 전 | 변경 후 |
|---|---|---|
| 이서 알림 위치 | [전](output/alert-style-followup/before/1440x900-18px-iseo-arrival.png) | [후](output/alert-style-followup/after/1440x900-18px-iseo-arrival.png) |
| 토즈 급여 알림 | [전](output/alert-style-followup/before/1440x900-18px-salary-after.png) | [후](output/alert-style-followup/after/1440x900-18px-salary-after.png) |
| Offlook 회사 공지 | [전](output/alert-style-followup/before/1440x900-18px-notice.png) | [후](output/alert-style-followup/after/1440x900-18px-notice.png) |
| 프레임 없는 이서 | [전](output/alert-style-followup/before/1440x900-18px-iseo-front.png) | [후](output/alert-style-followup/after/1440x900-18px-iseo-front.png) |
| 모바일 이서 알림 | [전](output/alert-style-followup/before/390x844-18px-iseo-arrival.png) | [후](output/alert-style-followup/after/390x844-18px-iseo-arrival.png) |
| 낮은 창 급여 알림 | [전](output/alert-style-followup/before/800x450-24px-salary-before.png) | [후](output/alert-style-followup/after/800x450-24px-salary-before.png) |

코드 변경과 이전 작업 보존 해시는 [소스 기록](ALERT_STYLE_FOLLOWUP_20261028_SOURCE.json)을 참고한다.
