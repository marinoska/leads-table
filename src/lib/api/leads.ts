import type { Lead, LeadsResponse } from '@/types';
import type { ListLeadsQuery } from '@/server/leads/lead.schema';
import { sendApiRequest } from '@/lib/client';

/**
 * Serializable query params: every value is present (`string | number`), so
 * `undefined` can't be passed and `?x=undefined` can't be sent. An unset filter
 * is simply an absent key — the caller builds this, omitting empties (useLeads).
 */
export type LeadsQueryParams = Record<string, string | number>;

/** The column the list is sorted by (mirrors the API's `sortBy` enum). */
export type LeadSortField = ListLeadsQuery['sortBy'];

/** Active sort — which column and which direction. Always present (has a default). */
export type LeadSort = Pick<ListLeadsQuery, 'sortBy' | 'sortOrder'>;

/** Default sort — newest first — matching the API schema's defaults. */
export const DEFAULT_LEAD_SORT: LeadSort = { sortBy: 'createdAt', sortOrder: 'desc' };

/**
 * User-facing, server-side query state — status/search filters (optional) plus the
 * active sort (always set). These feed the query key, so changing any of them
 * starts a fresh query at offset 0.
 */
export type LeadListFilters = Partial<Pick<ListLeadsQuery, 'status' | 'search'>> & LeadSort;

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

/** AI-enriches a single lead (bonus) and returns the updated lead. */
export function enrichLead(id: string): Promise<Lead> {
  return sendApiRequest<Lead>('POST', `/leads/${id}/enrich`);
}
