---
id: W04
artifact: candidate-strategy
capabilities:
- job-research
- experience-mining
- red-team
stages:
- jd_acquisition
- jd_decomposition
- company_business
- industry_context
- historical_hiring
- public_people_patterns
- org_hypothesis
- hiring_reason_90_days
- independent_ideal_candidate
- user_evidence_mapping
- candidate_positioning
- risks_unknowns_verification
- brief_sources
---
# W04 Job Intelligence — Hero Workflow
## Purpose
Understand the real role and hiring problem before tailoring candidate positioning.
## Trigger
“이 공고 어때?”, JD analysis, company+role, hiring-reason question, URL/text/PDF/screenshot.
## Required context
Read [policies](../principles/index.md), [state](../state/state.md). Select/create exactly one
company+role/requisition. JD and source dates are needed; a complete user profile is not needed
until evidence mapping. Missing profile cannot shape or delay the independent ideal candidate.
## Steps
Execute stages in this order, using [research capability](../capabilities/job-research.md).
1. **jd_acquisition**: URL→read current official posting. Text→retain supplied provenance/date;
   PDF→read available text/pages; screenshot→read visible fields and confirm unclear OCR; company+
   role→search official careers and confirm which posting. No unreadable invented text. If absent,
   ask for accessible text/image and mark role-specific analysis provisional, not “JD analyzed”.
2. **jd_decomposition**: separate must/nice requirements, actual responsibilities, expected outcomes,
   metrics if stated, interfaces, seniority, constraints, keywords, ambiguities and missing scope.
3. **company_business**: research products/customers/revenue/business model/current strategy and
   official career/candidate/value/interview guides. Link actual sources to relevant role context.
4. **industry_context**: market/customer/regulatory/competitive forces affecting this role, sourced
   and time-bounded. Do not add industry exposition that changes no candidate decision.
5. **historical_hiring**: dated closed postings/changes in requirements/hiring patterns. Label
   historical explicitly; do not infer an active vacancy or reorg solely from removed postings.
6. **public_people_patterns**: job-relevant public employee career trajectories/skill patterns,
   with sources and small-sample limitations. No private contacts or sensitive profiling.
7. **org_hypothesis**: reporting/interfaces/team shape only as evidence-qualified hypotheses;
   identify multiple plausible structures. Community evidence alone is not an org fact.
8. **hiring_reason_90_days**: infer why now (growth/replacement/new initiative/unknown), alternatives,
   confidence, questions to verify, likely first-90-day outcomes. No invented actual KPIs.
9. **independent_ideal_candidate**: freeze a persona from role/business/hiring evidence BEFORE
   reading/mapping user strengths. Criteria cover functional, business, stakeholder and execution
   demands and genuine uncertainty. Save defined_before_mapping=true; no user-profile anchoring.
10. **user_evidence_mapping**: now inspect confirmed profile/evidence. Map each criterion as Strong
    Evidence / Transferable Evidence / Gap / Unknown with IDs, bridge and limitation. Ask only
    missing high-impact examples through [experience mining](../capabilities/experience-mining.md).
11. **candidate_positioning**: construct a truthful positioning thesis supported by 2–3 evidence
    anchors; name what the user can prove and where to acknowledge a gap.
12. **risks_unknowns_verification**: use [red team](../capabilities/red-team.md) for recruiter/HM/
    skeptical risks; list unverifiable findings, conflicting evidence and recruiter questions.
13. **brief_sources**: output [Candidate Strategy Brief](../artifacts/candidate-strategy.md) and
    dated sources. Recommend supportable next action, not numerical fit/hiring odds.
Stop research when role, business, defensible hypothesis, independent persona and mapping suffice.
If a stage yields no evidence, record Unknown and continue supported stages; never silently skip.
## Evidence rules
All important claims classified. Official declared values ≠ verified lived culture. Historical jobs
≠ live jobs; public biographies ≠ hidden hiring requirements. Hiring reason/org/90 days are
INFERENCE unless directly supported. Unread page/undated snippet cannot become VERIFIED FACT.
## Output
Candidate Strategy Brief + Sources with every required section, evidence mapping and next action.
## State updates
Opportunity/CompanyResearch/JobAnalysis/HiringHypothesis/IdealCandidate/CandidateStrategy/Source/
Claim/NextAction scoped to one ID. Revisions retain old hypotheses. No status change from analysis.
## Fallbacks
No web: use provided sources labeled USER_SUPPLIED, state current facts unverified, research plan.
No file-reading capability: ask for JD text; no OCR reconstruction guesses. No candidate profile:
complete independent research/persona, leave mapping Unknown, then ask one useful experience.
## Do not
Start with candidate fit, tailor the ideal persona around the user, invent employees/org/metrics,
mix opportunities, use numerical scores or treat model memory as current company fact.
