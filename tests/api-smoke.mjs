import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
const base = 'http://127.0.0.1:4321';
const access = readFileSync('../../outputs/Journal_Editor_Access.txt', 'utf8');
const password = process.env.JOURNAL_TEST_PASSWORD || access.match(/password:\n\n([A-Za-z0-9_-]+)/)?.[1];
assert.ok(password, 'Local editor access file missing.');
let cookie = '';
async function call(path, method = 'GET', payload, origin = base) {
  const response = await fetch(base + path, { method, headers: { ...(method === 'GET' ? {} : { 'Content-Type': 'application/json', Origin: origin }), ...(cookie ? { Cookie: cookie } : {}) }, body: payload ? JSON.stringify(payload) : undefined });
  return { status: response.status, data: await response.json(), response };
}
const before = await call('/api/journal?year=2000');
assert.equal(before.status, 200); assert.equal(before.data.cloud, true);
assert.deepEqual(Object.keys(before.data.records), [], 'Dedicated test year must be empty; existing records will not be touched.');
assert.equal((await call('/api/journal', 'POST', {date:'2000-02-29',action:'reset'})).status, 401);
const session = await call('/api/session', 'POST', {password}); assert.equal(session.status, 200);
cookie = session.response.headers.get('set-cookie').split(';')[0];
assert.ok(session.response.headers.get('set-cookie').includes('HttpOnly'));
try {
  assert.equal((await call('/api/journal', 'POST', {date:'2000-02-30',action:'reset'})).status, 400);
  assert.equal((await call('/api/journal', 'POST', {date:'2099-01-01',action:'reset'})).status, 400);
  assert.equal((await call('/api/journal', 'POST', {date:'2000-02-29',action:'reset'}, 'https://unrelated.example')).status, 403);
  const first = await call('/api/journal', 'POST', {date:'2000-02-29',action:'check',taskId:'pam',checked:true}); assert.equal(first.status, 200);
  const note = await call('/api/journal', 'POST', {date:'2000-02-29',action:'note',note:'Disposable integration test',baseRevision:first.data.record.revision}); assert.equal(note.status, 200);
  const stale = await call('/api/journal', 'POST', {date:'2000-02-29',action:'note',note:'This must not overwrite',baseRevision:first.data.record.revision}); assert.equal(stale.status, 409);
  const parallel = await Promise.all([
    call('/api/journal','POST',{date:'2000-02-29',action:'check',taskId:'paper',checked:true}),
    call('/api/journal','POST',{date:'2000-02-29',action:'check',taskId:'ielts',checked:true}),
  ]); assert.ok(parallel.every(result => result.status === 200));
  cookie = '';
  const otherDevice = await call('/api/journal?year=2000');
  const record = otherDevice.data.records['2000-02-29'];
  assert.equal(record.checked.pam, true); assert.equal(record.checked.paper, true); assert.equal(record.checked.ielts, true);
  assert.equal(record.note, 'Disposable integration test'); assert.equal(record.tasks.length, 7); assert.equal(otherDevice.data.editing,false);
  console.log('PASS: real cloud persistence, second-device read, merged simultaneous writes, revision conflicts, owner authorization, date validation, same-origin protection, HttpOnly session.');
} finally {
  for (let attempt = 0; attempt < 5; attempt++) {
    const stored = await get('journal/v1/development/local/state.json', { access:'private', useCache:false, token:process.env.BLOB_READ_WRITE_TOKEN });
    if (!stored || stored.statusCode !== 200) break;
    const state = await new Response(stored.stream).json(); delete state.records['2000-02-29'];
    try {
      await put('journal/v1/development/local/state.json',JSON.stringify(state),{access:'private',allowOverwrite:true,addRandomSuffix:false,ifMatch:stored.blob.etag.replace(/^W\//,''),contentType:'application/json',token:process.env.BLOB_READ_WRITE_TOKEN}); break;
    } catch (error) { if (!(error instanceof BlobPreconditionFailedError) || attempt === 4) throw error; }
  }
  console.log('Removed dedicated development test records.');
}
