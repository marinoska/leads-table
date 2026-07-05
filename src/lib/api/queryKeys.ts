import type { LeadListFilters } from '@/lib/api/leads';

/**
 * Single source of truth for React Query keys. Import these instead of writing
 * key arrays inline, so a query and its invalidations can never drift apart.
 *
 * - `leadKeys.all`  → broad key for invalidating every leads query at once.
 * - `leadKeys.list` → the paginated (infinite) list for a set of filters; each
 *   filter combination caches separately, and changing filters starts fresh.
 */
export const leadKeys = {
  all: ['leads'] as const,
  list: (filters: LeadListFilters) => [...leadKeys.all, 'list', filters] as const,
};
