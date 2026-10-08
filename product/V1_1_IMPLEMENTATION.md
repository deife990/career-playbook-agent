# CareerPilot v1.1 — Screening & Application Engine Upgrade

Status: implementation in progress. V1 product/technical specifications remain the foundation.
Consumer language: Korean; document language follows the target application.

## Existing V1 and gap analysis

V1 is a platform-neutral instruction Core, generated thin ChatGPT/Claude adapters, JSON Schema
contracts, portable state and development-only validators/model evaluations. No runtime server,
account, executable dependency or additional consumer installation is needed. W04 independently
defines the ideal candidate; W05 creates evidence-linked Master/Tailored bullets; W06 prepares
interviews; W09 compares offers with original requirements. Context validation enforces company
scope, confirmed bullet evidence and preservation of actual interview recall.

Missing: a complete screening pipeline; structured requirement/claim provenance; human scan and
credibility findings; explicit form constraints; immutable submitted records and selection during
interview preparation; actual binary extraction/visual QA; compensation continuity before offers.
The existing number checker is a narrow guard, not a semantic proof of factual accuracy.

## Architecture

One W05 workflow shares Application state across evidence, positioning, Master inventory, JD
requirements, selection, tailoring, assertion audit, structural ATS checks, coverage, recruiter
scan, HM credibility, differentiation, meaning-preserving editing, consistency, rendering,
extraction, final red team and submitted freeze. New capabilities are internal references,
not separately installed skills. W01–W09 and the original router precedence remain intact.

Add optional fields to ResumeVersion/Application/JobAnalysis/InterviewRound. Existing V1 packs
retain their values and paths. Schema version 1.0.0 remains supported; new optional extensions
are documented as a reader compatibility boundary (old strict validators cannot read new fields).
No destructive migration. Keep applications/<opportunity>.json canonical; binary deliverables may
be sidecars with safe relative paths, hashes and observed QA, not embedded in the JSON manifest.

Frozen submissions refer to immutable resume IDs, store exact answers/cover letter/JD identity,
and survive export/import. A corrected submission creates a new version, never edits the old.
Interview preparation selects the actual submitted record for its opportunity and records that
selection. Missing submission evidence remains Unknown; latest Master is never a substitute.

## Incremental gates

0. Research/adoption decisions and unchanged V1 baseline (83 tests passed).
1. Additive state contracts, immutable freeze and V1 round-trip regression.
2. W05 modes/pipeline, JD mapping, bullets, forms, human screening and pre-offer compensation.
3. Host document-production contract and actual DOCX/PDF extraction QA fixtures.
4. A–H behavior regressions, actual model evaluations, generated adapter parity and package checks.
5. Korean docs/changelog/version, clean clone, diff review and release readiness report.

Each gate must pass its relevant checks before moving on; no stale V1 signoff counts as V1.1 proof.
Report native-install/model/artifact limitations separately from static tests. Do not label an
unobserved host render, real ATS upload or native installation as passed.

## Non-negotiable boundaries

Career facts outrank resume wording. Master is an evidence-backed representation, not authority
to preserve unsupported old claims. Never infer missing metrics, ownership, skills, titles,
motivation or work authorization. Gaps are not keywords. No ATS probability or numeric fit score.
ATS vendor observation establishes a host only, not its configuration or parsing behavior.
External ideas are redesigned under CareerPilot policies; users install only CareerPilot.
