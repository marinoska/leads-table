/**
 * Single source of truth for React Query keys. Import these instead of writing
 * key arrays inline, so a query and its invalidations can never drift apart.
 *
 * - `leadKeys.all`  → broad key for invalidating every leads query at once.
 * - `leadKeys.list` → the paginated (infinite) list. Filters/sort will become an
 *   argument here in later tasks so each filter combination caches separately.
 */
export const leadKeys = {
  all: ['leads'] as const,
  list: () => [...leadKeys.all, 'list'] as const,
};
