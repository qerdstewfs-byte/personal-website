import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beijingClock, beijingHour, formatJournalDate, untilNextMinute } from '../src/lib/journal-dates.ts';

test('Clock changes date at Beijing midnight and schedules the next minute boundary', () => {
  assert.deepEqual(beijingClock(new Date('2026-12-31T15:59:59Z')), { time: '23:59', date: 'Thu, Dec 31 · Beijing' });
  assert.deepEqual(beijingClock(new Date('2026-12-31T16:00:00Z')), { time: '00:00', date: 'Fri, Jan 1 · Beijing' });
  assert.equal(beijingHour(new Date('2026-12-31T16:00:00Z')), 0);
  assert.equal(untilNextMinute(Date.parse('2026-12-31T15:59:59.900Z')), 120);
});

test('Cached calendar labels preserve leap day and year boundaries', () => {
  const full = { month: 'long', day: 'numeric', year: 'numeric' };
  for (let iteration = 0; iteration < 2; iteration++) {
    assert.equal(formatJournalDate('2028-02-29', full), 'February 29, 2028');
    assert.equal(formatJournalDate('2027-01-01', { weekday: 'long' }), 'Friday');
    assert.equal(formatJournalDate('2026-12-31', full), 'December 31, 2026');
    assert.equal(formatJournalDate('2028-02-29', { year: 'numeric', day: 'numeric', month: 'long' }), 'February 29, 2028');
  }
});
