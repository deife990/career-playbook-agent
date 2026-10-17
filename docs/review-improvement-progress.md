# Review improvement progress — 2026-10-18

## Current — approved rc.8 release evaluation

The [2026-10-17 release override](rc8-release-policy-2026-10-17.md) supersedes the earlier held
scope and zero-failure release gate. One approved source revision is complete; Claude's nine-case
quick check yielded 7 PASS / 2 existing-type FAIL. Final C evaluation stopped on unavailable
Claude subject model metadata under the approved unresolved-error condition. ChatGPT has 15 valid
PASS; Claude has 7 valid PASS / 1 FAIL / 1 quarantined automatic PASS; 236 verdicts are unstarted.
Frozen packages and the 260-verdict C protocol remain unchanged. See [current release progress](rc8-release-progress-2026-10-17.md).
Incomplete evidence is not release acceptance. D/F, browser, main merge, push, tag and release
upload remain excluded; old diagnostic ERRORs and automatic FAILs remain preserved.

## Historical — G2 approved development diagnostic: no unstarted case remains

The approved n=1 development diagnostic has 35/36 valid verdicts: ChatGPT 18 PASS;
Claude 11 PASS / 6 FAIL / 1 quarantined model-metadata ERROR. Missing = 0.
The final six Claude cases finished on the unchanged candidate/selection lock (1 PASS / 5 FAIL).
This is DIAGNOSTIC_ONLY, not G2 acceptance or release evidence. Automatic PASS also has manual
boundary/procedure findings. Two new automatic FAIL reasons need rubric/runtime-contract
qualification; all original verdicts remain unchanged.

[Current results, every scenario/assertion vs own C, raw failure review, usefulness and salary questions](rc8-development-results-2026-10-17.md).
[Preservation audit](../evals/reports/rc8-development-2026-10-16/completion-audit-2026-10-17.json) verifies
30 prior records and 339 raw files unchanged, C/package/content/lock identities preserved,
no completed PASS/FAIL rerun, no held-out model call. The current
[state](../evals/reports/rc8-development-2026-10-16/resume-state-2026-10-17.json) supersedes the old
quota-hold state for navigation only; old evidence was not overwritten.

G2 restoration is complete: the exact mock-question parenthetical was restored, RULE-MAP corrected
to deletion→restoration, and the sentence-level audit records other omitted examples and limits.
[Sentence audit](rc8-g2-sentence-review-2026-10-16.md). Tests after the separately approved selective
wrapper fix: 226 PASS; static checks PASS; holdout leakage 0. Runtime source was not changed again.
Claude evd-07's missing model ID remains ERROR; its subject regeneration was explicitly excluded
from the 13-case resumption approval and has not run. No additional diagnostic round is authorized.

rc.8 scope remains E + D; F is excluded until reference discovery can be tested. E is implemented
but unresolved actual failures block acceptance. D cleanup, F, holdout/final evaluations and new
candidate edits remain held. README/VERSION retain rc.7. No main merge/push/tag/release,
automation, extra payment or reset-credit use.
[Original plan](rc8-e-d-plan-2026-10-16.md) · [Frozen acceptance/failure policy](rc8-evaluation-policy-2026-10-16.md) ·
[Pre-result candidate revision cap](rc8-candidate-revision-limit-2026-10-16.md).

## Completed

- A: distinguish structural/document lint, deterministic tooling/state validation, actual model
  behavior and native observation; retain historical reports and add navigation.
- B first: immutable per-entry initial-load UTF-8 caps (Claude 39,333 bytes; ChatGPT 39,610–40,330)
  and runtime inventory caps (139/111). Tests prove actual policy/file growth is caught.
- B: byte-identical prompt extraction; protocol/suite fingerprinting; tiered independent repeats;
  cross-platform judges; rates by planned denominator; no overwriting reports; prior ERROR attempts
  and subject checkpoints preserved; real FAIL never rerun away; strict readiness and comparison.
- D preparation only: typed reachability identifies exactly 13 unused aliases plus 28 duplicate
  Claude templates. No runtime file has been removed yet.
- C complete: both frozen baseline hosts have 130 verdicts; no missing run or unresolved ERROR.
  Original provider interruptions/checkpoints, automatic failures and later manual qualifications
  are retained. No harness or package edit was required. C completion is not release readiness.

## Completed C state — 260 / 260

| Host | Completed / planned | PASS | FAIL | Unresolved ERROR | Remaining |
|---|---:|---:|---:|---:|---:|
| ChatGPT | 130 / 130 | 130 | 0 | 0 | 0 |
| Claude | 130 / 130 | 119 | 11 | 0 | 0 |

[Final platform/tier results, failures, disputes and limits](c-stage-results-2026-10-16.md).
Each host is its own candidate-comparison baseline. Different judge routing prevents interpreting
the two hosts' rates as a relative model-quality comparison. Original automatic FAILs are retained.
Actual failures remain, so this completed baseline is not release PASS.

## Why work paused after the 19:42 KST commit

The 19:42 pause was deliberate at a batch boundary to preserve the remaining quota. The last
Codex reading before that pause was 89% of the five-hour window; a reading at 20:42 KST showed
99%. These readings alone do not prove that another model call would fail. Later explicit
resumption attempts did not start: automatic permission approval timed out twice. That timeout
was not a model-evaluation result, and its cause cannot be attributed to account quota from the
available evidence. The baseline reports remained at 168 completed runs with no new ERROR.
No harness or package edit was needed. The displayed reset was **2026-10-15 23:51 KST**.

At 23:54 KST, a fresh account reading confirmed the new window at 0% usage. The previous
`careerpilot-c` heartbeat was successfully deleted at the user's request; resumption is manual.
The bounded driver checks errors after each selected scenario; this is not a guarantee that all
generic CLI errors halt the underlying harness before another repetition.

## C completion and subsequent scope

No C run remains. Only missing/ERROR rows were resumed, in batches of at most six; PASS/FAIL
rows were not rerun. The final package/suite/protocol audit passes with no missing or ERROR run.
The final immutable full-response snapshots and preservation audit are linked from the results.

D, E and F runtime changes were not started during C. The next approved phases follow
separately from this completed baseline. E will follow the
[general-principle plan](e-stage-general-principles-2026-10-15.md) and add the drafted
[variant scenarios](../evals/variants/e-stage/README.md) as a separate, newly fingerprinted group.
No browser validation, main merge, tag or release upload is authorized. Historical report moving
and broad formatting are excluded. No account upgrade, extra payment or reset credit was used.

[Preregistered tiers/criteria](review-improvement-protocol.md) ·
[Original progress journal](../evals/reports/review-v2-baseline-progress.json)
