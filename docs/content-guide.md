# Content maintenance

The public navigation is **Current Work / English Learning / Paper Library**. All visible webpage content is in English. Original PDFs and reading notes keep their supplied contents and language.

## Current Work

The homepage reads `src/data/current-work.json`. Its `paragraphs` array is intentionally empty until the owner supplies a research update. Add the approved English paragraphs there and publish through the existing GitHub → Vercel workflow. There is no online editor and no sample research content.

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

`src/lib/site-features.ts` sets `dailyJournal: false`. This hides the journal homepage, navigation label, and owner-editing controls. The journal component, calendar/checklist scripts, authentication and journal APIs, server storage code, and stored cloud records remain intact. Static pages make no session request while editing controls are hidden.

To restore the journal when requested, set this flag to `true` and rebuild. It restores the original homepage and editing controls without a data migration. Update the homepage assertions in `tests/function-runtime.mjs` when deliberately changing the feature state. Do not delete or reset cloud records as part of a display change.

## Publication checks

1. Verify the supplied content and metadata; retain incomplete entries as drafts.
2. Run `npm test`, `npm run build`, and `npm run test:runtime`.
3. Check the built public pages for English-only text, correct navigation, functioning search and filters, source downloads, and redirects from retired report URLs.
4. Publish through the existing GitHub → Vercel workflow, keeping `raylee123.vercel.app`.
5. Verify the production homepage, library, redirects, and PDF downloads against the deployed commit.

Content fields are escaped rather than evaluated as HTML or scripts. Local asset URLs and HTTPS links are supported; embedded credentials, protocol-relative URLs, and traversal paths are rejected.
