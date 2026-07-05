export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  /** JSON request body — serialized automatically, with Content-Type set. */
  body?: unknown;
  /** Abort signal (React Query passes one into its queryFn/mutationFn). */
  signal?: AbortSignal;
}

/**
 * Thin JSON client for this app's same-origin `/api` routes. Sets the JSON
 * Content-Type when there's a body, forwards an optional AbortSignal, and on a
 * non-2xx response throws with the API's `{ error }` message so React Query can
 * surface it as `error`.
 *
 * Deliberately minimal: no auth/base-URL/custom headers — the API is same-origin
 * and unauthenticated, and every route returns JSON.
 */
export async function sendApiRequest<T>(
  method: HttpMethod,
  path: string,
  { body, signal }: ApiRequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.error ?? `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}
