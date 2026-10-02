# Evaluation and release operations
Install only requirements-dev.txt into a Python 3.12 development environment. Runtime ZIPs contain
Markdown/JSON/YAML, with no executable code, key, server or database.

Run static tests and builds sequentially: generation mutates shared adapter folders. Actual
model evaluations may run one per platform concurrently after source is frozen. Do not regenerate
that platform while a subject is loading references. Reports store package and suite fingerprints,
real model IDs, transcript quotes and assertion verdicts. ERROR is never a passing evaluation.
Repeated judge validation errors preserve both attempts and require investigation.

`python -m scripts.package_release` creates reproducible archives for inspection, even before RC.
`python -m scripts.package_release --require-ready` refuses missing/stale model or native evidence.
Native check observations belong in evals/native-install.json with a nonempty repository evidence
file; record only synthetic observations. [Native checklist](native-install-test.md).

CI Validate and Build run without host credentials on every PR/push. Actual model evaluation is
manual/nightly/tag-triggered on a private self-hosted `careerpilot-evals` runner with existing Codex
and Claude CLI logins. Set repository variable CAREERPILOT_MODEL_EVALS_ENABLED only when that runner
exists. This developer configuration is optional and is never an installation requirement.
Skipped CI model jobs do not clear release gates. Local authenticated evaluation remains available.
No credentials or CLI session data are uploaded; artifact paths contain synthetic transcripts only.
Semver tags run all checks and refuse release until native and model evidence matches that version.
The release workflow initially publishes prereleases; promote a candidate only after explicit
human release decision. Source VERSION is independent of state schema_version.
