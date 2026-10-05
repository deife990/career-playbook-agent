# ChatGPT에 CareerPilot 설치하기
CareerPilot은 계정 연결이 필요 없는 Skill 전용 플러그인입니다. 공개 플러그인 디렉터리에
심사·게시된 제품으로 소개하지 않습니다. 현재 배포는 개인용 플러그인 또는 로컬/저장소 marketplace를 사용합니다.

## ChatGPT 웹에서 확인하기
1. 왼쪽 **플러그인** → **개인용**을 여세요.
2. 오른쪽 **추가** → **플러그인 압축 파일 업로드**에서
   `careerpilot-chatgpt-v1.0.0-rc.4.zip`을 선택하세요. 일반 채팅 첨부와 구분하세요.
3. 업로드 후 표시되는 내용을 확인하고 CareerPilot을 설치·활성화하세요. 공개 디렉터리에
   제출하는 동작은 별도이며, 개인 테스트를 위해 공개 게시할 필요는 없습니다.
4. 새 채팅에서 `@`를 입력해 CareerPilot 또는 해당 Skill이 나타나는지 확인한 뒤
   “이직 준비 시작하고 싶어.”라고 말하세요.

2026-10-04 실제 계정에서 수정된 단일 플러그인 ZIP 수락과 설치 완료, 12개 Skill 표시를
확인했습니다. 설치 화면의 **CareerPilot 설정**을 누르면 시작 대화가 열립니다.
전체 이직 lifecycle 검증과 최종 출시 검증은 별도로 진행 중입니다.
기존 개인용 CareerPilot은 **추가 작업 → 새 버전 업로드**로 수정본을 반영할 수 있습니다.
rc.2는 실제 업로드 완료와 버전 표시를 확인했고 가상 시나리오 검증 중입니다.

## ZIP 구성과 로컬 설치
웹 업로드용 ZIP에는 `plugin.json`, `.codex-plugin/plugin.json`, `skills`, `references`가 있습니다.
로컬 marketplace 목록은 웹 ZIP에 넣지 않습니다. 데스크톱/CLI에서 저장소를 사용하려면
아래 개발 저장소 경로의 marketplace 등록을 사용하세요. 계정별 메뉴가 다를 수 있습니다.

## 개발 저장소를 사용할 때
저장소 루트의 `.agents/plugins/marketplace.json`은 `adapters/chatgpt`를 가리킵니다. Core를 변경한
개발자는 생성·검증 후 `codex plugin marketplace add "/저장소 위치"`로 원본을 등록할 수 있습니다.
GitHub 원본으로 배포할 때는 검증된 ref를 선택하세요. 현재 구현 브랜치는 검증 중인 개발 코드입니다.

## 설치 항목이 보이지 않으면
개인 marketplace나 사용자 Skill이 허용되는 계정/워크스페이스인지 확인하세요. 지원되지 않는
surface에서는 ZIP을 채팅에 첨부했다고 자동 설치된 것으로 간주하지 마세요. 관리자에게 허용된
marketplace 설치를 문의하거나 지원되는 데스크톱 환경을 사용하세요. IDE에서는 플러그인 설치를
지원하지 않습니다. 원본 파일을 넣는 것과 설치·활성화는 별도입니다.
음성/GPT-Live와 지속적인 파일 기억은 계정·surface에 따라 다릅니다. 사용할 수 없으면 텍스트
모의면접과 경력 정보 내보내기/복구를 사용하세요. CareerPilot은 이 기능을 새 API로 구현하지 않습니다.

2026-10-02 확인: [공식 플러그인 사용 안내](https://learn.chatgpt.com/docs/plugins),
[공식 패키징 및 marketplace 안내](https://developers.openai.com/plugins/build/plugins).
