# v1.1.0-rc.5 native acceptance — PENDING

October 12, 2026, Codex via CUA. Existing authenticated Chrome accounts, simulation only.
ChatGPT accepted rc.5 and a new setup conversation was started. Installed screenshot:
[native-proof/rc5/chatgpt-installed.png](native-proof/rc5/chatgpt-installed.png).

Claude rc.5 upload was blocked by automatic approval review failing with 429 Too Many Requests.
The user chose to upload the exact ZIP manually. No rc.5 Claude installation signoff is claimed.

Static checks and 120 tests passed before the evaluation-runner service-limit fix. A targeted
11-test harness check including four new service-limit regressions passed. Full updated suite
is being verified separately. Model CLI runs use immutable rc.5 snapshots. ChatGPT repeatedly
failed with actual provider 429 responses and its own run was stopped; successful cases remain
in dist/evals/chatgpt.json. Claude CLI remains in progress. No release readiness is claimed.

Browser bindings at this checkpoint: Chrome id 1; rc.5 ChatGPT new conversation tab 1472298642;
Claude replace page tab 1472298645; rc.4 ChatGPT tab 1472298633 and Claude tab 1472298639.
Fresh native W01–W09, submitted-version preservation, complete export, lossless fresh-chat restore
and company-isolated continuation are still required for rc.5.

Full updated regression suite: 124 passed. ChatGPT W01 brief observed; activation passed, no fabricated experience or account-memory write. Chat: https://chatgpt.com/c/6accab72-9b5c-83e8-9681-041ece5e154e

## Manual upload verified; browser work deferred

User completed Claude rc.5 upload. Cloud revision v6 has 126 runtime files, all byte-identical to the current release archive (see claude-installed-identity.json). No duplicate Skill was added.
A new Claude conversation retained the installed Skill and Sonnet 5.5 Medium, but screen reading then failed with an automatic approval-review 429. User explicitly chose to resume browser verification after service stabilization. No native lifecycle PASS is claimed.
ChatGPT W02 was requested in the existing rc.5 chat. CLI model runners continued independently; current completed cases are in dist/evals, not a completed signoff. Resume checkpoint records active sessions and exact next stages.
