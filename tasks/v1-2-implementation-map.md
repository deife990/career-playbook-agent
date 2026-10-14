# Implemented v1.2 integration locations

Implemented after both v1.1 suites passed. Current model verification remains in checkpoint 8.
The source decisions and acceptance matrix are in plan.md and state-contract.md.

| Existing location | Implemented change | Verification |
|---|---|---|
| core/capabilities/experience-mining.md | Dispatch targeted discovery after existing-context scan; retain manual/file entry | No duplicate intake; no mandatory corporate access |
| core/capabilities/career-evidence-discovery.md (new) | Coverage, priorities, sessions, exchange, attribution, clustering, confirmation and stop rules | EVD-01 through EVD-14 |
| core/capabilities/copilot-bridge.md (new) | Bounded broad/focused corporate AI prompts and vendor-neutral/manual fallback | Prompt criteria/date/source/ownership boundaries |
| templates/artifacts/evidence-exchange.md (new) | Exact Markdown field names, multiple candidate blocks and minimal references | Multiline parsing, Unknown, invalid/hostile input |
| core/workflows/w04-job-intelligence.md | Coverage and discovery recommendation inside existing user_evidence_mapping stage | Independent ideal persona and all fifteen output sections preserved |
| core/workflows/w05-application-prep.md | Coverage gate before the existing v1.1 pipeline; supported partial drafts still available | Previous screening and file fallback regressions |
| core/workflows/w08-interview-debrief.md | Identify Potential Career Evidence without rewriting actual recall | Confirmed global promotion only; immutable actual answer |
| core/state/state.md and shared evidence/privacy policies | Global generalized episodes; application-scoped sessions; no raw import/body | Legacy pack and cross-company preservation |
| schemas/entities.schema.json | Nullable optional fields and episode/session definitions | Strict schemas and old-pack lossless import |
| templates/career-profile.json and templates/application.json | New optional defaults only; old omitted fields remain omitted | No unnecessary schema_version migration |
| scripts/context_pack.py | Typed episode links and new-extension privacy/confirmation validation | Atomic invalid import; immutable submissions/debriefs |
| scripts/evidence_discovery.py (new development oracle) | Deterministic exchange validation, attribution inputs, cluster review and confirmed promotion | Negative ownership/privacy/conflict tests; no runtime executable shipped |
| scripts/generate_adapters.py | Generate a compact discovery guard/link from Core in both hosts | Twelve ChatGPT skills, one Claude entry; reference/parity checks |
| evals/scenarios/evd-01...14.yaml (new) | Observable synthetic acceptance tests, mapped to existing personas | Actual-model suites for both hosts |
| docs and DECISIONS.md | Discovery/bridge/ownership/privacy/state/workflow/eval guides and primary-bridge ADR | Linked examples and accurate readiness scope |

## Compatibility constraints that need explicit implementation

- Global evidence may not retain another application's source IDs: those source entities are
  scoped and cannot support cross-company reuse. Generalize the reference into minimal global
  provenance, excluding JD, employer strategy, interviewer reaction and confidential details.
- The scan order does not grant unrestricted reads of every application. Inspect loaded global
  facts first, then candidate-authored material from explicitly selected/provided prior contexts;
  record inaccessible sources as unavailable rather than searched or empty.
- Pending candidates can remain only as sanitized, unconfirmed session data. A positive Copilot
  "Sensitive Information Removed" flag is insufficient for privacy approval or user confirmation.
- No assignment-only record becomes B. No D/E-only record becomes an own-action achievement.
  Newly supplied independent own-action proof creates a reviewed candidate; do not silently
  change the meaning of an old CC-only record.
- Confirmation binds candidate identity and exact action/scope/outcome version. Any material
  edit or unresolved conflict invalidates earlier confirmation. Never select the larger outcome.
- One episode may have many provenance references but does not yield six counted achievements.
  Reuse stable evidence/episode IDs; do not combine separate incidents by keywords alone.
- New-field validation applies to new evidence/session/episode extensions and does not rewrite
  or discard unknown legacy fields. Existing permitted old packs retain exact values/order.
- Preserve actual answer/debrief text, submitted version, original JD and user requirements even
  when a separately confirmed generalized story is improved for a later opportunity.
