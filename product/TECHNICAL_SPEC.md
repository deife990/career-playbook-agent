# CareerPilot Technical Implementation v1.0
Source of truth together with [Product Definition](PRODUCT_DEFINITION.md). Full V1 scope is frozen.
One platform-neutral Core → generated thin adapters. Host LLM runs workflows; installed artifacts
contain Markdown, YAML and JSON, no Python/Node dependency. Python 3.12, jsonschema, pyyaml, pytest
are development tooling only. No external service or new credentials are required by the product.

## Gate sequence
Foundation → Policies → State → Router → W01–W03 → W04 Hero → Application Engine → Interview Engine →
Offer Engine → ChatGPT Adapter → Claude Adapter → Evals → Packaging → Clean Install → Release Candidate.
Run each gate's tests before advancing. Commit meaningful milestones on feat/careerpilot-full-v1.
Internal incremental work does not authorize scope reduction. Record ambiguity in DECISIONS.md.

## Repository
product/ specs; core/principles/, state/, router/, workflows/, capabilities/, artifacts/;
schemas/ Draft 2020-12 contracts; templates/ JSON defaults and Markdown artifacts;
adapters/chatgpt/ portable plugin and minimum 12 generated skills; adapters/claude/careerpilot/
single SKILL.md and progressive references; evals/personas|scenarios|assertions|regression/;
fixtures/ synthetic only; scripts/, tests/, docs/, .github/workflows/. dist/ is generated-only.
README.md, CHANGELOG.md, VERSION, CONTRIBUTING.md at root. Semantic product version and independent
schema_version. Never install tooling into generated product archives.

## Canonical entities
CareerProfile, JobPreferences, CareerGoal, Skill, Achievement, CareerEvidence, Story, TargetRole,
TargetCompany, Opportunity, CompanyResearch, JobAnalysis, HiringHypothesis, IdealCandidate,
CandidateStrategy, Application, ResumeVersion, LinkedInReview, PortfolioArtifact, InterviewRound,
InterviewQuestion, InterviewAnswer, InterviewDebrief, CompensationPackage, Offer, Source, Claim,
Decision, NextAction. Nullable knowledge fields enable progressive onboarding; structural envelope
keys/version identifiers stay mandatory to allow reliable import. Unknown IDs are allowed in drafts;
persisted cross-references require assigned IDs and matching opportunity scope.

## State files and validation
Global profile, preferences and story bank; each applications/<id>.json contains one opportunity,
its analysis/application/interviews/offers/sources/claims/decisions/actions. Manifest lists paths and
schema version. Validate schemas, IDs, references, scope, provenance, lifecycle and immutable logs
before replacement; import atomically, no unsupported version coercion. Preserve source pack on
conflict; expose conflicts for user resolution. No inferred lifecycle transitions.
Lifecycle: DISCOVERED→SCREENING→INTERESTED→APPLYING→APPLIED→RECRUITER→INTERVIEWING→FINAL→OFFER→ACCEPTED;
REJECTED/WITHDRAWN/ON_HOLD/DECLINED alternatives require an event. Resume bullets track evidence_ids.

## Runtime routing
Completed interview→W08; offer→W09; mock→W07; upcoming interview→W06; applying/resume→W05;
specific JD→W04; discovery→W03; direction→W02; general→W01. Recent context resolves ambiguity;
multiple active opportunities require clarification. Mock explicit-end handling precedes normal
routing during an active mock. Experience mining and state requests are capabilities, not extra
top-level workflows. Router is a semantic instruction contract; Python router tests are an offline
reference oracle, not a product execution engine.

## Adapters and build
Generate adapter entry skills from Core/config; identical canonical references, no manually copied
policy logic. Each ChatGPT entry: Purpose/Trigger/Required context/Steps/Evidence rules/Output/
State updates/Fallbacks/Do not. Claude entry <500 lines with router/universal rules and conditional
reference links. Root plugin.json follows official portable format. Claude ZIP has careerpilot/
top-level folder with SKILL.md. Validate internal Markdown links in source and extracted archives.
Deterministic archive order/timestamps, checksums, no symlinks/secrets/dev code. Include provenance
hashes linking evaluated content to build. Consumer install instructions verified 2026-10-02.

## Verification and CI
validate_frontmatter.py, validate_schemas.py, validate_references.py, build_chatgpt.py,
build_claude.py, build_all.py, package_release.py, run_static_evals.py. Model eval fixtures: minimum
ten requested personas and every blocker; real host responses and independent rubric decisions.
Do not treat keyword linting or hand-authored expected responses as model eval results.
PR/push validation; build artifacts; manual/nightly/pre-release evaluation; semver-tag release
archives named careerpilot-chatgpt-vX.Y.Z.zip and careerpilot-claude-vX.Y.Z.zip with checksums.
RC eligibility fails closed on absent/stale evidence or native install signoffs. Model evaluation
in CI may require an already-authenticated self-hosted runner; never add a runtime API key.

## Book integration
docs/ebook-map.yaml maps topics to workflows/capabilities and stable topic IDs for bidirectional
links. Chapter IDs/titles are verified against the local final 24-chapter manuscript; the index records
its hash without copying private author material. Independent use never requires the book.
