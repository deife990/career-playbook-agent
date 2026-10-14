# Implementation plan: CareerPilot v1.2

## Scope and prerequisite

Implement Career Evidence Discovery & Copilot Bridge after the current v1.1 rc.7
implementation and its complete actual-model regression suites pass. User explicitly
excluded further browser verification on 2026-10-12; record that exclusion separately,
never fabricate native PASS. Keep immutable v1.1 reports and archives before changing
runtime files or version. No publication, corporate access or new service is needed.

## Architecture decisions

- Keep the twelve ChatGPT skills and single Claude entry. Extend experience-mining;
  add a vendor-neutral discovery capability and a Microsoft Copilot prompt adapter.
- The consumer runtime is Markdown/schema/templates. Python is a development oracle,
  never a shipped dependency or a mandatory step for a user.
- W04 derives JD criteria independently. W05 checks evidence coverage before drafting;
  sufficient evidence skips discovery and uncertain evidence never becomes absence.
- Read the existing profile/evidence/Master/stories/selected prior applications/debriefs
  and supplied material before requesting corporate search or new recollection.
- Corporate-approved AI runs inside the company. The user transfers sanitized summaries
  through Markdown. No Graph/Work IQ installation, backend, account or API key.
- New nullable optional state extensions preserve v1.0/v1.1 imports without migration.
  Global generalized evidence remains separate from each application's company context.
- Candidate actions remain unconfirmed until explicit confirmation, provenance and
  sanitization pass. D/E records cannot establish own actions; C corroborates and cannot
  independently turn team actions into ownership. Conflicting scope needs reconciliation.
- Stop search on sufficient evidence, exhaustion, user stop, confirmed absence or privacy
  risk. No absence inference from exhausted search; bound rounds and preserve stop reason.

## Ordered tasks

1. **v1.1 closure** — finish both 33-case model suites, preserve real reports,
   verify deterministic packages and implement version-bound explicit browser exclusion.
   Verification: existing regression tests, actual model evidence, scoped readiness.
2. **Coverage and exchange contract** — define five coverage categories, priority,
   source exhaustion, Markdown fields, ownership A–E and iterative stop states.
   Verification: EVD-01/02/03 and malformed/quoted exchange input tests. Depends on 1.
3. **Privacy and ownership** — parse candidate summaries as untrusted data; redact
   technical identifiers, require review of contextual sensitivity, validate attribution
   and confirm only exact sanitized actions. Verification: EVD-04/05/06/07. Depends on 2.
4. **Episodes and persistence** — consolidate related records without metric inflation,
   preserve conflicts, append confirmed generalized evidence and story links globally.
   Verification: EVD-08/12/14 plus v1.0/v1.1 lossless import and submission preservation.
   Depends on 3. No raw import body or hidden action is exported.
5. **Iterative bridge and fallback** — bounded targeted broad/focused prompts, known
   limits and memory cues; generic approved AI/manual/file modes. Verification:
   EVD-09/10/11 and explicit stop/no-new-results. Depends on 2–4.
6. **Workflow integration** — integrate W04/W05 coverage and W08 potential evidence
   while preserving actual recall and submitted resumes. Generated adapters share Core.
   Verification: EVD-13, routing, workflow/parity/reference and full regression checks.
   Depends on 4–5.
7. **Docs and release candidate** — quick start, ownership/privacy/state guides,
   source decisions/notices, version bump and deterministic ZIPs. Depends on 6.
8. **Behavior and readiness** — actual ChatGPT/Claude EVD-01–14 plus all prior cases,
   scope-bound readiness and archive identity. Never sign off partial/error runs.
   Depends on 7. Repair real behavior failures and rerun changed package evidence.

## Checkpoints and risks

After 3: confirmation and privacy gates pass before persistence is introduced.
After 6: old packs, actual debriefs and immutable submissions remain unchanged.
After 8: no critical ownership/privacy failure and both full suites pass.
Corporate names and sensitive commercial context need semantic review, beyond regex.
The development sanitizer is conservative and fails closed for unreviewed content;
it does not claim to classify every confidential term automatically.

No extra approval pause is needed for the plan: the user explicitly requested plan
followed by implementation, tests, documentation, version bump and readiness.

## Public source decisions

Research date: 2026-10-12. These are design references, not installed skills or permissions.

| Source | Decision | Reason |
|---|---|---|
| [performance-review-writer](https://github.com/github/awesome-copilot/blob/main/skills/performance-review-writer/SKILL.md) | ADAPT | Contribution discovery and weak-detail marking inform bounded search. Replace direct WorkIQ reads with manual sanitized exchange; retain observable behavior and user ownership. |
| [Microsoft Work IQ](https://github.com/microsoft/work-iq) | REJECT as dependency; ADAPT source types | Its README describes tenant permissions/admin consent and email, meetings, documents, Teams and people queries. Those constraints support an independent bridge; no consent, installation or license acceptance occurs. |
| [Copilot brag-sheet skill](https://github.com/microsoft/copilot-brag-sheet/blob/main/skills/brag-sheet/SKILL.md) | ADAPT | Scan before drafting, group related signals, retain evidence gaps and confirm before saving. Abstract coding records into work episodes; do not adopt automatic capture or insist on metrics. |
| [brag-skill](https://github.com/kammradt/brag-skill/blob/main/SKILL.md) | ADAPT | Aggregate optional sources and cluster by deliverable. Do not adopt session-history reads, automatic integration or outgoing Slack actions. |

Original implementation and wording follow the supplied product specification. No third-party
source code or verbatim skill body is copied; preserve this attribution and any later license
notice if actual text/code reuse is introduced. Optional Outlook repositories are unnecessary.
