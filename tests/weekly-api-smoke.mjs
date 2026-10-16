// Real-cloud lifecycle test. Run only against a disposable local server started
// with a unique VERCEL_GIT_COMMIT_REF=weekly-reports-audit-<UUID> namespace.
// This script never reads or writes journal records and never logs credentials.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { emptyReportContent } from '../src/lib/reports.ts';

const origin = process.env.REPORT_TEST_ORIGIN;
const password = process.env.REPORT_TEST_PASSWORD;
const scope = process.env.REPORT_TEST_SCOPE;
assert.ok(origin && password, 'Set REPORT_TEST_ORIGIN and the disposable REPORT_TEST_PASSWORD.');
const target = new URL(origin);
assert.ok(target.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(target.hostname), 'Only a local test server is allowed.');
assert.equal(target.origin, origin, 'Use a bare local origin without a pathname.');
assert.match(scope ?? '', /^weekly-reports-audit-[a-f0-9-]{36}$/i, 'Confirm the disposable server namespace via REPORT_TEST_SCOPE.');

const first = '/api/reports/report-1';
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC0kAAAAASUVORK5CYII=', 'base64');
let cookie = '', initialized = false;
let assertions = 0;
async function request(path, { method = 'GET', data, raw, mime, owner = false, requestOrigin = origin } = {}) {
  const response = await fetch(origin + path, {
    method,
    headers: {
      ...(method === 'GET' ? {} : { Origin: requestOrigin }),
      ...(data !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(raw !== undefined ? { 'Content-Type': mime ?? 'image/png' } : {}),
      ...(owner && cookie ? { Cookie: cookie } : {}),
    },
    body: data !== undefined ? JSON.stringify(data) : raw,
    redirect: 'manual',
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  const json = response.headers.get('content-type')?.includes('application/json') ? JSON.parse(bytes.toString('utf8')) : null;
  assert.match(response.headers.get('cache-control') ?? '', /no-store/, `${method} ${path} must not cache private or revocable data.`);
  assertions++;
  return { status: response.status, response, json, bytes };
}
const expectStatus = (result, expected, context) => {
  assert.equal(result.status, expected, `${context}: ${result.json?.error ?? 'unexpected status'}`);
  assertions++;
  return result;
};
const fetchReport = async (path = first, owner = true) => expectStatus(await request(path, { owner }), 200, `read ${path}`).json.report;
const save = async (action, content, revision, path = first) => request(path, { method: 'POST', owner: true, data: { action, content, revision } });
const fixture = title => {
  const value = emptyReportContent();
  value.title = title; value.author = 'Disposable test'; value.date = '2026-10-15';
  value.sections.summary = [{ kind: 'paragraph', text: '公开测试：A & B <script>alert(1)</script> https://doi.org/10.1038/nbt839。' }];
  value.sections.plan = [{ kind: 'list', items: ['第一项', '第二项 https://example.org/next'] }];
  return value;
};

try {
  const publicBefore = expectStatus(await request('/api/reports'), 200, 'initial public list');
  assert.deepEqual(publicBefore.json, { editing: false, reports: [] }, 'Refuse to test a namespace with published records.');
  expectStatus(await request(first), 404, 'initial draft is private');
  expectStatus(await request(`${first}?version=draft`), 404, 'explicit draft is private');
  expectStatus(await request('/api/reports/invalid-id'), 404, 'invalid report identifier');
  for (const path of ['/api/reports', first, `${first}/images`]) {
    expectStatus(await request(path, { method: 'POST', data: {} }), 401, 'anonymous writes');
    expectStatus(await request(path, { method: 'POST', data: {}, requestOrigin: 'https://unrelated.example' }), 403, 'cross-origin writes');
  }

  const login = expectStatus(await request('/api/session', { method: 'POST', data: { password } }), 200, 'test owner login');
  cookie = login.response.headers.get('set-cookie')?.split(';')[0] ?? '';
  assert.ok(cookie, 'Test login must issue a cookie.');
  assert.match(login.response.headers.get('set-cookie') ?? '', /httponly/i);
  assert.match(login.response.headers.get('set-cookie') ?? '', /samesite=strict/i);
  const ownerBefore = expectStatus(await request('/api/reports', { owner: true }), 200, 'initial owner list').json;
  assert.equal(ownerBefore.editing, true);
  assert.equal(ownerBefore.reports.length, 1, 'Refuse to modify a namespace with pre-existing reports.');
  let report = await fetchReport();
  assert.equal(report.id, 'report-1'); assert.equal(report.revision, 0);
  assert.deepEqual(report.content, emptyReportContent(), 'The first template must be completely blank.');
  initialized = true;

  const creationId = randomUUID();
  const created = expectStatus(await request('/api/reports', { method: 'POST', owner: true, data: { action: 'create', requestId: creationId } }), 200, 'create second report').json.report;
  const retried = expectStatus(await request('/api/reports', { method: 'POST', owner: true, data: { action: 'create', requestId: creationId } }), 200, 'retry create').json.report;
  assert.equal(created.id, retried.id); assert.equal(created.number, 2);
  assert.deepEqual(created.content, emptyReportContent());
  assert.equal((await request('/api/reports', { owner: true })).json.reports.length, 2);

  let draft = fixture('PRIVATE draft A');
  report = expectStatus(await save('save', draft, report.revision), 200, 'save private draft').json.report;
  assert.deepEqual((await request('/api/reports')).json.reports, []);
  expectStatus(await request(first), 404, 'saved draft stays private');
  assert.equal((await fetchReport()).content.title, draft.title, 'Fresh owner request reads persisted data.');
  expectStatus(await save('save', fixture('stale'), 0), 409, 'stale save');

  for (const upload of [
    { raw: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script/></svg>'), mime: 'image/svg+xml' },
    { raw: Buffer.from('<html>not an image</html>'), mime: 'image/png' },
    { raw: png.subarray(0, 40), mime: 'image/png' },
  ]) expectStatus(await request(`${first}/images`, { method: 'POST', owner: true, ...upload }), 400, 'invalid image');
  expectStatus(await request(`${first}/images`, { method: 'POST', owner: true, raw: Buffer.alloc(4_000_001) }), 413, 'oversized image');
  expectStatus(await request(first, { method: 'POST', owner: true, data: { content: 'x'.repeat(512_001) } }), 413, 'oversized report request');
  expectStatus(await request(first, { method: 'POST', owner: true, raw: Buffer.from('{broken'), mime: 'application/json' }), 400, 'malformed JSON');
  expectStatus(await request(`${first}/images`, { method: 'POST', owner: true, raw: png, requestOrigin: 'https://unrelated.example' }), 403, 'authenticated cross-origin upload');

  const uploadA = expectStatus(await request(`${first}/images`, { method: 'POST', owner: true, raw: png }), 200, 'private image upload').json.image;
  const imagePathA = `${first}/images/${uploadA.id}`;
  assert.equal(uploadA.mime, 'image/png'); assert.equal(uploadA.width, 1); assert.equal(uploadA.height, 1);
  expectStatus(await request(imagePathA), 404, 'unpublished image is private');
  const privateImage = expectStatus(await request(imagePathA, { owner: true }), 200, 'owner image read');
  assert.deepEqual(privateImage.bytes, png);
  assert.equal(privateImage.response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(privateImage.response.headers.get('content-type'), 'image/png');
  expectStatus(await request(`/api/reports/${created.id}/images/${uploadA.id}`, { owner: true }), 404, 'cross-report image read');

  draft.sections.summary.push({ kind: 'image', imageId: uploadA.id, alt: '测试图片', caption: '图 1' });
  const crossReport = fixture('Must fail'); crossReport.sections.summary.push({ kind: 'image', imageId: uploadA.id, alt: '', caption: '' });
  expectStatus(await save('save', crossReport, created.revision, `/api/reports/${created.id}`), 400, 'cross-report image reference');
  draft.title = 'PUBLIC snapshot A';
  report = expectStatus(await save('publish', draft, report.revision), 200, 'publish first snapshot').json.report;
  const firstPublishedAt = report.publishedAt;
  const publicReport = await fetchReport(first, false);
  assert.equal(publicReport.content.title, 'PUBLIC snapshot A');
  assert.deepEqual(expectStatus(await request(imagePathA), 200, 'published image').bytes, png);
  expectStatus(await request(`${first}?version=draft`), 404, 'visitors cannot request a published report draft');
  assert.equal((await request('/api/reports')).json.reports.length, 1);

  const uploadB = expectStatus(await request(`${first}/images`, { method: 'POST', owner: true, raw: png }), 200, 'new private image upload').json.image;
  const imagePathB = `${first}/images/${uploadB.id}`;
  const nextDraft = fixture('PRIVATE snapshot B');
  nextDraft.sections.plan.push({ kind: 'image', imageId: uploadB.id, alt: '', caption: '未公开图片' });
  report = expectStatus(await save('save', nextDraft, report.revision), 200, 'edit without republishing').json.report;
  assert.equal(report.hasUnpublishedChanges, true);
  assert.equal((await fetchReport(first, false)).content.title, 'PUBLIC snapshot A');
  assert.equal((await fetchReport(first, false)).updatedAt, firstPublishedAt);
  assert.equal((await request('/api/reports')).json.reports[0].title, 'PUBLIC snapshot A');
  expectStatus(await request(imagePathA), 200, 'published image survives removal from draft');
  expectStatus(await request(imagePathB), 404, 'new draft image stays private');
  const savedRevision = report.revision;
  const concurrent = await Promise.all([
    save('save', { ...nextDraft, title: 'Device A draft' }, savedRevision),
    save('save', { ...nextDraft, title: 'Device B draft' }, savedRevision),
  ]);
  assert.deepEqual(concurrent.map(item => item.status).sort(), [200, 409], 'Concurrent updates must not silently overwrite.');
  report = await fetchReport();
  assert.equal(report.revision, savedRevision + 1);
  assert.equal((await fetchReport(first, false)).content.title, 'PUBLIC snapshot A');
  expectStatus(await save('publish', nextDraft, savedRevision), 409, 'stale publication');
  expectStatus(await save('unpublish', undefined, savedRevision), 409, 'stale unpublication');

  report = expectStatus(await save('publish', nextDraft, report.revision), 200, 'publish replacement snapshot').json.report;
  assert.equal((await fetchReport(first, false)).content.title, 'PRIVATE snapshot B');
  expectStatus(await request(imagePathA), 404, 'removed image is no longer public');
  expectStatus(await request(imagePathB), 200, 'new published image is available');
  report = expectStatus(await save('unpublish', undefined, report.revision), 200, 'unpublish').json.report;
  assert.deepEqual((await request('/api/reports')).json.reports, []);
  expectStatus(await request(first), 404, 'unpublished report');
  expectStatus(await request(imagePathB), 404, 'unpublished image');
  assert.equal((await fetchReport()).content.title, 'PRIVATE snapshot B');
  console.log(`PASS: ${assertions} HTTP checks covering real-cloud drafts, publication snapshots, private images, concurrency, validation, authorization and no-store responses.`);
} finally {
  if (initialized) {
    try {
      let report = await fetchReport();
      if (report.publishedAt) report = expectStatus(await save('unpublish', undefined, report.revision), 200, 'cleanup unpublish').json.report;
      expectStatus(await save('save', emptyReportContent(), report.revision), 200, 'cleanup first blank template');
      console.log('Restored the disposable first report to an unpublished blank template. Exact cloud namespace cleanup remains with the test launcher.');
    } catch { console.error('Disposable test cleanup failed; clean only the confirmed test namespace.'); }
  }
}
