# 실행 빌드 0.12.0

「퇴사할 건데, 좋아해도 될까요?」 프롤로그와 1화 플레이 빌드입니다.

## 실행

이 폴더에서 로컬 서버를 실행하세요.

    python3 -m http.server 8774 --bind 127.0.0.1

브라우저에서 `http://127.0.0.1:8774/?v=0.12.0`을 여세요. 저장 데이터는 브라우저의 로컬 저장소에 보관됩니다.

## 현재 변경

[튜토리얼·실습 UI 개편](UPDATE_V0120.md) · [화면 검수 자료](review/v0120/index.html)

## 검수 자료

- `checks/v0120/`: v0.12.0 검수 스크립트. 실행하려면 Node.js 환경에서 Playwright를 설치해야 합니다.

## 주요 파일

- `story.js`, `cards.js`: 이야기 분기와 요청 카드
- `game.js`, `scene-ui.js`, `review-ui.js`: 진행·장면·내 준비
- `guide-panel.js`, `practice-ui.js`, `ai-handoff.js`: 공통 안내·실습·서비스 이동과 복귀
- `assets/`: 게임 원화와 튜토리얼 이미지
- `downloads/`: 게임 안에서 선택적으로 제공하는 예시 ZIP
- `vendor/`: Monogatari 엔진, 라이선스와 출처

게임은 CareerPilot 계정이나 대화 내용을 읽지 않습니다. 외부 서비스 이동은 사용자가 직접 선택할 때만 시작됩니다.
