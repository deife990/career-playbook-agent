# ChatGPT에 CareerPilot 설치하기
CareerPilot은 계정 연결이 필요 없는 Skill 전용 플러그인입니다. 공개 플러그인 디렉터리에
심사·게시된 제품으로 소개하지 않습니다. 현재 배포는 개인용 플러그인 또는 로컬/저장소 marketplace를 사용합니다.

## ChatGPT 웹에서 확인하기
1. 왼쪽 **플러그인** → **개인용**을 여세요.
2. 오른쪽 **추가** → **플러그인 압축 파일 업로드**에서
   `careerpilot-chatgpt-v1.0.0-rc.1.zip`을 선택하세요. 일반 채팅 첨부와 구분하세요.
3. 업로드 후 표시되는 내용을 확인하고 CareerPilot을 설치·활성화하세요. 공개 디렉터리에
   제출하는 동작은 별도이며, 개인 테스트를 위해 공개 게시할 필요는 없습니다.
4. 새 채팅에서 `@`를 입력해 CareerPilot 또는 해당 Skill이 나타나는지 확인한 뒤
   “이직 준비 시작하고 싶어.”라고 말하세요.

2026-10-04 실제 계정에서 개인용 목록과 ZIP 업로드 메뉴를 확인했습니다. 아직 이 계정의
CareerPilot ZIP 수락·활성화·대화 동작은 확인하지 않았습니다. 계정별로 메뉴가 다를 수 있습니다.
로컬 설치가 웹 계정에 자동 등록되었다고 가정하지 마세요.

## 데스크톱/로컬 환경에서 ZIP을 받았을 때
1. `careerpilot-chatgpt-v1.0.0-rc.1.zip`을 풀어 `careerpilot` 폴더를 안전한 위치에 보관하세요.
2. 폴더에는 `plugin.json`, `skills`, `references`, `.agents/plugins/marketplace.json`이 있습니다.
3. 지원되는 ChatGPT 데스크톱/Work 환경에서 해당 폴더를 로컬 프로젝트/marketplace 원본으로
   사용하세요. 한 번의 등록에 CLI를 이용한다면 `codex plugin marketplace add "/압축 푼 위치/careerpilot"`
   을 실행할 수 있습니다. CareerPilot 사용 중에는 이 명령이 필요하지 않습니다.
4. 앱을 다시 열고 Plugins의 원본 목록에서 CareerPilot을 찾아 설치하세요. 설치 후 새 대화에서
   “이직 준비 시작하고 싶어.”라고 말하세요. 설치 항목과 Skill 활성화 여부를 확인하세요.

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
