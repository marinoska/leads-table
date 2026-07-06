'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useDebounce } from 'use-debounce';
import type { Status } from '@/lib/constants';
import type { LeadListFilters, LeadSort, LeadSortField } from '@/lib/api/leads';
import { DEFAULT_LEAD_SORT } from '@/lib/api/leads';
import { useLeads } from '@/hooks/useLeads';
import { LeadsFilters } from './LeadsFilters';
import { LeadsTable } from './LeadsTable';
import { ErrorState } from './ErrorState';
import styles from './leads.module.css';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Client container for the leads table. Owns the query state — the search and
 * status filters plus the active sort — debounces the search, and passes it all
 * to useLeads, which puts it in the query key so changing any of it refetches
 * from offset 0. The filter bar stays mounted across loading/error/empty so the
 * input keeps focus while results reload.
 */
export function LeadsTableClient() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Status | ''>('');
  const [sort, setSort] = useState<LeadSort>(DEFAULT_LEAD_SORT);
  const [retrying, setRetrying] = useState(false);
  const [debouncedSearch] = useDebounce(search, SEARCH_DEBOUNCE_MS);

  // Empty search/status → undefined: the query key omits it, and useLeads drops
  // it when building the request params, so `?search=undefined` is never sent.
  const filters: LeadListFilters = {
    search: debouncedSearch || undefined,
    status: status || undefined,
    ...sort,
  };

  // Changes whenever the query changes (sort or a filter); the table uses it to
  // scroll back to the top when the result set is replaced.
  const scrollResetKey = JSON.stringify(filters);

  // Clicking the active column flips its direction; a new column starts ascending.
  const handleSort = (field: LeadSortField) => {
    setSort((current) =>
      current.sortBy === field
        ? { sortBy: field, sortOrder: current.sortOrder === 'asc' ? 'desc' : 'asc' }
        : { sortBy: field, sortOrder: 'asc' },
    );
  };

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useLeads(filters);

  // Flatten the loaded pages once per data change, not on every render.
  const leads = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;

  // Retry the failed load, showing the spinner (not the stale cached rows) while
  // the refetch is in flight.
  const handleRetry = () => {
    setRetrying(true);
    refetch().finally(() => setRetrying(false));
  };

  let content: ReactNode;
  if (isPending || retrying) {
    content = (
      <div className={styles.centerBox}>
        <div className={styles.spinner} role="status" aria-label="Loading leads" />
      </div>
    );
  } else if ((isError && !isFetchNextPageError) || !data) {
    // The load failed (initial / filter / sort). Gate on isError, not just !data, so a
    // failure shows this clean card instead of the stale rows keepPreviousData keeps.
    // A failed *next* page keeps its rows and is handled inline in the table.
    content = (
      <ErrorState
        message="Couldn’t load leads. Please check your connection and try again."
        onRetry={handleRetry}
      />
    );
  } else {
    content =
      leads.length === 0 ? (
        <div className={styles.stateBox}>No leads found.</div>
      ) : (
        <LeadsTable
          leads={leads}
          total={total}
          sort={sort}
          onSort={handleSort}
          scrollResetKey={scrollResetKey}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isFetchNextPageError={isFetchNextPageError}
          fetchNextPage={fetchNextPage}
        />
      );
  }

  return (
    <div className={styles.results}>
      <LeadsFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />
      {content}
    </div>
  );
}
