// Run after `npm run build`. Isolate the artifact from the project's
// node_modules so a missing deployment dependency cannot resolve locally.
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repo = fileURLToPath(new URL('../', import.meta.url));
const artifact = path.join(repo, '.vercel/output/functions/_render.func');
const isolated = mkdtempSync(path.join(path.dirname(repo), 'function-runtime-'));
try {
  cpSync(artifact, isolated, { recursive: true });
  const configuration = JSON.parse(readFileSync(path.join(isolated, '.vc-config.json'), 'utf8'));
  assert.equal(configuration.runtime, 'nodejs24.x');
  writeFileSync(path.join(isolated, 'smoke.mjs'), `
    import assert from 'node:assert/strict';
    import handler from './dist/server/entry.mjs';
    const home = await handler.fetch(new Request('https://journal.example/'));
    assert.equal(home.status, 200);
    assert.ok((await home.text()).includes('Ray_Lee'));
    const session = await handler.fetch(new Request('https://journal.example/api/session'));
    assert.equal(session.status, 200);
    assert.equal((await session.json()).editing, false);
    console.log('PASS: isolated Vercel function starts and serves homepage and session API.');
  `);
  const child = spawnSync(process.execPath, ['smoke.mjs'], { cwd: isolated, encoding: 'utf8', timeout: 30_000 });
  assert.equal(child.status, 0, child.stderr || child.error?.message || 'Isolated function failed.');
  process.stdout.write(child.stdout);
} finally {
  rmSync(isolated, { recursive: true, force: true });
}
