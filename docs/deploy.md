# Deployment and cloud records

Continue using the existing Vercel project `personal-website`, connected to `qerdstewfs-byte/personal-website`, production branch `master`. The repository uses Astro with `@astrojs/vercel`, server output, Node 24, and pinned dependencies. Do not replace the existing project or manually deploy `dist` as a static-only folder: the calendar API and management session need Vercel Functions.

## Required server environment variables

| Name | Purpose | Visibility |
| --- | --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Private Blob read/write credential injected by the connected store | Server only |
| `BLOB_STORE_ID` | Connected store identifier, also supports Vercel OIDC | Config |
| `ADMIN_PASSWORD_HASH` | `salt:scrypt-digest` (64-byte digest, hex) for editor password | Secret |
| `SESSION_SECRET` | Random signing key for editor cookies | Secret |

The journal store was provisioned for this existing project. No secret belongs in a `PUBLIC_` or `VITE_` environment variable. The password itself is delivered in a separate local access file, outside the repository. Public visitors do not need an account. Use the header's **Enable editing** button and management password to change checklist records; **Lock editing** clears the device session.

## Prefixes and update safety

The live records use `journal/v1/production/state.json`. Preview records use `journal/v1/preview/<branch>/state.json`; local records use `journal/v1/development/local/state.json`. The private store can be shared while the prefixes remain separate. State includes all date-keyed snapshots and the current future-default checklist. A single conditional Blob write updates them atomically; stale full-note and task edits return HTTP 409.

Reads bypass the private Blob CDN cache. The stored ETag is normalized from the compressed response representation before a conditional write. Repeated precondition failures are retried a bounded number of times, with a clear recoverable save failure if conflicts continue. UI drafts stay available after failures. There is no filesystem or localStorage fallback for research records.

## Release workflow

1. Make content and code changes on a branch of this repository.
2. Run `npm test` and `npm run build`; check the actual public category/detail/download links.
3. Push the branch to create a Vercel preview. Preview mutations cannot touch production records.
4. Review the generated preview and the commit being released, then merge to `master` to update this existing Vercel site.
5. Verify the production homepage, the two libraries, and `/api/journal?year=<Beijing year>` return successfully. The public record API should report `cloud: true` and `editing: false` without a management cookie. Unauthorized mutations must return HTTP 401.

When adding a paper, check the original PDF and notes actually download, original figures stay legible on phone and desktop, sources are correct, and all displayed conclusions come from the supplied materials. A missing local asset or incomplete published report fails the build.

## Troubleshooting

An HTTP 503 record response means the cloud service/configuration is unavailable; the page retains failed drafts and shows a retry action. It must not present a fabricated saved state. An HTTP 409 means another device changed the record; use the note comparison dialog or reopen the task editor to fetch the latest version.

An editor password or signing-key change takes effect after the updated Vercel environment is redeployed. Rotating `SESSION_SECRET` also invalidates old management cookies. Set credentials directly in Vercel; do not paste secrets into issue discussions, source files, PR descriptions, or chat.
