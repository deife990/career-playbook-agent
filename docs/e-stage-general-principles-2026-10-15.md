# E-stage direction: two general principles — 2026-10-15

This is a plan only. No package, entry-file, core, schema or template change is made before C
completes. The frozen C scenarios, assertions, tiers and prompts stay unchanged.

## Principles to implement in E

1. **Scope preservation.** Describe only the actions and durations the user supplied. Do not attach
   quality or method qualifiers (structured, data-driven, accurate, careful, collaborative, attention
   to data quality and similar) or extra actions/outcomes to positioning, evidence mapping or resume
   wording. A transferable idea may appear only as a labelled INFERENCE and is not copy-ready.
2. **Provided fields only.** Fields the user did not give (round number, speaker, date, result) are not
   marked confirmed. Leave them Unknown or ask once. When the speaker is ambiguous, record the
   ambiguity instead of choosing one.

## Constraints

- No scenario-specific keyword rules and no sentence copied from C scenarios in an entry file.
- Source edits go in `core/principles/` (evidence and entry guards) and the relevant workflow or
  artifact contract; generated adapters are rebuilt, never edited by hand.
- The change must not raise the frozen byte and file budgets.
- Keep the preserved safety principles: fact/inference labels, no invented career facts, Unknown
  retention, company isolation, no coaching during an active mock interview.

## Evaluation

- Acceptance is unchanged from the [clarification](e-stage-acceptance-clarification-2026-10-15.md):
  existing real baseline failures resolved and zero new failures, on the full frozen C suite with
  the same repeats, judges and context mode.
- The drafted [variant group](../evals/variants/e-stage/README.md) changes occupation, wording,
  numbers and provided fields, includes non-operations roles, and is frozen with its own fingerprint
  before any E model call. It runs on both the rc.7 baseline and the candidate. It is a separate
  group and is never merged into C.
- Variant safety failures count against the candidate. Variant results do not replace the full suite.

## Reporting

Report each host against its own baseline only. Claude and ChatGPT use different judge platforms,
so do not rank the hosts or interpret a failure-rate gap between them. Disputed judge reasons are
shown with the original response and judge text; automatic FAILs are not silently converted.
