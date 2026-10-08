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
- screening-engine
- resume-artifact
- human-voice
- compensation
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
3. Select mode/depth and execute the complete [screening pipeline](../capabilities/screening-engine.md):
   Evidence→Positioning→Master→Target JD→Selection→Tailoring→Assertion Audit→ATS Structural QA→
   JD Coverage→Recruiter Scan→HM Credibility→Differentiation→Human Voice→Cross-Surface Consistency→
   DOCX/PDF Rendering→Extraction/Parse QA→Final Red Team→Freeze after actual submission.
   Maintain one Application and its version ledger; internal checks are not separate installations.
4. [LinkedIn audit](../capabilities/linkedin.md) before optimization; review authorized professional
   footprint and cross-document consistency. Rewrite only requested sections.
5. Apply [portfolio/handout decision gate](../capabilities/portfolio.md); record CREATE/SKIP/DEFER.
6. Draft requested [cover letter/answers](../capabilities/application-writing.md) and
   [recruiter/networking messages](../capabilities/networking.md), respecting official limits.
7. Run [Recruiter→HM→Skeptical red team](../capabilities/red-team.md), fix actual weaknesses.
8. Audit evidence IDs, date/title/metric/ownership, company scope and source freshness again.
   Unresolved facts→DRAFT + precise verification question, never final-ready fabricated material.
9. Produce actual checked files when supported using [artifact QA](../capabilities/resume-artifact.md).
   A draft without extraction/visual QA is not final-ready. Preserve useful copy and pending tests.
10. Produce [Application Pack](../artifacts/application-pack.md) and one next step. User confirms
   facts and decides submission; maintain [pipeline](../capabilities/application-pipeline.md).
   After confirmed submission freeze the exact submitted version/answers/cover letter/JD/date;
   later Master updates never change it. No actual confirmation means no submitted record.
11. Handle expected salary/current compensation fields through [compensation](../capabilities/compensation.md)
   at the actual process stage; no formal offer is required for early conversation support.
## Evidence rules
JD demands are not career facts. No numeric inflation, fictional credentials or contradictory
versions. Qualitative supported outcomes are acceptable; invented precision is not.
## Output
Before presenting any interim/final bullet or message, run the assertion audit in
[resume](../capabilities/resume.md). Unknown outcomes mean action-only copy with no claimed benefit.
Application Pack with requested copy, decision on optional assets, audit and next action.
## State updates
CareerEvidence/Story globally; Application/ResumeVersion/LinkedInReview/PortfolioArtifact/Decision/
NextAction within scope; global Master/LinkedIn/portfolio records export through career-profile.json
resume_versions/linkedin_reviews/portfolio_artifacts with null opportunity_id, alongside global claims.
APPLYING on explicit preparation intent; APPLIED only on confirmed actual submission, with event.
Persist screening observations/coverage/concerns/meaning-preserving edits, form limits/provenance,
compensation conversations and submissions. Preserve submitted records through export/import.
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
