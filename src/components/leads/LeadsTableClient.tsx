'use client';

import { useLeads } from '@/hooks/useLeads';
import { LeadsTable } from './LeadsTable';
import { TableSkeleton } from './TableSkeleton';
import styles from './leads.module.css';

/**
 * Client container for the leads table. Reads query state from useLeads, decides
 * which UI to render — loading / error / empty / data — flattens the loaded
 * pages, and hands the infinite-query controls to the virtualized table.
 */
export function LeadsTableClient() {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLeads();

  if (isPending) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <div className={styles.stateBox} role="alert">
        <p className={styles.errorText}>Couldn’t load leads: {error.message}</p>
        <button type="button" className={styles.retryButton} onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  const leads = data.pages.flatMap((page) => page.data);
  const total = data.pages[0].total;

  if (leads.length === 0) {
    return <div className={styles.stateBox}>No leads found.</div>;
  }

  return (
    <div className={styles.results}>
      <LeadsTable
        leads={leads}
        total={total}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
