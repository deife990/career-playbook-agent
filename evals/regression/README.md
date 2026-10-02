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
