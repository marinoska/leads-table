'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchLeads } from '@/lib/api/leads';
import { leadKeys } from '@/lib/api/queryKeys';

const PAGE_SIZE = 20;

/**
 * Loads the first page of leads via React Query. Loading, error, caching, and
 * request cancellation (the injected `signal`) are handled by the query.
 * Task 5 will swap this for useInfiniteQuery; filters/sort go in the queryKey.
 */
export function useLeads() {
  const params = { limit: PAGE_SIZE, offset: 0 };
  return useQuery({
    queryKey: leadKeys.list(params),
    queryFn: ({ signal }) => fetchLeads(params, signal),
  });
}
