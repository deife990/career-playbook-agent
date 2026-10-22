# CareerPilot 연결 확인표

2026-10-20 · 제품 1.2.0-rc.7 · 게임 회차·공개 ZIP 연결 확인 · 계정 실사용 시험 전

현재 연결 상태: [프롤로그·1화](episode01-v08/README.md)에 타이틀 설치 안내·첫 요청·12개 사용 카드를 구현했다. 공개 릴리스 원본 ZIP 두 개를 내려받아 크기·SHA-256을 확인했고 게임의 다운로드 경로에서도 같은 파일을 확인했다. [현재 실행본](episode01-v08/README.md)과 [파일 출처](episode01-v08/downloads/provenance.json)를 따른다. 아래 기능 표의 제품 동작은 문서 대조 결과이며 계정에서의 설치·실제 응답 성공은 여전히 미확인이다.

이번 확인은 현재 저장소의 README·워크플로·경험 정리·상태 보관 문서를 읽고 게임의 요청과 대조한 것이다. ChatGPT·Claude에 새로 설치하거나 이 요청들을 실제로 실행하지 않았다. 따라서 ‘지원하도록 설계된 기능’과 ‘현재 계정에서 확인된 동작’을 구분한다.

2026-10-20 보완: 아래 표는 기본 요청·설치 경로의 연결표다. 전체 기능 범위 검토에서 찾은 빈틈을 [전체 에피소드](EPISODES.md)와 [선택형 메시지 12개](SIDE_STORIES.md)에 반영했다. 최신 경험 탐색·파일 검사·제출본 보관·여러 지원·복원과 기타 기능의 전체 대응은 [FEATURE_COVERAGE.md](FEATURE_COVERAGE.md)를 기준으로 한다. [전편 상세 대본](MAIN_SCRIPT.md)과 [선택형 상세 대본](SIDE_SCENES_PLAY.md)까지 작성했으며 실제 사용 시험은 아니다.

## 1. 첫 대본의 연결

| 지점 | 게임이 요청하는 것 | 확인한 제품 동작 | 판단과 남은 확인 |
|---|---|---|---|
| P00·D01 | 사용하는 서비스 하나에 설치 | README와 공개 릴리스에 두 설치 ZIP이 있음. 현재 공식 도움말을 게임 안내에 반영 | 1.2.0-rc.7 파일·해시·게임 경로 확인. 계정별 설치·활성화 성공은 미확인 |
| E03-A 새 시작 | 현재 상황부터 바꿀 점·지킬 조건을 질문 하나씩 정리 | W01은 현재 상황과 변화 이유·지역 등 요구조건을 점진적으로 확인. 이력서는 선택 사항. 모름·건너뛰기 허용 | 기능과 맞음. W01 전체를 끝내거나 고정된 첫 응답을 보장하지 않음 |
| E03-A 기존 대화 | 이미 확인한 정보를 활용해 불분명한 점 하나 정리 | W01·언어 원칙은 기존 사실 재사용, 중복 질문 최소화 | 같은 대화를 우선 사용. 다른 대화로 옮기면 전체 경력 정보 복원 필요 |
| E03-B | 가상 대화로 시작 방법 이해 | W01의 질문 흐름을 바탕으로 별도 작성한 정적 예시 | 실제 생성 결과·실제 서안의 계정처럼 표현하지 않음 |
| E04 복귀 | 어떤 경로에서도 동일한 이야기 진행 | 플러그인 기능 아님. 게임의 서사 설계 | 사용자가 한 말을 기억하는 것은 C2 선택에 한정. 플러그인 응답은 게임이 읽지 않음 |

첫 요청은 자연어 예시다. 별도 명령어·새 Skill 설치가 필요한 기능처럼 표현하지 않는다.

## 2. 뒤 에피소드의 요청 예시

아래는 실제 상황이 해당될 때 사용할 문장이다. 가상의 회사·면접·오퍼를 사용자의 사실로 전달하지 않는다. 게임의 샘플 대화는 외부 서비스로 자동 전송하지 않는다.

| 회차 / 목적 | 사용자가 보낼 수 있는 요청 | 대조한 기능 | 알아야 할 범위 |
|---|---|---|---|
| 1화 / 상황과 조건 | “CareerPilot으로 이직을 준비하고 싶어. 바꾸고 싶은 점과 지키고 싶은 조건을 정리하고 싶어. 먼저 내 현재 상황부터 질문 하나씩 해줘.” | W01 | 현재 상태와 바꿀 점 또는 지킬 조건 하나면 시작 가능. 이력서 필수 아님 |
| 1화 이후 / 방향 | “내가 원하는 조건과 지금까지 한 일을 바탕으로 다음 커리어 방향을 같이 정해보자.” | W02 | 여러 방향과 확인할 점을 비교. 게임이 선택한 이유를 자동 입력하지 않음 |
| 2화 / 경험 정리 | “내가 한 업무에서 이직에 쓸 경험 하나를 정리하고 싶어. 직접 한 행동부터 하나씩 물어봐줘.” | experience-mining·W01 | 팀 전체 성과와 본인 행동 분리. 모르는 수치는 채우지 않음 |
| 3화 / 탐색 | “내 조건에 맞는 회사와 포지션을 찾아줘.” | W03 | 실제 공고 확인은 접근 가능한 최신 공식 자료에 달림. 자료가 없으면 조사 후보로 표시 |
| 3화 / 공고 이해 | 실제 공고 링크·본문과 함께 “이 공고에서 어떤 사람을 찾는지 먼저 분석하고 내 경험과 비교해줘.” | W04 | 사용자의 경력에 맞춰 채용 요구를 지어내지 않음. 링크가 안 읽히면 공고 본문 사용 |
| 3화 / 지원서 | 선택한 실제 공고를 지정해 “여기에 지원할래. 내 경험으로 이력서부터 준비하자.” | W05 | 실제 행동을 확인해 맞춤 문구 작성. 실제 제출 여부는 사용자가 알려줘야 함 |
| 4화 / 예정된 면접 | 실제 회사·일정을 알린 뒤 “이 회사 면접이 잡혔어. 이번 면접 준비를 도와줘.” | W06 | 제출했던 이력서와 실제 라운드 정보 기준. 일정이 없는 사용자에게 이 문장을 쓰게 하지 않음 |
| 4화 / 연습 | “실제 면접 일정은 없어. 관심 직무로 모의면접을 해보고 싶어. 필요한 것부터 물어봐줘.” | W07 | 직무가 불명확하면 먼저 확인. 한 질문씩 답하고 진행 중에는 코칭하지 않음 |
| 4화 / 연습 종료 | “모의면접 끝내자. 피드백 줘.” | W07 | 명시적으로 끝낸 뒤 피드백. 정해진 문항 수만으로 자동 종료를 약속하지 않음 |
| 5화 / 실제 면접 복기 | 실제 면접이 있었을 때 “면접 끝났어. 기억나는 질문부터 같이 정리하자.” | W08 | 실제 질문부터 수집. 모의면접과 구분하고 반응으로 합격을 예측하지 않음 |
| 6화 / 실제 오퍼 비교 | 실제 조건을 알려준 뒤 “오퍼를 받았어. 처음 이직하려던 이유와 조건에 맞는지 비교해줘.” | W09 | 조건과 불확실성 비교. 수락·거절은 사용자 판단이며 게임의 선택과 별개 |
| 6화·중단 전 / 보관 | “내 경력 정보 전체를 내보내줘. 회사별 지원·면접 기록도 포함해줘.” | career-state·상태 보관 | 전체 정보 파일 보관. 파일 생성 불가 시 같은 정보의 JSON 대안 |
| 새 대화 / 복원 | 본인 경력 정보 파일과 함께 “이 경력 정보로 이어서 준비하자. 복원한 회사와 면접 기록부터 확인해줘.” | career-state·상태 복원 | 설치 ZIP을 경력 정보 파일로 사용하지 않음. 자동 기억·자동 서비스 간 동기화로 설명하지 않음 |

모의면접을 이미 시작한 동안에는 이력서 수정·중간 피드백을 섞지 않는다. 사용자가 끝낸 뒤 복기·수정으로 넘어간다. 면접이 임박한 사용자는 W01 전체를 완료하지 않고 필요한 면접 준비부터 시작할 수 있다. 게임이 제품의 필수 입구가 되지는 않는다.

### 지역·생활 제약을 실제 준비에 반영

지역 유지가 필수인지 선호인지, 통근·이주 범위를 어디까지 허용할지는 실제 사용자가 직접 확인한다. 서안의 조건을 복사하지 않는다. 기존에 확인한 필수 조건은 탐색·지원서·오퍼 비교까지 유지하고, 바꾸려면 사용자가 명시한다.

W02·W03에서 지역 안의 전환과 이동을 수반하는 전환을 비교할 수 있다. 후보가 적거나 원격·통근 조건이 확인되지 않으면 그대로 남긴다. 더 높은 연봉만으로 이동이 유리하다고 결론 내리지 않으며, 공급된 주거·이동·근무 조건과 모르는 항목을 분리한다. 현재 급여를 유지하며 준비하는 것도 다음 행동이 될 수 있다.

운영 경력에서는 예외 대응·협업·개선 등을 실제로 했는지 질문할 수 있다. 반복 업무를 했다는 사실만으로 특정 역량이나 성과를 단정하지 않는다. 게임에서 다룬 가상 그룹의 자금 소문은 실제 사용자 회사의 재무 사실이나 개인의 경력 정보로 저장하지 않는다.

## 3. 설치 안내의 목적지와 상태

현재 대본에서는 버튼 이름과 목적지만 정한다. 웹게임 UI·리디렉션·업로드는 구현하지 않는다.

| 버튼 | 목적지 / 자료 | 상태 |
|---|---|---|
| ChatGPT 설치 ZIP | [rc.7 ChatGPT ZIP](https://github.com/deife990/career-playbook-agent/releases/download/v1.2.0-rc.7/careerpilot-chatgpt-v1.2.0-rc.7.zip) | 현재 README에서 확인한 주소. 이번 작업의 다운로드 시험 없음 |
| Claude 설치 ZIP | [rc.7 Claude ZIP](https://github.com/deife990/career-playbook-agent/releases/download/v1.2.0-rc.7/careerpilot-claude-v1.2.0-rc.7.zip) | 현재 README에서 확인한 주소. 이번 작업의 다운로드 시험 없음 |
| 버전·릴리스 | [공개 릴리스](https://github.com/deife990/career-playbook-agent/releases/tag/v1.2.0-rc.7) | 출시 후보임을 표시. GitHub Source code ZIP과 설치 ZIP 구분 |
| ChatGPT 열기 | [ChatGPT](https://chatgpt.com) | 기존 대화·플러그인 선택 자동화 없음 |
| Claude 열기 | [Claude](https://claude.ai) | 기존 대화·Skill 활성화 자동화 없음 |
| ChatGPT 설치 단계 | [현재 로컬 안내](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/docs/install-chatgpt.md) | 웹 구현 시 안내를 공개 페이지 또는 게임 내 패널로 옮길 것 |
| Claude 설치 단계 | [현재 로컬 안내](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/docs/install-claude.md) | 웹 구현 시 안내를 공개 페이지 또는 게임 내 패널로 옮길 것 |
| 설치 도움말 | [현재 로컬 도움말](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/docs/troubleshooting.md) | 기능 미지원·조직 제한·잘못된 ZIP 등을 구분. 공개 페이지 목적지는 미구현 |

공개 전에는 지원 계정으로 파일 받기 → 업로드 → 활성화 → 새 대화 → 첫 요청 → 게임 복귀를 각각 확인해야 한다. 현재 README도 rc.7의 실제 웹 설치와 전체 과정 시험이 없음을 명시한다. ChatGPT의 개인용 ZIP 업로드 경로는 과거 시험 계정 기록이며 모든 계정에서 같은 메뉴를 보장하지 않는다.

계정에서 설치 메뉴가 없으면 게임 진행은 유지하고 지원 환경 안내로 연결한다. 실제 설치 성공을 다운로드 횟수나 일반 AI 응답만으로 판단하지 않는다. 이미 설치한 사람에게 재설치를 요구하지 않는다.

## 4. 게임이 보관할 최소 정보

추후 구현 시 장면 위치, 게임 속 선택, 선택한 서비스, 직접 표시한 첫 사용 상태 정도만 기기에 저장하는 안이다. 선택 상태는 대본 분기를 위한 것이며 실제 성격·이직 조건을 추론한 프로필이 아니다.

이력서·연봉·기업명·실제 면접 기록·CareerPilot 응답은 게임으로 가져오지 않는다. 실제 작업을 했다는 자기보고도 관계 점수나 후일담 잠금에 사용하지 않는다. 자동 설치 감지·사용 횟수 수집·서비스 간 동기화는 설계 전제에 포함하지 않는다. 현재 저장 기능은 구현하지 않았다.

## 5. 확인 근거와 한계

- [현재 제품 README](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/README.md), [버전 파일](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/VERSION), [사용자 언어 원칙](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/principles/ux-language.md).
- [W01](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w01-career-setup.md), [W02](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w02-career-strategy.md), [경험 정리](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/experience-mining.md).
- [W03](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w03-opportunity-discovery.md), [W04](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w04-job-intelligence.md), [W05](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w05-application-prep.md).
- [W06](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w06-interview-prep.md), [W07](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w07-mock-interview.md), [W08](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w08-interview-debrief.md), [W09](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w09-offer-decision.md).
- [경력 정보 저장·복원](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/docs/state-portability.md), [상태 명세](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/state/state.md).

현재 명세에서 기능 연결은 찾았다. 이번 대본의 자연어 요청에 대한 실제 응답, 첫 사용자 설치 성공률, 재미·행동 변화는 확인 전이다. README에는 Claude 평가에서 근거 없는 표현 등이 남았다고 공개되어 있다. 특히 이력서 문장을 그대로 승인하도록 가르치지 않고, 사용자가 직접 한 일과 맞는지 확인하는 행동을 2·3화에 넣는다. 대본 작성으로 제품의 미해결 문제가 해결됐다고 주장하지 않는다.
