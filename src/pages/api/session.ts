import type { APIRoute } from 'astro';
import { authConfigured, isEditor, makeSession, verifyPassword, allowLogin, SESSION_COOKIE, SESSION_SECONDS } from '../../server/auth';
import { body, json, sameOrigin } from '../../server/http';

export const GET: APIRoute = ({ cookies }) => json({ editing: isEditor(cookies), configured: authConfigured() });
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return json({ error: 'Request origin is not allowed.' }, 403);
  if (!authConfigured()) return json({ error: 'Editing is not configured yet.' }, 503);
  let data; try { data = await body(request); } catch { return json({ error: 'Invalid login request.' }, 400); }
  try {
    if (!await allowLogin(request)) return json({ error: 'Too many attempts. Please try again in 15 minutes.' }, 429);
    if (!verifyPassword(data.password)) return json({ error: 'The management password is incorrect.' }, 401);
    cookies.set(SESSION_COOKIE, makeSession(), { httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'strict', path: '/', maxAge: SESSION_SECONDS });
    return json({ editing: true });
  } catch { return json({ error: 'Cloud connection unavailable. Please try again.' }, 503); }
};
export const DELETE: APIRoute = ({ request, cookies }) => {
  if (!sameOrigin(request)) return json({ error: 'Request origin is not allowed.' }, 403);
  cookies.delete(SESSION_COOKIE, { path: '/' }); return json({ editing: false });
};
