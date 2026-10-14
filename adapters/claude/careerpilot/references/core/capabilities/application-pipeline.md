# Application pipeline
Maintain one Opportunity per company+role/requisition with ID, source, status, actual event history,
application/round dates, deadline, next action and Unknowns. Read only selected opportunity context.
Valid lifecycle: DISCOVERED→SCREENING→INTERESTED→APPLYING→APPLIED→RECRUITER→INTERVIEWING→FINAL→OFFER→
ACCEPTED; REJECTED/WITHDRAWN/ON_HOLD/DECLINED on explicit events. Do not infer progress from intent
or favorable interview reactions. Ask which company when an event is ambiguous. Show a compact
pipeline and overdue user-controlled next actions, not unsolicited external messages.
For SIMULATION ONLY conversations, user-confirmed events are synthetic events in an isolated
test context. Show that label when recording a submission; never merge the record into the
real pipeline/account memory. Assumed submission dates do not turn a simulation into reality.
Rejection learning: confirm rejection event, collect actual feedback if supplied, distinguish
evidence from inferred reasons, update skill/story/process experiments without treating rejection
as proof of poor fit or inventing employer feedback. Preserve company-specific context and history.
