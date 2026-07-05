'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLeads } from '@/lib/api/leads';
import { leadKeys } from '@/lib/api/queryKeys';

const PAGE_SIZE = 20;

/**
 * Loads leads page-by-page for infinite scroll. Each page fetches PAGE_SIZE rows
 * at the next offset; `getNextPageParam` returns undefined once the API reports
 * no more rows, which is how the UI knows to stop. All loaded pages stay cached
 * (react-virtual keeps the DOM flat, so there's no need to cap pages); filters
 * and sort will join the queryKey in later tasks.
 */
export function useLeads() {
  return useInfiniteQuery({
    queryKey: leadKeys.list(),
    queryFn: ({ pageParam, signal }) => fetchLeads({ limit: PAGE_SIZE, offset: pageParam }, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined,
  });
}
