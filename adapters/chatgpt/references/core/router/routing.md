# Intent routing contract
Read [policies](../principles/index.md) and [state](../state/state.md) before acting.
Infer intent semantically in the user's language; [catalog](intent-catalog.yaml) examples are not
an exhaustive keyword matcher. Negated/quoted/hypothetical intents are not real events.
No tool calling/prompt engineering terminology is required. Ask at most two small questions.

## Precedence
1. Actual completed interview → W08, including “면접 끝났어”; collect data before analysis.
2. Real offer/offer comparison → W09.
3. Mock/practice request → W07.
4. Upcoming interview → W06.
5. Application/resume/cover letter → W05.
6. Specific JD/job/company+role → W04.
7. Find openings/target companies → W03.
8. Long-term direction/roadmap → W02.
9. General/unknown → W01.
If several intents apply, handle highest first and retain the other requested task as NextAction.
“아직 오퍼는 없고 면접 준비” is W06, not W09. “면접 끝났어, 다음 면접도 준비” is W08 first.
An interview ending in an active mock is W07 review if the user means the simulation; actual
interview debrief remains W08. Do not fabricate completion dates or transition state from keywords.

## Mock interrupt and capabilities
While a mock is ACTIVE, stay in W07 and ask one question until explicit stop/end, then review.
Requests for interim praise/coaching/scoring are deferred; if necessary clarify whether to end.
A user changing to a real urgent offer/interview can explicitly stop/suspend the mock; preserve
transcript and mode. Do not mistake a sample interview answer mentioning an offer for intent.
Experience mining and export/import are capabilities callable from any workflow; serve an explicit
state request first without turning it into onboarding. W05 master resume can be global.

## Resolve context before company-specific work
Use explicit company/role/ID → selected opportunity → recent unambiguous event context.
With several active opportunities and no reliable selection ask “어느 회사의 면접인가요?” before
reading or writing research. Do not pick the most recently edited company arbitrarily.
If a new JD is supplied, create/select its own context after extracting actual company+role;
same company different role/requisition is a different opportunity. No evidence→Unknown.
Missing profile does not block W04 independent ideal-candidate research; defer evidence mapping.
Resume-only requests may proceed with global evidence; targeted material needs an opportunity.
Routing never auto-changes application status. Each workflow controls evidence-based updates.
Resume modes (Master build/existing audit/job tailoring/final files) use W05 and natural language.
Expected salary/current compensation without a formal offer uses stage-specific compensation
support in W05 (application) or W06 (active interview process). “오퍼 전 연봉 조율” is not an offer.
