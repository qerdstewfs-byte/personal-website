import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const resources = JSON.parse(await readFile(new URL('../src/data/resources.json', import.meta.url), 'utf8'));

test('every resource has an intact public download', async () => {
  assert.ok(resources.length > 0);
  const paths = new Set();
  for (const resource of resources) {
    assert.equal(resource.category, 'PPT');
    assert.ok(resource.url.startsWith('/files/ppt/'));
    assert.ok(!resource.url.includes('..'));
    assert.ok(!paths.has(resource.url));
    paths.add(resource.url);
    const file = new URL('../public' + resource.url, import.meta.url);
    const bytes = await readFile(file);
    assert.equal((await stat(file)).size, resource.size);
    assert.equal(bytes.subarray(0, 2).toString(), 'PK');
    assert.equal(createHash('sha256').update(bytes).digest('hex'), resource.sha256);
  }
});

test('all and PPT routes render real downloadable files without old content', async () => {
  for (const route of ['index.html', 'ppt/index.html']) {
    const html = await readFile(new URL('../dist/' + route, import.meta.url), 'utf8');
    for (const resource of resources) {
      assert.ok(html.includes(resource.url));
      assert.ok(html.includes(resource.title));
    }
    assert.ok(html.includes('download='));
    assert.ok(html.includes('id="resourceSearch"'));
    assert.ok(!html.includes('editorAccess'));
    assert.ok(!html.includes('/api/'));
  }
  const output = await readdir(new URL('../dist/', import.meta.url));
  for (const oldRoute of ['photoacoustic', 'english', 'api', 'library']) {
    assert.ok(!output.includes(oldRoute), 'Old route is removed: ' + oldRoute);
  }
});
