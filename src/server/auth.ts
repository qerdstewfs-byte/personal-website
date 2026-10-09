import { createHmac, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { env, requireEnv } from './env';
import { updateJson } from './storage';
import { consumeLoginAttempt, LoginLimitReached, LOGIN_WINDOW_MS } from '../lib/login-attempt';
import type { LoginAttempts } from '../lib/login-attempt';

export const SESSION_COOKIE = 'ray_journal_editor';
export const SESSION_SECONDS = 60 * 60 * 24 * 7;
type CookieReader = { get: (name: string) => { value: string } | undefined };
function sign(value: string) { return createHmac('sha256', requireEnv('SESSION_SECRET')).update(value).digest('base64url'); }
export function authConfigured() { return Boolean(env('ADMIN_PASSWORD_HASH') && env('SESSION_SECRET')); }
export function isEditor(cookies: CookieReader): boolean {
  if (!authConfigured()) return false;
  const cookie = cookies.get(SESSION_COOKIE)?.value; if (!cookie || cookie.length > 256) return false;
  const parts = cookie.split('.'); if (parts.length !== 3 || !/^\d+$/.test(parts[0])) return false;
  const [expires, nonce, signature] = parts;
  if (Number(expires) <= Math.floor(Date.now() / 1000)) return false;
  const expected = sign(`${expires}.${nonce}`); const a = Buffer.from(signature); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function makeSession() {
  const payload = `${Math.floor(Date.now() / 1000) + SESSION_SECONDS}.${randomUUID()}`; return `${payload}.${sign(payload)}`;
}
export function verifyPassword(value: unknown): boolean {
  if (typeof value !== 'string' || value.length > 200 || !authConfigured()) return false;
  const [salt, digest] = requireEnv('ADMIN_PASSWORD_HASH').split(':');
  if (!salt || !digest || !/^[a-f0-9]{128}$/.test(digest)) return false;
  const expected = Buffer.from(digest, 'hex'); const actual = scryptSync(value, salt, 64);
  return timingSafeEqual(expected, actual);
}
export async function allowLogin(request: Request): Promise<boolean> {
  const ip = (request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown').trim().slice(0, 100);
  const hash = sign(ip); const now = Date.now();
  try {
    await updateJson<LoginAttempts>(`login/${hash}`, () => ({ until: now + LOGIN_WINDOW_MS, count: 0 }), previous => consumeLoginAttempt(previous, now));
    return true;
  } catch (error) {
    if (error instanceof LoginLimitReached) return false;
    throw error;
  }
}
