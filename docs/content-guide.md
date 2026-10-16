# Content maintenance

The public navigation is **Weekly Reports / English Learning / Paper Library**. Navigation and library content remain English; weekly report templates and report content use Chinese. Original PDFs and reading notes keep their supplied contents and language.

## Weekly Reports

The homepage provides a report index and a paper-style editor. Unlock editing with the existing management password to access the initial private **周报一**. Its title, name, date, and all five writing areas start blank. Use **New report** to add the next numbered report; the sample document's author and research content are never prefilled.

The template has four main sections: 现阶段工作主题; 本周工作总结及问题 (工作总结 and 遇到问题); 下周工作计划; 讨论结果. Each writing area accepts paragraphs, numbered lists, and uploaded PNG/JPEG images. Paste HTTP(S) URLs into text to create clickable links in previews and Word exports. Images can have captions and alternative text, with a 4 MB per-file limit and 20 images per report.

**Save draft** saves only the owner's working copy. **Publish** creates a public snapshot. Further edits remain private until **Update publication** is used, and **Unpublish** removes public access to the report and its images. The server checks report revisions during conditional writes; conflicts preserve the local unsaved text rather than overwriting another device's version. Export or copy unsaved edits before choosing **Reload saved**.

**Export Word** downloads a single editable `.docx`, including text, real numbered lists, hyperlinks, and embedded images. Owners can export their current draft; visitors can export published copies. Generation is lazy-loaded and runs in the browser, so the document is not constrained by a server response-size limit. The template preserves the supplied reference's A4 geometry and Chinese/English typography. The original reference file is not published or modified.

Reports and images use the existing private Vercel Blob store, under a separate `weekly-reports/` path within each deployment's storage namespace. The `/api/reports` routes enforce the existing editor cookie, origin checks, bounded uploads, and draft/published visibility. Image responses are authorized against the published snapshot for visitors and use `private, no-store`, including after unpublication. No storage credentials or private Blob URLs are sent to the browser.

## Paper Library

The library provides a searchable, categorized list with two direct downloads per paper. There are no public paper reports, slides, or interpretation pages. Old paper URLs redirect to the corresponding entry in its category list.

| Category key | Collection | URL |
| --- | --- | --- |
| `laser-diode-driver` | PAM Systems → Laser Diode Drivers | `/photoacoustic/pam-system/laser-diode-driver/` |
| `system-building` | PAM Systems → System Construction | `/photoacoustic/pam-system/system-building/` |
| `pact` | Fundamentals → PACT | `/photoacoustic/fundamentals/pact/` |
| `pam` | Fundamentals → PAM | `/photoacoustic/fundamentals/pam/` |
| `pame` | Fundamentals → PAME | `/photoacoustic/fundamentals/pame/` |

For each real paper, maintain `src/content/papers/<slug>.md` with frontmatter containing:

- `slug`: a unique lowercase identifier using words, numbers, and hyphens.
- `title`, `journal`, `year`, `authors`, and `doi`: verified bibliographic metadata. Use the DOI without a URL prefix.
- `category`: one of the keys above.
- `summary`: a short English summary grounded in the supplied paper and notes.
- `tags`: English terms used for search.
- `status`: `draft` until verified; `published` to include the item in the library.
- `downloads.pdf` and `downloads.notes`: each contains `url`, `label` (the English download filename), and optional `size`.

Store the supplied source documents at `public/library/<slug>/original.pdf` and `public/library/<slug>/reading-notes.pdf`. Their public URLs start with `/library/`. Compare SHA-256 hashes with the supplied files to confirm byte-for-byte preservation. Do not add duplicate papers: compare DOI, title, authors, and year with the existing catalogue first.

Published papers require both source downloads. The build rejects missing local files and Chinese text in the public title, summary, journal, author, and tag fields. The search covers title, summary, authors, journal, tags, DOI, and year; category filters work alongside search.

The previous `team`, `problem`, `materials`, `methods`, `innovations`, `results`, `conclusions`, `figures`, `references`, `presentation`, and Markdown report body are retained as archived source. They are not rendered on public pages and are not required for new catalogue entries. Existing figure and slide references remain validated for consistency. `PaperReport.astro` and `PaperPresentation.astro` are also retained but are no longer imported by public routes.

## English Learning

Maintain real speaking or vocabulary entries in `src/content/english/<slug>.md`. Use `type: speaking` or `type: vocabulary`, a unique `slug`, and `status: published` only after verification. The title, meaning, category, tags, context, examples, source labels, and displayed body must be in English. Do not populate the optional legacy `chinese` example field for public entries.

The existing search, category filters, speaking/vocabulary filters, and `/english/<slug>/` entry pages remain available. No sample entries, online editor, audio recorder, or review quiz is included.

## Daily Journal preservation

`src/lib/site-features.ts` sets `dailyJournal: false` and enables weekly reports. This hides the journal homepage and navigation label. The journal component, calendar/checklist scripts, authentication and journal APIs, server storage code, and stored cloud records remain intact. Owner controls are shown on the weekly homepage; other static pages do not make session requests.

To restore the journal when requested, set `dailyJournal` to `true` and rebuild. It restores the original homepage and editing controls without a data migration. Update the homepage assertions in the runtime tests when deliberately changing the feature state. Do not delete or reset cloud records as part of a display change. The earlier Current Work component/data also remain in source.

## Publication checks

1. Verify the supplied content and metadata; retain incomplete entries as drafts.
2. Run `npm test`, `npm run build`, and `npm run test:runtime`.
3. Check the built library/English pages for English-only text, correct navigation, functioning search and filters, source downloads, and redirects from retired paper-report URLs.
4. Publish through the existing GitHub → Vercel workflow, keeping `raylee123.vercel.app`.
5. Verify the weekly report workflow in a disposable development storage namespace: login, save, reload, publish, private follow-up edits, image permissions, unpublish, and Word export. Never use production records for test content.
6. Verify the production homepage, library, report access controls, redirects, and downloads against the deployed commit.

Content fields are escaped rather than evaluated as HTML or scripts. Local asset URLs and HTTPS links are supported; embedded credentials, protocol-relative URLs, and traversal paths are rejected.
