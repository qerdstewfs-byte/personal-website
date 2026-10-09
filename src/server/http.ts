export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
export function sameOrigin(request: Request): boolean {
  return request.headers.get('origin') === new URL(request.url).origin;
}
export async function body(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('Expected JSON.');
  const text = await request.text(); if (text.length > 50_000) throw new Error('Request too large.');
  const value = JSON.parse(text); if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid request.');
  return value;
}
