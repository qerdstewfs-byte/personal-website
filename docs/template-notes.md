# Weekly report Word export

The exporter uses a content-free copy of the supplied Word reference. The original document remains unchanged and is not included in the repository or public website. Only document design parts and empty paragraph patterns are distributed in `src/data/report-template.json`.

## Reference fidelity

- Source SHA-256: `80638568d54030351818883cf947a4acc94467103a15a50dbd66e0b4848f31a6`.
- A4 portrait: 11906 × 16838 twips; margins 1440 top/bottom and 1800 left/right.
- Centered title: Microsoft YaHei, 15 pt, bold. Name/date: right aligned, Songti and Times New Roman, 14 pt.
- Main headings: Microsoft YaHei, 14 pt, bold. Subheadings: 12 pt, bold. Native Word numbering preserves 1, 2, 2.1, 2.2, 3, 4.
- Body: Songti and Times New Roman, 12 pt, exact 20 pt line spacing. Ordered lists use editable native Word numbering, starting at (1) for each list block.
- The reference styles, theme, font table, web settings, and empty footnote/endnote separator parts remain byte-identical. The original numbering definitions are retained; new list instances are appended.
- Blank title, name, date and body fields remain empty. The reference's author, dates, body text, example links, revision IDs and application-specific metadata are removed.
- The existing Word Title style is applied with the reference's direct formatting. Explicit bold avoids Word's toggle behavior between the Title and linked character style. Heading keep-with-next rules prevent orphan headings.

Images were requested for the new editor, although the reference contains none. PNG/JPEG files are embedded inline, centered, fitted to the original printable width and a page-safe height without changing aspect ratio. Captions use the body typography. Missing images produce an error rather than an incomplete export. HTTP(S) URLs become Word hyperlinks; arbitrary HTML remains escaped text.

## Runtime

`buildWeeklyReportDocx(content, images)` in `src/lib/report-docx.ts` returns `Promise<Uint8Array>`. It runs entirely in the browser and is imported only when Export Word is clicked. It performs no network requests. The caller fetches authorized image bytes and downloads the result. The archive uses `fflate`; images are stored without recompressing their already-compressed data.

## Verification

Automated tests in `tests/report-docx.test.mjs` verify blank exports, removal of sample content, reference-part hashes, escaping and clickable URLs, independent list numbering, image embedding/dimensions, and missing-image failures.

The supplied two-page reference and final exported documents were opened read-only in Microsoft Word. A blank one-page export and a three-page representative export containing long Chinese/English text, lists, links and an image were exported to PDF and every rendered page inspected. XML parts were parsed, original source hash rechecked, and title formatting corrected after the first rendering. No source/example text is used as website content.

The skill's canonical `render_docx.py` was attempted, but this Windows runtime did not contain bundled LibreOffice. The verification fallback used a separate hidden Microsoft Word instance (`Documents.Open` read-only; `ExportAsFixedFormat`; close without saving), then the bundled `pypdfium2` rasterizer. No installed desktop LibreOffice or existing user document session was used.

To regenerate the content-free asset, use the bundled Python runtime with `scripts/distill-report-template.py <reference.docx> --output src/data/report-template.json --inventory <private-QA-folder>/package-inventory.json`. The script requires the recorded source hash and fails if sample content survives. Changing the reference requires a new layout audit and rendered verification; do not update only its hash.
