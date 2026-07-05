'use client';

import type { CSSProperties } from 'react';
import type { Lead } from '@/types';
import { useSpinnerVisible } from '@/hooks/useSpinnerVisible';
import { useLeadsVirtualizer } from '@/hooks/useLeadsVirtualizer';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { LEAD_COLUMNS, GRID_TEMPLATE_COLUMNS } from './columns';
import { LeadRow } from './LeadRow';
import styles from './leads.module.css';

// Minimum time the loading spinner stays up, so instant local fetches still show it.
const SPINNER_MIN_MS = 500;

interface LeadsTableProps {
  leads: Lead[];
  total: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

/**
 * Virtualized leads table. The header lives outside the scroll area (always
 * visible); only the rows scroll, and only the ones in view (plus overscan) are
 * in the DOM. Virtualization + infinite-load live in useLeadsVirtualizer; a fade
 * + spinner overlay the bottom while the next page loads.
 */
export function LeadsTable({
  leads,
  total,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: LeadsTableProps) {
  const { scrollRef, virtualRows, totalSize, lastIndex, firstVisibleRow, lastVisibleRow } =
    useLeadsVirtualizer(leads.length);

  useInfiniteScroll({
    lastIndex,
    count: leads.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  // Padded so instant local fetches still show the spinner; useInfiniteScroll
  // guards on the real isFetchingNextPage, so this is display-only.
  const showSpinner = useSpinnerVisible(isFetchingNextPage, SPINNER_MIN_MS);

  return (
    <>
      <p className={styles.count}>
        Showing {firstVisibleRow}–{lastVisibleRow} of {total.toLocaleString()} leads
      </p>

      <div
        role="table"
        aria-rowcount={total + 1}
        className={styles.tableFrame}
        style={{ '--grid-cols': GRID_TEMPLATE_COLUMNS } as CSSProperties}
      >
        <div role="row" aria-rowindex={1} className={styles.header}>
          {LEAD_COLUMNS.map((col) => (
            <div
              key={col.key}
              role="columnheader"
              className={`${styles.headerCell} ${col.align === 'right' ? styles.right : ''}`}
            >
              {col.label}
            </div>
          ))}
        </div>

        <div role="rowgroup" className={styles.scrollArea} ref={scrollRef}>
          <div role="presentation" className={styles.rowGroup} style={{ height: totalSize }}>
            {virtualRows.map((virtualRow) => {
              const lead = leads[virtualRow.index];
              return (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  rowIndex={virtualRow.index}
                  style={{ height: virtualRow.size, transform: `translateY(${virtualRow.start}px)` }}
                />
              );
            })}
          </div>
        </div>

        {showSpinner && (
          <>
            <div className={styles.fade} aria-hidden="true" />
            <div className={styles.spinner} role="status" aria-label="Loading more leads" />
          </>
        )}
      </div>
    </>
  );
}
