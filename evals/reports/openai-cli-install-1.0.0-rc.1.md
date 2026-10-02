# OpenAI CLI installation observation

Observed at: 2026-10-02T17:17:01.277014+00:00
Observer: Codex implementation agent
Surface: official Codex CLI local marketplace installer (not ChatGPT consumer UI)
Package version: 1.0.0-rc.1; installer cache slot: local
Evaluated installed runtime fingerprint: 658bb95d20b921ffac86d94e7f303a112d3fc05dd1dfbd4c79e99359dad81ce0

The actual generated ChatGPT ZIP was extracted into work/native-install/chatgpt.
`codex plugin marketplace add ./work/native-install/chatgpt/careerpilot --json` accepted the
marketplace as careerpilot-local. `codex plugin add careerpilot@careerpilot-local --json` succeeded.
The subsequent filtered plugin listing reported installed=true and enabled=true. The installed
cache's exact runtime fingerprint matches the current 15/15 actual-model report.

No new account, API key, MCP connection, or CareerPilot runtime program was required.
The default-config CLI first rejected its configured model. A per-command supported model then
returned a truthful fallback, but host file tooling could not read the installed references
(the tool reported a malformed Unicode Python executable path). No global configuration was
changed and the installed package fingerprint remained intact. An isolated-config source-tree
reading test is separate from installed-plugin automatic activation. Installation alone is not
a passing ChatGPT UI activation/lifecycle/context-recovery signoff. Consumer native checks remain
PENDING; this evidence must not be promoted to a full native PASS.
