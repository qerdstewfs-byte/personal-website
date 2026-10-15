// Run after `npm run build`. Isolate the artifact from the project's
// node_modules so a missing deployment dependency cannot resolve locally.
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import './catalogue-build.mjs';

const repo = fileURLToPath(new URL('../', import.meta.url));
const artifact = path.join(repo, '.vercel/output/functions/_render.func');
const routes = JSON.parse(readFileSync(path.join(repo, '.vercel/output/config.json'), 'utf8')).routes;
const retiredRoutes = routes.filter(route => route.status === 302 && route.headers?.Location?.startsWith('/photoacoustic/'));
assert.equal(retiredRoutes.length, 4, 'All four previously shared report URLs must redirect.');
const staticHome = readFileSync(path.join(repo, '.vercel/output/static/index.html'), 'utf8');
assert.ok(staticHome.includes('Ray_Lee') && staticHome.includes('id="current-work-title"'), 'Homepage must be emitted as the static Current Work page.');
assert.ok(!staticHome.includes('id="dailyBoard"') && !staticHome.includes('id="editorAccessBtn"'), 'The journal UI must remain hidden.');
const isolated = mkdtempSync(path.join(path.dirname(repo), 'function-runtime-'));
try {
  cpSync(artifact, isolated, { recursive: true });
  const configuration = JSON.parse(readFileSync(path.join(isolated, '.vc-config.json'), 'utf8'));
  assert.equal(configuration.runtime, 'nodejs24.x');
  writeFileSync(path.join(isolated, 'smoke.mjs'), `
    import assert from 'node:assert/strict';
    import handler from './dist/server/entry.mjs';
    const session = await handler.fetch(new Request('https://journal.example/api/session'));
    assert.equal(session.status, 200);
    assert.equal((await session.json()).editing, false);
    for (const route of ${JSON.stringify(retiredRoutes)}) {
      const pathname = route.src.slice(1, -1);
      for (const suffix of ['', '/']) {
        const response = await handler.fetch(new Request('https://journal.example' + pathname + suffix));
        // Vercel uses the configured 302 at the edge; Astro's function fallback
        // currently returns 301. Both must lead directly to the same list entry.
        assert.ok([301, 302].includes(response.status), pathname + suffix);
        assert.equal(response.headers.get('location'), route.headers.Location);
      }
    }
    console.log('PASS: isolated Vercel function serves the retained session API and redirects retired reports, with or without trailing slashes.');
  `);
  const child = spawnSync(process.execPath, ['smoke.mjs'], { cwd: isolated, encoding: 'utf8', timeout: 30_000 });
  assert.equal(child.status, 0, child.stderr || child.error?.message || 'Isolated function failed.');
  process.stdout.write(child.stdout);
} finally {
  rmSync(isolated, { recursive: true, force: true });
}
