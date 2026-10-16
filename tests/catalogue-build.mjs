// Verify the actual generated catalogue and its filter script without a browser.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const repo = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(repo, '.vercel/output/static');
const html = readFileSync(path.join(output, 'photoacoustic/index.html'), 'utf8');
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const attr = (tag, key) => decode(new RegExp(`\\b${key}="([^"]*)"`).exec(tag)?.[1] ?? '');
const tags = [...html.matchAll(/<article\b[^>]*\bdata-library-entry\b[^>]*>/g)].map(match => match[0]);
assert.ok(tags.length > 0, 'The real paper collection must be present in the static HTML.');

const papers = readdirSync(path.join(repo, 'src/content/papers'))
  .filter(name => name.endsWith('.md') && !name.startsWith('_'))
  .map(name => JSON.parse(readFileSync(path.join(repo, 'src/content/papers', name), 'utf8').split('---')[1]))
  .filter(paper => paper.status === 'published');
assert.equal(tags.length, papers.length);
for (const paper of papers) {
  const tag = tags.find(tag => attr(tag, 'id') === paper.slug);
  assert.ok(tag, `Missing catalogue entry: ${paper.slug}`);
  if (paper.doi) assert.ok(attr(tag, 'data-search').includes(paper.doi.toLowerCase()), 'DOI must be searchable.');
  for (const file of Object.values(paper.downloads)) {
    assert.ok(html.includes(`href="${file.url}" download="${file.label}"`), `Missing direct download: ${file.url}`);
    const built = readFileSync(path.join(output, file.url));
    assert.equal(built.subarray(0, 5).toString(), '%PDF-');
    assert.deepEqual(built, readFileSync(path.join(repo, 'public', file.url)), 'The build must preserve source files.');
  }
}

let pageCount = 0;
for (const filename of readdirSync(output, { recursive: true }).filter(name => name.endsWith('.html'))) {
  const page = readFileSync(path.join(output, filename), 'utf8');
  assert.ok(!/\p{Script=Han}/u.test(page), `Chinese text in public HTML: ${filename}`);
  assert.ok(!/Daily Journal|data-presentation|data-slide|id="dailyBoard"/.test(page), `Retired UI in ${filename}`);
  assert.ok(!page.includes('PaperPresentation') && !page.includes('DailyBoard.astro'), 'Retired UI scripts must not load.');
  pageCount++;
}
const home = readFileSync(path.join(output, 'index.html'), 'utf8');
assert.match(home, /<h1\b[^>]*id="weeklyTitle"[^>]*>Weekly Reports<\/h1>/, 'Weekly Reports must replace the old homepage.');
for (const id of ['weeklyReports', 'reportList', 'weeklyReportForm', 'reportPaper', 'newReport', 'saveReport', 'publishReport', 'unpublishReport', 'exportReport', 'editorAccessBtn']) {
  assert.ok(home.includes(`id="${id}"`), `Missing weekly report capability: ${id}`);
}
assert.ok(!home.includes('Current Work') && !home.includes('current-work-title'), 'The old placeholder homepage must not remain visible.');
assert.ok(!home.includes('贺礼') && !home.includes('PRIVATE draft'), 'Reference document text and private test data must never be embedded in the public shell.');

// Execute the shipped filter logic against generated entry attributes. These
// small event targets are test doubles; no browser or desktop session is used.
const eventTarget = () => ({
  value: '', handlers: new Map(),
  addEventListener(type, callback) { this.handlers.set(type, callback); },
  dispatch(type) { this.handlers.get(type)?.(); },
  focus() {},
});
const entries = tags.map(tag => ({
  id: attr(tag, 'id'), hidden: false,
  dataset: { search: attr(tag, 'data-search'), category: attr(tag, 'data-category') },
}));
const search = eventTarget(), category = eventTarget(), reset = eventTarget();
const counter = { textContent: '' }, noResults = { hidden: true };
const classes = new Set(['with-tree']);
const selectors = new Map([
  ['[data-library-search]', search], ['[data-library-category]', category],
  ['[data-library-counter]', counter], ['[data-library-no-results]', noResults],
  ['[data-library-reset]', reset],
]);
const explorer = {
  classList: { contains: name => classes.has(name), add: name => classes.add(name) },
  querySelector: selector => selectors.get(selector) ?? null,
  querySelectorAll: selector => selector === '[data-library-entry]' ? entries : [],
};
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).find(script => script.includes('data-library-explorer'));
assert.ok(script, 'The catalogue filter must be shipped.');
vm.runInNewContext(script, {
  document: { querySelectorAll: () => [explorer], addEventListener() {} },
  window: { matchMedia: () => ({ matches: false }) },
});
const visible = () => entries.filter(entry => !entry.hidden).map(entry => entry.id).sort();
for (const paper of papers) {
  search.value = `  ${paper.doi.toUpperCase()}  `;
  search.dispatch('input');
  assert.deepEqual(visible(), [paper.slug], 'Case-insensitive DOI search must isolate its paper.');
  assert.equal(counter.textContent, '1 paper');
}
search.value = 'no-paper-matches-this-query';
search.dispatch('input');
assert.deepEqual(visible(), []);
assert.equal(noResults.hidden, false);
reset.dispatch('click');
assert.equal(visible().length, papers.length);
assert.equal(noResults.hidden, true);
category.value = 'pam';
category.dispatch('change');
assert.deepEqual(visible(), papers.filter(paper => paper.category === 'pam').map(paper => paper.slug).sort());
reset.dispatch('click');
assert.equal(visible().length, papers.length);
console.log(`PASS: ${pageCount} English page shells, ${papers.length} papers, source downloads, Weekly Reports homepage controls, search and filters.`);
