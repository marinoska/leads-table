'use client';

import type { CSSProperties } from 'react';
import type { Lead } from '@/types';
import type { LeadSort, LeadSortField } from '@/lib/api/leads';
import { useSpinnerVisible } from '@/hooks/useSpinnerVisible';
import { useLeadsVirtualizer } from '@/hooks/useLeadsVirtualizer';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { LEAD_COLUMNS, GRID_TEMPLATE_COLUMNS } from './columns';
import { LeadRow } from './LeadRow';
import styles from './leads.module.css';

// Minimum time the loading spinner stays up, so instant local fetches still show it.
const SPINNER_MIN_MS = 500;

// Constant shared grid template for the header + rows — never changes, so it
// lives at module scope rather than being rebuilt each render.
const GRID_STYLE = { '--grid-cols': GRID_TEMPLATE_COLUMNS } as CSSProperties;

interface LeadsTableProps {
  leads: Lead[];
  total: number;
  sort: LeadSort;
  onSort: (field: LeadSortField) => void;
  /** Changes when the query (sort/filters) changes, so the table scrolls to top. */
  scrollResetKey: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => void;
}

/**
 * Virtualized leads table. The header lives outside the scroll area (always
 * visible); only the rows scroll, and only the ones in view (plus overscan) are
 * in the DOM. While the next page loads a fade + spinner overlay the bottom; if
 * that page fails, an inline retry shows instead and the loaded rows stay put.
 */
export function LeadsTable({
  leads,
  total,
  sort,
  onSort,
  scrollResetKey,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  fetchNextPage,
}: LeadsTableProps) {
  const { scrollRef, virtualRows, totalSize, lastIndex, firstVisibleRow, lastVisibleRow } =
    useLeadsVirtualizer(leads.length, scrollResetKey);

  useInfiniteScroll({
    lastIndex,
    count: leads.length,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
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

      <div role="table" aria-rowcount={total + 1} className={styles.tableFrame} style={GRID_STYLE}>
        <div role="row" aria-rowindex={1} className={styles.header}>
          {LEAD_COLUMNS.map((col) => {
            const { sortKey } = col;
            const isSorted = sortKey !== undefined && sortKey === sort.sortBy;
            const ariaSort =
              sortKey === undefined
                ? undefined
                : isSorted
                  ? sort.sortOrder === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none';
            return (
              <div
                key={col.key}
                role="columnheader"
                aria-sort={ariaSort}
                className={`${styles.headerCell} ${col.align === 'right' ? styles.right : ''}`}
              >
                {sortKey === undefined ? (
                  col.label
                ) : (
                  <button type="button" className={styles.sortButton} onClick={() => onSort(sortKey)}>
                    <span className={styles.sortLabel}>{col.label}</span>
                    <span className={styles.sortArrow} aria-hidden="true">
                      {isSorted ? (sort.sortOrder === 'asc' ? '▲' : '▼') : ''}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
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
                  size={virtualRow.size}
                  start={virtualRow.start}
                />
              );
            })}
          </div>

          {/* Inside the scroll content, so it only shows at the bottom and never
              resizes the viewport (which would make it flicker). */}
          {!hasNextPage && <p className={styles.endNote}>All leads loaded</p>}
        </div>

        {showSpinner && (
          <>
            <div className={styles.fade} aria-hidden="true" />
            <div
              className={`${styles.spinner} ${styles.spinnerBottom}`}
              role="status"
              aria-label="Loading more leads"
            />
          </>
        )}
      </div>

      {isFetchNextPageError && !showSpinner && (
        <div className={styles.loadError} role="alert">
          <span>Couldn’t load more leads.</span>
          <button type="button" className={styles.retryButton} onClick={() => fetchNextPage()}>
            Retry
          </button>
        </div>
      )}
    </>
  );
}
