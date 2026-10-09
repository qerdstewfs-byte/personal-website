import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beijingDate, shiftDate, validDate, summary, DEFAULT_TASKS } from '../src/lib/journal.ts';
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
