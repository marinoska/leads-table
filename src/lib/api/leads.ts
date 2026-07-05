import type { LeadsResponse } from '@/types';
import type { ListLeadsQuery } from '@/server/leads/lead.schema';
import { sendApiRequest } from '@/lib/client';

/**
 * Serializable query params: every value is present (`string | number`), so
 * `undefined` can't be passed and `?x=undefined` can't be sent. An unset filter
 * is simply an absent key — the caller builds this, omitting empties (useLeads).
 */
export type LeadsQueryParams = Record<string, string | number>;

/** User-facing, server-side filters (status + search) — these feed the query key. */
export type LeadListFilters = Partial<Pick<ListLeadsQuery, 'status' | 'search'>>;

/**
 * Fetches a page of leads by serializing the given (already-clean) params.
 * Transport + error handling live in sendApiRequest.
 */
export function fetchLeads(params: LeadsQueryParams, signal?: AbortSignal): Promise<LeadsResponse> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, String(value));
  }
  const query = searchParams.toString();
  return sendApiRequest<LeadsResponse>('GET', `/leads${query ? `?${query}` : ''}`, { signal });
}
