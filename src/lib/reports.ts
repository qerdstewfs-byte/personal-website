export const REPORT_SECTIONS = [
  { key: 'topic', title: '1. 现阶段工作主题' },
  { key: 'summary', title: '2.1 工作总结' },
  { key: 'issues', title: '2.2 遇到问题' },
  { key: 'plan', title: '3. 下周工作计划' },
  { key: 'discussion', title: '4. 讨论结果' },
] as const;
export type ReportSection = typeof REPORT_SECTIONS[number]['key'];
export type ReportBlock = { kind: 'paragraph'; text: string } | { kind: 'list'; items: string[] } | { kind: 'image'; imageId: string; alt: string; caption: string };
export type ReportContent = { title: string; author: string; date: string; sections: Record<ReportSection, ReportBlock[]> };
export type ReportView = { id: string; number: number; revision: number; updatedAt: string; publishedAt: string | null; hasUnpublishedChanges: boolean; content: ReportContent };
export type ReportSummary = Omit<ReportView, 'content' | 'revision'> & { title: string; date: string };
export type StoredReport = { id: string; number: number; revision: number; createdAt: string; updatedAt: string; draft: ReportContent; published: { content: ReportContent; at: string } | null };
export type ReportImage = { id: string; reportId: string; mime: 'image/png' | 'image/jpeg'; width: number; height: number; bytes: number };
export type ReportStore = { schemaVersion: 1; reports: Record<string, StoredReport>; images: Record<string, ReportImage> };
export class ReportError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.name = 'ReportError'; this.status = status; }
}
export const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
export function validReportId(value: string) { return value === 'report-1' || (value.startsWith('report-') && UUID_PATTERN.test(value.slice(7))); }
export function emptyReportContent(): ReportContent { return { title: '', author: '', date: '', sections: { topic: [], summary: [], issues: [], plan: [], discussion: [] } }; }
export function initialReportStore(): ReportStore {
  return { schemaVersion: 1, images: {}, reports: { 'report-1': { id: 'report-1', number: 1, revision: 0, createdAt: '', updatedAt: '', draft: emptyReportContent(), published: null } } };
}
export function reportLabel(number: number) {
  const digits = '零一二三四五六七八九';
  if (number < 10) return `周报${digits[number]}`;
  if (number < 100) return `周报${number >= 20 ? digits[Math.floor(number / 10)] : ''}十${number % 10 ? digits[number % 10] : ''}`;
  return `周报${number}`;
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ReportError('Invalid report content.');
  return value as Record<string, unknown>;
}
function text(value: unknown, limit: number): string {
  if (typeof value !== 'string' || value.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new ReportError(`Use text shorter than ${limit.toLocaleString('en')} characters.`);
  return value.replace(/\r\n?/g, '\n');
}
export function validateReportContent(value: unknown): ReportContent {
  const input = object(value), sections = object(input.sections);
  const result = emptyReportContent();
  result.title = text(input.title, 240); result.author = text(input.author, 120); result.date = text(input.date, 10);
  if (result.date && (!/^\d{4}-\d{2}-\d{2}$/.test(result.date) || !Number.isFinite(Date.parse(`${result.date}T12:00:00Z`)) || new Date(`${result.date}T12:00:00Z`).toISOString().slice(0, 10) !== result.date || result.date < '1900-01-01' || result.date > '2200-12-31')) throw new ReportError('Use a valid report date.');
  let totalCharacters = 0, totalImages = 0;
  for (const { key } of REPORT_SECTIONS) {
    const blocks = sections[key];
    if (!Array.isArray(blocks) || blocks.length > 100) throw new ReportError('Use at most 100 blocks in each section.');
    result.sections[key] = blocks.map(value => {
      const block = object(value);
      if (block.kind === 'paragraph') {
        const content = text(block.text, 20_000); totalCharacters += content.length;
        return { kind: 'paragraph', text: content };
      }
      if (block.kind === 'list') {
        if (!Array.isArray(block.items) || block.items.length > 100) throw new ReportError('Use at most 100 numbered items per list.');
        const items = block.items.map(item => text(item, 10_000));
        totalCharacters += items.reduce((sum, item) => sum + item.length, 0);
        return { kind: 'list', items };
      }
      if (block.kind === 'image') {
        if (typeof block.imageId !== 'string' || !UUID_PATTERN.test(block.imageId)) throw new ReportError('Use an uploaded report image.');
        totalImages++;
        return { kind: 'image', imageId: block.imageId, alt: text(block.alt, 500), caption: text(block.caption, 2000) };
      }
      throw new ReportError('Unsupported report block.');
    });
  }
  if (totalCharacters > 100_000) throw new ReportError('A report can contain at most 100,000 text characters.');
  if (totalImages > 20) throw new ReportError('A report can contain at most 20 images.');
  return result;
}
export function reportImageIds(content: ReportContent) {
  return [...new Set(REPORT_SECTIONS.flatMap(({ key }) => content.sections[key].flatMap(block => block.kind === 'image' ? [block.imageId] : [])))];
}
export function projectReport(report: StoredReport, editing: boolean, version?: string): ReportView | null {
  if (version && version !== 'draft' && version !== 'published') throw new ReportError('Unknown report version.');
  const draft = editing && version !== 'published';
  if ((!editing && version === 'draft') || (!draft && !report.published)) return null;
  return {
    id: report.id, number: report.number, revision: draft ? report.revision : 0,
    updatedAt: draft ? report.updatedAt : report.published!.at, publishedAt: report.published?.at ?? null,
    hasUnpublishedChanges: draft && (!report.published || JSON.stringify(report.draft) !== JSON.stringify(report.published.content)),
    content: structuredClone(draft ? report.draft : report.published!.content),
  };
}
export function reportSummaries(store: ReportStore, editing: boolean): ReportSummary[] {
  return Object.values(store.reports).sort((a, b) => b.number - a.number).flatMap(report => {
    const view = projectReport(report, editing); if (!view) return [];
    const { content, revision: _revision, ...summary } = view;
    return [{ ...summary, title: content.title, date: content.date }];
  });
}
export function applyReportAction(store: ReportStore, id: string | null, input: Record<string, unknown>, now: string): ReportStore {
  if (input.action === 'create' && id === null) {
    if (typeof input.requestId !== 'string' || !UUID_PATTERN.test(input.requestId)) throw new ReportError('Invalid report creation request.');
    const newId = `report-${input.requestId}`;
    if (store.reports[newId]) return store;
    const reports = Object.values(store.reports);
    if (reports.length >= 1000) throw new ReportError('The report collection has reached 1,000 entries.');
    store.reports[newId] = { id: newId, number: Math.max(...reports.map(item => item.number)) + 1, revision: 0, createdAt: now, updatedAt: now, draft: emptyReportContent(), published: null };
    return store;
  }
  if (!id || !validReportId(id) || !Object.hasOwn(store.reports, id)) throw new ReportError('Report not found.', 404);
  const report = store.reports[id];
  if (!Number.isSafeInteger(input.revision) || input.revision !== report.revision) throw new ReportError('This report changed on another device. Your unsaved text is still here. Reload the saved version before trying again.', 409);
  if (input.action === 'save' || input.action === 'publish') {
    const content = validateReportContent(input.content);
    for (const imageId of reportImageIds(content)) {
      if (store.images[imageId]?.reportId !== id) throw new ReportError('An image is unavailable for this report. Upload it again.');
    }
    report.draft = content;
    if (input.action === 'publish') report.published = { content: structuredClone(content), at: now };
  } else if (input.action === 'unpublish') {
    report.published = null;
  } else throw new ReportError('Unknown report action.');
  report.revision++; report.updatedAt = now; report.createdAt ||= now;
  return store;
}
export function canReadReportImage(store: ReportStore, reportId: string, imageId: string, editing: boolean) {
  const image = store.images[imageId];
  if (!image || image.reportId !== reportId || !Object.hasOwn(store.reports, reportId)) return false;
  return editing || Boolean(store.reports[reportId].published && reportImageIds(store.reports[reportId].published!.content).includes(imageId));
}

/** Plain text stays escaped; only real HTTP(S) URLs become clickable links. */
export function linkSegments(value: string): Array<{ text: string; url?: string }> {
  const segments: Array<{ text: string; url?: string }> = [];
  let cursor = 0;
  for (const match of value.matchAll(/https?:\/\/[^\s<>"'，。；：！？、“”‘’（）【】《》\u0000-\u001f]+/gi)) {
    let candidate = match[0].replace(/[.,;:!?，。；：！？、]+$/, '');
    while (candidate.endsWith(')') && (candidate.match(/\)/g)?.length ?? 0) > (candidate.match(/\(/g)?.length ?? 0)) candidate = candidate.slice(0, -1);
    try {
      const parsed = new URL(candidate);
      if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || !parsed.hostname) continue;
      if (match.index > cursor) segments.push({ text: value.slice(cursor, match.index) });
      segments.push({ text: candidate, url: parsed.href });
      cursor = match.index + candidate.length;
    } catch { /* Invalid URLs remain plain text. */ }
  }
  if (cursor < value.length) segments.push({ text: value.slice(cursor) });
  return segments.length ? segments : [{ text: value }];
}
