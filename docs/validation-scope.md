# User-requested validation scope

On 2026-10-12 the user explicitly requested: “브라우저 검증은 따로 하지말고”.
This excludes additional native browser validation for the current work. It does not
exclude static/unit/schema/packaging tests or the complete actual-model behavioral suites.
Keep the historical native observations as partial evidence and never mark them PASS.

Release readiness defaults to requiring complete native signoff. An explicit
`--native-exclusion` record may certify only the requested scope; it must name this
user instruction, the exact product version and both exact runtime fingerprints.
New package contents/version invalidate an old exclusion record. Existing failed
model assertions, incomplete runs and fabricated citations still block readiness.
Corporate Copilot/tenant access is not tested and is not requested or performed.
