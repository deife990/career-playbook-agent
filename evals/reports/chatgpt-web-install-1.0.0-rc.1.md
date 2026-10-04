# ChatGPT web installation observation — 2026-10-04

Status: PENDING. This is an observed failure record, not installation signoff.
Observer: Codex via CUA, existing authenticated ChatGPT web account in Chrome.

- User explicitly approved private upload/installation of CareerPilot.
- Personal plugin list was empty. Add → Upload plugin archive opened New plugin.
- Browser chooser file selection required extension file-URL permission. No permission was changed.
- Native file picker selected the exact consumer ZIP. The UI displayed its filename.
- Two Add plugin attempts returned “플러그인을 추가하지 못했습니다. 다시 시도하세요.”
- No specific validation diagnostic was exposed; unrelated extension console errors do not explain the failure.
- Official documentation requires author and interface metadata for upload. The prior portable-valid manifest lacked them. The manifest is now repaired; this is a candidate cause, not a confirmed diagnosis.
- Re-selection was interrupted by concurrent Chrome use. Automatic approval review rejected broad native state inspection because an unrelated private page was selected. No further inspection of that page occurred. Bound CareerPilot tab remains ready for user selection.

Current package fingerprint: `83ff1e37a880a479619b9fe398c7df97c036bf23cefbc91e7464e5d19f48fe08`
Previously evaluated package fingerprint: `658bb95d20b921ffac86d94e7f303a112d3fc05dd1dfbd4c79e99359dad81ce0`
The Core, workflow entries and references are unchanged; manifest metadata changed. The old full-package model report is retained as historical evidence and is not current-package release signoff.
Local static checks and 78 tests pass. Current-package fresh-clone/model/native gates must be completed before release.

Screenshot: consumer output `chatgpt-web-upload-failed.jpg`, captured from the bound CareerPilot tab with unrelated sidebar excluded.

Sources:
- https://developers.openai.com/plugins/build/plugins
- https://developers.openai.com/plugins/deploy/submission-errors

## Follow-up: onboarding path correction

The user reported the same generic error with the metadata-complete package. Direct comparison with official documentation found `onboardingSkill` incorrectly set to the bare identifier `careerpilot-router`. The documented field is a relative path to an included SKILL.md, now `./skills/careerpilot-router/SKILL.md`. This is a confirmed package defect; the generic server error does not establish it as the sole cause.

A regression validator rejects bare identifiers, traversal and missing onboarding files. Static checks, both builds, ZIP generation and 79 tests pass. Native acceptance remains unverified.

Newest package fingerprint: `7ab1d1c9e1700a403a156ec09c15721ecae4895fd9adb7d79bd8fa09a8e1065f`
Consumer retry file: `careerpilot-chatgpt-v1.0.0-rc.1-upload-fix.zip` (identical bytes to the newest canonical ChatGPT ZIP, distinct filename to avoid old-file selection). Earlier full-package model and clean-clone evidence remain historical until refreshed.

Reference: https://developers.openai.com/plugins/deploy/submission#automatically-provide-submission-and-review-information
