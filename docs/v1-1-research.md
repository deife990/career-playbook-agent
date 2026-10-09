# v1.1 외부 자료 채택 결정

조사 기준: 공개 저장소의 아래 commit. 외부 지침은 참고 자료이며 CareerPilot 정책이 우선한다.
문구/코드 전체를 복제하거나 외부 Skill을 설치하지 않는다. 일반적인 패턴을 새로 설계한다.

| 자료 / commit | 읽은 범위 | 채택·수정 | 거절 |
|---|---|---|---|
| [ResumeSkills](https://github.com/Paramchoudhary/ResumeSkills/tree/74ae19e7c62b0516d1c298328e5544976c12da5d) | ATS optimizer, bullet writer, tailor, formatter, version manager, section builder, application form, LinkedIn, career changer, portfolio, references, offer comparison, salary, JD analyzer | Master inventory→targeted selection, 회사별 버전, 필드별 답변, 사실 기반 경력 전환·교차 문서 일치, 선택적 포트폴리오 | 80% match/점수/확률, 모든 bullet 숫자, 추정 지표, 제목 변경·강한 동사로 책임 확대, 임의 오퍼 가치·가중치 |
| [Interview Coach](https://github.com/noamseg/interview-coach-skill/tree/634a8dd8689e0420c21e5f0c8ae3cfa9e1a7ab7e) | resume, differentiation, storybank, evidence sourcing, calibration, cross-cutting, salary, decode, LinkedIn, pitch, concerns, apply | ATS와 사람의 검토 분리, depth, story→bullet, 구체적인 강점·우려·범위, 단계별 보상 기록, 실제 피드백으로 가설 수정 | 근거 없는 callback 통계·ATS 점수·vendor별 parser 단정, 숫자 기반 합격 예측, 반응을 채용 결과로 확정, 반드시 논쟁적인 자기소개 |
| [Resume Builder](https://github.com/dabydat/resume-builder-skill/tree/bf6355fd226410c4028124ec14f711bbe87b52d3) | skill entry; ATS/keywords, bullet writing, common mistakes, format/structure | 역할·사업 맥락 intake, DOCX/PDF 생성 후 실제 추출·페이지·잘림·시각 검수 | 모든 ATS가 동일하다는 단정, 절대 폰트·여백·페이지 규칙, 사용자가 모르는 규모, 도움 역할→주도 역할, 기술직 전용 순서의 범용화 |
| [No AI Slop](https://github.com/petergyang/no-ai-slop/tree/000650b156983f5159695b441477f4e63b25dc85) | skill entry + editing eval | 상투어·반복·과장 검토, 최소 수정, 변경 전후 의미 검수 | 구체성을 위해 새 숫자/사례 추가, 전체 voice 교체, 자동 AI 작성 판별, 무조건 단어 금지 |
| [Open Career Skills](https://github.com/squerne/open-career-skills/tree/daaf01f832e5cc35e5e49e3257014de90fb5ed24) | ats-detective | 안전한 URL host 관찰, 회사·공고 일치 확인, CONFIRMED/LIKELY/UNKNOWN | vendor별 날짜/키워드/파일형식 보장, oraclecloud=Taleo 단정, slug 존재만으로 회사 확정, 무관한 홍보 |

모든 저장소는 위 commit에서 MIT license를 포함한다. 실질적 문구/구현의 재사용 없이
새로운 CareerPilot 계약을 작성한다. 원문 출처와 라이선스는 THIRD_PARTY_NOTICES.md에 남긴다.
현재 salary/history 법률, ATS 제품 기능, 플랫폼 설치법은 필요한 시점에 공식 출처로 확인한다.
외부 prompt의 숫자·통계는 검증된 채용 사실로 승격하지 않는다.
