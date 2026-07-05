'use client';

import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchLeads, type LeadListFilters, type LeadsQueryParams } from '@/lib/api/leads';
import { leadKeys } from '@/lib/api/queryKeys';

const PAGE_SIZE = 20;

/**
 * Loads leads page-by-page for infinite scroll, driven by `filters` — the status
 * and search filters plus the active sort. All of them are part of the queryKey,
 * so changing any one starts a fresh query at offset 0 and drops the old pages.
 * The per-page request is assembled here as LeadsQueryParams (string | number
 * values), so an unset filter becomes an absent key — never `?x=undefined` — and
 * the type won't let one slip through.
 *
 * `keepPreviousData` keeps the current rows on screen while a new sort/filter
 * loads, instead of tearing the table down to a full-page spinner (which would
 * drop focus from the just-clicked sort header). The first load has no previous
 * data, so it still shows the spinner.
 */
export function useLeads(filters: LeadListFilters) {
  return useInfiniteQuery({
    queryKey: leadKeys.list(filters),
    queryFn: ({ pageParam, signal }) => {
      const query: LeadsQueryParams = {
        limit: PAGE_SIZE,
        offset: pageParam,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };
      if (filters.search) query.search = filters.search;
      if (filters.status) query.status = filters.status;
      return fetchLeads(query, signal);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined,
    placeholderData: keepPreviousData,
  });
}
