# Evaluation
Static: schemas, defaults, references, skill/frontmatter limits, workflow contracts, manifests,
generation parity, build/archive cleanliness and offline state/router/behavior contract regressions.
Static tests are not actual model behavior. At least ten synthetic personas and every blocker are
represented in scenarios. No real user resumes/mail enter eval data.

Real model evaluation: python -m scripts.run_model_evals --platform chatgpt (existing codex login),
or --platform claude (existing claude login). Loads generated package entry/policies/router/state/
selected workflow and actual capability/artifact references; records hashes of loaded files.
Each user turn receives a real model answer with previous turns preserved. A separate judge call
receives only scenario/rubric/transcript and returns assertion decisions plus exact response quotes.
Model self-reported compliance or a text grep is insufficient. Context export also runs deterministic
schema/scope/round-trip verification. Outputs remain in ignored work/ and dist/evals/.
Development CLI harness is not evidence of native consumer UI installation or automatic activation.
No API keys are required by CareerPilot. Developer runners must be authenticated separately.
Absent auth is BLOCKED, never PASS; model/eval/native evidence must match current content hashes.

Final 1.0.0-rc.1 actual CLI evidence: both platforms 15/15 PASS, archived in reports/.
Resume reuse requires the same package plus scenario/persona/seed-content fingerprint; changes
in any evaluation input invalidate reuse. Native consumer signoff remains separate and pending.

CI integration: validate/build jobs use hosted Python 3.12 runners. Actual model jobs require
a trusted self-hosted runner labeled `self-hosted, careerpilot-evals`, existing Codex/Claude CLI
logins, and repository variable `CAREERPILOT_MODEL_EVALS_ENABLED=true`. This external runner is
not registered/enabled by this implementation. Do not put CLI credentials in the repository.
Manual/nightly/reusable pre-release jobs are wired but remain skipped until the owner enables
that runner. PR code never runs on the authenticated runner. The release job requires a tag
matching VERSION plus current model evidence and observed native signoffs; a disabled runner
or missing evidence cannot publish a release. These are developer release tools, not runtime
installation requirements for CareerPilot users.
