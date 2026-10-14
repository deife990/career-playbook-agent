# Evaluation evidence navigation

Historical reports stay in Git. They are not consumer-package files. No evidence is moved/deleted.

| Evidence | Applicable runtime / protocol | Status and limits |
|---|---|---|
| [Strengthened baseline start](review-v2-baseline-start.json) | unchanged v1.2 rc.7, protocol v2 | PENDING; 130 runs per host planned; no candidate certification |
| [v1.2 rc.7 readiness](release-candidate-1.2.0-rc.7.json) | v1.2 rc.7, original n=1 protocol | Scoped historical PASS; browser excluded; reference discovery unverified |
| [ChatGPT v1.2](chatgpt-1.2.0-rc.7.json) / [Claude v1.2](claude-1.2.0-rc.7.json) | v1.2 rc.7, original preloaded n=1 | Actual responses, original configuration only |
| [Judge error audit](semantic-review-1.2.0-rc.7.json) / [Timeout audit](claude-f-timeout-recovery-1.2.0-rc.7.json) | unchanged original subjects | Prior failure/error retained; independent reviews explicitly recorded |
| [v1.1 baseline](release-candidate-1.1.0-rc.7.json) | immutable v1.1 rc.7 | Historical scoped PASS; never certifies v1.2 |
| [v1.0 readiness](release-candidate-1.0.0-rc.7.json) | v1.0 rc.7 | Historical native and CLI evidence; never transfers to later bytes |

For the chronology, original failed/incomplete records and observed native regressions, see
[GATES](../../docs/GATES.md). For preregistered comparison criteria and scenario tiers, see
[review protocol](../../docs/review-improvement-protocol.md). Static/document lint and deterministic
state/tool checks are separate from these actual-model responses. The new baseline is not complete
until every planned run is present; failed/error/omitted runs cannot be relabeled PASS.
