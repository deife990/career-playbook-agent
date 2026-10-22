# 기능 전체와 이야기의 연결 — 1.2.0-rc.7

2026-10-20 · 상세 원고 0.7 기준 · 사용자 기능의 기획 연결표 · 실행 검증 아님

## 범위와 완료 수준

[제품 버전](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/VERSION)의 W01–W09, `core/capabilities`의 중복 파일을 제외한 21개 기능 문서, 라우팅·경력 정보 보관, 설치·업데이트 안내를 기준으로 삼았다. 미래 어댑터·직접 회사 계정 연결은 제공 기능으로 포함하지 않는다. 내부 필드·검사 단계마다 플레이어가 명령을 외우게 하는 것이 목표는 아니다.

**전체 사용자 기능에 상황·대사·입력·가상 결과·확인·다음 행동을 배정하고 전편의 선택 반응·합류·후일담 원고까지 작성했다.** 게임 구현, 실제 계정에서의 기능 성공·학습 효과는 미검증이다. 기능 문서별 원고 대응과 교육 효과를 구분한다.

본편은 [전편 상세 대본](MAIN_SCRIPT.md), 선택형 장면은 [상세 대본](SIDE_SCENES_PLAY.md)과 [실제 사용 카드](SIDE_STORIES.md)를 함께 사용한다. 요약은 [EPISODES.md](EPISODES.md)다. S번호는 집필용이며 화면에서는 장면 제목을 쓴다.

## 핵심 워크플로 9개

| 기능 | 장면 | 필요한 입력 → 결과에서 확인 → 다음 행동 |
|---|---|---|
| W01 상황·조건 정리 | 1화·2화 | 현재 상황·바꿀 것·지킬 것 → 필수/선호/미확인과 확인한 경험 → 작은 준비 하나 |
| W02 방향·로드맵 | 2B | 경험·조건·목표 → 2~3개 방향의 근거·기회비용·확인할 점 → 30/60/90일 실험 중 다음 행동 |
| W03 후보 탐색 | 3A·S03 | 역할·지역·원래 조건 → 공식 공고·날짜·모집 상태·필수 충돌 → 분석할 후보 선택 |
| W04 공고·회사 분석 | 3A·S02·S03 | 공고·출처 → 역할/사업/채용 이유 가설/독립 후보 기준/내 근거/미확인 → 확인 질문·지원 전략 |
| W05 지원 자료 | 3B·S04–S08·S10 | 확인된 경험·공고·실제 양식 → 정확한 문구·일관성·파일 검사·미완료 → 본인 제출 후 정확한 제출본 보관 |
| W06 면접 준비 | 4A·5A·S08·S10 | 실제 제출본·초대·공식 안내·이전 복기 → 라운드/메모/질문/일정·형식 → 선택형 연습 |
| W07 모의면접 | 4B·S09 | 역할·언어·집중점·종료 신호 → 한 질문씩 연습/명시적 종료 후 실제 답변 피드백 → 개선 하나 재연습 |
| W08 실제 복기 | 5A·S11 | 실제 질문·답변·추가 질문 → 사실/해석/모름·다음 준비·새 경험 후보 → 확인된 다음 라운드 또는 다음 지원 |
| W09 오퍼·결정 | 6A·S10·S12 | 실제 조건 요약·원래 기준·기한 → 충족/충돌/미확인·확인/협상/수락/고사 대안 → 사용자 결정·실제 행동 기록 |

근거: [W01](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w01-career-setup.md), [W02](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w02-career-strategy.md), [W03](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w03-opportunity-discovery.md), [W04](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w04-job-intelligence.md), [W05](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w05-application-prep.md), [W06](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w06-interview-prep.md), [W07](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w07-mock-interview.md), [W08](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w08-interview-debrief.md), [W09](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/workflows/w09-offer-decision.md).

## 공통·보조 기능 21개

| 제품 문서 | 본편·선택 장면 | 보여줄 사용법 |
|---|---|---|
| [career-analysis](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/career-analysis.md) | 1화·2B·6A | 원래 조건 보존, 방향 비교, 실제 근거가 필요한 시장가치·공개 경력 사례의 한계 |
| [role-mapping](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/role-mapping.md) | 2B·3A·S03 | 직접 이어갈 역할/도전할 역할/인접 진입 경로, 실제 필수 조건과 지역 |
| [job-research](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/job-research.md) | 3A·4A | 공고·사업·업계·과거 채용·공개 경력·조직·채용 이유, 공식 면접 안내와 사실/가설 구분 |
| [experience-mining](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/experience-mining.md) | 2A·S02 | 자기 행동·범위·결과 확인, 안전한 메모·기억 질문, 모르는 수치 유지 |
| [career-evidence-discovery](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/career-evidence-discovery.md) | 2A·3A·5A·S02·S11 | 기존 자료 먼저 확인, 필요한 미확인만 탐색, 충분하면 생략, 사건 중복·본인 기여·새 경험 확인 |
| [copilot-bridge](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/copilot-bridge.md) | S02 | 승인 도구 안에서 검색→공유 가능한 요약 검토→직접 전달→정확한 행동 확인, 도구 없으면 수동 경로 |
| [story-bank](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/story-bank.md) | 2A→3B→4A→5A·S02·S09·S11 | 같은 확인 경험을 지원·면접에 재사용, 짧은/보통/긴 말하기 변형, 당시 답변과 개선안을 구분 |
| [resume](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/resume.md) | 3B·S04 | 실제 근거로 문장 작성·선택·순서 조정, 사실 확인, 지원 목적에 맞춘 강조 |
| [screening-engine](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/screening-engine.md) | 3B·S04·S05·S06 | 원본/검토/맞춤/최종, 빠른/보통/깊은 검토, 공고 근거·채용담당자·현업·차별점·일관성·제출본 |
| [resume-artifact](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/resume-artifact.md) | 3B·S04 | 실제 DOCX/PDF, 텍스트·화면 검사, 만들거나 검사하지 못한 상태를 구분 |
| [human-voice](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/human-voice.md) | 3B·S04·S05 | 과장·상투어를 줄이되 행동·책임·수치·확실성을 바꾸지 않는 수정 |
| [linkedin](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/linkedin.md) | S05 | 수정 전 검토, 공개 프로필·영어 표현·노출 선택, 이력서와 동일한 경력 사실 |
| [application-writing](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/application-writing.md) | S06·S10 | 실제 질문·글자 수·언어·동기, 커버레터·답변·희망 조건, 정확한 제출 답변 보관 |
| [networking](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/networking.md) | S07·S12 | 실제 관계에 맞는 문의·추천 요청·일정 답장·감사·후속 연락, 초안과 전송 구분 |
| [portfolio](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/portfolio.md) | S08 | 만들기/생략/보류 판단, 공개 사례집과 면접용 요약 구분, 확인된 사례로 계획 |
| [red-team](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/red-team.md) | 3B·S04·4B 종료 후 | 채용담당자→현업→의심하는 검토자의 근거 질문, 위험·수정·미확인, 진행 중 코칭과 구분 |
| [interviewer-intelligence](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/interviewer-intelligence.md) | 4A·5A | 실제 초대·공식 안내·공개 직무 범위에 맞춘 라운드, 예상 질문과 실제 질문 구분 |
| [english-global](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/english-global.md) | S05·S07·S09·4A | 같은 사실로 영어 문서·질문·한국어 피드백, 시차·형식·되묻기 등 실제 준비 |
| [voice-mock](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/voice-mock.md) | S09 | 지원되는 음성 환경에서 같은 연습 규칙, 맥락·기록 한계, 텍스트 대안 |
| [compensation](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/compensation.md) | S10·6A·S12 | 지원서→리크루터→진행 중→오퍼 전→정식 제안, 보상 구성·조건 확인·협상·추천인·이력 확인 |
| [application-pipeline](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/capabilities/application-pipeline.md) | 3B→5A→6B·S03·S11 | 회사/직무 구분, 실제 제출·면접·결과만 상태 반영, 다음 행동·불합격 후 재사용 |

## 설치·이어가기·운영 원칙

| 범위 | 장면 | 설계한 사용법 |
|---|---|---|
| ChatGPT/Claude 설치·활성화·실행 오류 | P00·D01 | 서비스 하나, 맞는 설치 ZIP, 계정별 지원·오류 안내, 설치 못 해도 이야기 진행 |
| 이미 준비하던 사용자·필요한 단계로 바로 시작 | E03·‘내 준비’·S03 | 모든 주제 처음부터 접근, 기존 사실 재사용, 긴 온보딩 없이 필요한 작업부터 |
| 전체 보관·새 대화·서비스 변경·업데이트 | S01·6B | 설치 파일/경력 정보/게임 저장 구분, 전체 정보와 실제 제출 파일 보관, 복원한 회사·기록 확인 |
| 실제 기록과 가상 연습 구분 | 전편·S09·S11 | 가상 예시는 사용자 경력·실제 지원 상태에 저장하지 않음, 실제 응답을 게임이 읽지 않음 |
| 권한·모름·건너뛰기·개인 조건 | 전편·S02·S05–S12 | 제공한 자료와 허용 범위만, 부재를 단정하지 않음, 실제 전송·지원·결정은 사용자 행동 |

근거: [설치 안내](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/README.md), [라우팅](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/router/routing.md), [경력 정보 보관](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/docs/state-portability.md), [상태 범위](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/state/state.md), [언어·상호작용](https://github.com/deife990/career-playbook-agent/blob/cc1ee79b669527b42b85e5c4c334b0f3883ea537/core/principles/ux-language.md).

## 설명을 숨겨서 커버한 것으로 세지 않는 항목

- 공고 분석은 3A에서 왜 필요한지와 결과를 보여준다. 기능 이름만 연결표에 두지 않는다.
- 경험 탐색·자료 작성·연봉·음성·레퍼런스 등 조건부 기능은 S01–S12에 실제 읽을 장면과 사용 흐름을 작성했다. 선택형이라는 이유로 원고를 생략하지 않았다.
- 회사 승인 도구 사용은 수동 전달 방식이다. 미래 회사 연결 어댑터·Work IQ·백그라운드 검색을 현재 게임 기능으로 설명하지 않는다.
- 내부 점검 표의 모든 라벨·필드·단계를 외우는 것은 학습 목표가 아니다. 결과의 사실성·미확인·파일 검사·다음 행동을 이해하도록 한다.

## 상세 대본에서 바로 확인할 위치

| 학습 흐름 | 실제로 재생할 장면 |
|---|---|
| W01 상황 / 설치 | [1화 E03·D01](PILOT_SCRIPT.md) |
| W02 방향·실험 | [2화 EP02-03·T02](EP02_SCRIPT.md) |
| W03 탐색 / W04 회사 이해 | [3화 EP03-01~02·T03](EP03_SCRIPT.md), [S02·S03](SIDE_SCENES_PLAY.md) |
| W05 문서·제출본 | [3화 EP03-03·T03·04](EP03_SCRIPT.md), [S04~S08·S10](SIDE_SCENES_PLAY.md) |
| W06 준비 / W07 연습 | [4화 EP04-01~02·T04](EP04_SCRIPT.md), [S08~S10](SIDE_SCENES_PLAY.md) |
| W08 복기·다음 준비 | [5화 EP05-01~02·T05](EP05_SCRIPT.md), [S11](SIDE_SCENES_PLAY.md) |
| W09 제안·결정 | [6화 EP06-01~02·T06](EP06_SCRIPT.md), [S10·S12](SIDE_SCENES_PLAY.md) |
| 보관·복원·업데이트 | [S01](SIDE_SCENES_PLAY.md), [끝 화면](EP06_SCRIPT.md) |

21개 기능의 장면 배정은 위 기존 표의 S번호·회차를 이 상세 원고에서 찾는다. 실제 요청과 입력은 같은 번호의 사용 카드와 T카드에서 확인한다. 연결만 있고 대사가 없는 상태와 구분하되, 실제 모델 출력은 이 정적 예시와 달라질 수 있다.

## 다음 검증

1. 본편만 읽어도 핵심 이직 흐름·관계가 이해되는지 확인한다.
2. 현재 필요한 작업을 하나 제시하고 해당 선택형 장면을 도움 없이 찾는지 확인한다.
3. 그 장면을 읽은 사람이 필요한 입력·결과에서 확인할 점·다음 행동을 자기 말로 설명하는지 본다.
4. 지원 계정에서는 실제 제품의 설치·해당 작업·복원 동선을 따로 시험한다. 문서에 경로가 있다는 이유로 성공 처리하지 않는다.
5. 누락·혼동이 있으면 해당 장면을 수정한다. 모든 참가자에게 모든 실습을 의무 실행하게 하지 않는다.

현재 상태는 **전체 기능에 대응하는 전편·선택형 상세 원고, 화면·복귀 흐름, 베타 진행 자료 작성**이다. ‘전체 기능을 학습시키는 완성 게임’이나 ‘학습 효과 검증 완료’를 뜻하지 않는다.
