# Review improvement gate — 2026-10-15

Protocol v2 tooling passes 201 structural/deterministic tests and static checks. C's strengthened
baseline and D/E/F runtime changes are pending. The rc.7 evidence below describes its original
n=1 protocol; it does not certify protocol v2 or a future rc.8. New readiness rejects missing
repetitions, wrong judge routing, changed prompts/configuration and failed assertions.
[Preregistered criteria](review-improvement-protocol.md).

## Strengthened baseline interruption

C completed 17 passing ChatGPT runs plus one judge ERROR; Claude completed 17 PASS, three actual
FAIL and one subject ERROR. Full planned denominator is 130 per host. Claude account reset message:
`You've hit your limit · resets 4:50am (Asia/Seoul)`. Both subject and cross-judge routing are affected.
Completed subjects/checkpoints, literal transcripts, failed verdicts and service logs are preserved.
This is **INCOMPLETE_WITH_REAL_FAILURES**, never readiness PASS. Original rc.7 runtime bytes are
unchanged. D's reachability tooling is prepared; runtime cleanup E/F remain unapplied until the
baseline finishes. See [progress audit](../evals/reports/review-v2-baseline-progress.json).

# Current v1.2 candidate — 2026-10-14

**1.2.0-rc.7** implementation, guides and deterministic runtime archives are complete.
189 structural/document-contract lint and deterministic developer-tool/state tests and all static checks pass. These checks do not measure model behavior. Both hosts passed all fourteen EVD cases
and both legacy/v1.2 state roundtrips. Complete current actual-model evidence:

The rc.7 CLI protocol runs each scenario once with preloaded references and a same-platform judge,
except the explicitly audited cross-host timeout recovery below. Autonomous reference discovery is
not verified; these results do not estimate a stable probabilistic pass rate.

| Host | Current behavior result |
|---|---|
| ChatGPT | 48/48 PASS; one objective negation false-positive reviewed on the unchanged subject |
| Claude | 48/48 PASS; ten cases run fresh after the provider reset |

Claude reported `You've hit your limit · resets 5:50pm (Asia/Seoul)` on 2026-10-14; the ten pending
cases were run after the reset on the unchanged package. **Scoped release readiness PASS** with strict
`--require-ready` packaging; exact ZIP hashes match the artifact-identity record.
Browser validation is EXCLUDED_BY_USER, not native certification; corporate tenant retrieval is
not executed. No public release was posted. Source commits and distribution preparation are
documented in [the v1.2 distribution guide](v1-2-release-preparation.md).
This is a release-candidate gate, not a public release. [Current readiness record](../evals/reports/release-candidate-1.2.0-rc.7.json).

The original ChatGPT 47/48 FAIL report is retained. Its last judge treated “VERIFIED FACT는 없음”
as assigning VERIFIED FACT, although both actions explicitly remained USER FACT. Manual inspection
and one completed independent review of the unchanged full response/criteria confirmed the negation;
package, suite, loaded files and provider response identity were verified.
[Review audit](../evals/reports/semantic-review-1.2.0-rc.7.json).
Claude's original timeout ERROR is also retained. Its completed actual submitted-baseline response
was independently judged with unchanged criteria on available ChatGPT, after provider-output,
transcript and package/suite identity checks; the Claude subject was not regenerated or substituted.
[Timeout recovery](../evals/reports/claude-f-timeout-recovery-1.2.0-rc.7.json).

## Earlier v1.2 development checkpoints

1.2.0-rc.7 implements the discovery/bridge upgrade. Deterministic tests: 189 PASS; static checks
and packaging PASS. The full **48-case** actual-model suites are required; no v1.2 readiness PASS
is claimed before they finish. Original rc.1 targeted failures are preserved (privacy audit echo;
new recall confirmation). rc.2 passed all fourteen EVD cases and both state roundtrips on ChatGPT,
but omitted an original work condition. rc.3 retained that condition but Claude still invented a
JD row from candidate experience. rc.4 reinforces the shared employer/candidate boundary;
older package results do not certify it.
Manual review found a further rc.4 contradiction: SQL stayed Unknown in the mapping but became
categorical absence/Gap in red-team/readiness notes. The original automatic PASS and manual FAIL
are both preserved. rc.5 fixes whole-output consistency; its targeted case passed on both hosts
and was inspected manually. Full current suites and scoped readiness remain pending.
Rc.6 also repairs W04's unsupported accuracy-review interpretation and clarifies state judging
against the existing optional-null lossless contract. Both targeted W04/W05 cases passed on both
hosts; full 48-case suites now run fresh with the clarified assertion and current package.
Rc.6 full suites stopped on actual usage limits (ChatGPT 34 PASS / one behavior FAIL / one ERROR;
Claude seven PASS / two ERROR). Its EVD-08 merged proposal lost unique safe date/title references.
Rc.7 preserves all minimal provenance entries and passes that targeted case on both hosts;
the actual answers were inspected. New full current suites are running. Model timeouts now
preserve current logs and stop; stale response files cannot satisfy a new invocation.
Browser validation remains EXCLUDED_BY_USER, not a native PASS. Corporate tenant retrieval is
not executed by these synthetic tests. The v1.1 scoped baseline below remains immutable.

# Gate evidence
The v1.1 baseline **1.1.0-rc.7** passed 144 deterministic tests and both complete
actual-model suites (33/33 per host). Browser validation is EXCLUDED_BY_USER, not certified.
Scoped readiness and exact runtime archives passed. Claude's original citation-only ERROR
is retained; a fresh independent judge graded the unchanged actual response after provider
outputs and package/suite identity checks. Historical behavior failures remain preserved.
[Baseline report](../evals/reports/release-candidate-1.1.0-rc.7.json).

Full V1 scope remains fixed. Preparation of later build/checklist tooling does not clear an earlier
behavioral gate. Static evidence does not clear native installation or actual-model blockers.

## Historical v1.0 gate evidence

| Gate | Evidence / status |
|---|---|
| Foundation | Specs, nullable schemas/defaults, skeleton builds; 9 tests; Foundation CI passed after preserving empty directories |
| Policies | Five shared policies, provenance/freshness/privacy and beginner language; policy/schema regressions pass |
| State | Portable named JSONs; company isolation, typed references, real lifecycle events, immutable recall/original requirements, partial debrief completion and global roadmap/Master resume portability pass |
| Router | Precedence, negation/recent-context ambiguity, active-mock boundary and company clarification oracle pass |
| W01–W03 | Brief/roadmap/discovery contracts, artifacts and evidence screening regressions pass |
| W04 Hero | Ordered 13 stages, independent Ideal Candidate before mapping, Unknown distinct from Gap; source/template regressions pass |
| Application | Supported resume facts/numbers, optional asset decision, three reviewer lenses and final consistency checks pass |
| Interview | Prep, single-focus mock, explicit-end review, debrief collection and preserved round history regressions pass |
| Offer | Original requirement comparison, gross/conditional compensation, alternatives and real-event updates pass |
| ChatGPT adapter | Twelve generated structured skills; pinned official manifest; shared Core hashes/links/limits pass |
| Claude adapter | One short generated entry, on-demand references and templates; shared Core parity pass |
| Evals | rc.7 actual ChatGPT and Claude CLI evaluations each 20/20 PASS after native Unknown classification repairs. rc.6 Claude CLI 18/18 PASS; ChatGPT 8/18 PASS then account usage limit, INCOMPLETE (reset later confirmed). rc.5 actual ChatGPT and Claude CLI suites each 18/18 PASS. rc.4: 10 personas / 18 scenarios; ChatGPT CLI 18/18 PASS, Claude 17/18 FAIL (invented net-pay range); prior six critical repairs PASS. rc.3 CLI ChatGPT 18/18 PASS, Claude 15/18 FAIL; native W04 FAIL despite CLI success. Historical rc.2/rc.1 evidence retained |
| Packaging | Static PASS: deterministic archives, exact inventory, extraction/reference/parity/checksums. rc.7 current actual model/native signoffs PASS; release-readiness and final archive identity checked separately |
| Clean install | rc.7 fresh Git clone + fresh Python 3.12: 83 tests, static and both deterministic ZIPs PASS at f782405. Current archives accepted on existing ChatGPT/Claude accounts; fresh synthetic W01–W09 chats, downloaded state validation, exact JSON restore and company-isolated continuation PASS on both. Fresh-account provisioning not tested |
| Release Candidate | rc.7 required actual model/native gates PASS; strict release-readiness and final archive identity PASS ([report](../evals/reports/release-candidate-1.0.0-rc.7.json)). No public release |

Historical failed model report: [ChatGPT rc.2](../evals/reports/chatgpt-1.0.0-rc.2.json).
Historical reports: [ChatGPT rc.1](../evals/reports/chatgpt-1.0.0-rc.1.json),
[Claude rc.1](../evals/reports/claude-1.0.0-rc.1.json).
Fresh clone evidence: [rc.2 report](../evals/reports/clean-clone-1.0.0-rc.2.json).
Native synthetic observations: [ChatGPT E2E](../evals/reports/chatgpt-native-e2e-1.0.0-rc.2.md).
Native observations: [status](../evals/native-install.json), [checklist](native-install-test.md),
[synthetic lifecycle inputs](native-fixture.md), [Korean user guide](native-acceptance-ko.md). Project connection remains unchanged; move
this chat to “AI Career 전자책” manually if the ChatGPT project linkage is needed.

rc.3 reports: [ChatGPT](../evals/reports/chatgpt-1.0.0-rc.3.json), [Claude](../evals/reports/claude-1.0.0-rc.3.json), [native regression](../evals/reports/chatgpt-native-regression-1.0.0-rc.3.md), [fresh clone 82 tests](../evals/reports/clean-clone-1.0.0-rc.3.json).

rc.4 evidence: [ChatGPT 18 scenarios](../evals/reports/chatgpt-1.0.0-rc.4.json), [native regression](../evals/reports/chatgpt-native-regression-1.0.0-rc.4.md), [fresh clone 83 tests](../evals/reports/clean-clone-1.0.0-rc.4.json).

rc.5 actual full model reports: [ChatGPT](../evals/reports/chatgpt-1.0.0-rc.5.json), [Claude](../evals/reports/claude-1.0.0-rc.5.json). Native state protocol repair: [observations](../evals/reports/chatgpt-native-state-1.0.0-rc.4.json).

rc.6 native evidence: [ChatGPT restore and functional continuation](../evals/reports/chatgpt-native-regression-1.0.0-rc.6.md), [Claude lifecycle failures](../evals/reports/claude-native-e2e-1.0.0-rc.6.md), [Claude export validator](../evals/reports/claude-native-state-1.0.0-rc.6.json).


Current rc.7 evidence: [ChatGPT 20 scenarios](../evals/reports/chatgpt-1.0.0-rc.7.json), [Claude 20 scenarios](../evals/reports/claude-1.0.0-rc.7.json), [ChatGPT native lifecycle](../evals/reports/chatgpt-native-e2e-1.0.0-rc.7.md), [Claude native lifecycle and quality notes](../evals/reports/claude-native-e2e-1.0.0-rc.7.md), [clean clone 83 tests](../evals/reports/clean-clone-1.0.0-rc.7.json). Earlier failed/incomplete reports remain historical evidence; they do not certify this candidate.

## Historical v1.2 development-start assessment — 2026-10-12

The user excluded further browser verification from this assessment. Existing native observations
remain partial evidence; no new native PASS is claimed. rc.5 static checks and 124 regression tests
passed. Both current 33-case model suites are still incomplete and match the current package/suite
fingerprints. This earlier assessment allowed isolated development while model verification
finished; it is superseded by the later full specification requiring v1.1 completion first. The earlier advice did not certify v1.1 and is not the current start condition.
The v1.1 changes are still uncommitted in the existing feature branch; preserve that baseline before
mixing in v1.2 work. No v1.2 implementation or Git publication was performed for this assessment.

rc.5 final model evidence: Claude 32/33 (synthetic submission boundary FAIL), ChatGPT 22 passing cases before account limit. rc.6 repairs the boundary and requires both complete fresh 33-case suites. The user-requested browser exclusion is version/fingerprint-bound in evals/browser-exclusion-1.1.0-rc.6.json.

## Historical v1.1 continuation before closure

rc.7 fixes the rc.6 final-handoff omission and debrief outcome reassurance. Claude returned
`You've hit your limit · resets 5:20am (Asia/Seoul)` during the first rc.7 subject call;
no new Claude behavior was observed. Both repaired ChatGPT scenarios passed. Its full
33-case suite is running on the same immutable rc.7 package. The explicit browser scope
record is now evals/browser-exclusion-1.1.0-rc.7.json.

## Approved follow-up protocol

[Preregistered acceptance, tier inventory and limits](review-improvement-protocol.md) govern the
review improvement work. New protocol evidence is required; existing reports remain historical
and are not rewritten. Structural lint, deterministic developer checks, model behavior and native
observations are distinct evidence categories.
