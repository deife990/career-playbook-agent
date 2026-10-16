# Review improvement progress — 2026-10-16

## Next candidate — G1 approval pending

rc.8 scope is E + D; F conditional loading is deferred until reference discovery can be tested.
Final-only holdout content was frozen first in `47c520c`. The
[plan, contract diagnosis, split and cost](rc8-e-d-plan-2026-10-16.md) and
[post-C failure policy](rc8-evaluation-policy-2026-10-16.md) are prepared for review.
No E/D runtime changes or development/holdout model calls have started. G1 approval is required;
later development calls, D cleanup and final evaluation each have separate approval gates.

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
