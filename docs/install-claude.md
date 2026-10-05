# Claude에 CareerPilot 설치하기
하나의 Skill ZIP만 설치하면 됩니다. 여러 Skill을 따로 설치할 필요가 없습니다.
1. `careerpilot-claude-v1.0.0-rc.6.zip`을 받으세요. ZIP 안에 `careerpilot/SKILL.md`가 있어야 합니다.
2. Claude의 Customize(사용자 지정) → Skills(스킬) → 스킬 추가 → 스킬 업로드를 선택하세요.
   현재 계정 화면에서 이 경로를 확인했습니다. 다른 UI에서는 `+` → Create skill → Upload a skill로 표시될 수 있습니다.
3. ZIP을 업로드하고 CareerPilot을 켜세요. 새 대화에서 “이직 준비 시작하고 싶어.”라고 말하세요.
4. Skills를 사용할 수 없으면 Settings → Capabilities의 Code execution and file creation을
   확인하세요. 회사 계정에서는 관리자가 Skills/사용자 생성 Skill을 허용해야 할 수 있습니다.

Claude의 Skill 기능은 위 호스트 설정을 요구할 수 있습니다. CareerPilot 자체는 Python 프로그램을
실행하거나 패키지를 설치하지 않으며 새 계정·API key·서버가 필요하지 않습니다.
파일·웹·음성 기능이 없으면 대화/제공 자료/텍스트 연습과 경력 정보 내보내기를 사용합니다.
업로드가 성공했더라도 새 대화에서 활성화·파일 접근을 확인해야 합니다.
2026-10-02 확인: [공식 사용 안내](https://support.claude.com/en/articles/12512180-use-skills-in-claude),
[공식 ZIP 구조 안내](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills).
