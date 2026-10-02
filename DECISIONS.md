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
