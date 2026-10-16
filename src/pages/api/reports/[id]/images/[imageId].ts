import type { APIRoute } from 'astro';
import { isEditor } from '../../../../../server/auth';
import { requireReportId, readReportImage } from '../../../../../server/reports';
import { reportFailure } from '../../../../../server/report-http';
export const GET: APIRoute = async ({ cookies, params }) => {
  try { return await readReportImage(requireReportId(params.id), params.imageId, isEditor(cookies)); }
  catch (error) { return reportFailure(error); }
};
