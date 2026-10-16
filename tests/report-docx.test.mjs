import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { strFromU8, unzipSync } from 'fflate';
import { buildWeeklyReportDocx } from '../src/lib/report-docx.ts';
import { emptyReportContent } from '../src/lib/reports.ts';

const imageId = 'bcad4ad2-2f37-4b6d-9421-318216df4321';
const png = new Uint8Array(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jPioAAAAASUVORK5CYII=', 'base64'));
const digest = value => createHash('sha256').update(value).digest('hex');
const xml = (parts, name = 'word/document.xml') => strFromU8(parts[name]);

test('blank export preserves the reference page and styles but removes all sample content', async () => {
  const parts = unzipSync(await buildWeeklyReportDocx(emptyReportContent(), new Map()));
  const document = xml(parts);
  assert.match(document, /<w:pgSz w:w="11906" w:h="16838"\/>/);
  assert.match(document, /<w:pgMar w:top="1440" w:right="1800" w:bottom="1440" w:left="1800"/);
  assert.match(document, /<w:pStyle w:val="a3"\/>/); // Source's real Title style.
  assert.equal((document.match(/<w:sectPr/g) ?? []).length, 1);
  assert.deepEqual([...document.matchAll(/<w:t[^>]*>([^<]+)<\/w:t>/g)].map(match => match[1]), [
    '现阶段工作主题', '本周工作总结及问题', '工作总结', '遇到问题', '下周工作计划', '讨论结果',
  ]);
  const allText = Object.values(parts).map(strFromU8).join('\n');
  for (const forbidden of ['贺礼', '医学影像系统与应用实验室', 'lenovo', 'GrammarlyDocumentId', '2026年10月15日', 'lpor.202000484', 's44303-026-00191-6']) assert.ok(!allText.includes(forbidden), forbidden);
  assert.ok(!parts['docProps/custom.xml']);
  assert.equal(digest(parts['word/styles.xml']), 'b2211bb2c49327830d735fb5b2d9aabc937626ba2abf7af2b6b4cb61ea0dd310');
  assert.equal(digest(parts['word/theme/theme1.xml']), '2144430b2dae0beefe7ef9f3a59e155d73d4be735336f6fd9c79eb9395ad124e');
  assert.equal(digest(parts['word/fontTable.xml']), 'bf155b342f12c10753c97425634d7dbe326df4e9b4163af81415e0525a6aef49');
});

test('text, links and lists remain editable and list blocks restart independently', async () => {
  const content = emptyReportContent();
  Object.assign(content, { title: '研究进展 <A & B>', author: '测试作者', date: '2028-02-29' });
  content.sections.topic = [{ kind: 'list', items: ['第一项', '第二项\n继续说明'] }];
  content.sections.summary = [{ kind: 'paragraph', text: '参数 A < B & C > D\t网址 https://example.org/paper?q=1&v=2。 javascript:alert(1)' }];
  content.sections.plan = [{ kind: 'list', items: ['下一步'] }];
  const parts = unzipSync(await buildWeeklyReportDocx(content, new Map()));
  const document = xml(parts), rels = xml(parts, 'word/_rels/document.xml.rels');
  assert.ok(document.includes('研究进展 &lt;A &amp; B&gt;'));
  assert.ok(document.includes('2028年2月29日'));
  assert.ok(document.includes('<w:br/>') && document.includes('<w:tab/>'));
  assert.match(document, /<w:hyperlink r:id="rIdReport\d+"/);
  assert.ok(rels.includes('Target="https://example.org/paper?q=1&amp;v=2" TargetMode="External"'));
  assert.ok(!rels.includes('javascript:'));
  const listIds = [...document.matchAll(/<w:numId w:val="(\d+)"\/>/g)].map(match => match[1]);
  assert.equal(listIds.length, 3);
  assert.equal(listIds[0], listIds[1]);
  assert.notEqual(listIds[1], listIds[2]);
  for (const id of new Set(listIds)) assert.ok(xml(parts, 'word/numbering.xml').includes(`<w:num w:numId="${id}"><w:abstractNumId w:val="1"/><w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/>`));
});

test('pictures are embedded once, use unique drawing IDs, and fit the source text area', async () => {
  const content = emptyReportContent();
  content.sections.summary = [
    { kind: 'image', imageId, alt: 'A & B', caption: '宽图' },
    { kind: 'image', imageId, alt: '重复图', caption: '' },
  ];
  const parts = unzipSync(await buildWeeklyReportDocx(content, new Map([[imageId, { bytes: png, mime: 'image/png', width: 8000, height: 4000 }]])));
  assert.deepEqual(parts['word/media/report-image-1.png'], png);
  assert.equal(Object.keys(parts).filter(name => name.startsWith('word/media/')).length, 1);
  const document = xml(parts);
  const extents = [...document.matchAll(/<wp:extent cx="(\d+)" cy="(\d+)"\/>/g)].map(match => [Number(match[1]), Number(match[2])]);
  assert.equal(extents.length, 2);
  assert.ok(extents.every(([width, height]) => width <= 8306 * 635 && height <= 12158 * 635 && Math.abs(width / height - 2) < 0.001));
  assert.match(document, /<wp:docPr id="1"[^>]*descr="A &amp; B"/);
  assert.match(document, /<wp:docPr id="2"/);
  assert.ok(!xml(parts, 'word/_rels/document.xml.rels').includes('Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" TargetMode="External"'));
});

test('missing or unsupported images fail instead of silently dropping report content', async () => {
  const content = emptyReportContent();
  content.sections.summary = [{ kind: 'image', imageId, alt: '', caption: '' }];
  await assert.rejects(buildWeeklyReportDocx(content, new Map()), /image is missing/);
  await assert.rejects(buildWeeklyReportDocx(content, new Map([[imageId, { bytes: png, mime: 'image/svg+xml', width: 1, height: 1 }]])), /image could not be exported/);
});
