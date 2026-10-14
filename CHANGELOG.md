# Changelog

## 1.1.0-rc.7 — Unreleased

- Repair malformed judge citations by selecting actual assistant lines; preserve independent verdicts and original ERROR evidence. No runtime dependency or automatic passing result is added.

- Keep the hiring outcome Unknown after repeated ownership or additional-example questions; do not infer rejection, non-rejection or interviewer intent.
- Include an actual-submission reporting request in final pre-submission handoffs even when file QA remains NOT_CHECKED.
- Preserve rc.6 actual reports: ChatGPT 32/33; Claude 29 passing cases, one behavior failure and a usage-limit error. Fresh rc.7 model signoff is required.

## 1.1.0-rc.6 — Unreleased

- Retain the SIMULATION ONLY boundary visibly when freezing synthetic submissions; isolate them from real submissions and account memory.
- Preserve rc.5 evidence: Claude 32/33 (simulation-boundary failure), ChatGPT 22 passes before account limit. Neither certifies rc.6.
- Browser checks are excluded by user request, recorded separately from actual-model and regression evidence.

## 1.1.0-rc.5 — Unreleased

- Preserve Unknown in risk headings and positioning; missing examples do not prove an experience gap.
- Provide action-only partial resume copy and an actual file-export checklist before missing-fact intake when file tools are unavailable.
- Stop the development model runner on service 429 errors as well as account limits; retain real logs and passing checkpoints.
- Preserve rc.4 failed/incomplete model reports: two Claude behavior failures; both model runners later reached account limits. Current rc.5 requires fresh package-bound signoff.

## 1.1.0-rc.4 — Unreleased

- Preserve unknown past application history in discovery tables; an empty loaded context does not prove no prior applications.
- Keep confirmed SQL-result review as Partial coverage in W05, with validation and authoring scope explicitly unresolved.
- Add a native-discovered application-history regression and preserve the original rc.3 observations.
- rc.3 ChatGPT CLI passed 32/32; Claude had 15 passing cases before the run was superseded by these native repairs. Neither certifies rc.4.

## 1.1.0-rc.3 — Unreleased

- Retry exact installed reference paths with an available file reader after a ChatGPT skill-resource read failure.
- Keep requirement-match labels separate from Recruiter/Hiring Manager review grades.
- Clarify that JD-first persona reasoning retains the documented fifteen-section output order.
- Preserve rc.2 observations; this package requires fresh model and native signoff.

## 1.1.0-rc.2 — Unreleased

- Analyze supplied interview recall immediately when requested, preserving missing fields as Unknown.
- Reinforce one requested fact per active mock question in both host entries.
- Distinguish pending drafts from final handoffs; require submission confirmation before freezing.
- Correct evaluation ambiguity between proposed next actions and invented past experience.
- Add a two-turn final-handoff regression covering submission timing, exact version and simulation privacy.
- Preserve rc.1 failed model/native observations; rc.2 requires fresh package-bound signoff.

## 1.1.0-rc.1 — Unreleased

- Add a shared evidence-backed screening pipeline with four resume modes and three depths.
- Separate ATS structural QA, JD coverage, recruiter scan, HM credibility and differentiation.
- Preserve factual meaning through final voice edits and cross-surface checks.
- Add form limits, confirmed motivation and compensation continuity before formal offers.
- Preserve exact submitted resumes, answers and JD context across export/import and interview preparation.
- Add optional state fields without migrating old V1 packs; older strict readers need upgrading for new fields.
- Add A–H behavioral regressions, compensation/portable-state cases and bilingual DOCX/PDF fixtures with extraction and visual QA.
- Keep external frameworks subordinate to CareerPilot policies; include source decisions and license notices.
- Version-specific model/native signoff is required; historical V1 passing evidence does not certify v1.1.

## 1.0.0-rc.7 — Unreleased

- Preserve Unknown consistently in discovery table cells, positioning and interview risks; a confirmed requirement plus confirmed absence is needed for Gap.
- Add regressions for native Claude rc.6 Unknown-to-Gap and Unknown-to-absence failures. Original failures remain recorded.
- Native ChatGPT rc.6 pure restore/re-export is byte-identical; functional continuation is checked separately.
- Both rc.7 actual model suites passed 20/20. Both native web hosts passed the eight mandatory acceptance checks, including W01–W09, full export validation, fresh-chat lossless restore and company-isolated continuation.
- Strict release readiness and deterministic archive identity passed; clean clone passed 83 tests. Quality and coverage notes remain in the native reports. No public release.

## 1.0.0-rc.6

- Clarify the manifest JSON-data digest after a native export used valid byte hashes that the portable validator rejected.
- Hash algorithm is explicit in Core state and manifest schema; null remains the safe fallback. No runtime dependency added.
- rc.5 actual model suites passed 18/18 on each platform; new package requires fresh checks.

## 1.0.0-rc.5

- Prevent unknown tax/net compensation from becoming a remembered numeric range, even under INFERENCE.
- Require confirmed calculation inputs and current authoritative support; retain the actual rc.4 Claude offer failure.
- Current package needs fresh model/native acceptance; historical passing tests do not clear this version.

## 1.0.0-rc.4

- Generate visible Core entry safeguards and W04 section order for both hosts after native rc.3 omitted brief sections.
- Preserve prepared round objectives/positioning, distinguish missing collections from empty ones on recovery, and count mock continuation checks as questions.
- Preserve rc.3 native and Claude failures; no release signoff inferred from CLI success.

## 1.0.0-rc.3

- Native simulation repairs: preserve factual scope in brief/positioning, retain every Candidate Strategy section, explicitly invite text mock when voice is unavailable.
- Portable export now explicitly requires filename/ID equality and final ZIP member/history checks after a native rc.2 export mismatch.
- rc.2 failed observations remain historical evidence; rc.3 requires fresh behavioral and native acceptance.

## 1.0.0-rc.2 — Unreleased
- Native synthetic ChatGPT testing exposed user-confirmed experience labeled as externally verified.
- Keep self-confirmation as USER FACT and generate the small shared classification contract into both platform entries.
- Add a two-turn regression scenario for provenance after user confirmation; native lifecycle signoff remains pending.

## 1.0.0-rc.1 — Unreleased
- Implement W01–W09 with evidence, freshness, privacy, company isolation and human decisions.
- Add portable career state, global Master resume, story bank and preserved interview feedback loop.
- Generate twelve ChatGPT skills and one Claude skill from shared platform-neutral Core.
- Add beginner installation/recovery docs and ebook topic mapping without invented chapter numbers.
- Add deterministic ZIPs, official manifest validation, static regressions and actual model evals.
- Require current behavioral and native installation evidence before releasing; native tests pending.
- Add documented ChatGPT archive author/interface metadata and reject portable-only manifests at the upload validation gate.
- Fix onboardingSkill to the included SKILL.md path and validate missing/unsafe onboarding paths.
- Package one consumer plugin separately from its local marketplace catalog and generate Codex compatibility metadata; actual ChatGPT web upload and install accepted.
