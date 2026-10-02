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
