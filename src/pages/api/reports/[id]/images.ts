import type { APIRoute } from 'astro';
import { isEditor } from '../../../../server/auth';
import { json, sameOrigin } from '../../../../server/http';
import { requireReportId, uploadReportImage } from '../../../../server/reports';
import { reportFailure } from '../../../../server/report-http';
export const POST: APIRoute = async ({ cookies, params, request }) => {
  if (!sameOrigin(request)) return json({ error: 'Request origin is not allowed.' }, 403);
  if (!isEditor(cookies)) return json({ error: 'Unlock editing with your management password first.' }, 401);
  try { return json({ image: await uploadReportImage(requireReportId(params.id), request) }); }
  catch (error) { return reportFailure(error); }
};
