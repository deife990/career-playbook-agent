# ChatGPT rc.3 native repair regression

Status: FAIL; native W04 still omitted required sections. Targeted repair observation only.
Date: 2026-10-05, observer Codex via CUA; ChatGPT web Work GPT-5.6 Terra Medium.

Actual existing CareerPilot New version upload UI confirmed success, version 1.0.0-rc.3, 12 skills.
Runtime fingerprint: `ee0c08926420eb9302a9ca75dcaad495e228ff7c6c92e21408612fc6ef60a107`.
ZIP SHA-256: `047efdd5035e5eaed6f4577f0334264676c0da31b0f8e4888245140e91c54ea1`.

Historical full synthetic W01–W09/restore failures and repair observations are preserved in
[rc.2 report](chatgpt-native-e2e-1.0.0-rc.2.md). Current-package native regression is separate.

Chat: https://chatgpt.com/c/6ac27627-3c74-83ee-aba3-2be18a3bf7a2
First submitted message explicitly synthetic-only; title `[시뮬레이션] CareerPilot rc.3 재시험`.
- W01 omitted unsupported reporting quality/documentation and retained unknowns. It proposed QA
  as a career direction without an explicit RECOMMENDATION label; the synthetic user clarified
  that QA had not been a confirmed goal. No broad provenance/goal signoff is claimed.
- W05 omitted documentation and SQL. It retained only testing/reporting actions, but `Reported
  defects identified during testing` adds an unprovided association/timing. New rc.4 guards
  prohibit deriving identification or test linkage from bare reporting.
- W04 concise Beta brief used Target/conditions/JD/evidence/Fit-gaps/Positioning/Next action;
  required 15 sections, independent Ideal Candidate, explicit Sources/Unknowns were omitted.
  This FAIL is retained despite the rc.3 CLI suite passing 18/18. Reference loading was not
  independently established in this chat. rc.4 generates the Core section list visibly into
  both host entries; detailed contract loading remains required.

Actual rc.3 Claude CLI: 15/18 PASS, overall FAIL. Pure recovery introduced absent mock_sessions
  as [], one active-mock turn asked continue plus interviewer question, and bare testing/reporting
  was expanded into quality-process/identification capability without an INFERENCE label.
Current reports are preserved without weakened assertions or success-only retries.
