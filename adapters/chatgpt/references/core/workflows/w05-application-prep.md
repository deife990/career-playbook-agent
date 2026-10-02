---
id: W05
artifact: application-pack
capabilities:
- experience-mining
- story-bank
- resume
- linkedin
- portfolio
- application-writing
- networking
- red-team
- application-pipeline
---
# W05 Application Preparation
## Purpose
Create an evidence-consistent Application Pack for one selected opportunity.
## Trigger
“여기 지원할래”, resume, cover letter, application answers, LinkedIn audit, portfolio request.
## Required context
Read [policies](../principles/index.md), [state](../state/state.md), selected opportunity/strategy,
official candidate guide and evidence. Global Master Resume/LinkedIn-only work may proceed without
an opportunity; company-tailored material requires selection. Missing strategy→W04-supported view.
## Steps
1. Confirm requested documents, language, deadline and official constraints; inspect existing copy.
2. Mine missing relevant facts with [experience mining](../capabilities/experience-mining.md),
   then create/update [STAR stories](../capabilities/story-bank.md) only from confirmed evidence.
3. Plan [resume](../capabilities/resume.md) changes, create Master/Tailored version with IDs.
4. [LinkedIn audit](../capabilities/linkedin.md) before optimization; review authorized professional
   footprint and cross-document consistency. Rewrite only requested sections.
5. Apply [portfolio/handout decision gate](../capabilities/portfolio.md); record CREATE/SKIP/DEFER.
6. Draft requested [cover letter/answers](../capabilities/application-writing.md) and
   [recruiter/networking messages](../capabilities/networking.md), respecting official limits.
7. Run [Recruiter→HM→Skeptical red team](../capabilities/red-team.md), fix actual weaknesses.
8. Audit evidence IDs, date/title/metric/ownership, company scope and source freshness again.
   Unresolved facts→DRAFT + precise verification question, never final-ready fabricated material.
9. Produce [Application Pack](../artifacts/application-pack.md) and one next step. User confirms
   facts and decides submission; maintain [pipeline](../capabilities/application-pipeline.md).
## Evidence rules
JD demands are not career facts. No numeric inflation, fictional credentials or contradictory
versions. Qualitative supported outcomes are acceptable; invented precision is not.
## Output
Application Pack with requested copy, decision on optional assets, audit and next action.
## State updates
CareerEvidence/Story globally; Application/ResumeVersion/LinkedInReview/PortfolioArtifact/Decision/
NextAction within scope; global Master/LinkedIn/portfolio records export through career-profile.json
resume_versions/linkedin_reviews/portfolio_artifacts with null opportunity_id, alongside global claims.
APPLYING on explicit preparation intent; APPLIED only on confirmed actual submission, with event.
## Fallbacks
No resume: confirmed evidence inventory then draft. No company strategy: limited draft marked
Unknown or W04 first. No connectors: manual/file mining. No persistent files: portable pack.
## Do not
Fabricate metrics/leadership, optimize without audit, force optional assets, submit/send silently.

## Partial delivery rule
When requested components are blocked by missing facts, return supported interim decisions for
each requested component before asking the next one/two questions. For example: no portfolio
request + one day remaining → SKIP/DEFER with reason; missing LinkedIn profile → audit pending,
invite profile text and provide a self-check list. Do not omit these requests just because the JD
or outcomes are unknown. Never manufacture qualitative achievements to make an interim draft.
