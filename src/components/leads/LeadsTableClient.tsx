'use client';

import { useState, type ReactNode } from 'react';
import { useDebounce } from 'use-debounce';
import type { Status } from '@/lib/constants';
import type { LeadListFilters } from '@/lib/api/leads';
import { useLeads } from '@/hooks/useLeads';
import { LeadsFilters } from './LeadsFilters';
import { LeadsTable } from './LeadsTable';
import styles from './leads.module.css';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Client container for the leads table. Owns the filter state (search + status),
 * debounces the search, and passes the filters to useLeads — which puts them in
 * the query key, so changing a filter refetches from offset 0 and clears the old
 * results. The filter bar stays mounted across loading/error/empty so the input
 * keeps focus while results reload.
 */
export function LeadsTableClient() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Status | ''>('');
  const [debouncedSearch] = useDebounce(search, SEARCH_DEBOUNCE_MS);

  // Empty search/status → undefined: the query key omits it, and useLeads drops
  // it when building the request params, so `?search=undefined` is never sent.
  const filters: LeadListFilters = {
    search: debouncedSearch || undefined,
    status: status || undefined,
  };

  const {
    data,
    isPending,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useLeads(filters);

  let content: ReactNode;
  if (isPending) {
    content = (
      <div className={styles.centerBox}>
        <div className={styles.spinner} role="status" aria-label="Loading leads" />
      </div>
    );
  } else if (!data) {
    // Initial load failed (no pages yet) — full error state with retry. A failed
    // next page keeps its data, so it's handled inline at the bottom of the table.
    content = (
      <div className={styles.stateBox} role="alert">
        <p className={styles.errorText}>Couldn’t load leads: {error?.message ?? 'please try again'}</p>
        <button type="button" className={styles.retryButton} onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  } else {
    const leads = data.pages.flatMap((page) => page.data);
    const total = data.pages[0].total;
    content =
      leads.length === 0 ? (
        <div className={styles.stateBox}>No leads found.</div>
      ) : (
        <LeadsTable
          leads={leads}
          total={total}
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
