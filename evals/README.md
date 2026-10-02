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
