# E-03 · 실제 서비스 설치 경로 확인 기록

2026-10-23. **부분 확인입니다. 실제 로그인 계정의 설치 경로는 확정하지 않았습니다.** 따라서 게임의 기존 Claude·ChatGPT 메뉴 경로 자체를 새 경로로 교체하지 않았습니다. 단계별 도움말·사전 조건·일반 파일명·확인 동사만 개선했습니다.

| 서비스 | 확인한 근거 | 확인 결과 | 한계 |
|---|---|---|---|
| Claude | Anthropic 공식 지원 문서 | 현재 열람한 본문에는 Customize > Skills > + > Create skill > Upload a skill 경로와 코드 실행 관련 사전 조건, 스위치 활성화가 설명됨 | 실제 claude.ai는 로그인 화면으로 열림. 사용자 지정 메뉴와 권한을 실제 계정 내부에서 확인하지 못함. 코드 실행 설정의 Settings/Capabilities와 스킬 업로드 메뉴를 같은 단계로 섞지 않음 |
| ChatGPT | OpenAI 공식 Plugins 도움말 | 플러그인 선택/사용, 옵션·권한이 있을 때의 웹 ZIP 업로드, 관리자용 Admin console > workspace > Plugins > Add > Upload plugin 경로를 확인 | 모든 개인 계정에 Personal > + > ZIP 업로드가 제공된다는 근거는 확인하지 못함. 실제 계정의 메뉴·업로드 권한 미검증. 관리자 경로를 일반 사용자 경로로 바꾸지 않음 |

공식 근거:

- [Anthropic · Using Skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [OpenAI · Plugins in ChatGPT](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt)

게임에는 실제 메뉴 이름이 계정에 따라 다를 수 있다는 안내를 유지합니다. Claude의 다운로드 도움말은 파일·폴더 문제만 다루고, 권한/코드 실행 관련 조건은 설치 메뉴·활성화 도움말에서 다룹니다. ChatGPT는 다운로드 전에 계정 종류와 ZIP 업로드 옵션·권한을 확인하도록 안내합니다. 모바일 ZIP 업로드 가능 여부도 검증 완료로 표시하지 않습니다.

두 배포 ZIP의 파일명·크기·SHA-256은 기존 provenance와 일치합니다. 로컬 다운로드 버튼으로 파일 수신을 시험하는 것은 실제 서비스에 설치·활성화하는 것과 별개입니다.

실제 계정에서 남은 확인은 다음과 같습니다: 서비스별 메뉴 열기 → ZIP 업로드 옵션/권한 확인 → 업로드/켜기 → 새 대화에서 CareerPilot 선택·호출. 이 과정의 계정별 화면을 확인하기 전까지 E-03을 완료로 보고하지 않습니다.
