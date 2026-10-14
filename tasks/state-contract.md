# v1.2 proposed contract and acceptance matrix

Design only; implement after v1.1 checkpoint 1.

## Coverage

Each frozen JD criterion carries label, must-have flag, hiring relevance and an
evidence-ID list. A confirmed absence/mismatch requires explicit user or reliable
criterion-specific proof. Missing resume examples and exhausted searches are Unknown.
Strong and Usable stop by default. Thin/Unknown with high hiring impact are prioritized;
low-value rows never cause company-wide search. Coverage categories are separate from
v1.1 JD-match and reviewer-grade vocabularies, and do not add a fit score.

## Existing-context scan

Order: profile → evidence → Master → stories → prior tailored resumes → applications
→ debriefs → answers → supplied files → project records → bridge → memory cues.
For prior applications, use only supported candidate-authored facts/evidence links;
do not copy another company's JD, hypotheses, interviewer reactions or confidential
source content. Unavailable sources are explicitly recorded, never silently assumed
searched. Do not repeat known facts as intake questions.

## Exchange and trust boundary

Support several `## Evidence Candidate N` blocks and exact field labels from the user
specification. Multiline/list values stay grouped by field. Unknown/unsure fields stay
null. Unknown labels, missing candidate identity and oversized input are rejected as
invalid exchange; imported instructions never become system/workflow instructions.
The parser produces sanitized candidates only. It does not create confirmed evidence.
No mailbox access, outbound connector or background capture exists in this contract.

Required candidate fields:
Target Criterion; Project / Event; Period; Situation; My Actions;
Other People's / Team Actions; Systems / Technologies; Scope; Outcome;
Evidence References; Uncertainties; Sensitive Information Removed.
Provenance is date + generalized title + source type/scope, with no full body or URL.

## Ownership and confirmation

A: explicit own action; B: assignment plus actual execution; C: third-party attribution;
D: only recipient/CC/attendance; E: context/team result without an own action.
Unknown attribution stays unresolved. Assignment alone is not B. C supports an exact
action only after the user confirms it; D/E cannot yield an individual action claim.
Never infer leadership/ownership solely from an A/B category or user attendance.
No ownership classifier may infer metrics or convert a team result to an individual result.
The user confirms exact sanitized action/scope, not a broad summary containing assumptions.
Disagreement leaves a conflict to resolve; no overwritten evidence or submitted version.

## Nullable state extensions

Keep schema_version 1.0.0. CareerEvidence can add optional nullable source type,
bridge name, A–E ownership classification, episode_id, sanitized, retrieval_scope,
raw_content_stored and minimal source references. CareerProfile may add optional
nullable career_episodes. Application may add nullable evidence_discovery_sessions
with that application's opportunity_id. Stored candidates and
episodes must be sanitized; confirmed evidence references valid global episode IDs.
Persist no raw exchange text, mail body, internal URLs or hidden confidential context.
Episodes and confirmed evidence IDs are global (opportunity_id null); discovery sessions
remain scoped to their target application, so another company's coverage is not global
career fact. Session criteria have stable scoped criterion keys, not a user-facing score.
Legacy omitted keys remain omitted on pure import/export.

## Episode consolidation

Consolidate only explicit matching project/event identity with compatible time scope
and corroborating references, never just common words like migration. Preserve separate
incidents with overlapping keywords. Shared stakeholder/site/ticket hints are reviewed
without retaining identifying values. Deduplicate references/actions, not achievements.
Contradicting outcomes/roles remain unresolved alternatives; no metric sums or highest
number selection. Future discoveries append references to a known episode after review.

## Iteration

Session keeps selected criterion IDs, bounded time/source scope, broad/focused stage,
round count, new candidate IDs and stop reason. Broad first, then focused ownership/
outcome retrieval for a selected episode. Default maximum three retrieval rounds, with
an explicit decision before expanding scope. Stop for sufficient evidence, no new
signals in scope, explicit user stop, confirmed gap or privacy risk. Exhaustion never
changes Unknown to Confirmed Gap.

## Sanitization

Technical patterns (credentials, tokens, IPs, hostnames, URLs, email/phone addresses)
can be removed mechanically; customer identities, employee details, contracts, pricing,
security design and unreleased information also need semantic review. Unreviewed
context stays pending even if regex finds nothing. Generalize context, retain the
confirmed action and leave an outcome Unknown if removing sensitive facts destroys
its support. Synthetic fixtures are the only data used in developer tests/logs.

## Scenario-to-checkpoint matrix

| Scenario | Observable acceptance |
|---|---|
| EVD-01 | Strong existing evidence skips bridge and repeated intake |
| EVD-02 | Thin vendor clue yields bounded ownership-specific prompt |
| EVD-03 | Unknown SQL remains Unknown and merits targeted verification |
| EVD-04 | CC-only is D and cannot become an action bullet |
| EVD-05 | Thanks/acknowledgement is C; explicit exact confirmation precedes persistence |
| EVD-06 | Team accomplishment retains team scope; missing individual action remains unresolved |
| EVD-07 | Synthetic token/IP/hostname/customer details absent from candidates, evidence and export |
| EVD-08 | Six related records form one episode; different incident/time remains separate |
| EVD-09 | Promising broad result produces a narrower episode/ownership prompt |
| EVD-10 | Sufficient evidence stops further retrieval |
| EVD-11 | No Copilot leads to a concrete memory cue or user-supplied file; no forced connector |
| EVD-12 | Generalized confirmed global evidence reused at another application by ID |
| EVD-13 | New recalled experience becomes a candidate; actual answer is unchanged; confirmation required |
| EVD-14 | Employer A context is not pasted into Employer B resume; only generalized confirmed action reused |

Additional negative tests: hostile pasted instruction; unresolved ownership; assignment only;
duplicate source/reference; conflicting role/outcome; unsupported number; stale confirmation;
unknown sensitivity; original v1.0/v1.1 packs; pure lossless re-export; preserved submitted resume.

## Implementation cautions from source review

W04 retains its thirteen stages and fifteen output sections; insert the five-category
coverage table inside the existing evidence-mapping section, with a separate vocabulary
from W04 match buckets and v1.1 reviewer grades. W05 performs coverage before the existing
screening engine but still supplies a supported partial draft when discovery is declined
or time is short. Discovery is a selective recommendation, not a mandatory corporate step.

W08's confirmation of recall for analysis is not confirmation to promote new evidence.
Only actual recalled past actions can become Potential Career Evidence; proposed model
answers cannot. Preserve the original answer and ask separately about the exact reusable
sanitized action before global persistence.

New extension records must require both sanitization and contextual privacy review.
A "Yes" supplied by Copilot is an untrusted claim, not either completed check. Redacting
technical strings cannot prove customer/contract/security context is safe. Removing support
for an outcome makes that outcome Unknown; do not reconstruct or estimate it. The original
chat message cannot be erased by a sanitizer, so claim only safe output/state/export.

Minimal references have date/title/source scope, never raw messages, hidden URLs or
foreign opportunity source IDs. No generic recursive scan of every application: select
candidate-authored material and reject cross-company intelligence before reuse.

Do not implement a fake NLP authority in the development oracle. Ownership A–E uses
explicit reviewed evidence attributes (direct action, assignment plus execution,
third-party acknowledgement, participation, context) and records rationale. Missing or
conflicting attributes remain Unknown. Runtime model behavior is verified separately.
The same applies to criterion support: consume actual reviewed criterion-to-evidence
links, not substring matches that can confuse SQL-result review with SQL authorship.

Only user-confirmed sanitized actions are promoted. Confirmation binds exact content;
edits invalidate it. Same project/time/scope is a clustering hint, not permission to merge
separate incidents. Contradictory roles/outcomes remain candidates pending clarification;
no metric sums, max-value selection or overwrite of existing confirmed evidence.
