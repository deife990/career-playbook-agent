# Resume artifact production and observed QA

Inspect the host's actual file creation/conversion/extraction/render capabilities. Use available
native document/PDF tools, with no extra consumer skill, API key, service or mandatory Python
dependency. Respect the employer's current accepted file formats/size/length instructions first.
Formatting defaults are recommendations, not universal ATS rules. A restrained single-column
document with common headings, readable typography and body contact information reduces layout
complexity; it does not guarantee every parser reads it. Context controls A4/Letter and length.

## Production

1. Use fact-checked selected ResumeVersion, requested language and actual candidate name/contact
   facts. Missing essential contact/title/date fields remain Unknown; ask rather than invent.
2. Generate editable DOCX and text-based PDF when supported. Preserve headings, employment blocks,
   dates, bullet boundaries, true Unicode/Korean name, readable spacing, hyperlinks and factual order.
   Prefer converting the final DOCX to PDF when available; otherwise generate both from the same
   frozen content and explicitly verify parity. Never rename a text file .pdf/.docx or rasterize
   all text just to deliver something. CV/academic/portfolio length may differ; do not impose a page
   limit solely from seniority. Do not shrink typography to hide overflow.
3. Open final files; actually extract DOCX text (including hyperlink runs) and PDF text. Compare
   to the expected name/company/title/dates/skills and each bullet/section of the selected version.
   Normalize whitespace only; preserve characters, numeric units, responsibility and content order.
4. Verify PDF page count against requested/observed expectations; inspect every rendered page for
   clipping, overlap, missing glyphs, broken bullets, unreadable fonts, blank/sparse overflow and
   visual balance. Extraction alone cannot prove visual quality. Check final DOCX rendering too.
5. Inspect actual link targets/encoding, contact fields in headers/footers, columns/tables/textboxes,
   image-only pages, section recognition and title/company/date boundaries. Inspect actual portal
   autofill only if the user authorizes portal access; report observed behavior, not vendor lore.
6. Fix, regenerate and repeat extraction/visual checks on final bytes. Record paths, optional real
   SHA-256, format/page count, method/date, extracted text and PASS/FAIL/UNKNOWN observations.
   Filenames should identify candidate/role/company/version; use safe relative sidecar paths.

## Results and fallback

ATS-Ready: supported file, key content and reading order verified, structural/visual checks pass.
This means locally readable; no ATS ranking/pass guarantee. ATS-Risky: readable but observed
layout/field/order/link/unchecked visual risk needs correction. ATS-Broken: extraction is empty,
key text is missing/corrupted/truncated, or file cannot open. NOT_CHECKED: insufficient tools or
file unavailable. Missing tests never become PASS. OCR text is not proof the original PDF is text-based.

Final-ready requires factual/user review and actual observed file QA. If document creation is
unavailable, supply complete supported copy and a layout/export checklist; say “문구 초안이며,
DOCX/PDF 생성과 실제 파일 검증은 아직 완료하지 못했어요.” Keep ready false and affected stages
PENDING. If only one format is available, deliver it honestly and mark the other pending rather
than withholding supported work. Hash calculation unavailable→null. No fictitious download links.

## Experimental vendor observation

Read a supplied posting's parsed hostname, not substring search of its full URL. Reject userinfo,
non-HTTP(S), lookalike/suffix-spoofed hosts and third-party URLs mentioning a vendor in the path.
Known hosted boards may suggest Workday/Greenhouse/Lever/Ashby/iCIMS/Taleo/SuccessFactors/
SmartRecruiters/Workable. Observe redirect destinations only if actually followed. oraclecloud
alone does not identify Taleo. Company name is not vendor evidence.

CONFIRMED requires vendor board host plus matching employer/role/requisition confirmed from actual
page or supplied identifiable posting. A recognized host without that identity is LIKELY; ambiguous
custom host/no access is UNKNOWN. Store URL/source/check date and identity check. A slug/API hit
alone is not employer confirmation. Do not probe accounts or scrape private candidate data.
Vendor observation is optional and cannot block ordinary tailoring. Vendor-specific parser/date/
keyword/file advice requires current official evidence relevant to the claim; otherwise give
generic structural checks. A vendor host says nothing about employer-specific screening settings.
