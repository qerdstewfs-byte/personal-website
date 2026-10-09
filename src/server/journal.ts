import { CATEGORIES, DEFAULT_TASKS, beijingDate, validDate, type Task, type DayRecord } from '../lib/journal';
import { readJson, updateJson } from './storage';
type JournalData = { version: 1; template: Task[]; records: Record<string, DayRecord> };
function initialState(): JournalData { return { version: 1, template: structuredClone(DEFAULT_TASKS), records: {} }; }
export async function readJournal(year: number) {
  const data = (await readJson<JournalData>('state'))?.data || initialState();
  return { template: data.template, records: Object.fromEntries(Object.entries(data.records).filter(([date]) => date.startsWith(`${year}-`))) };
}
export function validateTasks(value: unknown): Task[] {
  if (!Array.isArray(value) || !value.length || value.length > 40) throw new Error('Use between 1 and 40 tasks.');
  const ids = new Set<string>();
  return value.map(item => {
    if (!item || typeof item !== 'object') throw new Error('Invalid task.');
    const { id, title, detail, category } = item;
    if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,90}$/.test(id) || ['__proto__', 'constructor', 'prototype'].includes(id) || ids.has(id)) throw new Error('Invalid or duplicate task ID.');
    if (typeof title !== 'string' || !title.trim() || title.length > 90 || typeof detail !== 'string' || detail.length > 150 || !CATEGORIES.includes(category)) throw new Error('Invalid task fields.');
    ids.add(id); return { id, title: title.trim(), detail: detail.trim(), category };
  });
}
export async function writeRecord(input: Record<string, unknown>) {
  const { date, action } = input;
  if (!validDate(date) || date > beijingDate()) throw new Error('Select a valid date on or before today in Beijing.');
  if (!['check', 'note', 'reset', 'tasks'].includes(String(action))) throw new Error('Unknown action.');
  const tasks = action === 'tasks' ? validateTasks(input.tasks) : null;
  if (action === 'note' && (typeof input.note !== 'string' || input.note.length > 10_000)) throw new Error('Notes can contain up to 10,000 characters.');
  if (action === 'check' && (typeof input.taskId !== 'string' || typeof input.checked !== 'boolean')) throw new Error('Invalid checkmark.');
  if (['note', 'tasks'].includes(String(action)) && (!Number.isInteger(input.baseRevision) || Number(input.baseRevision) < 0)) throw new Error('Invalid record revision. Reload the record before editing.');
  if (input.applyToFuture && (action !== 'tasks' || date !== beijingDate())) throw new Error('Only today’s checklist can become the future default.');
  // A single conditional commit keeps the selected record and its future-default change atomic.
  const state = await updateJson<JournalData>('state', initialState, previous => {
    const record = previous.records[date] || { date, tasks: structuredClone(previous.template), checked: {}, note: '', revision: 0, updatedAt: '' };
    if (['note', 'tasks'].includes(String(action)) && record.revision !== input.baseRevision) throw new Error('Record changed on another device. Reload before replacing this note or checklist.');
    if (action === 'check') {
      const taskId = input.taskId as string; if (!record.tasks.some(task => task.id === taskId)) throw new Error('This task is no longer on the selected checklist. Reload it first.');
      record.checked[taskId] = input.checked as boolean;
    } else if (action === 'note') record.note = input.note as string;
    else if (action === 'reset') record.checked = {};
    else if (tasks) {
      record.tasks = tasks; record.checked = Object.fromEntries(tasks.map(task => [task.id, Boolean(record.checked[task.id])]));
    }
    if (tasks && input.applyToFuture) previous.template = tasks;
    record.revision += 1; record.updatedAt = new Date().toISOString(); previous.records[date] = record; return previous;
  });
  return { record: state.records[date], ...(tasks && input.applyToFuture ? { template: state.template } : {}) };
}
