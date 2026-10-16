# Review improvement progress — 2026-10-16

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
- C partial: immutable baseline copies match exact rc.7 runtime fingerprints; acceptance and all 48
  tiers were committed before model results. The earlier Claude usage-limit stop was resumed after
  its reset; both original ERRORs were provider quota interruptions and were completed on the
  unchanged package, suite and protocol. Partial original responses and failures are archived.

## Current C state (checkpoint 230 / 260)

| Host | Completed / planned | PASS | FAIL | Unresolved ERROR | Remaining |
|---|---:|---:|---:|---:|---:|
| ChatGPT | 118 / 130 | 118 | 0 | 0 | 12 |
| Claude | 112 / 130 | 102 | 10 | 0 | 18 |

Rates for each host are read only against that host's own baseline. Judge platforms differ
(ChatGPT subjects are judged by Claude on critical scenarios and Claude subjects by ChatGPT),
so a gap between the two hosts is not evidence about relative model quality. E decisions compare
each host's candidate with its own baseline, not one host with the other.

The 10 Claude automatic failures are retained and are not relaunched. The latest evidence is
[checkpoint 230](../evals/reports/c-stage-resume-audit-18-2026-10-16.json). Earlier context is in the
[checkpoint 168](c-stage-checkpoint-168-2026-10-15.md), the
[failure review](c-stage-pre-resume-review.md) and the
[E acceptance clarification](e-stage-acceptance-clarification-2026-10-15.md).

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

## Remaining work

30 runs remain (ChatGPT 12, Claude 18). Execution has resumed on the same immutable baseline
packages, in batches of at most six runs, with usage checked at
each batch boundary. Only missing or ERROR runs are executed; recorded PASS/FAIL results are never
rerun. Equivalent manual command:

```bash
.venv/bin/python -m scripts.run_model_evals --platform HOST --package-root work/review-v2/baseline/packages/HOST --report-dir work/review-v2/baseline/reports --resume --scenario SCENARIO_ID
```

C is complete only when both hosts have 130 verdicts with no ERROR or missing run. Real failures
may remain; C completion is not release readiness.

D, E and F stay on hold until C is complete. E will follow the
[general-principle plan](e-stage-general-principles-2026-10-15.md) and add the drafted
[variant scenarios](../evals/variants/e-stage/README.md) as a separate, newly fingerprinted group.
No browser validation, main merge, tag or release upload is authorized. Historical report moving
and broad formatting are excluded. No account upgrade, extra payment or reset credit was used.

[Preregistered tiers/criteria](review-improvement-protocol.md) ·
[Progress journal](../evals/reports/review-v2-baseline-progress.json)
