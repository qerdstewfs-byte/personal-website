import { ReportError } from '../lib/reports';
import { json } from './http';
export function reportFailure(error: unknown) {
  if (error instanceof ReportError) return json({ error: error.message }, error.status);
  if (error instanceof Error && error.message.startsWith('Record changed')) return json({ error: 'The report changed on another device. Keep your unsaved text and reload the saved version.' }, 409);
  if (error instanceof Error && error.message.startsWith('Record storage limit')) return json({ error: 'The report collection is full. Your previous records are safe.' }, 400);
  return json({ error: 'Cloud connection unavailable. Keep this page open and retry; your saved reports are safe.' }, 503);
}
