# Implementation decisions
- D001 (2026-10-02): The referenced Product/Technical packages are truncated by the read tool at
  20,000 characters each. Consolidated specifications preserve the complete current human request;
  no claim is made that the archived preview is complete. Current human requirements prevail.
- D002: Portable OpenAI plugin root plugin.json + skills/, no MCP/auth; add marketplace catalog
  for installation. Official https://learn.chatgpt.com/docs/plugins and
  https://learn.chatgpt.com/docs/build-plugins verified 2026-10-02. ZIP alone is not a universal
  consumer upload install path; document supported marketplace flow and restrictions explicitly.
- D003: Claude single careerpilot/ ZIP with SKILL.md; Customize > Skills > Create skill > Upload a skill.
  Host requires Code execution/file creation enabled, but CareerPilot ships no executable dependency.
  https://support.claude.com/en/articles/12512180-use-skills-in-claude and
  https://support.claude.com/en/articles/12512198-how-to-create-custom-skills verified 2026-10-02.
- D004: Nullable knowledge fields; structural envelope/version keys required. Strict unknown-key
  rejection prevents silent typos. Nested schemas represent all canonical entities.
- D005: No product license chosen by human; private implementation, no unsolicited public publish
  or open-source license. No public release tag until all release checks pass.
- D006: A local Codex project named AI Career 전자책 exists at the exact requested Desktop path.
  Available tooling cannot attach this current chat to a ChatGPT project. Connection unchanged;
  user may manually move this chat into AI Career 전자책. Local project is not proof of ChatGPT linkage.
- D007: Authenticated developer CLI sessions may run model evals without new API keys. They do not
  establish native ChatGPT/Claude UI installation. Missing native evidence keeps RC gate blocked.
- D008: Correct OpenAI authoring reference is https://developers.openai.com/plugins/build/plugins.
  Marketplace source.path resolves from the marketplace root. Repository catalog points to
  ./adapters/chatgpt; the extracted ChatGPT ZIP catalog points to ./ for its own plugin root.
  Official portable schema pinned offline in fixtures/platform; no runtime validation dependency.
- D009: Unknown skills are distinct from evidenced gaps; an unprovided SQL history cannot appear
  in Gaps even with a qualifier. Added after an actual Claude model regression.
- D010: Global Master resumes, LinkedIn/portfolio records and claims persist in career-profile.json.
  Optional schema fields added compatibly at schema_version 1.0.0 before first release. Partial
  debriefs may append/fill unknowns without losing observations; completed captures are preserved.
- D011: Lossless model export may add schema-valid optional null fields. This is unknown-field
  normalization, not new career information; no existing field/value/list order may change or
  disappear. Deterministic eval checks this explicitly after schema/scope validation.
- D012: Native custom-package installation through computer UI requires action-time confirmation
  under the computer-use tool policy for software outside a recognized marketplace. Package
  preparation and CLI behavioral evaluation do not require this confirmation. Native evidence
  remains pending until actual observed installation and behavior; no simulated signoff.

- D013: Final local ebook manuscript discovered under the requested workspace outputs directory.
  Replaced provisional null chapter mapping with verified CH01–CH24 titles and an immutable source
  hash snapshot. Private author notes/case material are not copied. Chapter numbers are now sourced.
- D014: Global career-direction decisions and roadmap actions also require portable recovery,
  stored in CareerProfile decisions/next_actions with null opportunity_id. Added regional/global/
  teammate/reference round types and explicit ebook-derived preparation coverage before freezing RC.

- D015: Actual Claude account UI on 2026-10-02 exposes Customize → Skills → Add skill →
  Upload skill directly. Updated consumer docs; older official UI labels remain a fallback.
  Only navigation was observed; no upload/installation has occurred.

- D016 (2026-10-03): The actual OpenAI archive is accepted by the official CLI local marketplace
  installer and reported installed/enabled without new authentication. Exact installed runtime
  fingerprint matches actual model evidence. This supplementary CLI observation does not replace
  native ChatGPT consumer UI activation and lifecycle signoff.

- D017 (2026-10-04): The authenticated ChatGPT web account has an empty Personal plugin list
  while the local OpenAI installer reports CareerPilot installed/enabled. Local installation is
  therefore not evidence of this account's web registration. Actual UI exposes Plugins → Personal
  → Add → Upload plugin archive. Added this observed path to consumer installation docs. ZIP
  acceptance, web activation and lifecycle remain unobserved until upload confirmation and testing.

- D018 (2026-10-04): User authorized the ChatGPT private ZIP install. Native file selection worked
  without granting persistent extension file access, but two Add plugin attempts returned only a
  generic failure. Official upload documentation adds author/interface requirements beyond the
  portable schema; added those metadata fields and regression validation. Generic UI errors do not
  prove this was the cause. Repaired package acceptance is pending user file selection after native
  Chrome inspection was rejected for an unrelated private selected tab. Keep the bound plugin tab
  only. Existing model/fresh-clone evidence predates this metadata-only change and does not certify
  the current full package; release remains blocked until all current-package gates pass.

- D019 (2026-10-04): The user confirmed the metadata-complete package still fails web upload.
  Official onboardingSkill is a relative included-file path, not a skill identifier. Corrected
  it to ./skills/careerpilot-router/SKILL.md and validate shape/existence/traversal before build.
  This confirms a package defect but does not prove the generic error's sole cause. Provide a
  distinct upload-fix filename for the corrected bytes; no native pass or release claim yet.

- D020 (2026-10-04): Scoped browser diagnostics exposed HTTP 400 “Expected a single plugin
  archive” for the upload-fix ZIP. Consumer ChatGPT archives now exclude the local marketplace
  catalog and include a generated .codex-plugin/plugin.json compatibility manifest. Both changes
  together were accepted with HTTP 201, 12 skills visible, and actual web installation completed.
  Their individual causality is not isolated. Local build directories/repo catalogs still support
  marketplace installation; consumer ZIPs represent exactly one plugin. No auth data was recorded.
  Native installation pass alone is not full lifecycle or release readiness.

- D021 (2026-10-05): Native synthetic rc.2 lifecycle exposed both unsupported qualitative language
  and a new documentation action inferred from defect reporting. Keep factual scope guidance
  visible in generated entries, prohibit assistant repetition as user confirmation, and add
  model regressions. Also make no-voice text practice and concise artifact section coverage explicit.
  rc.3 repair is not automatically evidence that the whole native lifecycle passes.

- D022 (2026-10-05): Native portable export schemas passed individually but its file stems did
  not match opportunity IDs. Existing full validator rejected the original; native model repair
  preserved all non-path data exactly and then passed. Clarify stem/ID equality and inspect final
  ZIP members in the shared runtime protocol. No runtime Python dependency is added. Fresh-chat
  byte-identical re-export proves lossless transport; separately test continuation and new-round save.
