export type LoginAttempts = { until: number; count: number };
export class LoginLimitReached extends Error {}
export const LOGIN_WINDOW_MS = 15 * 60_000;
export const LOGIN_ATTEMPT_LIMIT = 6;

/** Runs inside the storage compare-and-swap loop, including each conflict retry. */
export function consumeLoginAttempt(previous: LoginAttempts, now: number): LoginAttempts {
  if (previous.until <= now) return { until: now + LOGIN_WINDOW_MS, count: 1 };
  if (previous.count >= LOGIN_ATTEMPT_LIMIT) throw new LoginLimitReached();
  return { ...previous, count: previous.count + 1 };
}
