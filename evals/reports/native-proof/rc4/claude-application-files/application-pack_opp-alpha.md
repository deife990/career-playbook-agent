> SIMULATION ONLY — 가상 김하윤(Hayun Kim)과 가상 Alpha 공고 기준입니다. 실제 지원·제출 기록이 아니며 계정 메모리에 저장하지 않았습니다.

# Application Pack
Opportunity: opp-alpha (가상 Alpha / QA Analyst)
Status: FACT_CHECKED · 파일 QA 통과 · **제출 안 됨**
Mode / depth: TAILOR_TO_JOB / STANDARD (Master는 BUILD_MASTER)

## Positioning and Evidence
- **USER FACT** ev-001: Synthetic QA Lab에서 QA Analyst, 2023-01~2025-12, 업무는 운영 분석.
- **USER FACT** ev-002: 마이그레이션 테스트케이스 12개를 직접 실행하고 결함을 보고함. 보고 방식은 Unknown.
- **USER FACT** ev-003: 다른 사람이 작성한 SQL 쿼리 결과를 검토함. 쿼리 작성은 Unknown.
- 위 사실은 모두 본인 진술이며 외부에서 검증되지 않았습니다.
- **RECOMMENDATION**: 포지셔닝은 "QA Analyst로서 테스트 실행과 결함 보고, SQL 결과 검토를 해 온 경력"으로 두고 범위를 그대로 씁니다.

## Master Resume
`Hayun_Kim_Master_Resume_v1.md` (resume-master-001, revision 1)로 보존했습니다. 확정 사실만 담았고 Unknown 항목은 별도 표로 분리했습니다. 이후 수정은 새 revision으로 하며 이 버전은 덮어쓰지 않습니다.

## Tailored Resume and Change Log
파일: `Hayun_Kim_QA_Analyst_Alpha_Resume_v1.docx` / `.pdf` (resume-alpha-001, Master에서 파생)

| 변경 | 내용 | 근거 |
|---|---|---|
| 순서 | JD 필수 1·2번(실행, 결함 보고)을 첫 불릿으로, SQL 검토를 둘째로, 운영 분석을 마지막으로 | JD 필수 요건 순서 |
| 문구 | "직접 실행"을 "Personally executed"로 표현 | ev-002, 의미 동일 |
| 추가 | Summary 마지막 문장과 헤더의 "Korea · Seeking fully remote work" | 본인이 확정한 목표와 MUST 요건 |
| 미추가 | 교육, 도구, 성과 수치, 리더십, Selenium, 쿼리 작성, 결함 보고 방식 | 모두 Unknown |
| 미추가 | JD 키워드("data validation" 등) | JD 요구는 경력 사실이 아님 |

섹션명 "Areas of Experience"는 "Skills"가 숙련도를 암시할 수 있어 피했습니다. 대신 일반 이력서 헤딩이 아니라는 점은 아래 ATS 항목에 기록했습니다.

## JD Coverage

| 요건 | 구분 | 판정 | 근거 | 부족/Unknown |
|---|---|---|---|---|
| 테스트케이스 실행 | 필수 | DIRECT_MATCH | ev-002 | Alpha의 테스트 유형과 도구는 Unknown |
| 결함 보고 | 필수 | DIRECT_MATCH | ev-002 | 보고 방식, 도구, 형식은 Unknown |
| SQL 데이터 검증 | 필수 | PARTIAL | ev-003 (타인 쿼리 결과 검토) | 쿼리 작성, 검증 목적, 담당 범위 미확정 |
| Selenium | 우대 | UNKNOWN | 없음 | 확인된 사실 없음 (Unknown 유지) |

확정된 Gap은 없습니다.

## LinkedIn Audit
**PENDING.** 프로필 텍스트나 스크린샷을 받지 못해 감사하지 않았고, 이력서와의 일치 여부는 Unknown입니다.
**RECOMMENDATION**: Alpha 공고가 LinkedIn을 요구하지는 않지만, 이력서에 직함·회사·기간이 명시되었으니 제출 전에 같은 내용인지 확인하세요. 자가 점검 목록은 다음과 같습니다.
1. 직함이 "QA Analyst, Synthetic QA Lab"인가
2. 기간이 2023-01~2025-12와 같은가
3. 이력서에 없는 수치, 도구, 리더십 표현이 프로필에 있는가
4. Open to Work 설정과 공개 범위가 원하는 대로인가 (현재 설정은 확인할 수 없음)

## Digital Footprint
공개 프로필, GitHub 등 본인이 알려 준 링크가 없어 검토하지 않았습니다. Unknown.

## Portfolio or Handout Decision
**SKIP** (재검토 조건: Alpha가 포트폴리오나 샘플을 요구하거나 면접 라운드가 잡힐 때).
이유: JD에 요구가 없고, 확인된 근거가 12개 테스트케이스 실행과 결함 보고뿐이라 보여 줄 사례의 범위와 방법이 Unknown이며, 공개 가능 여부도 확인되지 않았습니다.

## Cover Letter / Application Answers / Recruiter and Networking Drafts
요청하지 않아 만들지 않았습니다 (SKIP).

## Red Team Findings

| Risk | Severity | Why it matters | Evidence | Suggested fix |
|---|---|---|---|---|
| 마지막 근무가 2025-12로 끝나고 이후 기간이 이력서에 없음 | 중 | 채용 담당자가 공백을 물을 수 있음 | "Jan 2023 – Dec 2025" | 이후 상태를 사실대로 알려 주세요. 알려 주시면 한 줄로 반영할지 정합니다 |
| SQL이 검토 경험인지 작성 능력인지 | 중 | 필수 요건이 PARTIAL | "Reviewed results of SQL queries written by others." | 쿼리 작성 여부를 확인(Unknown 유지 시 현재 문구 유지) |
| 결함 보고 방식 Unknown | 중 | 면접에서 방식을 물을 수 있음 | "reported defects" | 방식을 확인하기 전에는 "reported defects"까지만 사용 |
| 소유권, 시스템, 성과 문구 없음 | 낮음~중 | 깊이를 보여 줄 수 없음 | 불릿 3개 | 확인된 사실이 생길 때만 추가. 지금은 채우지 않음 |
| Selenium 라인 없음 | 낮음 | 우대 항목 | 해당 라인 없음 | Unknown 유지, 있다고도 없다고도 쓰지 않음 |

## Screening Review
- **ATS 구조**: ATS-Ready (로컬 추출 기준). 단일 컬럼, 표·텍스트 상자·이미지 없음, 연락처는 본문에 있음. 실제 ATS 포털과 Microsoft Word에서의 렌더링은 테스트하지 않았습니다. "Areas of Experience" 헤딩이 표준 헤딩이 아니어서 인식 여부는 확인되지 않았습니다.
- **Recruiter Scan** (INFERENCE): 목표 직무 명확성 Strong (헤드라인과 직함이 모두 QA Analyst), 최근 직함·회사·기간 Strong, 핵심 근거 배치 Adequate (첫 불릿이 필수 1·2번), 밀도 Adequate (짧고 읽기 쉽지만 깊이가 적음), 성과·규모 Weak (수치는 "12 migration test cases"뿐), 마지막 근무 시점 Risk ("Dec 2025" 이후 미표시), Selenium Risk (우대, 사실은 Unknown).
- **Hiring Manager Credibility** (INFERENCE): 실행과 결함 보고 Adequate, SQL 검증 Risk (검토 경험 이상은 Unknown), 노출 대 소유 Risk (불릿에 범위나 성과 없음), 결함 보고 깊이 Risk (방식 Unknown).
- **Differentiation**: 확인된 앵커는 QA Analyst 직함, 운영 분석, 마이그레이션 테스트 실행뿐입니다. 이 이상의 차별점은 만들지 않았습니다.
- **Meaning-preserving edit**: 내부 초안의 "Directly executed"를 "Personally executed"로 바꿨고 의미는 같습니다.

## Consistency Audit
Master와 Alpha 버전의 직함, 회사, 기간, 불릿 사실은 일치합니다 (PASS). LinkedIn, 포트폴리오, 지원서 답변은 확인할 자료가 없어 Unknown이며 "일치"로 보지 않았습니다.

## Final Files and Observed QA

| 파일 | 형식 | 페이지 | 검사 결과 | SHA-256 |
|---|---|---|---|---|
| Hayun_Kim_QA_Analyst_Alpha_Resume_v1.docx | DOCX | 1 (A4) | ATS-Ready | b7eefac986042f09889adf6c4b72104d2decc2be3ac634bf967f0c986582dbdf |
| Hayun_Kim_QA_Analyst_Alpha_Resume_v1.pdf | 텍스트 PDF | 1 (A4) | ATS-Ready | 14eee7f72bd080efb52eaf575d15edb6696e551a6a54f7afa3affb30b181629f |

관찰한 내용:
- DOCX와 PDF에서 텍스트를 직접 추출해 기대 문구 13개가 모두 같은 순서로 있음을 확인했습니다.
- PDF는 이미지가 아닌 텍스트 PDF이고 임베디드 폰트 2종(Liberation Sans 일반, 굵게)을 사용합니다. DOCX를 변환해 만들었고, DOCX를 다시 렌더링한 텍스트가 전달한 PDF 텍스트와 같습니다.
- 두 파일을 페이지 이미지로 열어 보았고 잘림, 겹침, 깨진 글리프, 깨진 불릿이 없었습니다.
- 하이퍼링크는 없습니다.
- **미완료**: Microsoft Word에서의 렌더링, 실제 ATS 포털 파싱. 둘 다 Unknown입니다.

Ready: 사실 확인과 파일 QA 기준으로는 준비되었습니다. 본인의 최종 문구 확인(USER_APPROVED)은 아직 기록되지 않았고, 제출은 하지 않았습니다.

## Submitted Version and Interview Handoff
제출 기록 없음 (not submitted). 실제로 제출하면 알려 주세요. 그 시점의 이력서, JD, 답변을 그대로 고정하고, 이후 면접 준비는 제출한 버전에서 시작합니다.

## Unknowns and Final Checks
- Unknown: 교육, 자격, 쿼리 작성, 테스트 설계, Selenium, 성과 수치, 리더십, 협업, 결함 보고 방식, 2025-12 이후 상태, 전화·도시·링크, Alpha의 조직·도구·KPI·근무 조건·공고 날짜
- 제출 전 확인: 문구 최종 확인, 2025-12 이후 공백 처리 여부, LinkedIn 일치 여부

## Next Action
이력서 문구를 읽어 보고 승인하거나 수정할 곳을 알려 주세요. 2025-12 이후 상태(공백을 어떻게 다룰지)도 함께 알려 주시면 반영 여부를 정합니다.
