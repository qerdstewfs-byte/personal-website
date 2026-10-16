import type { APIRoute } from 'astro';
import { isEditor } from '../../server/auth';
import { json, sameOrigin } from '../../server/http';
import { reportSummaries, ReportError } from '../../lib/reports';
import { readReportStore, writeReport, reportBody } from '../../server/reports';
import { reportFailure } from '../../server/report-http';
export const GET: APIRoute = async ({ cookies }) => {
  try { const editing = isEditor(cookies); return json({ editing, reports: reportSummaries(await readReportStore(), editing) }); }
  catch (error) { return reportFailure(error); }
};
export const POST: APIRoute = async ({ cookies, request }) => {
  if (!sameOrigin(request)) return json({ error: 'Request origin is not allowed.' }, 403);
  if (!isEditor(cookies)) return json({ error: 'Unlock editing with your management password first.' }, 401);
  try {
    const input = await reportBody(request);
    if (input.action !== 'create') throw new ReportError('Unknown report action.');
    return json({ editing: true, report: await writeReport(null, input) });
  } catch (error) { return reportFailure(error); }
};
