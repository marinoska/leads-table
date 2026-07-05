import type { LeadsResponse } from '@/types';
import type { ListLeadsQuery } from '@/server/leads/lead.schema';
import { sendApiRequest } from './client';

/** The list query params the UI is allowed to send to `GET /api/leads`. */
export type FetchLeadsParams = Partial<
  Pick<ListLeadsQuery, 'limit' | 'offset' | 'status' | 'search' | 'sortBy' | 'sortOrder'>
>;

/**
 * Fetches a page of leads. Drops empty/undefined params from the query string
 * and forwards the AbortSignal; transport + error handling live in sendApiRequest.
 */
export function fetchLeads(params: FetchLeadsParams, signal?: AbortSignal): Promise<LeadsResponse> {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    qs.set(key, String(value));
  }
  const query = qs.toString();
  return sendApiRequest<LeadsResponse>('GET', `/leads${query ? `?${query}` : ''}`, { signal });
}
