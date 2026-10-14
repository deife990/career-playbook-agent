# Evaluation and release operations
Install only requirements-dev.txt into a Python 3.12 development environment. Runtime ZIPs contain
Markdown/JSON/YAML, with no executable code, key, server or database.

Run static tests and builds sequentially: generation mutates shared adapter folders. Actual
model evaluations may run one per platform concurrently after source is frozen. The runner evaluates an immutable package snapshot, so later builds cannot change an in-flight
subject. Do not change scenario/persona/seed files during evaluation. Do not run two evaluators
for the same platform concurrently because their canonical report/log destinations are shared. Reports store package and suite fingerprints,
real model IDs, transcript quotes and assertion verdicts. ERROR is never a passing evaluation.
Repeated judge validation errors preserve both attempts and require investigation.

`python -m scripts.package_release` creates reproducible archives for inspection, even before RC.
`python -m scripts.package_release --require-ready` refuses missing/stale model or native evidence.
Native check observations belong in evals/native-install.json with a nonempty repository evidence
file; record only synthetic observations. [Native checklist](native-install-test.md).

CI Validate and Build run without host credentials on every PR/push. Actual model evaluation is
manual/nightly and called before tag releases on a private self-hosted `careerpilot-evals` runner with existing Codex
and Claude CLI logins. Set repository variable CAREERPILOT_MODEL_EVALS_ENABLED only when that runner
exists. This developer configuration is optional and is never an installation requirement.
Skipped CI model jobs do not clear release gates. Local authenticated evaluation remains available.
No credentials or CLI session data are uploaded; artifact paths contain synthetic transcripts only.
Semver tags call the evaluation workflow once, then download its actual reports and run all checks and refuse release until native and model evidence matches that version.
The release workflow initially publishes prereleases; promote a candidate only after explicit
human release decision. Source VERSION is independent of state schema_version.

When the user explicitly excludes browser validation, create a version/fingerprint-bound
record naming the user instruction and use
`python -m scripts.release_readiness --native-exclusion evals/browser-exclusion-<VERSION>.json`.
This certifies only that scope; it never certifies native installation or bypasses model
assertions. The same record can be passed to `package_release --require-ready`.

After package changes, run failed scenarios first with `--scenario <id>` (repeatable), then
resume the complete unchanged package with `--resume`. Only PASS cases for the exact package
and suite fingerprints are skipped. A targeted subset alone is INCOMPLETE; all scenarios must
pass before readiness. Archive original reports before a repair. Account/service limits stop
the runner immediately; resume after provider recovery, never overwrite ERROR as PASS.

A malformed judge quotation remains ERROR. The bounded citation-repair pass now asks a fresh
independent judge to select numbered actual assistant lines instead of rewriting quotations.
The harness copies that selected original line exactly and rejects invalid/non-integer indices,
omitted assertions and non-boolean verdicts. This never changes FAIL to PASS automatically.
Citation-only recovery may rejudge an unchanged saved subject after package/suite checks;
retain the original ERROR, verify saved provider outputs match the transcript, and record the
recovery provenance. Behavior failures require a product repair, not a favorable reroll.
