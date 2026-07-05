'use client';

import { useLeads } from '@/hooks/useLeads';
import { LeadsTable } from './LeadsTable';
import { TableSkeleton } from './TableSkeleton';
import styles from './leads.module.css';

/**
 * Client container for the leads table. Reads query state from useLeads and
 * decides which UI to render — loading / error / empty / data — then hands
 * already-prepared data to the presentational <LeadsTable />.
 */
export function LeadsTableClient() {
  const { data, isPending, isError, error, refetch } = useLeads();

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

  const { data: leads, total } = data;
  if (leads.length === 0) {
    return <div className={styles.stateBox}>No leads found.</div>;
  }

  return (
    <div>
      <p className={styles.count}>
        Showing {leads.length} of {total.toLocaleString()} leads
      </p>
      <LeadsTable leads={leads} />
    </div>
  );
}
