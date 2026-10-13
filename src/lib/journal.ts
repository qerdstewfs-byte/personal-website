export const TIME_ZONE = 'Asia/Shanghai';
export const CATEGORIES = ['Research', 'English', 'Development'] as const;
export type Task = { id: string; title: string; detail: string; category: typeof CATEGORIES[number] };
export type DayRecord = { date: string; tasks: Task[]; checked: Record<string, boolean>; note: string; updatedAt: string; revision: number };
export type JournalPayload = { year: number; today: string; records: Record<string, DayRecord>; template: Task[]; editing: boolean; cloud: boolean };
export const DEFAULT_TASKS: Task[] = [
  { id: 'pam', title: 'PAM Research', detail: 'Study photoacoustic microscopy and take notes', category: 'Research' },
  { id: 'paper', title: 'Research Paper', detail: 'Read and analyze one paper or section', category: 'Research' },
  { id: 'ielts', title: 'IELTS Listening', detail: 'Complete one listening passage', category: 'English' },
  { id: 'course', title: 'English Course', detail: 'Complete one lesson', category: 'English' },
  { id: 'ted', title: 'TED Talk', detail: 'Watch, listen, and practice shadowing', category: 'English' },
  { id: 'vocab', title: 'Vocabulary Review', detail: 'Learn and review new words', category: 'English' },
  { id: 'jetson', title: 'Jetson Nano', detail: 'Code, experiment, or debug your project', category: 'Development' },
];
export type JournalState = { version: 1 | 2 | 3; template: Task[]; records: Record<string, DayRecord> };
// The owner's checklist on this day becomes the checklist for it and every later day.
export const CHECKLIST_BASELINE_DATE = '2026-10-12';
// A checklist edit applies from the edited day forward and becomes the default for
// unrecorded days; earlier days keep their own lists. Checkmarks of removed tasks stay
// in each record (progress ignores them), so adding a task back restores its history.
export function applyChecklist<T extends JournalState>(state: T, tasks: Task[], fromDate: string): T {
  state.template = structuredClone(tasks);
  for (const [date, record] of Object.entries(state.records)) if (date >= fromDate) record.tasks = structuredClone(tasks);
  return state;
}
const sameTasks = (a: Task[], b: Task[]) => JSON.stringify(a) === JSON.stringify(b);
// Version 2 briefly applied one checklist to every day, overwriting these days' own lists.
function originalChecklists(): Record<string, Task[]> {
  const brief = (id: string, title: string, category: Task['category']): Task => ({ id, title, detail: '', category });
  return {
    '2026-10-09': structuredClone(DEFAULT_TASKS),
    '2026-10-11': DEFAULT_TASKS.filter(task => !['paper', 'ted'].includes(task.id)).map(task => ({ ...task })),
    '2026-10-10': [brief('pam', 'PAM Research', 'Research'), brief('ielts', 'IELTS Listening', 'English'), brief('course', 'English Course', 'English'), brief('vocab', 'Vocabulary Review', 'English'), brief('jetson', 'Jetson Nano', 'Development'), brief('custom_21ccda7e-fb61-44ad-98cc-5fc681339acc', 'Online Course', 'Development')],
  };
}
// Version 1 kept an independent list per day. Version 3 applies the baseline from its day forward.
export function migrateJournal<T extends JournalState>(state: T): T {
  if (state.version === 3) return state;
  if (state.version === 2) {
    // Version 2 kept every record equal to the default list, so a past record that still
    // matches it was overwritten rather than edited; give it back its own list.
    for (const [date, tasks] of Object.entries(originalChecklists())) {
      const record = state.records[date];
      if (record && sameTasks(record.tasks, state.template)) record.tasks = tasks;
    }
  } else {
    applyChecklist(state, state.records[CHECKLIST_BASELINE_DATE]?.tasks ?? state.template, CHECKLIST_BASELINE_DATE);
  }
  state.version = 3;
  return state;
}
export function beijingDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const part = (type: string) => parts.find(p => p.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value && Number(value.slice(0, 4)) >= 1900 && Number(value.slice(0, 4)) <= 2200;
}
export function shiftDate(date: string, n: number): string {
  const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10);
}
export function formatDate(date: string, options: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', ...options, timeZone: TIME_ZONE }).format(new Date(`${date}T04:00:00Z`));
}
export function summary(record?: DayRecord) {
  const total = record?.tasks.length || 0;
  const done = record?.tasks.filter(t => record.checked[t.id]).length || 0;
  return { done, total, percent: total ? Math.round(done / total * 100) : 0 };
}
