import { journalPermissions } from '../lib/permissions';
import { REPORT_SECTIONS, linkSegments, reportImageIds, reportLabel, validReportId, type ReportBlock, type ReportContent, type ReportSection, type ReportSummary, type ReportView } from '../lib/reports';

const root = document.getElementById('weeklyReports');
if (root) initializeReports(root);

function initializeReports(root: HTMLElement) {
  function select<T extends HTMLElement>(selector: string) { return root.querySelector<T>(selector)!; }
  const list = select<HTMLElement>('#reportList');
  const count = select<HTMLElement>('#reportCount');
  const message = select<HTMLElement>('#weeklyMessage');
  const retry = select<HTMLButtonElement>('#retryReports');
  const panel = select<HTMLElement>('#reportContent');
  const paper = select<HTMLElement>('#reportPaper');
  const fields = select<HTMLFieldSetElement>('#reportFields');
  const status = select<HTMLElement>('#reportSaveStatus');
  const newButton = select<HTMLButtonElement>('#newReport');
  const saveButton = select<HTMLButtonElement>('#saveReport');
  const publishButton = select<HTMLButtonElement>('#publishReport');
  const unpublishButton = select<HTMLButtonElement>('#unpublishReport');
  const reloadButton = select<HTMLButtonElement>('#reloadReport');
  const previewButton = select<HTMLButtonElement>('#previewReport');
  const exportButton = select<HTMLButtonElement>('#exportReport');
  let editing = journalPermissions.editing;
  let reports: ReportSummary[] = [];
  let current: ReportView | null = null;
  let content: ReportContent | null = null;
  let dirty = false;
  let busy = false;
  let preview = false;
  let conflict = false;
  let manualLockRequested = false;
  let listRequest = 0;
  let detailRequest = 0;
  let pendingCreateId: string | null = null;
  let disposed = false;
  const hashId = location.hash.slice(1);
  const initialId = validReportId(hashId) ? hashId : undefined;

  function node<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }
  function button(text: string, action: () => void, label?: string) {
    const element = node('button', '', text);
    element.type = 'button';
    if (label) element.setAttribute('aria-label', label);
    element.addEventListener('click', action);
    return element;
  }
  function showMessage(text: string, error = false, canRetry = false) {
    message.textContent = text;
    message.dataset.error = String(error);
    retry.hidden = !canRetry;
  }
  function showStatus(text: string, error = false) {
    status.textContent = text;
    status.dataset.error = String(error);
  }
  function reportState(report: Pick<ReportView, 'publishedAt' | 'hasUnpublishedChanges'>) {
    return !report.publishedAt ? 'Draft' : report.hasUnpublishedChanges ? 'Unpublished changes' : 'Published';
  }
  function updateControls() {
    newButton.hidden = !editing;
    select<HTMLElement>('#reportOwnerActions').hidden = !editing;
    newButton.disabled = busy;
    saveButton.disabled = busy || !editing || !current || conflict;
    publishButton.disabled = busy || !editing || !current || conflict;
    unpublishButton.hidden = !current?.publishedAt;
    unpublishButton.disabled = busy || conflict;
    reloadButton.hidden = !conflict;
    reloadButton.disabled = busy;
    previewButton.disabled = busy;
    previewButton.textContent = preview ? 'Edit' : 'Preview';
    previewButton.setAttribute('aria-pressed', String(preview));
    publishButton.textContent = current?.publishedAt ? 'Update publication' : 'Publish';
    exportButton.disabled = busy || !current;
    fields.disabled = busy || !editing;
    for (const item of list.querySelectorAll<HTMLButtonElement>('button')) item.disabled = busy;
    const state = select<HTMLElement>('#reportState');
    state.textContent = current ? (dirty && current.publishedAt ? 'Unpublished changes' : editing || dirty ? reportState(current) : 'Published') : '';
  }
  function setBusy(value: boolean) { busy = value; updateControls(); }
  function markDirty() {
    dirty = true;
    updateControls();
    showStatus(conflict ? 'This report changed on another device. Export your edits before reloading the saved version.' : 'Unsaved changes');
  }
  function discardChanges() {
    return !dirty || window.confirm('Discard unsaved changes to this report?');
  }
  function appendLinkedText(element: HTMLElement, text: string) {
    for (const segment of linkSegments(text)) {
      if (segment.url) {
        const anchor = node('a', '', segment.text);
        anchor.href = segment.url; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer';
        element.append(anchor);
      } else element.append(document.createTextNode(segment.text));
    }
  }
  function imageUrl(reportId: string, imageId: string) {
    return `/api/reports/${encodeURIComponent(reportId)}/images/${encodeURIComponent(imageId)}`;
  }
  async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const permissionRevision = journalPermissions.revision;
    const response = await fetch(url, { cache: 'no-store', ...init });
    let data: Record<string, unknown>;
    try { data = await response.json(); }
    catch { throw new Error('The server returned an unexpected response. Please retry.'); }
    if (!response.ok) {
      if (response.status === 401) journalPermissions.deny(permissionRevision);
      if (response.status === 409) { conflict = true; updateControls(); }
      throw new Error(typeof data.error === 'string' ? data.error : 'Could not complete the request. Please retry.');
    }
    return data as T;
  }
  function renderList() {
    list.replaceChildren(); count.textContent = String(reports.length);
    for (const report of reports) {
      const item = button('', () => { if (!busy && report.id !== current?.id && discardChanges()) void loadReport(report.id); });
      item.className = 'report-index-item';
      item.setAttribute('aria-label', `${reportLabel(report.number)}${report.title ? ` — ${report.title}` : ''}`);
      if (report.id === current?.id) item.setAttribute('aria-current', 'page');
      const label = node('span', 'report-index-label', reportLabel(report.number)); label.lang = 'zh-CN'; item.append(label);
      if (report.title) { const title = node('span', 'report-index-title', report.title); title.lang = 'zh-CN'; item.append(title); }
      const metadata = node('span', 'report-index-meta');
      if (report.date) metadata.append(node('span', '', report.date));
      if (editing) metadata.append(node('span', '', reportState(report)));
      if (metadata.childElementCount) item.append(metadata);
      item.disabled = busy; list.append(item);
    }
  }
  function acceptReport(report: ReportView) {
    current = report; content = structuredClone(report.content); dirty = false; conflict = false;
    const { content: reportContent, revision: _revision, ...summary } = report;
    reports = [...reports.filter(item => item.id !== report.id), { ...summary, title: reportContent.title, date: reportContent.date }].sort((a, b) => b.number - a.number);
    history.replaceState(null, '', `${location.pathname}${location.search}#${encodeURIComponent(report.id)}`);
    showMessage(''); panel.hidden = false;
    select<HTMLElement>('#reportLabel').textContent = reportLabel(report.number);
    showStatus(editing ? (report.updatedAt ? 'Saved to cloud' : '') : '');
    renderList(); renderPaper(); updateControls();
  }
  async function loadList(preferredId?: string, keepCurrent = false) {
    const requestId = ++listRequest, permissionRevision = journalPermissions.revision;
    if (!keepCurrent) showMessage('Loading reports…');
    try {
      const data = await request<{ editing: boolean; reports: ReportSummary[] }>('/api/reports');
      if (disposed || requestId !== listRequest || permissionRevision !== journalPermissions.revision) return;
      if (data.editing !== editing) { journalPermissions.applyRead(data.editing, permissionRevision, 'session'); return; }
      reports = data.reports; renderList(); updateControls();
      if (keepCurrent && current) { showMessage(''); return; }
      const selected = reports.find(item => item.id === preferredId) ?? reports[0];
      if (selected) await loadReport(selected.id);
      else {
        current = null; content = null; panel.hidden = true; dirty = false;
        showMessage(editing ? 'No reports yet.' : 'No published reports yet.');
      }
    } catch (error) {
      if (disposed || requestId !== listRequest) return;
      showMessage(error instanceof Error ? error.message : 'Could not load reports.', true, true);
    }
  }
  async function loadReport(id: string) {
    const requestId = ++detailRequest, permissionRevision = journalPermissions.revision;
    setBusy(true);
    showMessage('Loading report…');
    try {
      const data = await request<{ editing: boolean; report: ReportView }>(`/api/reports/${encodeURIComponent(id)}?version=${editing ? 'draft' : 'published'}`);
      if (disposed || requestId !== detailRequest || permissionRevision !== journalPermissions.revision) return;
      acceptReport(data.report);
    } catch (error) {
      if (disposed || requestId !== detailRequest) return;
      showMessage(error instanceof Error ? error.message : 'Could not load the report.', true, true);
    } finally { if (requestId === detailRequest) setBusy(false); }
  }
  function textField(labelText: string, value: string, onInput: (value: string) => void, options: { type?: string; maxLength?: number; className?: string; placeholder?: string } = {}) {
    const label = node('label');
    label.append(node('span', 'paper-field-label', labelText));
    const input = node('input', `paper-input ${options.className ?? ''}`);
    input.type = options.type ?? 'text'; input.value = value;
    if (input.type === 'date') { input.min = '1900-01-01'; input.max = '2200-12-31'; }
    if (options.maxLength) input.maxLength = options.maxLength;
    if (options.placeholder) input.placeholder = options.placeholder;
    input.addEventListener('input', () => { onInput(input.value); markDirty(); });
    label.append(input); return label;
  }
  function renderPaper() {
    paper.replaceChildren();
    if (!current || !content) return;
    const canEdit = editing && !preview;
    if (canEdit) {
      const title = node('input', 'paper-input paper-title-input');
      title.type = 'text'; title.value = content.title; title.maxLength = 240;
      title.setAttribute('aria-label', '周报标题'); title.placeholder = '周报标题';
      title.addEventListener('input', () => { content!.title = title.value; markDirty(); });
      paper.append(title);
    } else paper.append(node('div', 'paper-title', content.title));
    const metadata = node('div', 'paper-metadata');
    if (canEdit) {
      metadata.append(textField('姓名', content.author, value => { content!.author = value; }, { maxLength: 120, placeholder: '姓名' }));
      metadata.append(textField('日期', content.date, value => { content!.date = value; }, { type: 'date' }));
    } else {
      if (content.author) metadata.append(node('span', '', content.author));
      if (content.date) { const [year, month, day] = content.date.split('-'); metadata.append(node('span', '', `${year} 年 ${Number(month)} 月 ${Number(day)} 日`)); }
    }
    paper.append(metadata);
    for (const section of REPORT_SECTIONS) {
      if (section.key === 'summary') paper.append(node('h2', '', '2. 本周工作总结及问题'));
      const container = node('section', 'report-section');
      const headingId = `weekly-section-${section.key}`;
      container.setAttribute('aria-labelledby', headingId);
      const heading = node(section.key === 'summary' || section.key === 'issues' ? 'h3' : 'h2', '', section.title);
      heading.id = headingId; container.append(heading);
      const body = node('div', 'report-section-body');
      if (canEdit) {
        const blocks = content.sections[section.key];
        if (!blocks.length) body.append(renderEditorBlock(section.key, { kind: 'paragraph', text: '' }, 0, true));
        else blocks.forEach((block, index) => body.append(renderEditorBlock(section.key, block, index)));
        const add = node('div', 'block-add');
        add.append(button('+ Paragraph', () => addBlock(section.key, { kind: 'paragraph', text: '' })));
        add.append(button('+ Numbered list', () => addBlock(section.key, { kind: 'list', items: [''] })));
        add.append(button('+ Image', () => chooseImage(section.key)));
        body.append(add);
      } else for (const block of content.sections[section.key]) body.append(renderBlock(block));
      container.append(body); paper.append(container);
    }
  }
  function renderBlock(block: ReportBlock) {
    if (block.kind === 'paragraph') { const paragraph = node('p'); appendLinkedText(paragraph, block.text); return paragraph; }
    if (block.kind === 'list') {
      const ordered = node('ol');
      for (const text of block.items) { const item = node('li'); appendLinkedText(item, text); ordered.append(item); }
      return ordered;
    }
    const figure = node('figure', 'report-figure');
    const image = node('img'); image.src = imageUrl(current!.id, block.imageId); image.alt = block.alt;
    image.loading = 'lazy'; image.decoding = 'async';
    image.addEventListener('error', () => { image.hidden = true; figure.prepend(node('p', 'image-failure', 'Image unavailable. Please reload the report.')); }, { once: true });
    figure.append(image);
    if (block.caption) { const caption = node('figcaption'); appendLinkedText(caption, block.caption); figure.append(caption); }
    return figure;
  }
  function renderEditorBlock(section: ReportSection, block: ReportBlock, index: number, virtual = false) {
    const wrapper = node('div', 'report-block');
    wrapper.dataset.section = section; wrapper.dataset.index = String(index);
    const bar = node('div', 'block-bar');
    bar.append(node('span', '', block.kind === 'paragraph' ? 'Text · paste URLs to add links' : block.kind === 'list' ? 'Numbered list · one item per line' : 'Image'));
    if (!virtual) {
      const tools = node('div', 'block-tools');
      const up = button('↑', () => moveBlock(section, index, -1), 'Move block up'); up.disabled = index === 0;
      const down = button('↓', () => moveBlock(section, index, 1), 'Move block down'); down.disabled = index >= content!.sections[section].length - 1;
      tools.append(up, down, button('Remove', () => {
        content!.sections[section].splice(index, 1); markDirty(); renderPaper(); focusSection(section);
      }, 'Remove this block'));
      bar.append(tools);
    }
    wrapper.append(bar);
    if (block.kind === 'paragraph' || block.kind === 'list') {
      const textarea = node('textarea', `block-textarea${block.kind === 'list' ? ' list-textarea' : ''}`);
      textarea.rows = 3; textarea.value = block.kind === 'paragraph' ? block.text : block.items.join('\n');
      textarea.maxLength = block.kind === 'paragraph' ? 20_000 : 100_000;
      textarea.setAttribute('aria-label', `${REPORT_SECTIONS.find(item => item.key === section)!.title} — ${block.kind === 'list' ? '编号列表' : '正文'} ${index + 1}`);
      textarea.addEventListener('input', () => {
        if (virtual && !content!.sections[section].length) content!.sections[section].push(block);
        if (block.kind === 'paragraph') block.text = textarea.value;
        else block.items = textarea.value.split('\n');
        markDirty();
      });
      wrapper.append(textarea);
    } else {
      wrapper.append(renderBlock(block));
      const metadata = node('div', 'image-editor-meta');
      metadata.append(textField('图片说明', block.caption, value => { block.caption = value; }, { maxLength: 2000 }));
      metadata.append(textField('替代文本（用于无障碍阅读）', block.alt, value => { block.alt = value; }, { maxLength: 500 }));
      wrapper.append(metadata);
    }
    return wrapper;
  }
  function focusSection(section: ReportSection, index?: number) {
    const scope = index === undefined ? paper.querySelector(`#weekly-section-${section}`)?.parentElement : paper.querySelector(`[data-section="${section}"][data-index="${index}"]`);
    scope?.querySelector<HTMLTextAreaElement | HTMLInputElement>('textarea,input')?.focus();
  }
  function addBlock(section: ReportSection, block: ReportBlock) {
    if (!content || busy || !editing) return;
    if (content.sections[section].length >= 100) { showStatus('Use at most 100 blocks in each section.', true); return; }
    content.sections[section].push(block); markDirty(); renderPaper(); focusSection(section, content.sections[section].length - 1);
  }
  function moveBlock(section: ReportSection, index: number, direction: -1 | 1) {
    const blocks = content!.sections[section], target = index + direction;
    if (target < 0 || target >= blocks.length || busy) return;
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    markDirty(); renderPaper(); focusSection(section, target);
  }
  function chooseImage(section: ReportSection) {
    if (busy || !editing || !current || !content) return;
    if (reportImageIds(content).length >= 20) { showStatus('A report can contain at most 20 images.', true); return; }
    const input = node('input'); input.type = 'file'; input.accept = 'image/png,image/jpeg';
    input.addEventListener('change', () => { if (input.files?.[0]) void uploadImage(section, input.files[0]); }, { once: true });
    input.click();
  }
  async function uploadImage(section: ReportSection, file: File) {
    if (!current || !content || busy || !editing) return;
    if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 4_000_000) { showStatus('Choose a PNG or JPEG image smaller than 4 MB.', true); return; }
    const reportId = current.id;
    setBusy(true); showStatus('Uploading image…');
    try {
      const data = await request<{ image: { id: string } }>(`/api/reports/${encodeURIComponent(reportId)}/images`, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
      if (current?.id !== reportId) return;
      content.sections[section].push({ kind: 'image', imageId: data.image.id, alt: '', caption: '' });
      markDirty(); renderPaper(); focusSection(section, content.sections[section].length - 1);
    } catch (error) { showStatus(error instanceof Error ? error.message : 'Could not upload the image. Please retry.', true); }
    finally { setBusy(false); }
  }
  async function saveReport(action: 'save' | 'publish' | 'unpublish') {
    if (!current || !content || !editing || busy || conflict) return;
    if (action === 'unpublish' && !window.confirm('Unpublish this report? Visitors will no longer be able to view it.')) return;
    const reportId = current.id, localContent = structuredClone(content), wasDirty = dirty;
    setBusy(true); showStatus(action === 'publish' ? 'Publishing…' : action === 'unpublish' ? 'Unpublishing…' : 'Saving draft…');
    try {
      const data = await request<{ report: ReportView }>(`/api/reports/${encodeURIComponent(reportId)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, revision: current.revision, ...(action === 'unpublish' ? {} : { content: localContent }) }) });
      if (disposed || current?.id !== reportId) return;
      acceptReport(data.report);
      if (action === 'unpublish' && wasDirty) { content = localContent; dirty = true; renderPaper(); }
      showStatus(action === 'publish' ? 'Published' : action === 'unpublish' ? (dirty ? 'Unpublished · unsaved changes remain in this tab' : 'Unpublished') : 'Draft saved to cloud');
    } catch (error) { showStatus(error instanceof Error ? error.message : 'Could not save. Your changes remain in this tab.', true); }
    finally { setBusy(false); }
  }
  async function createReport() {
    if (!editing || busy || !discardChanges()) return;
    setBusy(true); showMessage('Creating report…');
    pendingCreateId ??= crypto.randomUUID();
    try {
      const data = await request<{ report: ReportView }>('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create', requestId: pendingCreateId }) });
      pendingCreateId = null; preview = false; acceptReport(data.report); showStatus('Draft saved to cloud');
      paper.querySelector<HTMLInputElement>('.paper-title-input')?.focus();
    } catch (error) { showMessage(error instanceof Error ? error.message : 'Could not create a report. Please retry.', true); }
    finally { setBusy(false); }
  }
  async function exportWord() {
    if (!current || !content || busy) return;
    const report = current, snapshot = structuredClone(content);
    setBusy(true); showStatus('Preparing Word document…');
    try {
      const images = new Map<string, { bytes: Uint8Array; mime: string; width: number; height: number }>();
      for (const imageId of reportImageIds(snapshot)) {
        const response = await fetch(imageUrl(report.id, imageId), { cache: 'no-store' });
        if (!response.ok) throw new Error('An image could not be downloaded. Reload or unlock editing, then retry the export.');
        const bytes = new Uint8Array(await response.arrayBuffer());
        const mime = (response.headers.get('content-type') ?? '').split(';')[0];
        const width = Number(response.headers.get('x-image-width')), height = Number(response.headers.get('x-image-height'));
        if (!width || !height) throw new Error('An image is missing its dimensions. Please retry the export.');
        images.set(imageId, { bytes, mime, width, height });
      }
      const { buildWeeklyReportDocx } = await import('../lib/report-docx');
      const bytes = await buildWeeklyReportDocx(snapshot, images);
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
      const anchor = node('a'); anchor.href = url;
      anchor.download = `${(snapshot.title || reportLabel(report.number)).replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').slice(0, 100)}.docx`;
      document.body.append(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
      showStatus(dirty ? 'Word exported · unsaved changes remain in this tab' : 'Word exported');
    } catch (error) { showStatus(error instanceof Error ? error.message : 'Could not export the Word document. Please retry.', true); }
    finally { setBusy(false); }
  }

  newButton.addEventListener('click', () => void createReport());
  saveButton.addEventListener('click', () => void saveReport('save'));
  publishButton.addEventListener('click', () => void saveReport('publish'));
  unpublishButton.addEventListener('click', () => void saveReport('unpublish'));
  reloadButton.addEventListener('click', () => { if (current && !busy && discardChanges()) void loadReport(current.id); });
  retry.addEventListener('click', () => { if (!busy) void loadList(current?.id, dirty); });
  previewButton.addEventListener('click', () => { if (busy) return; preview = !preview; renderPaper(); updateControls(); });
  exportButton.addEventListener('click', () => void exportWord());
  select<HTMLFormElement>('#weeklyReportForm').addEventListener('submit', event => { event.preventDefault(); });

  const beforeUnload = (event: BeforeUnloadEvent) => {
    if (dirty || busy) { event.preventDefault(); event.returnValue = ''; }
  };
  const beforeLock = (event: Event) => {
    if (busy || !discardChanges()) { event.preventDefault(); return; }
    manualLockRequested = true;
  };
  const lockFailed = () => { manualLockRequested = false; };
  window.addEventListener('beforeunload', beforeUnload);
  document.addEventListener('journal:before-lock', beforeLock);
  document.addEventListener('journal:lock-failed', lockFailed);
  const unsubscribe = journalPermissions.subscribe(update => {
    const changed = editing !== update.editing;
    editing = update.editing; updateControls();
    if (!changed || disposed) return;
    ++listRequest; ++detailRequest;
    setBusy(false);
    const preferredId = current?.id ?? initialId;
    const discardOnLock = manualLockRequested && !editing && update.source === 'action';
    if (dirty && !discardOnLock) {
      renderPaper(); updateControls();
      showStatus(editing ? 'Unsaved changes · save to sync across devices' : 'Editing is locked. Your changes remain in this tab; unlock to save them.', !editing);
      void loadList(current?.id, true);
    } else {
      dirty = false; conflict = false; current = null; content = null; panel.hidden = true; preview = false;
      paper.replaceChildren(); reports = []; renderList();
      void loadList(preferredId);
    }
    manualLockRequested = false;
  });
  updateControls();
  void loadList(initialId);
  document.addEventListener('astro:before-swap', () => {
    disposed = true; ++listRequest; ++detailRequest; unsubscribe();
    window.removeEventListener('beforeunload', beforeUnload);
    document.removeEventListener('journal:before-lock', beforeLock);
    document.removeEventListener('journal:lock-failed', lockFailed);
  }, { once: true });
}
