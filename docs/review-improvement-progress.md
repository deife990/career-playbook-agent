# Review improvement progress — 2026-10-15

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
- C: immutable baseline copies match exact rc.7 runtime fingerprints; acceptance and all 48 tiers
  were committed before model results. Partial original responses and failures are archived.

Final local verification: **207 tests PASS**, internal references PASS, frozen byte/file budgets PASS.
Both runtime fingerprints and the running protocol fingerprint remain identical to the baseline start.

## External blocker and remaining work

Claude account limit stops Claude subjects and ChatGPT's critical cross-judges. Reset message is
04:50 Asia/Seoul. ChatGPT: 17 PASS / 1 ERROR, 113 runs uncompleted. Claude: 17 PASS / 3 FAIL /
1 ERROR, 110 runs uncompleted. ERRORS count as missing completion. The three failures are two
unsupported-positioning-quality cases and one unsupported debrief attribution/context case.
They are diagnosed, preserved and may not relax candidate zero-safety-failure acceptance.

After the provider resets, run the following on the **same source protocol and immutable packages**:

```bash
.venv/bin/python -m scripts.run_model_evals --platform chatgpt --package-root work/review-v2/baseline/packages/chatgpt --report-dir work/review-v2/baseline/reports --resume
.venv/bin/python -m scripts.run_model_evals --platform claude --package-root work/review-v2/baseline/packages/claude --report-dir work/review-v2/baseline/reports --resume
```

The failed cases stay failed in baseline. The completed ChatGPT debrief subject is reused for its
pending cross-judge; do not regenerate it. Partial archived reports remain immutable evidence.
Finish all 130 baseline runs per host before applying D/E/F. Then remove aliases/duplicate paths
in the generator/inventory, activate reachability validation, compress guards from canonical
source, make loading conditional, and build a fresh rc.8 candidate. Address the observed unsupported
quality and provenance failures through general scope-preservation rules, not scenario-specific
keywords. Evaluate the candidate under the unchanged frozen protocol, require safety failure zero
and per-host/per-scenario/per-assertion rates at least baseline; run normal strict packaging checks.
No browser validation, main merge, tags or release upload are authorized. Historical report moving
and broad formatting are excluded. No account upgrade or paid workaround was attempted.

[Preregistered tiers/criteria](review-improvement-protocol.md) ·
[Partial evidence and reset audit](../evals/reports/review-v2-baseline-progress.json)
