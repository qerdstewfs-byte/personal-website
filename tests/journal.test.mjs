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
const five = DEFAULT_TASKS.filter((task) => ['pam','ielts','course','vocab','jetson'].includes(task.id)).map((task) => ({ ...task, detail:'' }));
const ids = (record) => record.tasks.map((task) => task.id);
test('Version 1 data adopts the 2026-10-12 checklist from that day forward only', () => {
  const state = migrateJournal({ version:1, template:DEFAULT_TASKS, records:{ '2026-10-09':day('2026-10-09', DEFAULT_TASKS), '2026-10-12':day('2026-10-12', five), '2026-10-13':day('2026-10-13', DEFAULT_TASKS) } });
  assert.equal(state.version, 3);
  assert.deepEqual(state.template, five);
  assert.deepEqual(state.records['2026-10-09'].tasks, DEFAULT_TASKS);
  assert.deepEqual(state.records['2026-10-13'].tasks, five);
  assert.equal(migrateJournal(state), state);
});
test('Version 2 data gets back the past lists it overwrote, keeping checkmarks', () => {
  const state = migrateJournal({ version:2, template:five, records:{ '2026-10-09':day('2026-10-09', five), '2026-10-10':day('2026-10-10', five, {vocab:true,'custom_21ccda7e-fb61-44ad-98cc-5fc681339acc':true}), '2026-10-11':day('2026-10-11', five), '2026-10-13':day('2026-10-13', five) } });
  assert.deepEqual(state.records['2026-10-09'].tasks, DEFAULT_TASKS);
  assert.equal(state.records['2026-10-10'].tasks.at(-1).title, 'Online Course');
  assert.equal(state.records['2026-10-11'].tasks[0].detail, 'Study photoacoustic microscopy and take notes');
  assert.deepEqual(summary(state.records['2026-10-10']), {done:2,total:6,percent:33});
  assert.deepEqual(state.records['2026-10-13'].tasks, five);
  assert.deepEqual(state.template, five);
});
test('A past day edited after the version 2 change is not overwritten by the restore', () => {
  const edited = DEFAULT_TASKS.slice(0, 2);
  const state = migrateJournal({ version:2, template:five, records:{ '2026-10-09':day('2026-10-09', edited) } });
  assert.deepEqual(state.records['2026-10-09'].tasks, edited);
});
test('Editing a checklist changes that day and later days, never earlier ones', () => {
  const state = { version:3, template:five, records:{ '2026-10-11':day('2026-10-11', five), '2026-10-13':day('2026-10-13', five, {pam:true}), '2026-10-14':day('2026-10-14', five) } };
  applyChecklist(state, DEFAULT_TASKS, '2026-10-13');
  assert.deepEqual(state.records['2026-10-11'].tasks, five);
  assert.deepEqual(ids(state.records['2026-10-13']), DEFAULT_TASKS.map((task) => task.id));
  assert.deepEqual(state.records['2026-10-14'].tasks, DEFAULT_TASKS);
  assert.deepEqual(state.template, DEFAULT_TASKS);
  assert.notEqual(state.records['2026-10-13'].tasks, state.records['2026-10-14'].tasks);
  // Removing a task keeps its checkmark, so adding it back restores progress.
  applyChecklist(state, DEFAULT_TASKS.slice(1), '2026-10-13');
  assert.deepEqual(summary(state.records['2026-10-13']), {done:0,total:6,percent:0});
  applyChecklist(state, DEFAULT_TASKS, '2026-10-13');
  assert.deepEqual(summary(state.records['2026-10-13']), {done:1,total:7,percent:14});
});
