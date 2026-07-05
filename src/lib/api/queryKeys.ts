import type { FetchLeadsParams } from '@/lib/api/leads';

/**
 * Single source of truth for React Query keys. Import these instead of writing
 * key arrays inline, so a query and its invalidations can never drift apart.
 *
 * - `leadKeys.all`  → broad key for invalidating every leads query at once.
 * - `leadKeys.list` → the specific key for a given set of list params.
 */
export const leadKeys = {
  all: ['leads'] as const,
  list: (params: FetchLeadsParams) => [...leadKeys.all, params] as const,
};
