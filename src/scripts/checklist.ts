import { beijingDate, shiftDate, DEFAULT_TASKS } from '../lib/journal';
import type { Task, DayRecord, JournalPayload } from '../lib/journal';
import { CheckmarkBuffer } from '../lib/checkmarks';
import { formatJournalDate as format, beijingHour, formatSavedTime } from '../lib/journal-dates';
import { journalPermissions } from '../lib/permissions';

const CATEGORIES = ['Research', 'English', 'Development'] as const;
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['M','T','W','T','F','S','S'];
const MIN_YEAR = 1900;
const MAX_YEAR = 2200;

function initJournal() {
  const root = document.getElementById('dailyBoard');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
  const noteField = $<HTMLTextAreaElement>('dayNote');
  const editor = $<HTMLDialogElement>('taskEditor');
  const resetDialog = $<HTMLDialogElement>('resetDialog');
  const conflictDialog = $<HTMLDialogElement>('noteConflict');
  const listeners = new AbortController();
  let today = beijingDate();
  const hashDate = new URLSearchParams(location.hash.slice(1)).get('date');
  let selectedDate = validDate(hashDate) ? hashDate! : today;
  let displayedYear = Number(selectedDate.slice(0, 4));
  let template: Task[] = DEFAULT_TASKS.map(task => ({ ...task }));
  const records: Record<string, DayRecord> = {};
  const loadedYears = new Set<number>();
  let editing = false;
  let cloud = false;
  let connected = false;
  let loading = false;
  let pending = 0;
  let noteDirty = false;
  let noteFailed = false;
  let noteConflict = false;
  let noteBaseRevision = 0;
  let editorBaseRevision = 0;
  let conflictRecord: DayRecord | undefined;
  let noteTimer: ReturnType<typeof setTimeout> | undefined;
  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  let queue: Promise<unknown> = Promise.resolve();
  let noteFlush: Promise<boolean> | null = null;
  let loadVersion = 0;
  let dataVersion = 0;
  let lastError = '';
  let navigating = false;
  const checkmarks = new CheckmarkBuffer();
  let checkTimer: ReturnType<typeof setTimeout> | undefined;
  let checkFlush: Promise<boolean> | null = null;
  let checkFailed = false;
  let calendarBuiltYear = 0;
  const calendarButtons = new Map<string, HTMLButtonElement>();
  const calendarStates = new Map<string, string>();
  let taskSignature = '';
  let weekEndDate = '';

  function validDate(value: string | null): value is string {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const year = Number(value.slice(0,4));
    const parsed = new Date(`${value}T12:00:00Z`);
    return year >= MIN_YEAR && year <= MAX_YEAR && !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0,10) === value;
  }

  function record(date = selectedDate) { return checkmarks.overlay(date, records[date], template); }
  function tasks(date = selectedDate) { return record(date)?.tasks ?? template; }
  function orderedTasks() {
    const list = tasks();
    return [...CATEGORIES.flatMap(category => list.filter(task => task.category === category)), ...list.filter(task => !CATEGORIES.includes(task.category as typeof CATEGORIES[number]))];
  }
  function stats(day?: DayRecord) {
    const total = day?.tasks.length ?? 0;
    const done = day?.tasks.filter(task => day.checked[task.id] === true).length ?? 0;
    return { done, total, percent: total ? Math.round(done / total * 100) : 0 };
  }
  function canEdit() { return editing && cloud && connected && hasLoaded() && selectedDate <= today && !loading; }
  function hasLoaded(date = selectedDate) { return loadedYears.has(Number(date.slice(0,4))); }
  function announce(message: string) {
    $('journalToast').textContent = message;
    $('journalToast').classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('journalToast').classList.remove('show'), 4000);
  }
  function make(tag: string, className?: string, content?: string) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }

  function drawTasks() {
    const container = $('taskList');
    const activeTasks = tasks();
    const signature = JSON.stringify([selectedDate,activeTasks]);
    container.setAttribute('aria-busy', String(loading));
    // Preserve button nodes and keyboard focus while cloud requests run.
    if (taskSignature === signature) {
      for (const button of container.querySelectorAll<HTMLButtonElement>('button[data-task-id]')) {
        const task = activeTasks.find(task => task.id === button.dataset.taskId)!;
        const checked = record()?.checked[task.id] === true;
        button.classList.toggle('checked',checked);
        button.disabled = !canEdit();
        button.setAttribute('aria-pressed',String(checked));
        button.setAttribute('aria-label',`${checked ? 'Completed' : 'Incomplete'}: ${task.title}`);
        button.querySelector('.checkbox')!.textContent = checked ? '✓' : '';
      }
      for (const group of container.querySelectorAll<HTMLElement>('[data-category]')) {
        const list = activeTasks.filter(task => task.category === group.dataset.category);
        group.querySelector('.group-count')!.textContent = `${list.filter(task => record()?.checked[task.id]).length} / ${list.length}`;
      }
      return;
    }
    taskSignature = signature;
    container.replaceChildren();
    let index = 0;
    const categories = [...CATEGORIES, ...new Set(activeTasks.map(task => task.category).filter(category => !CATEGORIES.includes(category as typeof CATEGORIES[number])))];
    for (const category of categories) {
      const groupTasks = activeTasks.filter(task => task.category === category);
      if (!groupTasks.length) continue;
      const group = make('div','group');
      group.dataset.category = category;
      const head = make('div','group-head');
      const name = make('span','group-name');
      const dot = make('i',`group-dot ${category.toLowerCase()}`);
      dot.setAttribute('aria-hidden','true');
      name.append(dot,document.createTextNode(category));
      head.append(name,make('span','group-count',`${groupTasks.filter(task => record()?.checked[task.id]).length} / ${groupTasks.length}`));
      group.append(head);
      for (const task of groupTasks) {
        index++;
        const checked = record()?.checked[task.id] === true;
        const button = make('button',`task${checked ? ' checked' : ''}`) as HTMLButtonElement;
        button.type = 'button';
        button.dataset.taskId = task.id;
        button.disabled = !canEdit();
        button.setAttribute('aria-pressed',String(checked));
        button.setAttribute('aria-label',`${checked ? 'Completed' : 'Incomplete'}: ${task.title}`);
        const check = make('span','checkbox',checked ? '✓' : '');
        check.setAttribute('aria-hidden','true');
        const words = make('span','task-words');
        words.append(make('span','task-title',task.title),make('span','task-detail',task.detail || ''));
        button.append(check,words,make('span','task-index',String(index).padStart(2,'0')));
        group.append(button);
      }
      container.append(group);
    }
    if (!activeTasks.length) container.append(make('p','empty-tasks','No tasks have been added to this day.'));
  }

  function drawStats() {
    const saved = record();
    const s = stats(saved);
    const total = saved ? s.total : template.length;
    const known = hasLoaded();
    $('progressRing').style.setProperty('--p',`${s.percent}%`);
    $('progressRing').setAttribute('aria-label',known ? `${s.done} of ${total} tasks completed, ${s.percent} percent` : 'Progress has not loaded');
    $('percent').textContent = known ? `${s.percent}%` : '—';
    $('doneCount').textContent = known ? `${s.done} / ${total}` : `— / ${total}`;
    $('progressFill').style.width = `${s.percent}%`;
    $('motivation').textContent = !known ? 'Connect to read this day’s progress.' : selectedDate > today ? 'This day is still ahead.' : s.percent === 100 && s.total ? 'Everything is done. Enjoy your progress!' : !s.done ? 'Your first step starts here.' : s.percent >= 70 ? 'Almost there. Keep going!' : 'Great progress. One step at a time.';
  }

  function drawWeek() {
    const container = $('weekBars');
    if (weekEndDate !== selectedDate) {
      weekEndDate = selectedDate;
      const fragment = document.createDocumentFragment();
      for (let offset = -6; offset <= 0; offset++) {
        const date = shiftDate(selectedDate,offset);
        const button = make('button','week-item') as HTMLButtonElement;
        button.type = 'button'; button.dataset.date = date;
        const track = make('span','bar-track'); track.append(make('span','bar-fill'));
        button.append(make('span','bar-value'),track,make('span','bar-label',format(date,{weekday:'short'}).slice(0,2)));
        fragment.append(button);
      }
      container.replaceChildren(fragment);
    }
    for (const button of container.querySelectorAll<HTMLButtonElement>('[data-date]')) {
      const date = button.dataset.date!;
      const saved = record(date);
      const s = stats(saved);
      const description = !hasLoaded(date) ? 'Records not loaded' : saved ? `${s.done} of ${s.total} tasks complete (${s.percent}%)` : 'No saved record';
      button.setAttribute('aria-label',`${format(date,{month:'long',day:'numeric',year:'numeric'})}: ${description}`);
      button.title = button.getAttribute('aria-label')!;
      if (date === today) button.setAttribute('aria-current','date'); else button.removeAttribute('aria-current');
      button.querySelector<HTMLElement>('.bar-fill')!.style.height = `${s.percent}%`;
      button.querySelector('.bar-value')!.textContent = saved ? `${s.percent}%` : '—';
    }
  }

  function drawCalendar(changedDates?: ReadonlySet<string>) {
    $('calendarYear').textContent = String(displayedYear);
    $<HTMLButtonElement>('previousYear').disabled = loading || displayedYear <= MIN_YEAR;
    $<HTMLButtonElement>('nextYear').disabled = loading || displayedYear >= MAX_YEAR;
    const container = $('yearMonths');
    container.setAttribute('aria-busy',String(loading));
    if (calendarBuiltYear !== displayedYear) {
    changedDates = undefined;
    calendarBuiltYear = displayedYear;
    calendarButtons.clear(); calendarStates.clear(); container.replaceChildren();
    for (let month = 0; month < 12; month++) {
      const section = make('section','calendar-month');
      const heading = make('h3',undefined,MONTH_NAMES[month]);
      heading.id = `month-${displayedYear}-${month}`;
      section.setAttribute('aria-labelledby',heading.id);
      const weekdays = make('div','month-weekdays');
      weekdays.setAttribute('aria-hidden','true');
      WEEKDAYS.forEach(day => weekdays.append(make('span',undefined,day)));
      const days = make('div','month-days');
      const startingWeekday = (new Date(Date.UTC(displayedYear,month,1)).getUTCDay() + 6) % 7;
      for (let i = 0; i < startingWeekday; i++) { const blank = make('span'); blank.setAttribute('aria-hidden','true'); days.append(blank); }
      const count = new Date(Date.UTC(displayedYear,month + 1,0)).getUTCDate();
      for (let day = 1; day <= count; day++) {
        const date = `${displayedYear}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const button = make('button','calendar-day',String(day)) as HTMLButtonElement;
        button.type = 'button';
        button.dataset.date = date;
        calendarButtons.set(date,button);
        days.append(button);
      }
      section.append(heading,weekdays,days);
      container.append(section);
    }
    }
    for (const date of changedDates ?? calendarButtons.keys()) {
      const button = calendarButtons.get(date);
      if (!button) continue;
      const saved = record(date); const s = stats(saved);
      const stateKey = JSON.stringify([Boolean(saved),s.done,s.total,Boolean(saved?.note),date === today,date > today,date === selectedDate,loading,loadedYears.has(displayedYear)]);
      if (calendarStates.get(date) === stateKey) continue;
      calendarStates.set(date,stateKey);
      button.className = ['calendar-day', ...(saved ? ['recorded'] : []), ...(s.percent > 0 && s.percent < 100 ? ['partial'] : []), ...(s.total > 0 && s.percent === 100 ? ['complete'] : []), ...(date === today ? ['today'] : []), ...(date > today ? ['future'] : []), ...(saved?.note ? ['has-note'] : [])].join(' ');
      button.disabled = loading;
      button.setAttribute('aria-pressed',String(date === selectedDate));
      if (date === today) button.setAttribute('aria-current','date'); else button.removeAttribute('aria-current');
      const state = date > today ? 'Future date, read only' : !loadedYears.has(displayedYear) ? 'Records not loaded' : saved ? `${s.done} of ${s.total} tasks complete (${s.percent}%)${saved.note ? ', with a daily note' : ''}` : 'No saved record';
      button.setAttribute('aria-label',`${format(date,{month:'long',day:'numeric',year:'numeric'})}: ${state}`);
      button.title = button.getAttribute('aria-label')!;
    }
    const savedDays = [...new Set([...Object.keys(records),...checkmarks.dates()])].filter(date => Number(date.slice(0,4)) === displayedYear).map(date => record(date)!);
    const completeDays = savedDays.filter(day => { const s = stats(day); return s.total > 0 && s.done === s.total; }).length;
    const doneTasks = savedDays.reduce((count,day) => count + stats(day).done,0);
    const notes = savedDays.filter(day => day.note.trim()).length;
    const summary = $('yearSummary');
    summary.replaceChildren();
    if (!loadedYears.has(displayedYear)) { summary.append(make('span',undefined,loading ? 'Loading recorded days…' : 'Connect to load this year’s records.')); return; }
    for (const [count,label] of [[savedDays.length,'recorded days'],[completeDays,'complete days'],[doneTasks,'completed tasks'],[notes,'daily notes']] as const) {
      const item = make('span'); item.append(make('strong',undefined,String(count)),document.createTextNode(label)); summary.append(item);
    }
  }

  function drawStatus() {
    const isFuture = selectedDate > today;
    const hour = beijingHour();
    $('greeting').textContent = selectedDate === today ? hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening' : isFuture ? 'One step at a time' : 'Your progress, remembered';
    $('dayLabel').textContent = `${selectedDate === today ? 'TODAY' : isFuture ? 'LOOKING AHEAD' : 'FROM THE ARCHIVE'} · ${format(selectedDate,{year:'numeric',month:'long',day:'numeric'}).toUpperCase()}`;
    $('selectedDayText').textContent = format(selectedDate,{weekday:'long',month:'long',day:'numeric'});
    $('selectedDaySub').textContent = `Beijing time · ${selectedDate === today ? 'A fresh step forward.' : isFuture ? 'Future dates are read only.' : 'Every small step is remembered.'}`;
    $('boardTitle').textContent = selectedDate === today ? "Today's checklist" : `${format(selectedDate,{month:'short',day:'numeric'})}'s checklist`;
    $('progressLabel').textContent = selectedDate === today ? "Today's progress" : 'Selected day’s progress';
    $('boardDescription').textContent = !hasLoaded() ? 'Saved status has not loaded. The daily task template is shown below.' : record() ? 'This day keeps its own saved task list.' : 'No saved record yet. These are the current daily tasks.';
    $('returnToday').hidden = selectedDate === today;
    $('retryLoad').hidden = !lastError;
    $('accessHint').textContent = loading ? 'Loading cloud records…' : !connected ? 'Cloud records could not be loaded. Please retry the connection.' : !cloud ? 'Cloud storage is not connected. Records cannot be saved yet.' : isFuture ? 'Future dates can be viewed. Editing opens when the date arrives in Beijing.' : editing ? 'Owner editing is active. Changes are saved to the cloud and synced across devices.' : 'Public reading · Only the owner can edit. Use Owner access in the header to make changes.';
    const busy = pending > 0 || checkmarks.pending;
    $<HTMLButtonElement>('editTasks').disabled = !canEdit() || busy;
    $<HTMLButtonElement>('resetDay').disabled = !canEdit() || busy || !stats(record()).done;
    noteField.disabled = !canEdit();
    $<HTMLButtonElement>('saveTasks').disabled = !canEdit() || pending > 0;
    $<HTMLButtonElement>('confirmReset').disabled = !canEdit() || pending > 0;
    editor.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>('input,select,button').forEach(field => { field.disabled = !canEdit() || pending > 0; });
    $<HTMLInputElement>('applyToFuture').disabled ||= selectedDate !== today;
    for (const id of ['cancelConflict','useCloudNote','keepDraftNote','cancelReset']) $<HTMLButtonElement>(id).disabled = pending > 0;
    $('retryChecks').hidden = !checkFailed || !checkmarks.pending || !canEdit();
    $('footerStatus').textContent = checkFailed && checkmarks.pending ? 'Checkmarks not saved. Your choices are kept here; retry saving.' : busy ? 'Saving changes to the cloud… You can keep checking tasks.' : lastError ? lastError : !hasLoaded() ? 'Connecting to the journal…' : record() ? `Saved in the cloud · ${record()!.updatedAt ? formatSavedTime(record()!.updatedAt) + ' Beijing' : selectedDate}` : 'No saved record for this date yet.';
    $('retryNote').hidden = !noteFailed || !canEdit();
    $<HTMLButtonElement>('retryNote').textContent = noteConflict ? 'Review versions' : 'Retry saving';
    $('saveHint').textContent = noteConflict ? 'Another device changed this note. Your draft is safe here; review both versions.' : noteFailed ? 'Note not saved. Your text is still here; retry when connected.' : noteDirty ? 'Unsaved changes · Saving shortly…' : pending > 0 ? 'Saving…' : !canEdit() ? record()?.note ? 'Saved daily note · Public reading' : 'No note saved for this date.' : record() ? 'Saved in the cloud · Notes are different every day' : 'Autosaves when you write · Notes are different every day';
  }

  function render(replaceNote = false, changedDates?: ReadonlySet<string>) {
    drawTasks(); drawStats(); drawWeek(); drawCalendar(changedDates); drawStatus();
    if (replaceNote && !noteDirty) noteField.value = record()?.note ?? '';
  }

  async function fetchYear(year: number): Promise<JournalPayload> {
    const response = await fetch(`/api/journal?year=${year}`,{cache:'no-store',credentials:'same-origin'});
    let payload: JournalPayload & {error?:string};
    try { payload = await response.json(); } catch { throw new Error('The cloud returned an unreadable response. Please retry.'); }
    if (!response.ok) throw new Error(payload.error || 'Cloud records are unavailable. Please retry.');
    if (!payload.records || !Array.isArray(payload.template)) throw new Error('Cloud data is incomplete. Please retry.');
    return payload;
  }

  function mergeYear(year: number, payload: JournalPayload) {
    for (const date of Object.keys(records)) if (Number(date.slice(0,4)) === year) delete records[date];
    Object.assign(records,payload.records);
    loadedYears.add(year);
  }

  async function load(year = displayedYear, quiet = false) {
    if (pending || checkmarks.pending || noteDirty || editor.open || resetDialog.open || conflictDialog.open) return;
    const version = ++loadVersion;
    const expectedDataVersion = dataVersion;
    const permissionRevision = journalPermissions.revision;
    loading = !quiet;
    if (!quiet) drawStatus();
    try {
      const data = await fetchYear(year);
      if (version !== loadVersion || expectedDataVersion !== dataVersion || pending || checkmarks.pending || noteDirty) return;
      mergeYear(year,data);
      template = data.template;
      journalPermissions.applyRead(data.editing,permissionRevision,'journal');
      editing = journalPermissions.editing;
      cloud = data.cloud;
      today = data.today;
      connected = true;
      lastError = '';
      // The seven-day chart can cross New Year, so retrieve the real adjacent records.
      const weekStart = shiftDate(selectedDate,-6);
      const adjacentYear = Number(weekStart.slice(0,4));
      if (adjacentYear !== Number(selectedDate.slice(0,4)) && !loadedYears.has(adjacentYear) && adjacentYear >= MIN_YEAR) {
        const adjacent = await fetchYear(adjacentYear);
        if (version !== loadVersion || expectedDataVersion !== dataVersion || pending || checkmarks.pending || noteDirty) return;
        mergeYear(adjacentYear,adjacent);
      }
    } catch (error) {
      if (version !== loadVersion || expectedDataVersion !== dataVersion) return;
      connected = false;
      lastError = error instanceof Error ? error.message : 'Cloud records could not be loaded.';
    } finally {
      if (version === loadVersion) { loading = false; render(true); }
    }
  }

  type Action = 'check'|'checks'|'note'|'reset'|'tasks';
  function write(action: Action, extra: Record<string,unknown>, date = selectedDate, acknowledged?: () => void): Promise<void> {
    if (!editing || !cloud || !connected || date > today) return Promise.reject(new Error('Owner access is required to edit this day.'));
    pending++;
    dataVersion++;
    drawTasks(); drawStatus();
    const operation = queue.then(async () => {
      const permissionRevision = journalPermissions.revision;
      const response = await fetch('/api/journal',{method:'POST',credentials:'same-origin',keepalive:action === 'note',headers:{'Content-Type':'application/json'},body:JSON.stringify({date,action,...extra})});
      const payload = await response.json() as {record?:DayRecord;template?:Task[];error?:string};
      if (!response.ok || !payload.record) {
        if (response.status === 401 || response.status === 403) journalPermissions.deny(permissionRevision);
        if (action === 'note' && response.status === 409) noteConflict = true;
        throw new Error(payload.error || 'Changes could not be saved. Please retry.');
      }
      const previous = records[date];
      if (action !== 'note' && date === selectedDate && noteDirty && noteBaseRevision === (previous?.revision ?? 0) && payload.record.note === (previous?.note ?? '')) noteBaseRevision = payload.record.revision;
      records[date] = payload.record;
      acknowledged?.();
      if (payload.template) template = payload.template;
      if (action === 'note' && date === selectedDate) {
        noteBaseRevision = payload.record.revision;
        noteConflict = false;
        noteDirty = noteField.value !== payload.record.note;
        noteFailed = false;
        // A user may keep typing, or return to the old text, while this save is in flight.
        // Compare with the acknowledged cloud note rather than the previous local record.
        if (noteDirty) { clearTimeout(noteTimer); noteTimer = setTimeout(() => { void flushNotes(); },650); }
      } else if (date === selectedDate && !noteDirty) {
        noteField.value = payload.record.note;
      }
      lastError = '';
    }).catch(error => {
      lastError = error instanceof Error ? error.message : 'Changes could not be saved. Please retry.';
      if (action === 'note' && date === selectedDate) noteFailed = true;
      throw error;
    }).finally(() => { pending--; render(false,new Set([date])); });
    queue = operation.catch(() => undefined);
    return operation;
  }

  function flushChecks(): Promise<boolean> {
    if (checkFlush) return checkFlush;
    clearTimeout(checkTimer);
    checkFailed = false;
    checkFlush = (async () => {
      while (checkmarks.pending) {
        const date = checkmarks.dates()[0]; const sent = checkmarks.snapshot(date);
        try {
          await write('checks',{checks:sent.map(({taskId,checked}) => ({taskId,checked}))},date,() => checkmarks.acknowledge(date,sent));
          checkFailed = false;
        } catch {
          checkFailed = true; drawStatus(); announce('Checkmarks could not be saved. Your choices are kept here; retry saving.');
          return false;
        }
      }
      drawStatus(); return true;
    })().finally(() => { checkFlush = null; });
    return checkFlush;
  }

  function flushNotes(): Promise<boolean> {
    if (noteFlush) return noteFlush;
    clearTimeout(noteTimer);
    noteFlush = (async () => {
      if (checkmarks.pending && !(await flushChecks())) return false;
      await queue;
      if (!noteDirty) return true;
      if (noteConflict) { drawStatus(); return false; }
      if (!canEdit()) { noteFailed = true; drawStatus(); return false; }
      const value = noteField.value;
      try { await write('note',{note:value,baseRevision:noteBaseRevision}); return !noteDirty; }
      catch { drawStatus(); return false; }
    })().finally(() => { noteFlush = null; });
    return noteFlush;
  }

  async function changeDate(date: string, scroll = false) {
    if (!validDate(date) || date === selectedDate || navigating || loading) return;
    navigating = true;
    try {
      if (noteDirty && !(await flushNotes()) && !confirm('Your note has not been saved. Stay here to retry, or discard the unsaved text and change dates?')) return;
      noteDirty = false; noteFailed = false; noteConflict = false;
      selectedDate = date;
      dataVersion++;
      displayedYear = Number(date.slice(0,4));
      history.replaceState(null,'',`${location.pathname}#date=${date}`);
      render(true);
      if (!loadedYears.has(displayedYear) || Number(shiftDate(date,-6).slice(0,4)) !== displayedYear && !loadedYears.has(displayedYear - 1)) {
        if (checkmarks.pending && !(await flushChecks())) return;
        await load(displayedYear);
      }
      if (scroll) $('boardTitle').scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    } finally { navigating = false; }
  }

  async function changeYear(year: number) {
    if (year < MIN_YEAR || year > MAX_YEAR || loading || navigating) return;
    if (!(await flushNotes())) { announce('Save your note before changing calendar years.'); return; }
    displayedYear = year;
    await load(year);
  }

  function toggleTask(id: string) {
    if (!canEdit() || editor.open || resetDialog.open || !tasks().some(task => task.id === id)) return;
    checkmarks.stage(selectedDate,id,record()?.checked[id] !== true);
    dataVersion++; checkFailed = false;
    render(false,new Set([selectedDate]));
    clearTimeout(checkTimer); checkTimer = setTimeout(() => { void flushChecks(); },150);
  }

  function addEditorRow(task: Task) {
    const row = make('div','edit-entry'); row.dataset.id = task.id;
    const fields = make('div','edit-fields');
    const title = make('input','editor-input task-edit-title') as HTMLInputElement;
    title.type = 'text'; title.maxLength = 90; title.required = true; title.value = task.title; title.placeholder = 'Task title'; title.setAttribute('aria-label','Task title');
    const detail = make('input','editor-input task-edit-detail') as HTMLInputElement;
    detail.type = 'text'; detail.maxLength = 150; detail.value = task.detail ?? ''; detail.placeholder = 'Optional description'; detail.setAttribute('aria-label','Task description');
    fields.append(title,detail);
    const select = make('select','editor-input editor-select task-edit-category') as HTMLSelectElement;
    select.setAttribute('aria-label','Task category');
    for (const category of CATEGORIES) { const option = make('option',undefined,category) as HTMLOptionElement; option.value = category; option.selected = task.category === category; select.append(option); }
    const remove = make('button','delete-task','×') as HTMLButtonElement;
    remove.type = 'button'; remove.setAttribute('aria-label',`Remove ${task.title || 'task'}`);
    remove.addEventListener('click',() => { if ($('editRows').children.length <= 1) { announce('Keep at least one task.'); return; } row.remove(); });
    row.append(fields,select,remove); $('editRows').append(row); return row;
  }

  async function openEditor() {
    if (!canEdit() || pending) return;
    if (!(await flushNotes())) { announce('Save your note before editing tasks.'); return; }
    if (!canEdit()) return;
    $('editRows').replaceChildren(); tasks().forEach(addEditorRow);
    editorBaseRevision = record()?.revision ?? 0;
    $('editorDate').textContent = `${format(selectedDate,{month:'long',day:'numeric',year:'numeric'})} · Other saved days keep their own tasks.`;
    $<HTMLInputElement>('applyToFuture').checked = false;
    $<HTMLInputElement>('applyToFuture').disabled = selectedDate !== today;
    $('templateHint').textContent = selectedDate === today ? 'Existing daily records keep their own task lists.' : 'To change the default for unrecorded days, edit today’s checklist.';
    $('editorError').hidden = true;
    editor.showModal();
  }

  function listen(element: EventTarget, type: string, handler: EventListener) { element.addEventListener(type,handler,{signal:listeners.signal}); }
  listen($('taskList'),'click',event => { const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-task-id]'); if (button?.dataset.taskId) void toggleTask(button.dataset.taskId); });
  for (const id of ['yearMonths','weekBars']) listen($(id),'click',event => { const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-date]'); if (button?.dataset.date) void changeDate(button.dataset.date,true); });
  listen($('returnToday'),'click',() => { void changeDate(today); });
  listen($('previousYear'),'click',() => { void changeYear(displayedYear - 1); });
  listen($('nextYear'),'click',() => { void changeYear(displayedYear + 1); });
  listen($('retryLoad'),'click',() => { void load(); });
  listen($('retryNote'),'click',() => { if (noteConflict) void reviewConflict(); else void flushNotes(); });
  listen($('retryChecks'),'click',() => { void flushChecks(); });
  listen(noteField,'input',() => {
    dataVersion++;
    if (!noteDirty) noteBaseRevision = record()?.revision ?? 0;
    noteDirty = noteField.value !== (record()?.note ?? '');
    if (!noteConflict) noteFailed = false;
    drawStatus(); clearTimeout(noteTimer);
    if (noteDirty && !noteConflict) noteTimer = setTimeout(() => { void flushNotes(); },650);
  });
  listen($('editTasks'),'click',() => { void openEditor(); });
  for (const id of ['closeTaskEditor','cancelTaskEditor']) listen($(id),'click',() => { if (!pending) editor.close(); });
  listen(editor,'cancel',event => { if (pending) event.preventDefault(); });
  listen($('addTask'),'click',() => {
    if ($('editRows').children.length >= 40) { announce('A checklist can contain up to 40 tasks.'); return; }
    const row = addEditorRow({id:`custom_${crypto.randomUUID()}`,title:'',detail:'',category:'Research'});
    row.querySelector<HTMLInputElement>('input')?.focus();
  });
  listen($('taskEditorForm'),'submit',event => {
    event.preventDefault();
    const updated: Task[] = [];
    for (const row of Array.from($('editRows').children) as HTMLElement[]) {
      const title = row.querySelector<HTMLInputElement>('.task-edit-title')!;
      if (!title.value.trim()) { title.focus(); return; }
      updated.push({id:row.dataset.id!,title:title.value.trim(),detail:row.querySelector<HTMLInputElement>('.task-edit-detail')!.value.trim(),category:row.querySelector<HTMLSelectElement>('select')!.value as Task['category']});
    }
    if (!updated.length || pending) return;
    $('editorError').hidden = true;
    void write('tasks',{tasks:updated,applyToFuture:$<HTMLInputElement>('applyToFuture').checked,baseRevision:editorBaseRevision}).then(() => { editor.close(); announce('Checklist updated. Other recorded days are unchanged.'); }).catch(() => { $('editorError').textContent = `${lastError} Close and reopen this editor to load the latest checklist if another device changed it.`; $('editorError').hidden = false; });
  });
  listen($('resetDay'),'click',() => {
    if (!canEdit() || pending) return;
    $('resetDescription').textContent = `Reset ${format(selectedDate,{month:'long',day:'numeric',year:'numeric'})}? The tasks and note will be kept.`;
    resetDialog.showModal();
  });
  listen($('cancelReset'),'click',() => { if (!pending) resetDialog.close(); });
  listen(resetDialog,'cancel',event => { if (pending) event.preventDefault(); });
  listen($('resetForm'),'submit',event => {
    event.preventDefault();
    if (!canEdit() || pending) return;
    void flushNotes().then(saved => {
      if (!saved) { announce('Save your note before resetting checkmarks.'); return; }
      return write('reset',{}).then(() => { resetDialog.close(); announce('Checkmarks reset. Your note was kept.'); }).catch(() => { announce(lastError); });
    });
  });
  listen(document,'keydown',event => {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.ctrlKey || keyEvent.metaKey || keyEvent.altKey || editor.open || resetDialog.open || document.querySelector('dialog[open]') || ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName ?? '') || !canEdit()) return;
    if (/^[1-9]$/.test(keyEvent.key)) { const task = orderedTasks()[Number(keyEvent.key) - 1]; if (task) { keyEvent.preventDefault(); void toggleTask(task.id); } }
  });
  const unsubscribePermissions = journalPermissions.subscribe(detail => {
    const changed = editing !== detail.editing;
    editing = detail.editing;
    // Journal reads update the header too, but never trigger another journal read.
    if (detail.source === 'journal') return;
    if (changed) dataVersion++;
    if (!editing) { if (editor.open) editor.close(); if (resetDialog.open) resetDialog.close(); if (conflictDialog.open) conflictDialog.close(); }
    drawTasks(); drawStatus();
    if (detail.source === 'action' && !pending && !checkmarks.pending && !noteDirty) void load(displayedYear,connected);
  });
  listen(window,'beforeunload',event => { if (noteDirty || pending || checkmarks.pending) { event.preventDefault(); (event as BeforeUnloadEvent).returnValue = ''; } });
  listen(document,'visibilitychange',() => { if (document.hidden) { if ((noteDirty || checkmarks.pending) && canEdit()) void flushNotes(); } else if (!pending && !noteDirty && !editor.open && !resetDialog.open && !conflictDialog.open) { if (checkmarks.pending) void flushChecks(); else void load(displayedYear,true); } });

  async function reviewConflict() {
    clearTimeout(noteTimer);
    if (!canEdit() || pending) return;
    try {
      const payload = await fetchYear(Number(selectedDate.slice(0,4)));
      conflictRecord = payload.records[selectedDate];
      $<HTMLTextAreaElement>('cloudNote').value = conflictRecord?.note ?? '';
      $<HTMLTextAreaElement>('localNote').value = noteField.value;
      $('conflictError').hidden = true;
      conflictDialog.showModal();
    } catch (error) { announce(error instanceof Error ? error.message : 'Could not load the latest note. Your draft is still here.'); }
  }
  listen($('cancelConflict'),'click',() => { if (!pending) conflictDialog.close(); });
  listen(conflictDialog,'cancel',event => { if (pending) event.preventDefault(); });
  listen($('useCloudNote'),'click',() => {
    if (pending) return;
    if (conflictRecord) records[selectedDate] = conflictRecord; else delete records[selectedDate];
    noteDirty = false; noteFailed = false; noteConflict = false; noteBaseRevision = conflictRecord?.revision ?? 0;
    conflictDialog.close(); render(true); announce('The latest cloud note is now shown.');
  });
  listen($('keepDraftNote'),'click',() => {
    if (!canEdit() || pending) return;
    noteBaseRevision = conflictRecord?.revision ?? 0;
    noteConflict = false;
    void write('note',{note:noteField.value,baseRevision:noteBaseRevision}).then(() => { conflictDialog.close(); announce('Your draft has been saved to the cloud.'); }).catch(() => { $('conflictError').textContent = `${lastError} Close this dialog and review versions again to load the latest note.`; $('conflictError').hidden = false; });
  });

  const midnightTimer = setInterval(() => {
    const newToday = beijingDate();
    if (newToday === today) return;
    const wasToday = selectedDate === today;
    today = newToday;
    if (wasToday && !noteDirty && !pending && !checkmarks.pending && !document.querySelector('dialog[open]')) { void changeDate(today).then(() => announce('A new day in Beijing. A fresh checklist is ready.')); }
    else if (wasToday) { render(false); announce('A new day has started in Beijing. Finish your note, then return to today.'); }
    else render(false);
  },30000);
  document.addEventListener('astro:before-swap',() => { listeners.abort(); unsubscribePermissions(); clearInterval(midnightTimer); clearTimeout(noteTimer); clearTimeout(checkTimer); clearTimeout(toastTimer); },{once:true});
  // Start the request before constructing the year's calendar on the main thread.
  void load();
  render(true);
}

initJournal();
document.addEventListener('astro:page-load',initJournal);
