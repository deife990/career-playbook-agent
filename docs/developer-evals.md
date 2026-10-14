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
archived with its package/suite fingerprints. Build restores both current-version reports and
requires readiness before uploading consumer ZIPs/checksums. A committed, explicit user browser
exclusion is applied only to its exact version and runtime fingerprints; otherwise native
signoff is required. Missing, stale, incomplete or failed evidence blocks the package job.
See [v1.2 distribution preparation](v1-2-release-preparation.md) for a clean-checkout rebuild.
Actual model evaluation is
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

V1.2 adds EVD-01–14 (48 total scenarios per host, including v1.2 structured-state roundtrip). The development discovery oracle tests
coverage, bounded prompts, exchange parsing, exact confirmation, sanitization, episode identity,
source scope and immutable legacy/actual records. Synthetic CLI tests do not certify a corporate
Copilot tenant, direct connector, native browser installation or document rendering. Browser
validation remains explicitly excluded; current fingerprints and all model cases are still required.

A model invocation timeout preserves its current partial logs and stops the runner. Old output/log
files are cleared before a fresh invocation; a successful CLI exit without a newly written model
response cannot reuse an earlier answer. A timeout is ERROR, distinct from usage/rate limits.

The rc.7 semantic-review audit preserves an original automatic FAIL where the verdict mistook
an explicit denial of VERIFIED FACT for assigning it. Full actual response inspection, immutable
package/suite/loaded-file/provider identity checks and one completed independent review of the
unchanged assertions confirmed the classification. No subject or criterion was changed. A Claude
review attempt timed out without a verdict and is preserved separately. This is a diagnosed
judge error, not a favorable reroll of a real behavioral defect.

The rc.7 Claude submitted-baseline judge also timed out after its actual subject completed.
The unchanged provider response was verified and independently judged on available ChatGPT;
its original ERROR and recovery audit are retained. The ten remaining Claude subject cases
completed after service recovery. Both complete rc.7 suites now pass 48/48; the original
errors and independent review records remain unchanged.
