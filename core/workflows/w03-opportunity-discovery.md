---
id: W03
artifact: opportunity-screen
capabilities:
- role-mapping
- application-pipeline
---
# W03 Opportunity Discovery
## Purpose
Find and screen target roles/companies and produce a trustworthy Target Opportunity List.
## Trigger
“어떤 회사 지원”, “외국계 찾아줘”, opening search and company/role mapping.
## Required context
Read [policies](../principles/index.md), [state](../state/state.md), requirements and roadmap.
Confirm location/role if the search would otherwise be meaningless; do not force full onboarding.
## Steps
1. Form role-title synonyms/company/industry/region map from [role mapping](../capabilities/role-mapping.md).
2. Search official careers sources for current openings; verify actual role/location/date/status.
   If access is unavailable, produce a target research list clearly marked unverified.
3. Research closed historical jobs only as historical demand clues; never include them as live.
4. Inspect eligibility, language, work arrangement and must-have conflicts before attraction.
5. Group Core/Stretch/Strategic Entry; show Strong Evidence/Transferable Evidence/Gap/Unknown.
6. Explain each candidate's linkage to original goals, specific bridge and verification questions.
7. Produce [opportunity screen](../artifacts/opportunity-screen.md); let the user choose one for W04.
8. Record selected opportunities with distinct company+role/requisition IDs. Use the
   [pipeline](../capabilities/application-pipeline.md); do not auto-apply or mark INTERESTED without intent.
## Evidence rules
Live opening claims require current accessible official postings. No invented vacancies/salaries,
no inferred language eligibility, no hidden-org fact from community alone.
## Output
Target Opportunity List, category rationale, dates/sources, constraints and next analysis choice.
## State updates
TargetRole/TargetCompany/Opportunity (DISCOVERED with provenance)/Source/Claim/NextAction.
Preserve company scope. A search target without a real posting has null URL/status where unknown.
## Fallbacks
No web: search terms/official career-page checklist and user-supplied JDs. No openings: historical
patterns plus alternative entry routes, not fabricated active roles.
## Do not
Assign numeric fit scores, mix similar requisitions, imply selected targets are application events.
