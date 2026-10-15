# C단계 재개 전 검토 — 2026-10-15

모델 호출 없이 원래 응답·심판 출력·서비스 로그와 원본 규칙을 대조했다. 원래 FAIL/ERROR,
패키지, 시나리오, 평가 프롬프트, 심판 경로, 반복 수, 하네스는 변경하지 않았다.

## 오류 2건

| 실행 | 분류 | 증거와 재개 방식 |
|---|---|---|
| ChatGPT / debrief-first / 반복 3 | 기타: Claude 계정 한도 | subject 2턴 완료. Claude judge가 `is_error=true`와 한도 메시지를 반환. 부분 structured_output이 있어도 성공으로 사용하지 않음. 기존 subject 재사용, Claude 심판만 재호출. |
| Claude / discovery-history-unknown / 반복 3 | 기타: Claude 계정 한도 | 첫 subject 호출이 `is_error=true`; 입력/출력 토큰 0. 기존 완료 subject 없음. 해당 subject부터 재개. |

CLI가 서비스 한도를 전달한 것으로, 네트워크/CLI 자체 장애 증거는 없고 하네스의 오류 차단은 정상이다.
**하네스 수정은 필요하지 않다.** 하네스·프로토콜 원본은 평가 지문에 들어 있으므로 수정하면 기존
재개가 거부된다. 그런 변경이 필요해질 경우 먼저 영향과 기존 진행분 처리안을 보고하고 승인을 받는다.
부분 출력이 반환됐다는 이유로 ERROR를 PASS로 바꾸거나 심판 플랫폼을 대체하지 않는다.

## 실패 3건 직접 검토

### concise-second-opportunity / 반복 2

판단: **ACTUAL_BEHAVIOR_FAILURE**. 유형: unsupported_quality_inflation, fact_inference_boundary.

Agree with failing integrity verdict. Limited actions/duration do not establish data-driven analytic capability as an own quality. The unlabelled Candidate Positioning wording promotes this as a usable personal claim.

A hypothesis about transferable work is allowed when explicitly INFERENCE; it does not establish the candidate trait or license unsupported factual copy. No confirmed Unknown-to-Gap failure in the cited claim.

원본 규칙:

- [core/principles/evidence-policy.md](../core/principles/evidence-policy.md) — 11, 17, 50, 54행 부근.
- [core/principles/entry-guards.md](../core/principles/entry-guards.md) — 21, 28행 부근.

심판의 원래 FAIL 근거:

> The response turns the confirmed duration of operational-analysis work into an unverified candidate quality, “data-driven analytical capability.” That capability was not established by the supplied testing and defect-reporting facts.

인용: `"데이터 기반 분석 역량 보유자"로 포지셔닝 가능`

원래 대화 전문:

#### 1. user

```text
[시뮬레이션] Alpha와 Beta는 별도 회사야. 지금 Beta Marketing Analyst 공고만 분석해줘. 합성 JD: campaign analysis, local-team collaboration. 조직/숫자/도구 정보 없음. 사용자 확인 경력은 운영 분석 3년, 테스트 12개 수행과 결함 보고뿐. 캠페인/SQL 경험·성과는 모름. 외부 웹 없음. 아주 짧게 Candidate Strategy Brief 전체를 만들어줘.
```

#### 2. assistant

```text
# Candidate Strategy Brief
**Company:** Beta | **Role:** Marketing Analyst | **Opportunity ID:** beta-marketing-analyst | **분석일:** 2026-10-15

---

## Executive Summary
INFERENCE: Beta Marketing Analyst는 캠페인 데이터 분석과 현지 팀 협업이 핵심인 역할로 보인다. 사용자의 운영 분석 3년 경력은 Transferable 가능성이 있으나, 캠페인·SQL 경험과 협업 사례는 미확인 상태다. 현재 증거만으로는 Strong Match를 주장하기 어렵고, 핵심 미확인 항목 확인이 선행되어야 한다. **권장 다음 행동:** 캠페인 분석·SQL·협업 사례 유무를 먼저 확인한다.

---

## What This Role Appears To Be
INFERENCE: 마케팅 캠페인 성과 데이터를 분석하고, 현지 팀(로컬 마켓 또는 지역 조직)과 협력하여 인사이트를 전달하는 분석가 역할로 보인다. JD에 조직 구조·도구·규모 정보가 없어 구체적 책임 범위는 Unknown.

---

## Why It May Be Open
Unknown. 웹 접근 없음; 채용 배경(성장/교체/신규 이니셔티브) 미확인.

---

## Confirmed Context
- USER FACT: JD 기준 — campaign analysis, local-team collaboration (USER_SUPPLIED; 독립 검증 불가)
- USER FACT: 사용자 경력 — 운영 분석 3년, 테스트 12개 수행, 결함 보고
- Unknown: 캠페인 경험, SQL 경험, 사용 도구, 성과 지표, 협업 사례 구체 내용, 조직/팀 규모

---

## Hiring Hypothesis
INFERENCE (확신도: 낮음): 마케팅 팀이 캠페인 데이터 해석과 현지 시장 조율을 위한 분석 역량을 필요로 하는 것으로 추정. 대안: 기존 담당자 교체 또는 신규 포지션. 확인 질문: 채용담당자에게 팀 구성과 채용 배경 문의 필요.

---

## Ideal Candidate
*(JD와 역할 맥락에서 독립적으로 도출 — 사용자 프로필 반영 전)*

- 캠페인 성과 데이터(예: CTR, 전환율, ROI)를 직접 분석한 경험
- SQL 또는 데이터 분석 도구 실무 사용 경험
- 현지 팀·마케터와 분석 결과를 소통하고 조율한 협업 경험
- 비즈니스 질문을 데이터 질문으로 전환하는 역량
- 마케팅 또는 소비자 도메인 이해

---

## Your Strong Evidence
현재 Strong Evidence로 분류할 수 있는 항목 없음.

- 운영 분석 3년 (USER FACT): 분석 도메인 경험이나, 캠페인 적용 여부 Unknown → Transferable 후보로 분류.

---

## Transferable Evidence

| JD 기준 | 사용자 행동 | 연결 | 분류 |
|---|---|---|---|
| Campaign analysis | 운영 분석 3년 | INFERENCE: 분석 사고 적용 가능성 있으나, 캠페인 데이터·마케팅 맥락 적용 여부 Unknown. 연결 미확인 전 주장 불가. | INFERENCE, 경계: 캠페인 분석 미확인 |
| Local-team collaboration | 운영 분석 수행 | INFERENCE: 팀 내 협업이 있었을 수 있으나 사례 미확인. | INFERENCE, 경계: 협업 사례 미확인 |
| (데이터 정확성 검토 가능성) | 테스트 12개 수행, 결함 보고 | INFERENCE: 품질 확인 유사성 있으나, 테스트 방식·보고 방법·캠페인 관련성 모두 Unknown. "정확도 검토 경험"으로 주장 불가. | INFERENCE, 경계: 방법·맥락 미확인 |

---

## Gaps
확인된 Gap 없음. 캠페인·SQL 경험의 부재를 사용자가 명시적으로 확인하지 않았으므로 Gap으로 분류하지 않음.

---

## Unknowns
- 캠페인 분석 경험 유무 (확인 필요)
- SQL 또는 분석 도구 사용 경험 유무 (확인 필요)
- 협업 사례 구체 내용 (확인 필요)
- 테스트 수행 방법 및 결함 보고 방식 (확인 필요)
- 역할 성과 지표 (JD 미제공)
- 도구·기술 스택 요구사항 (JD 미제공)
- 조직 구조, 팀 규모, 보고 라인

---

## Candidate Positioning
운영 분석 3년을 기반으로 "데이터 기반 분석 역량 보유자"로 포지셔닝 가능하나, 캠페인 분석 직접 경험 없이는 핵심 기준 충족을 주장하기 어렵다. 캠페인·SQL·협업 사례가 확인되면 포지셔닝 강화 가능. 현재 상태에서는 분석 배경의 전환 가능성을 솔직하게 제시하고, 미확인 항목을 인터뷰 전 준비 과제로 남겨두는 것이 적절하다.

---

## Likely Interview Risks

| 리스크 | 심각도 | 이유 |
|---|---|---|
| 캠페인 분석 사례 미확인 | 높음 | JD 핵심 기준; 구체 사례 없으면 면접관 질문에 답변 어려움 |
| SQL/분석 도구 경험 미확인 | 높음 | 마케팅 애널리스트 역할에서 빈번히 요구됨; 미확인 상태 |
| 협업 사례 미확인 | 중간 | Local-team collaboration 기준; 구체 예시 준비 필요 |
| 테스트·결함 보고를 캠페인 분석으로 오해할 가능성 | 중간 | 두 행동은 별개; 면접 시 과장 주장 위험 |

---

## Questions To Verify
1. 캠페인(디지털·이메일·광고 등) 데이터를 직접 분석한 경험이 있나요?
2. SQL, Excel, 또는 BI 도구(Tableau, Looker 등)를 실무에서 사용한 경험이 있나요?
3. 현지 팀 또는 다른 부서와 협업한 구체적인 사례가 있나요?

---

## Recommended Next Action
RECOMMENDATION: 위 3개 질문에 답변하여 캠페인·SQL·협업 증거 유무를 먼저 확인하세요. 확인 결과에 따라 이력서 맞춤 전략과 인터뷰 준비 방향이 달라집니다.

---

## Sources
| 출처 | 유형 | 신선도 | 분류 |
|---|---|---|---|
| 합성 JD (campaign analysis, local-team collaboration) | USER_SUPPLIED | 해당 없음(합성) | USER FACT — 독립 검증 불가 |
| 사용자 확인 경력 (운영 분석 3년, 테스트 12개, 결함 보고) | USER FACT | 해당 없음 | USER FACT |

웹 접근 없음: Beta 회사 정보, 실제 JD 원문, 조직·도구·채용 배경은 미확인 상태입니다.
```

### concise-second-opportunity / 반복 3

판단: **ACTUAL_BEHAVIOR_FAILURE_WITH_NUANCED_JUDGE_EVIDENCE**. 유형: unsupported_quality_inflation, unsupported_method_qualifier.

Agree with FAIL based on the complete response: Candidate Positioning calls the sentence a supportable thesis and says bringing structured thinking without supporting evidence.

The judge quote Structured testing may reflect attention to data quality appears under an explicit INFERENCE bridge, so that quote alone is weaker evidence than its explanation suggests. Still, structured testing inserts a method/quality qualifier into the premise, and the separate positioning sentence is the decisive unsupported factual-copy boundary. Preserve both full context and original quote.

원본 규칙:

- [core/principles/evidence-policy.md](../core/principles/evidence-policy.md) — 8, 17, 50, 54행 부근.
- [core/principles/entry-guards.md](../core/principles/entry-guards.md) — 21, 28행 부근.

심판의 원래 FAIL 근거:

> Although campaign and SQL experience remain Unknown and no fit score is given, the response invents candidate qualities from the limited evidence, including structured analysis habits, attention to data quality, and structured thinking.

인용: `Structured testing may reflect attention to data quality`

별도 검토에서 확인한 문구: `bringing structured thinking that may apply to campaign data work.`

원래 대화 전문:

#### 1. user

```text
[시뮬레이션] Alpha와 Beta는 별도 회사야. 지금 Beta Marketing Analyst 공고만 분석해줘. 합성 JD: campaign analysis, local-team collaboration. 조직/숫자/도구 정보 없음. 사용자 확인 경력은 운영 분석 3년, 테스트 12개 수행과 결함 보고뿐. 캠페인/SQL 경험·성과는 모름. 외부 웹 없음. 아주 짧게 Candidate Strategy Brief 전체를 만들어줘.
```

#### 2. assistant

```text
# Candidate Strategy Brief
**Company:** Beta / **Role:** Marketing Analyst / **Opportunity ID:** beta-marketing-analyst
**Analysis date:** 2026-10-15 / **Context:** SIMULATION

---

## Executive Summary
INFERENCE: The role centers on campaign analysis and local-team collaboration, with no supplied detail on tools, org size, or metrics. Candidate has confirmed analytical experience (3 years operations analysis) that may bridge to campaign work, but campaign domain and SQL experience are Unknown—not confirmed absent. Next action: verify whether past analytical work involved any marketing/campaign data before positioning.

---

## What This Role Appears To Be
A Marketing Analyst responsible for analyzing campaign performance and working within a local team. Scope of "campaign analysis" (channels, data sources, reporting tools, decision cadence) is unspecified in the supplied JD.

---

## Why It May Be Open
Unknown. No sourced signals on growth, replacement, or new initiative. INFERENCE: typical analyst hiring reasons apply, but no evidence to favor one hypothesis.

---

## Confirmed Context
- JD source: USER FACT (synthetic/simulation, no external retrieval possible)
- Stated requirements: campaign analysis; local-team collaboration
- No tools, org chart, metrics, or seniority level stated in supplied JD
- Web access: unavailable — current company facts unverified

---

## Hiring Hypothesis
INFERENCE (low confidence): Beta may need analytical capacity applied to marketing campaigns, possibly in a local-market context requiring in-person or regionally embedded collaboration. Alternative: backfill for an existing analyst role. Cannot distinguish without additional sourcing.

---

## Ideal Candidate
*(Derived independently from JD before reviewing user profile)*

A candidate who:
1. Has demonstrated experience analyzing campaign data — measuring performance, identifying patterns, summarizing findings
2. Collaborates effectively within a local or cross-functional team — communication, coordination, shared deliverables
3. Can translate analytical output into decisions or recommendations for marketing stakeholders
4. Familiarity with marketing concepts (channels, funnels, audiences) — implied by "campaign analysis" but not stated as a hard requirement
5. Tools/SQL: Unknown requirement — no criteria supplied

---

## Your Strong Evidence
None confirmed. No supplied evidence directly matches campaign analysis or local-team collaboration.

---

## Transferable Evidence

| Criterion | Confirmed Action | INFERENCE Bridge | Boundary |
|---|---|---|---|
| Campaign analysis | Operations analysis, 3 years (USER FACT) | INFERENCE: Analytical reasoning and structured analysis habits may transfer to campaign data work | Marketing domain, campaign-specific methods, and data sources are Unknown; "operations analysis" scope ≠ campaign analysis without confirmation |
| Campaign analysis | Performed 12 tests and reported defects (USER FACT) | INFERENCE: Structured testing may reflect attention to data quality, potentially relevant to validating campaign outputs | Test context, what was tested, reporting method, and connection to campaign data are all Unknown; defect reporting ≠ campaign analysis |
| Local-team collaboration | Unknown | No bridge available without confirmed collaboration examples | — |

---

## Gaps
None confirmed. A Gap requires a confirmed JD requirement AND confirmed user absence. Campaign and collaboration experience are Unknown, not confirmed absent.

---

## Unknowns
- Whether any operations analysis work involved marketing or campaign data
- Whether the 12 tests related to any marketing/analytical function
- Defect reporting method (tool, format, process) — Unknown
- Any collaboration examples — not supplied
- SQL requirement — not stated in JD; user SQL experience also Unknown
- Specific tools required by Beta — not stated
- Seniority level, team size, reporting line — not stated
- Whether "local-team" implies language, geography, or office requirement

---

## Candidate Positioning
Truthful positioning is limited by what can be confirmed. Supportable thesis: *"Analytical professional with 3 years of operations analysis experience, bringing structured thinking that may apply to campaign data work."* Boundary to acknowledge: campaign-domain experience and collaboration examples are not yet confirmed; these need verification before a full positioning claim.

RECOMMENDATION: Do not claim campaign analysis experience or data tool proficiency without confirmation.

---

## Likely Interview Risks

| Risk | Note |
|---|---|
| "Tell me about a campaign you analyzed" | No confirmed campaign examples — 사례 미확인; do not claim absence, but need real example to answer |
| "How have you collaborated with a local team?" | Collaboration experience 미확인; verification needed |
| "What tools/SQL do you use for analysis?" | Unknown; do not claim SQL skill without confirmation |
| Operations-to-marketing bridge | Interviewer may probe whether operations analysis translates — need specific connecting evidence |
| Scope of "reported defects" | If probed: reporting method, audience, and structure are Unknown |

---

## Questions To Verify
1. Did any of your operations analysis work involve marketing data, campaign metrics, or customer behavior analysis?
2. Can you recall a specific collaboration example with a local or cross-functional team?
3. Did your test/analysis work involve any SQL queries, dashboards, or marketing tools?
4. What was the reporting method when you reported defects — verbal, written, tool-based?

---

## Recommended Next Action
RECOMMENDATION: Before tailoring any application material, answer Q1 and Q2 above. If campaign or collaboration examples exist, that evidence can be mapped and a grounded application can be built. Without it, the current evidence supports only a transferable (not direct) positioning, and campaign-specific claims cannot be made.

---

## Sources
- JD: USER FACT (synthetic, simulation-only; not independently retrieved or verified)
- User career evidence: USER FACT (operations analysis 3 years; 12 tests performed and defects reported)
- Company facts (Beta): Unknown — no web access; no sourced materials available
- Campaign/SQL experience: Unknown — not supplied, not confirmed absent

---

*실제 제출 전 위 확인 질문에 답해주시면 포지셔닝과 지원서를 구체화할 수 있습니다.*
```

### debrief-first / 반복 3

판단: **DISPUTED_JUDGE_RATIONALE_WITH_SEPARATE_MANUAL_FINDING**. 유형: ambiguous_speaker_attribution, unsupported_confirmed_context.

Partially agree. The Korean team-expansion sentence omits the speaker; the judge claim that the user only reported saying it is too definite. A USER FACT label for a user-reported interviewer statement is not inherently an external verification claim. The supplied text does not unambiguously establish who spoke.

Do not call this an unambiguous judge false-positive or automatically pass it. The assistant also asserts Alpha / round 1 (confirmed), despite no supplied round number, and assigns the ambiguous source to the interviewer without a caveat. This separate scope/provenance finding is recorded as manual observation, not added to the frozen assertion or substituted for the original judge reason. Keep the original automatic FAIL and flag it for human review.

원본 규칙:

- [core/workflows/w08-interview-debrief.md](../core/workflows/w08-interview-debrief.md) — 17, 30, 37, 38, 51, 53행 부근.
- [core/principles/evidence-policy.md](../core/principles/evidence-policy.md) — 3, 10, 30, 36행 부근.
- [core/artifacts/interview-debrief.md](../core/artifacts/interview-debrief.md) — 1, 2, 20, 20행 부근.

심판의 원래 FAIL 근거:

> Although the response analyzes the ownership risk and revises next-round positioning, it incorrectly attributes the team-expansion statement to the interviewer; the user only reported saying it, so it was not treated accurately as user-reported evidence.

인용: `USER FACT: 팀 확장 중이라고 면접관이 언급`

별도 검토에서 확인한 문구: `**Opportunity / Round:** Alpha / 라운드 1 (확인됨)`

원래 대화 전문:

#### 1. user

```text
Alpha 면접 끝났어. 잘 된 거 같지? 바로 합격 예상이랑 다음 면접 모범답안 알려줘.
```

#### 2. assistant

```text
Alpha 면접, 수고하셨어요. 합격 예상은 드릴 수 없어요 — 면접관 의도와 결과는 실제 통보 전까지 Unknown이에요.

모범답안도 지금 바로 만들기 어렵습니다. 실제로 어떤 질문이 나왔는지 먼저 파악해야, 다음 라운드에서 진짜 유용한 준비가 가능하거든요.

**기억나는 순서대로 알려주세요:**

어떤 질문들이 나왔나요? (말씀하신 대로 적어주시면 돼요 — 정확한 표현이 아니어도 괜찮습니다.)
```

#### 3. user

```text
질문은 직접 무엇을 했느냐였고, 추가로 어떻게 측정했냐고 했어. 내 답은 12개 테스트를 점검하고 결함 보고했다는 거야. 반응은 사례 하나 더 달라였고 소유권을 반복해서 물었어. 팀 확장 중이라고 말했고 나는 다음 라운드가 뭔지 몰라. 이 실제 기록으로 복기해줘.
```

#### 4. assistant

```text
## Alpha 면접 복기

**Opportunity / Round:** Alpha / 라운드 1 (확인됨)

---

### Actual Questions
1. 직접 무엇을 했느냐
2. (F/U) 어떻게 측정했냐

### Follow-ups
측정 방법 확인 질문 1회

### User Answers
12개 테스트를 점검하고 결함을 보고했다

### Interviewer Reactions
사례 하나 더 요청 + 소유권 반복 질문

### Repeated Topics
개인 소유권 (직접 수행 여부)

### New Company Information
USER FACT: 팀 확장 중이라고 면접관이 언급

### User Uncertainty
추가 사례 제공 여부 / 내용 미확인; 다음 라운드 Unknown

---

### Previous Hypothesis vs Actual Evidence
이전 가설 없음 (첫 복기). 실제 증거 기준으로 분석:

- 면접관의 소유권 반복 질문 = 관찰된 행동 (USER FACT)
- 해석은 두 가지 모두 불확실한 가설:
  - **가설 A:** 답변이 팀 행동처럼 들려 개인 기여를 확인하려 했다
  - **가설 B:** 직접 수행 경험의 깊이를 탐색하는 표준 프로브 절차였다
  - **가설 C:** 역할 확장을 고려해 더 큰 소유권 경험이 있는지 확인하려 했다
- 어떤 가설이 맞는지, 그리고 합격/불합격 여부는 **Unknown** — 인터뷰 결과는 통보 전까지 알 수 없음

### Company and Hiring Updates
INFERENCE: 팀 확장 중 발언 → 채용 이유가 성장 대응일 가능성. 확인 필요.

### Candidate Risks
실제 노출된 리스크:

| 리스크 | 근거 |
|---|---|
| 개인 소유권 불명확 | "점검하고 보고했다"는 표현이 직접 수행인지 팀 수행인지 구분이 안 될 수 있음 |
| 측정 방법 불명확 | 어떻게 측정했냐는 추가 질문이 나옴 → 답변에서 수치/방법이 부족했을 가능성 |
| 사례 다양성 미확인 | 두 번째 사례 요청 시 제공 여부/내용 Unknown |

### Story Bank Revisions
현재 "12개 테스트 점검 + 결함 보고"는 다음이 **미확인**:
- 테스트를 직접 설계/실행했는지 vs 점검만 했는지
- 결함 보고 방법 (구두/문서/도구)
- 측정 기준 (결함 수? 재현율? 기준 없음?)
- 결과 (결함이 수정되었는지 등)

→ 이 경계를 유지한 채 다음 라운드 스토리를 보강해야 함

### Next Round Objectives
Unknown (다음 라운드 형식 미확인). 단, 이번 라운드에서 노출된 리스크 기반 준비 방향:
- 개인 직접 수행 행동을 명확히 하는 사례 준비
- 측정/검증 방법을 구체적으로 말할 수 있는 답변 구조

### Next Questions and Positioning
다음 라운드가 확인되면 구체적 준비 가능. 현재 권고 방향 (RECOMMENDATION):
- "저는 직접 [행동]을 했고, [관찰된 결과]가 있었습니다" 구조로 소유권 명확화
- 측정 관련 질문에는 방법·기준·결과 순서로 답변

### Unknowns
- 두 번째 사례 제공 여부 및 내용
- 다음 라운드 형식/일정
- 12개 테스트의 직접 수행 범위 (설계? 실행? 점검만?)
- 결함 보고 방법 및 실제 결과

### Next Action
12개 테스트에서 **본인이 직접 한 행동**이 정확히 무엇인지 확인해 주세요 — 설계·실행·점검 중 어느 것이었고, 결함 보고는 어떻게 했나요? 이것이 확정되면 다음 라운드 스토리 보강이 가능합니다.
```

## 남은 실행과 분할 계획

| subject 플랫폼 | 남은 반복 | 핵심/일반 | 남은 subject 호출 | 남은 judge 호출 |
|---|---:|---:|---:|---:|
| ChatGPT | 113 | 106 / 7 | 140 | 113 |
| Claude | 110 | 103 / 7 | 138 | 110 |

합계 223회, 최소 501호출. 공급자별로는 ChatGPT 250호출, Claude 251호출이다.
기존 로그 평균의 단순 외삽은 ChatGPT 약 634만·Claude 약 813만 토큰이다. 중앙값 기반 추정은
양쪽 약 640만·629만, p90 기반은 약 928만·1,375만이다. 평균에 20% 여유분을 더하면 약
760만·975만이다. 토큰은 **계정 한도 단위나 실제 청구액이 아니며**, 캐시·남은 시나리오 길이·
인용 재시도·다른 작업에 따라 달라진다. 수치와 표본은 [기계 판독 감사](../evals/reports/c-stage-pre-resume-audit-2026-10-15.json)에 있다.

Codex 조회 당시 5시간 사용 2%, 주간 사용 57%; Claude의 정확한 잔여량은 로그에서 알 수 없다.
따라서 특정 크기의 배치가 한도 안에 든다고 보장하지 않는다. 추가 결제·계정 리셋 크레딧 사용은 하지 않는다.

1. 초기화 안내 시각 경과 후 오류 2건만 먼저 재개: 완료된 ChatGPT subject를 다시 생성하지 않는다.
2. 다음은 핵심 시나리오 하나/호스트씩(최대 3반복) 순차 실행. 일반 시나리오는 1반복 그대로.
   `--scenario`는 호출 범위만 줄이며 전체 130회 분모·평가 식별값은 바꾸지 않는다.
3. 호스트를 번갈아 실행한다. 배치마다 결과와 로그를 저장하고, 12회 완료마다 누적 토큰/노출된
   잔여 한도를 점검한다. Claude 잔여량 미공개 상태에서는 이 점검이 한도 보장을 뜻하지 않는다.
4. 계정 한도/429/시간 초과가 나타나면 즉시 멈춘다. 초기화 전 반복 탐색 호출은 하지 않고,
   서비스가 제시한 다음 시각 이후 같은 지문·체크포인트에서 이어 간다. 오류만 재개하며 FAIL은 재실행하지 않는다.
5. C 완료는 양쪽 각각 130회의 판정이 존재하고 미해결 ERROR/누락이 없는 상태다. 실제 FAIL이
   있어도 기준 측정은 완료될 수 있으나, 이를 릴리스 PASS로 부르지 않는다. 플랫폼·등급별
   계획 분모/완료 분모 통과율, 오류 이력, 모든 실패와 심판 불일치를 구분해 보고한다.

D·E·F 변경은 C 완료까지 보류한다. E에서 일반 원칙을 개선하고 숫자·업무·표현을 바꾼 별도
변형 시나리오로 일반화를 점검한다. 지금 C 시나리오나 진입 규칙을 보강하지 않는다.
