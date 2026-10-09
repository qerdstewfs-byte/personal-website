import type { APIRoute } from 'astro';
import { beijingDate } from '../../lib/journal';
import { readJournal, writeRecord } from '../../server/journal';
import { cloudConfigured } from '../../server/storage';
import { isEditor } from '../../server/auth';
import { body, json, sameOrigin } from '../../server/http';

export const GET: APIRoute = async ({ url, cookies }) => {
  const year = Number(url.searchParams.get('year') || beijingDate().slice(0, 4));
  if (!Number.isInteger(year) || year < 1900 || year > 2200) return json({ error: 'Invalid calendar year.' }, 400);
  try {
    const { records, template } = await readJournal(year);
    return json({ year, today: beijingDate(), records, template, editing: isEditor(cookies), cloud: cloudConfigured() });
  } catch { return json({ error: 'Cloud records could not be loaded. Your saved records have not been changed.' }, 503); }
};
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return json({ error: 'Request origin is not allowed.' }, 403);
  if (!isEditor(cookies)) return json({ error: 'Unlock editing with your management password first.' }, 401);
  let data; try { data = await body(request); } catch { return json({ error: 'Invalid record request.' }, 400); }
  try { return json(await writeRecord(data)); }
  catch (error) {
    const message = error instanceof Error ? error.message : '';
    const inputError = /^(Select|Unknown|Use|Invalid|Notes|Only|This task|Record storage limit)/.test(message);
    const conflict = message.startsWith('Record changed');
    return json({ error: inputError || conflict ? message : 'Cloud save failed. Keep this page open and retry; your previous record is safe.' }, inputError ? 400 : conflict ? 409 : 503);
  }
};
