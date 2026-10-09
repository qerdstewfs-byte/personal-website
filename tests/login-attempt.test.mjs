import { test } from 'node:test';
import assert from 'node:assert/strict';
import { consumeLoginAttempt, LoginLimitReached, LOGIN_WINDOW_MS } from '../src/lib/login-attempt.ts';

test('The seventh attempt is blocked without extending the window or mutating the saved quota', () => {
  const now = 10_000;
  let state = { until: now + LOGIN_WINDOW_MS, count: 0 };
  for (let attempt = 1; attempt <= 6; attempt++) state = consumeLoginAttempt(state, now + attempt);
  assert.throws(() => consumeLoginAttempt(state, now + 7), LoginLimitReached);
  assert.deepEqual(state, { until: now + LOGIN_WINDOW_MS, count: 6 });
  assert.deepEqual(consumeLoginAttempt(state, state.until), { until: state.until + LOGIN_WINDOW_MS, count: 1 });
});

test('Concurrent attempts recheck the quota after a compare-and-swap conflict', async () => {
  const now = 10_000;
  let saved = { until: now + LOGIN_WINDOW_MS, count: 5 };
  let revision = 0;
  let writes = 0;
  async function optimisticAttempt() {
    for (let retry = 0; retry < 5; retry++) {
      const expectedRevision = revision;
      const next = consumeLoginAttempt(structuredClone(saved), now);
      await Promise.resolve();
      if (revision !== expectedRevision) continue;
      saved = next; revision++; writes++;
      return true;
    }
    throw new Error('Unexpected retry exhaustion');
  }
  const attempts = await Promise.allSettled([optimisticAttempt(), optimisticAttempt(), optimisticAttempt()]);
  assert.equal(attempts.filter(result => result.status === 'fulfilled').length, 1);
  assert.ok(attempts.filter(result => result.status === 'rejected').every(result => result.reason instanceof LoginLimitReached));
  assert.equal(saved.count, 6);
  assert.equal(writes, 1);
});
