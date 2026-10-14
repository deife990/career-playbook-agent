# v1.1 rc.7 remaining verification

Core and generated entries now repair both observed rc.6 failures:

- Claude debrief-first: repeated ownership/additional-example requests establish
  observed behavior only; hiring outcome Unknown, no reassurance or settled intention.
- ChatGPT screening-l-final-handoff: final pre-submission reviews explicitly ask for
  actual submission confirmation to freeze exact resume/JD/answers, even with QA unobserved.

Original rc.6 complete/partial reports are preserved under evals/reports. Deterministic
regressions pass (136 tests). Both repaired ChatGPT scenarios passed; its complete
33-case suite is running. rc.7 actual-model signoff is pending. Claude first subject
call returned an account usage-limit error, with reset advertised at 05:20 Asia/Seoul;
stop Claude calls until recovery. Do not reuse previous-package PASS as current evidence.
After targeted verification, finish both full 33-case suites and scope-bound readiness
before v1.2 runtime changes. Browser validation remains excluded by user request.
