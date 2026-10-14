# v1.2 implementation checkpoints

- [x] 1. Complete v1.1 current model suites; archive results and scoped readiness.
- [x] 2. Coverage/priority and Markdown exchange contract; focused tests pass.
- [x] 3. Sanitization, attribution and explicit confirmation gate; negative cases pass.
- [x] 4. Episode consolidation/global persistence and legacy-pack compatibility pass.
- [x] 5. Bounded iterative bridge/generic/manual/file fallback pass.
- [x] 6. W04/W05/W08 integration, references and both adapter parity pass.
- [x] 7. User docs, source decisions, version bump and deterministic ZIPs complete.
- [x] 8. Both complete model suites and scoped readiness pass; final review complete.

Runtime changes for v1.2 wait for checkpoint 1. Browser verification is excluded by the user.

Checkpoint 1 passed: rc.7, 144 unit tests, 33/33 actual cases per host, scoped readiness PASS.

V1.2 complete within user scope: 189 tests, static checks, exact archives, ChatGPT 48/48 and Claude 48/48 actual
model cases, and scoped readiness PASS. Browser/native validation excluded by user; no public release.

## Distribution and GitHub preparation — 2026-10-14

- [x] Preserve the immutable verified v1.1 rc.7 source as a separate commit.
- [x] Restore archived current-version model evidence in package CI; require scoped readiness.
- [x] Document exact v1.2 filenames/hashes, installation, clean-checkout rebuild and release scope.
- Source push, remote CI and final clean-checkout verification are recorded in the local
  distribution manifest and final task report after execution. PR #2 stays Draft; no tag/release.
