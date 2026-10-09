import { get, put, BlobPreconditionFailedError, BlobError } from '@vercel/blob';
import { env } from './env';
const MAX_DOCUMENT_BYTES = 25_000_000;

function prefix() {
  const deployment = env('VERCEL_ENV') || 'development';
  const branch = (env('VERCEL_GIT_COMMIT_REF') || 'local').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
  return `journal/v1/${deployment === 'production' ? 'production' : `${deployment}/${branch}`}`;
}
function options() {
  const token = env('BLOB_READ_WRITE_TOKEN'); const storeId = env('BLOB_STORE_ID');
  if (!token && !storeId) throw new Error('Cloud storage is not connected.');
  return token ? { token } : { storeId, oidcToken: env('VERCEL_OIDC_TOKEN') };
}
export function cloudConfigured() { return Boolean(env('BLOB_READ_WRITE_TOKEN') || env('BLOB_STORE_ID')); }
export async function readJson<T>(path: string): Promise<{ data: T; etag: string } | null> {
  const result = await get(`${prefix()}/${path}.json`, { access: 'private', useCache: false, ...options() });
  if (!result || result.statusCode !== 200) return null;
  const text = await new Response(result.stream).text();
  if (Buffer.byteLength(text, 'utf8') > MAX_DOCUMENT_BYTES) throw new Error('Stored document is too large.');
  // Compressed private responses may prefix the underlying Blob ETag with W/.
  // Conditional writes expect the stored object's strong ETag, preserving its quotes.
  return { data: JSON.parse(text) as T, etag: result.blob.etag.replace(/^W\//, '') };
}
export async function updateJson<T>(path: string, initial: () => T, mutate: (data: T) => T): Promise<T> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await readJson<T>(path);
    const data = mutate(existing ? structuredClone(existing.data) : initial());
    const serialized = JSON.stringify(data);
    if (Buffer.byteLength(serialized, 'utf8') > MAX_DOCUMENT_BYTES) throw new Error('Record storage limit reached. Your previous records are safe; shorten this entry and retry.');
    try {
      await put(`${prefix()}/${path}.json`, serialized, {
        access: 'private', addRandomSuffix: false, allowOverwrite: Boolean(existing),
        ...(existing ? { ifMatch: existing.etag } : {}),
        contentType: 'application/json', cacheControlMaxAge: 60, ...options(),
      });
      return data;
    } catch (error) {
      if (!(error instanceof BlobPreconditionFailedError) && !(error instanceof BlobError && /already exists/i.test(error.message))) throw error;
    }
  }
  throw new Error('Record changed on another device. Please reload and try again.');
}
