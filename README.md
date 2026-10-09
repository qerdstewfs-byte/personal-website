# Ray_Lee’s Research Journal

Personal research records, English learning, and a source-grounded photoacoustic paper library, rebuilt within the original Astro project.

- `/`: the supplied daily checklist, Beijing time, full-year calendar, day-specific task snapshots and notes.
- `/english/`: speaking corpus and vocabulary search, filters, and individual entries.
- `/photoacoustic/`: the supplied two-level directory and individual illustrated paper reports.
- `/about`: redirects to the research library, replacing the old personal profile.

Reading is public. Cloud mutations require the management password; the browser receives only a signed HttpOnly cookie, never storage credentials. Calendar data lives in a private Vercel Blob store and remains available on another device. The whole journal state and future task template are committed atomically with ETag checks. Notes/task-list replacement also require the revision last seen by the editor; conflicts preserve the local note and offer an explicit comparison.

Real materials have not yet been supplied. Empty libraries are intentional. No invented papers, team profiles, English entries, history, or sample downloads are published.

## Local development

Use Node 24 or newer. Install the locked dependencies with `npm ci`. Create a local `.env.local` from `.env.example` using development credentials, then run `npm run dev`. Missing cloud configuration produces an explicit connection error and never silently falls back to device-only persistence.

`npm run build` runs Astro type/content validation and creates Vercel server output. `npm test` checks Beijing midnight, leap years, and historical snapshot summaries. `tests/api-smoke.mjs` is an opt-in local integration check against the real cloud backend; it uses only the dedicated development namespace and removes its own disposable test date. Supply the local test password through `JOURNAL_TEST_PASSWORD`; it is not a production test runner.

## Adding real materials

See [content guide](docs/content-guide.md). Papers and English entries use schema-validated Markdown files under `src/content/`. Drafts are excluded from public routes. A published paper needs real source files, a verified team with source links, materials/methods, illustrated innovations with evidence and tradeoffs, results, and conclusions. Local PDF/note/image files live in `public/library/<paper-slug>/`; missing files fail the build.

The owner supplies PDFs, corresponding learning notes, and English materials for continued curation and GitHub updates. This version does not include a website upload dashboard, audio practice, or vocabulary exercises.

## Data and deployment

See [deployment guide](docs/deploy.md). Runtime secrets belong in Vercel environment variables or ignored local environment files. `.env.*`, `.vercel/`, generated outputs, and credential files must not be committed.

Private Blob storage keeps object access credentials on the server; the journal read API deliberately exposes the records publicly, as requested. Production, branch previews, and local development use different data prefixes so a preview test cannot overwrite production history.

The journal supports calendar years 1900–2200, up to 40 tasks per day and 10,000 note characters. A 25 MB UTF-8 document limit is checked before saving; an oversized change fails without replacing the previously readable state. The current personal-scale document approach can later be migrated to a relational database if the archive grows beyond that limit.

`docs/handoff/` and `docs/roadmap.md` describe the old personal website and are retained only as historical project notes; this README and the current content/deployment guides describe the rebuilt site.
