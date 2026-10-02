# Regression policy
Preserve failing synthetic transcript/fixture, assertion ID, cause, fix and re-run result. Do not
weaken assertions or delete hard cases to pass. Re-evaluate changed content and invalidate stale
native/model signoffs. Judge grading is fallible; disputed/ambiguous results require human review.

## First real-model run findings
- W05: missing JD caused OpenAI to ask questions while omitting requested interim LinkedIn/
  portfolio decisions. Added partial delivery rule; unchanged audit assertion must pass.
- W07: one sentence bundled motivation + evidence linkage. Added single-focus rule.
- Claude W05 draft introduced exhaustive scope/efficiency without evidence. Strengthened draft
  integrity in Core and the fabrication rubric to cover qualitative inventions explicitly.
- Judge sometimes stripped Markdown or joined distant quotes; invalid literal evidence remains
  ERROR and gets one independent regrade. Persona seed now supplied to the judge to avoid falsely
  calling supplied university-project context invented. No behavioral assertion weakened.

Final Claude W05 regression: a DRAFT bullet added “검토 및 인계 기반 마련” and scope/method qualifiers
although only process checking and documentation were supplied. Strengthened action-only fallback
and per-assertion audit for every outward-facing draft. Pending re-evaluation; an earlier pass does
not clear this finding against modified content.

Claude active mock regression: “Which project, and what was your role?” bundled episode identity
and own role despite one question mark. Added silent single-slot follow-up selection, an explicit
counterexample, and repair-before-repeat. Post-end repairs also cannot assert unknown actions.
