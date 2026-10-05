# Claude rc.7 native synthetic lifecycle

Status: PASS — eight mandatory native acceptance checks observed.

- Date: 2026-10-05; observer: Codex via CUA.
- Surface: Claude web, Chrome, Sonnet 5.5 Medium.
- Existing careerpilot Custom Skill was replaced with the actual rc.7 archive through its Replace/upload UI; acceptance and updated timestamp were observed. The host's `v1/current` label is its cloud skill revision, not CareerPilot's semantic version. No new runtime account, API key or server was configured.
- Package fingerprint: `04c59d81c489cf5eda1d3ca5d19ae86716e163744ae127e8fb771589a39f268d`.
- [Synthetic chat](https://claude.ai/chat/6b43b571-df4a-4f95-a1ab-2ac65a0a354f), titled `[시뮬레이션] CareerPilot rc.7 E2E`.

All inputs described fictional career/company/interview/offer events. No application, recruiter message or offer decision was sent. Only this task's conversation main content was captured; unrelated private sidebar/conversation metadata was excluded.

Observed: W01 brief/original requirements; W02 proposed roadmap; W03 unknown requirements/experience stayed outside Gap (rc.6 regression repaired); W04 fifteen-section Hero brief and no inference of experience absence in candidate positioning (rc.6 regression repaired); W05 supported application assets and refusal of unsupported ROI; W06 English interview preparation/cheat sheet; W07 one question per turn, vague-claim challenge, deferred interim coaching/rubric and explicit-end weak-point/story/structure review; W08 debrief collection before analysis, two separately preserved recall rounds and hypothetical approaches outside career evidence; W09 Alpha offer evaluated against the original remote MUST, without invented net compensation or Beta interview facts.

An ambiguous completed-interview event asked which company before recording; it was explicitly canceled. The downloaded native export passed the full development schema/hash/reference/scope validator and twenty critical data checks. Both actual question/answer pairs and company recollections are retained, with unknown recall explicit rather than invented. The HM round's prepared objectives/positioning, prior-round link and ended mock are present. Alpha has its own OFFER event, original remote requirement evaluation, unknown bonus/equity/net pay and no decision event.

[Fresh restore chat](https://claude.ai/chat/3da86f76-2dbc-471f-8553-ff449293f960), titled `[시뮬레이션] CareerPilot rc.7 복원 시험`: the restored summary read both companies and both rounds correctly. All six re-exported JSON members were byte-identical, and parsed JSON values were exact; ZIP container bytes differed. A subsequent explicit Alpha deadline update passed validated import against the prior state: all global JSON and the whole Beta file stayed exact; the new Alpha deadline/source/claim and manifest revision/hash were valid. No acceptance, rejection or contact occurred.

Evidence: [data validation](claude-native-state-1.0.0-rc.7.json), [checkpoint transcript](claude-native-transcript-1.0.0-rc.7.json), [installed archive](native-proof/claude-rc7-installed.jpg), [restored continuation](native-proof/claude-rc7-continuation.png).

Quality/coverage notes: the exported manifest retained the valid older example product_version `1.0.0-rc.1`; installed rc.7 identity is independently recorded above. First-round prep did not explicitly create objectives, so its objectives field stayed null; HM objectives were created and preserved. The deferred direction decision is stored, while unconfirmed roadmap proposals were not serialized as goals or next actions. The first mock question was slightly paraphrased in the saved mock transcript; actual interview question/answer literals were exact. These observations are not a claim that every prose artifact is byte-exact or that every optional input mode was exercised. Host memory/settings were unchanged, and no fresh account, public directory publication or live microphone use was tested. CLI model success remains separate evidence, not native certification.
