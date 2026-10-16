import type { APIRoute } from 'astro';
import { isEditor } from '../../../server/auth';
import { json, sameOrigin } from '../../../server/http';
import { projectReport, ReportError } from '../../../lib/reports';
import { readReportStore, writeReport, requireReportId, reportBody } from '../../../server/reports';
import { reportFailure } from '../../../server/report-http';
export const GET: APIRoute = async ({ cookies, params, url }) => {
  try {
    const id = requireReportId(params.id), editing = isEditor(cookies), store = await readReportStore();
    if (!Object.hasOwn(store.reports, id)) throw new ReportError('Report not found.', 404);
    const report = projectReport(store.reports[id], editing, url.searchParams.get('version') ?? undefined);
    if (!report) throw new ReportError('Report not found.', 404);
    return json({ editing, report });
  } catch (error) { return reportFailure(error); }
};
export const POST: APIRoute = async ({ cookies, params, request }) => {
  if (!sameOrigin(request)) return json({ error: 'Request origin is not allowed.' }, 403);
  if (!isEditor(cookies)) return json({ error: 'Unlock editing with your management password first.' }, 401);
  try { return json({ editing: true, report: await writeReport(requireReportId(params.id), await reportBody(request)) }); }
  catch (error) { return reportFailure(error); }
};
