import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyReportAction, canReadReportImage, emptyReportContent, initialReportStore,
  linkSegments, projectReport, ReportError, reportImageIds, reportLabel,
  reportSummaries, validateReportContent, validReportId,
} from '../src/lib/reports.ts';

const firstId = 'report-1';
const secondRequest = 'b1c49166-63bf-4fa7-a7ec-1e4ab49e43f2';
const secondId = `report-${secondRequest}`;
const imageA = 'd5dc5dc3-6f7b-4cdb-9119-af4ae4355440';
const imageB = '733561db-fc46-49d6-b5b8-d7e8b9935547';
const at = '2026-10-15T08:00:00.000Z';
const later = '2026-10-16T08:00:00.000Z';
const content = (title = '未公开的研究记录') => {
  const value = emptyReportContent();
  value.title = title;
  value.author = '研究者';
  value.date = '2026-10-15';
  value.sections.topic = [{ kind: 'paragraph', text: '测量光声信号。' }];
  value.sections.summary = [{ kind: 'list', items: ['完成实验', '阅读 https://doi.org/10.1038/nbt839'] }];
  return value;
};
const act = (store, action, value = content(), revision = store.reports[firstId].revision, now = at) =>
  applyReportAction(store, firstId, { action, revision, content: value }, now);
const image = imageId => ({ kind: 'image', imageId, alt: '实验图片', caption: '图 1' });
const registerImage = (store, id, reportId = firstId) => {
  store.images[id] = { id, reportId, mime: 'image/png', width: 1, height: 1, bytes: 67 };
};
const status = code => error => error instanceof ReportError && error.status === code;

test('The first report is an owner-only blank template with no copied sample content', () => {
  const store = initialReportStore();
  assert.deepEqual(Object.keys(store.reports), [firstId]);
  assert.deepEqual(store.reports[firstId].draft, emptyReportContent());
  assert.equal(store.reports[firstId].revision, 0);
  assert.equal(projectReport(store.reports[firstId], false), null);
  assert.deepEqual(reportSummaries(store, false), []);
  const owner = reportSummaries(store, true);
  assert.equal(owner.length, 1);
  assert.equal(owner[0].title, '');
  assert.equal(owner[0].date, '');
  assert.equal(reportLabel(owner[0].number), '周报一');
});

test('Creation retries are idempotent and subsequent reports have independent blank content', () => {
  const store = initialReportStore();
  applyReportAction(store, null, { action: 'create', requestId: secondRequest }, at);
  applyReportAction(store, null, { action: 'create', requestId: secondRequest }, later);
  assert.equal(Object.keys(store.reports).length, 2);
  assert.equal(store.reports[secondId].number, 2);
  assert.equal(store.reports[secondId].createdAt, at);
  store.reports[secondId].draft.sections.topic.push({ kind: 'paragraph', text: '仅属于第二份。' });
  assert.deepEqual(store.reports[firstId].draft, emptyReportContent());
  assert.deepEqual(reportSummaries(store, true).map(item => item.number), [2, 1]);
  assert.deepEqual(reportSummaries(store, false), []);
});

test('Saving a draft never makes its contents or metadata visible to visitors', () => {
  const store = initialReportStore();
  act(store, 'save');
  assert.equal(store.reports[firstId].revision, 1);
  assert.deepEqual(reportSummaries(store, false), []);
  assert.equal(projectReport(store.reports[firstId], false), null);
  assert.equal(projectReport(store.reports[firstId], false, 'draft'), null);
  assert.equal(projectReport(store.reports[firstId], true, 'published'), null);
  assert.equal(projectReport(store.reports[firstId], true).content.title, '未公开的研究记录');
});

test('Published contents and timestamps stay fixed while the owner edits a later draft', () => {
  const store = initialReportStore();
  const initial = content('已发布的周报');
  act(store, 'publish', initial);
  initial.title = '外部对象不能修改已发布内容';
  act(store, 'save', content('尚未发布的修改'), 1, later);
  const published = projectReport(store.reports[firstId], false);
  assert.equal(published.content.title, '已发布的周报');
  assert.equal(published.updatedAt, at);
  assert.equal(published.publishedAt, at);
  assert.equal(published.revision, 0);
  assert.equal(published.hasUnpublishedChanges, false);
  assert.equal(reportSummaries(store, false)[0].title, '已发布的周报');
  assert.equal(projectReport(store.reports[firstId], true).content.title, '尚未发布的修改');
  assert.equal(projectReport(store.reports[firstId], true).hasUnpublishedChanges, true);
  assert.equal(projectReport(store.reports[firstId], true, 'published').content.title, '已发布的周报');
  // Even a caller modifying a projected response cannot mutate stored snapshots.
  published.content.title = '改变响应副本';
  assert.equal(projectReport(store.reports[firstId], false).content.title, '已发布的周报');
  act(store, 'publish', content('尚未发布的修改'), 2, later);
  assert.equal(projectReport(store.reports[firstId], false).content.title, '尚未发布的修改');
  assert.equal(projectReport(store.reports[firstId], true).hasUnpublishedChanges, false);
});

test('Unpublishing removes public access while keeping draft content for future publication', () => {
  const store = initialReportStore();
  act(store, 'publish', content('可恢复的内容'));
  act(store, 'unpublish', undefined, 1, later);
  assert.deepEqual(reportSummaries(store, false), []);
  assert.equal(projectReport(store.reports[firstId], false), null);
  assert.equal(projectReport(store.reports[firstId], true).content.title, '可恢复的内容');
  assert.equal(store.reports[firstId].revision, 2);
});

test('Stale saves, publications and unpublications cannot overwrite another device', () => {
  for (const action of ['save', 'publish', 'unpublish']) {
    const store = initialReportStore();
    act(store, 'publish', content('设备 A'));
    const before = structuredClone(store);
    assert.throws(() => act(store, action, content('设备 B 的过期副本'), 0, later), status(409));
    assert.deepEqual(store, before);
  }
});

test('Retrying after a concurrent CAS commit rechecks the report revision', async () => {
  let saved = initialReportStore(), etag = 0, commits = 0;
  async function saveFromDevice(title) {
    for (let retry = 0; retry < 5; retry++) {
      const expected = etag;
      const next = structuredClone(saved);
      act(next, 'save', content(title), 0);
      await Promise.resolve();
      if (expected !== etag) continue;
      saved = next; etag++; commits++;
      return title;
    }
    throw new Error('Unexpected retry exhaustion');
  }
  const results = await Promise.allSettled([saveFromDevice('A'), saveFromDevice('B')]);
  assert.equal(results.filter(item => item.status === 'fulfilled').length, 1);
  assert.equal(results.filter(item => item.status === 'rejected' && status(409)(item.reason)).length, 1);
  assert.equal(saved.reports[firstId].revision, 1);
  assert.equal(commits, 1);
});

test('Only images in the public snapshot are public, independently of saved draft changes', () => {
  const store = initialReportStore();
  registerImage(store, imageA); registerImage(store, imageB);
  const first = content(); first.sections.summary.push(image(imageA));
  act(store, 'save', first);
  assert.equal(canReadReportImage(store, firstId, imageA, false), false);
  assert.equal(canReadReportImage(store, firstId, imageA, true), true);
  act(store, 'publish', first);
  assert.equal(canReadReportImage(store, firstId, imageA, false), true);
  assert.equal(canReadReportImage(store, firstId, imageB, false), false);
  const second = content(); second.sections.summary.push(image(imageB));
  act(store, 'save', second);
  assert.equal(canReadReportImage(store, firstId, imageA, false), true);
  assert.equal(canReadReportImage(store, firstId, imageB, false), false);
  act(store, 'publish', second);
  assert.equal(canReadReportImage(store, firstId, imageA, false), false);
  assert.equal(canReadReportImage(store, firstId, imageB, false), true);
  act(store, 'unpublish');
  assert.equal(canReadReportImage(store, firstId, imageB, false), false);
  assert.equal(canReadReportImage(store, firstId, imageB, true), true);
});

test('A report cannot reference a missing image or take another report’s private image', () => {
  const store = initialReportStore();
  applyReportAction(store, null, { action: 'create', requestId: secondRequest }, at);
  registerImage(store, imageA, secondId);
  for (const imageId of [imageA, imageB]) {
    const value = content(); value.sections.summary.push(image(imageId));
    const before = structuredClone(store);
    assert.throws(() => act(store, 'publish', value), status(400));
    assert.deepEqual(store, before);
  }
  assert.equal(canReadReportImage(store, firstId, imageA, true), false);
  assert.equal(canReadReportImage(store, secondId, imageA, true), true);
});

test('Content is copied into a strict schema without retaining arbitrary HTML or URL properties', () => {
  const value = content();
  value.html = '<script>alert(1)</script>';
  value.sections.topic[0].html = '<img src=x onerror=alert(1)>';
  value.sections.topic[0].url = 'javascript:alert(1)';
  const clean = validateReportContent(value);
  assert.deepEqual(Object.keys(clean).sort(), ['author', 'date', 'sections', 'title']);
  assert.deepEqual(clean.sections.topic[0], { kind: 'paragraph', text: '测量光声信号。' });
  value.sections.topic[0].text = '修改输入';
  assert.equal(clean.sections.topic[0].text, '测量光声信号。');
  for (const bad of [{ kind: 'html', html: '<b>test</b>' }, { kind: 'image', imageId: 'https://outside.example/a.png', alt: '', caption: '' }]) {
    const invalid = content(); invalid.sections.topic.push(bad);
    assert.throws(() => validateReportContent(invalid), status(400));
  }
});

test('Date and bounded content validation reject invalid or oversized input without changing the record', () => {
  for (const date of ['2026-02-29', '2026-04-31', '2026-13-01', '1899-12-31', '2201-01-01', '2026-1-01']) {
    const value = content(); value.date = date;
    assert.throws(() => validateReportContent(value), status(400), date);
  }
  for (const date of ['', '2028-02-29', '1900-01-01', '2200-12-31']) {
    const value = content(); value.date = date;
    assert.equal(validateReportContent(value).date, date);
  }
  const invalid = [
    { ...content(), title: 'x'.repeat(241) },
    { ...content(), author: 'x'.repeat(121) },
    { ...content(), title: 'a\u0000b' },
  ];
  const tooManyBlocks = content(); tooManyBlocks.sections.topic = Array.from({ length: 101 }, () => ({ kind: 'paragraph', text: '' })); invalid.push(tooManyBlocks);
  const tooLongParagraph = content(); tooLongParagraph.sections.topic = [{ kind: 'paragraph', text: 'x'.repeat(20_001) }]; invalid.push(tooLongParagraph);
  const tooLongList = content(); tooLongList.sections.topic = [{ kind: 'list', items: Array(101).fill('a') }]; invalid.push(tooLongList);
  const tooMuchText = content(); tooMuchText.sections.topic = Array.from({ length: 6 }, () => ({ kind: 'paragraph', text: 'x'.repeat(20_000) })); invalid.push(tooMuchText);
  const tooManyImages = content(); tooManyImages.sections.topic = Array.from({ length: 21 }, () => image(imageA)); invalid.push(tooManyImages);
  for (const value of invalid) {
    const store = initialReportStore(), before = structuredClone(store);
    assert.throws(() => act(store, 'save', value), status(400));
    assert.deepEqual(store, before);
  }
});

test('Image references are deduplicated across sections and cannot use arbitrary paths', () => {
  const value = content(); value.sections.topic = [image(imageA), image(imageA)]; value.sections.plan = [image(imageB)];
  assert.deepEqual(reportImageIds(value), [imageA, imageB]);
  for (const id of ['../state', '__proto__', 'constructor', 'report-../../state', 'report-1/../../secret', 'report-x']) {
    assert.equal(validReportId(id), false, id);
    assert.throws(() => applyReportAction(initialReportStore(), id, { action: 'save', revision: 0, content: content() }, at), status(404));
  }
  assert.equal(validReportId(firstId), true);
  assert.equal(validReportId(secondId), true);
});

test('Unknown actions, versions and creation IDs cannot silently modify or expose a report', () => {
  const store = initialReportStore(), before = structuredClone(store);
  assert.throws(() => applyReportAction(store, null, { action: 'create', requestId: '../../x' }, at), status(400));
  assert.throws(() => act(store, 'delete'), status(400));
  assert.throws(() => projectReport(store.reports[firstId], true, 'anything'), status(400));
  assert.deepEqual(store, before);
});

test('Link parsing preserves all text and makes only valid HTTP(S) URLs clickable', () => {
  const inputs = [
    '说明：参见 https://doi.org/10.1038/nbt839。下一句',
    '(https://example.org/paper_(2026)).',
    'javascript:alert(1) data:text/html,<script>alert(1)</script> file:///secret',
    '<img src=x onerror=alert(1)> https://example.org/?a=1&b=2',
    'https://user:secret@example.org/private https://example.org/open',
    'https:// invalid https:/// and HTTPS://EXAMPLE.ORG/ok',
  ];
  for (const value of inputs) {
    const segments = linkSegments(value);
    assert.equal(segments.map(part => part.text).join(''), value);
    for (const part of segments.filter(part => part.url)) {
      const parsed = new URL(part.url);
      assert.ok(['http:', 'https:'].includes(parsed.protocol));
      assert.equal(parsed.username, ''); assert.equal(parsed.password, '');
      assert.ok(parsed.hostname);
    }
  }
  assert.equal(linkSegments(inputs[2]).filter(part => part.url).length, 0);
  assert.deepEqual(linkSegments(inputs[4]).filter(part => part.url).map(part => part.url), ['https://example.org/open']);
  assert.equal(linkSegments(inputs[0]).find(part => part.url).text, 'https://doi.org/10.1038/nbt839');
});
