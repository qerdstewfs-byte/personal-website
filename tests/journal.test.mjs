import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beijingDate, shiftDate, validDate, summary, applyChecklist, migrateJournal, DEFAULT_TASKS } from '../src/lib/journal.ts';
test('Beijing midnight is independent of device timezone', () => {
  assert.equal(beijingDate(new Date('2026-10-09T15:59:59Z')), '2026-10-09');
  assert.equal(beijingDate(new Date('2026-10-09T16:00:00Z')), '2026-10-10');
  assert.equal(beijingDate(new Date('2026-12-31T16:00:00Z')), '2027-01-01');
});
test('Calendar rejects impossible dates and handles leap years', () => {
  assert.equal(validDate('2026-02-29'), false); assert.equal(validDate('2028-02-29'), true);
  assert.equal(validDate('2026-13-01'), false); assert.equal(validDate('2026-04-31'), false);
  assert.equal(shiftDate('2028-02-28', 1), '2028-02-29');
  assert.equal(shiftDate('2027-01-01', -1), '2026-12-31');
});
test('Historical progress uses its snapshot, ignoring removed IDs', () => {
  const record = { date:'2026-01-01', tasks:DEFAULT_TASKS.slice(0, 2), checked:{pam:true,removed:true}, note:'',revision:1,updatedAt:'' };
  assert.deepEqual(summary(record), {done:1,total:2,percent:50});
});
const day = (date, tasks, checked = {}) => ({ date, tasks, checked, note:'', revision:1, updatedAt:'' });
test('Version 1 data adopts the 2026-10-12 checklist for every day and the default', () => {
  const baseline = DEFAULT_TASKS.filter((task) => ['pam','ielts','jetson'].includes(task.id));
  const state = migrateJournal({ version:1, template:DEFAULT_TASKS, records:{ '2026-10-09':day('2026-10-09', DEFAULT_TASKS, {paper:true}), '2026-10-12':day('2026-10-12', baseline, {pam:true}) } });
  assert.equal(state.version, 2);
  assert.deepEqual(state.template.map((task) => task.id), ['pam','ielts','jetson']);
  for (const record of Object.values(state.records)) assert.deepEqual(record.tasks, baseline);
  // A removed task keeps its checkmark in the record but no longer counts toward progress.
  assert.equal(state.records['2026-10-09'].checked.paper, true);
  assert.deepEqual(summary(state.records['2026-10-09']), {done:0,total:3,percent:0});
  assert.equal(migrateJournal(state), state);
});
test('Editing the checklist changes every recorded day and restores checks on re-added tasks', () => {
  const state = { version:2, template:DEFAULT_TASKS.slice(0, 2), records:{ '2026-10-10':day('2026-10-10', DEFAULT_TASKS.slice(0, 2), {pam:true,paper:true}), '2026-10-11':day('2026-10-11', DEFAULT_TASKS.slice(0, 2)) } };
  applyChecklist(state, DEFAULT_TASKS.slice(0, 1));
  assert.deepEqual(summary(state.records['2026-10-10']), {done:1,total:1,percent:100});
  assert.deepEqual(state.records['2026-10-11'].tasks, DEFAULT_TASKS.slice(0, 1));
  applyChecklist(state, DEFAULT_TASKS.slice(0, 2));
  assert.deepEqual(summary(state.records['2026-10-10']), {done:2,total:2,percent:100});
  assert.notEqual(state.records['2026-10-10'].tasks, state.records['2026-10-11'].tasks);
});
