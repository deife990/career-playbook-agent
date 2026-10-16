# E-stage evaluation groups — content locks before E implementation

Original C scenarios, personas, prompts, assertions and package snapshots stay unchanged.
Neither group enters the original C scenario inventory or suite fingerprint.

- `holdout/`: nine final-only scenarios, seven critical x 3 cross-judge and two standard x 1
  same-judge; 23 verdicts per host per package. Inputs and dependencies were frozen first in
  [holdout-manifest-v1.json](holdout-manifest-v1.json), commit `47c520c`.
- `development/`: six previously unexecuted drafts moved here plus three procedure variants.
  All use a neutral synthetic persona so unrelated default QA/operations biography is not supplied.
- [development-manifest-v1.json](development-manifest-v1.json): nine original C failure scenarios
  plus nine development variants, once on both hosts. DIAGNOSTIC_ONLY, never release evidence.

No model call has used either variant group. Developer checks may use only the development
manifest. A separate orchestrator is planned; the frozen C runner/CLI stays unchanged.
Content locks do not include a future runner/candidate: separate execution locks precede calls.

Holdout text is visible to its author and reviewer; this is an operational holdout, not a blind
external benchmark. Do not use it in development prompts or use its outputs for candidate selection.
At the final gate the same holdout runs on rc.7 and the frozen candidate. Neither result is used
for tuning before both final schedules finish.

The earlier draft plan to run all variants on baseline and candidate is superseded by the
[post-C policy](../../../docs/rc8-evaluation-policy-2026-10-16.md): development is candidate-only
diagnosis to save calls; holdout baseline/candidate comparison happens only at the final gate.
See the [implementation/approval plan](../../../docs/rc8-e-d-plan-2026-10-16.md).
