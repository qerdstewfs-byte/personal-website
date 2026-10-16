import { randomUUID } from 'node:crypto';
import { readJson, updateJson, writePrivateImage, readPrivateImage } from './storage';
import { applyReportAction, initialReportStore, projectReport, ReportError, UUID_PATTERN, validReportId, canReadReportImage } from '../lib/reports';
import type { ReportStore, ReportImage } from '../lib/reports';

const DOCUMENT = 'weekly-reports/document';
export const MAX_IMAGE_BYTES = 4_000_000;
export async function readReportStore(): Promise<ReportStore> {
  const record = await readJson<ReportStore>(DOCUMENT);
  if (!record) return initialReportStore();
  if (record.data.schemaVersion !== 1 || !record.data.reports || !record.data.images) throw new Error('Unsupported report store.');
  return record.data;
}
export function requireReportId(value: string | undefined) {
  if (!value || !validReportId(value)) throw new ReportError('Report not found.', 404);
  return value;
}
export async function writeReport(id: string | null, input: Record<string, unknown>) {
  const now = new Date().toISOString();
  const store = await updateJson<ReportStore>(DOCUMENT, initialReportStore, data => applyReportAction(data, id, input, now));
  const reportId = id ?? `report-${input.requestId}`;
  return projectReport(store.reports[reportId], true)!;
}
export async function limitedBytes(request: Request, limit: number) {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > limit) throw new ReportError('The upload is too large.', 413);
  if (!request.body) throw new ReportError('The request is empty.');
  const reader = request.body.getReader();
  const parts: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.length;
      if (size > limit) { await reader.cancel(); throw new ReportError('The upload is too large.', 413); }
      parts.push(value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(parts, size);
}
export async function reportBody(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') throw new ReportError('Expected JSON.');
  const bytes = await limitedBytes(request, 512_000);
  let value: unknown;
  try { value = JSON.parse(bytes.toString('utf8')); } catch { throw new ReportError('Invalid report request.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ReportError('Invalid report request.');
  return value as Record<string, unknown>;
}
export function imageProperties(bytes: Buffer): Pick<ReportImage, 'mime' | 'width' | 'height'> {
  let width = 0, height = 0; let mime: ReportImage['mime'];
  if (bytes.length >= 33 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && bytes.toString('ascii', 12, 16) === 'IHDR' && bytes.readUInt32BE(8) === 13) {
    mime = 'image/png'; width = bytes.readUInt32BE(16); height = bytes.readUInt32BE(20);
    let offset = 8, hasData = false, ended = false;
    while (offset + 12 <= bytes.length) {
      const length = bytes.readUInt32BE(offset), kind = bytes.toString('ascii', offset + 4, offset + 8);
      if (offset + length + 12 > bytes.length) break;
      if (kind === 'IDAT') hasData = true;
      if (kind === 'IEND' && length === 0) { ended = offset + 12 === bytes.length; break; }
      offset += length + 12;
    }
    if (!hasData || !ended) throw new ReportError('Use a complete PNG or JPEG image.');
  } else if (bytes.length > 4 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9) {
    mime = 'image/jpeg'; let offset = 2;
    while (offset + 4 < bytes.length) {
      if (bytes[offset++] !== 0xff) break;
      while (bytes[offset] === 0xff) offset++;
      const marker = bytes[offset++];
      if (marker === 0xda || marker === 0xd9) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      const length = bytes.readUInt16BE(offset);
      if (length < 2 || offset + length > bytes.length) break;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker) && length >= 8) {
        height = bytes.readUInt16BE(offset + 3); width = bytes.readUInt16BE(offset + 5); break;
      }
      offset += length;
    }
  } else throw new ReportError('Use a PNG or JPEG image.');
  if (!width || !height || width > 10_000 || height > 10_000 || width * height > 40_000_000) throw new ReportError('Use an image no larger than 10,000 pixels per side and 40 megapixels.');
  return { mime, width, height };
}
const imagePath = (image: ReportImage) => `weekly-reports/images/${image.id}.${image.mime === 'image/png' ? 'png' : 'jpg'}`;
export async function uploadReportImage(reportId: string, request: Request) {
  const store = await readReportStore();
  if (!Object.hasOwn(store.reports, reportId)) throw new ReportError('Report not found.', 404);
  if (Object.values(store.images).filter(image => image.reportId === reportId).length >= 200) throw new ReportError('This report has reached its upload limit.');
  if (!['image/png', 'image/jpeg'].includes(request.headers.get('content-type')?.split(';')[0] ?? '')) throw new ReportError('Use a PNG or JPEG image.');
  const bytes = await limitedBytes(request, MAX_IMAGE_BYTES);
  const props = imageProperties(bytes);
  const image: ReportImage = { id: randomUUID(), reportId, ...props, bytes: bytes.length };
  await writePrivateImage(imagePath(image), bytes, image.mime);
  await updateJson<ReportStore>(DOCUMENT, initialReportStore, data => {
    if (!Object.hasOwn(data.reports, reportId)) throw new ReportError('Report not found.', 404);
    if (Object.values(data.images).filter(item => item.reportId === reportId).length >= 200) throw new ReportError('This report has reached its upload limit.');
    data.images[image.id] = image; return data;
  });
  return image;
}
export async function readReportImage(reportId: string, imageId: string | undefined, editing: boolean) {
  if (!imageId || !UUID_PATTERN.test(imageId)) throw new ReportError('Image not found.', 404);
  const store = await readReportStore();
  if (!canReadReportImage(store, reportId, imageId, editing)) throw new ReportError('Image not found.', 404);
  const metadata = store.images[imageId], blob = await readPrivateImage(imagePath(metadata));
  if (!blob || blob.statusCode !== 200) throw new ReportError('Image not found.', 404);
  return new Response(blob.stream, { headers: {
    'Content-Type': metadata.mime, 'Content-Length': String(metadata.bytes),
    'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff',
    'X-Image-Width': String(metadata.width), 'X-Image-Height': String(metadata.height),
    'Content-Disposition': 'inline',
  } });
}
