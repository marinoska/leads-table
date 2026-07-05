import type { CSSProperties } from 'react';
import { LEAD_COLUMNS, GRID_TEMPLATE_COLUMNS, ROW_HEIGHT } from './columns';
import styles from './leads.module.css';

/**
 * Placeholder shown during the initial load. Uses the same frame, header, grid
 * template, and row height as <LeadsTable /> so the swap to real data doesn't
 * shift the layout.
 */
export function TableSkeleton({ rows = 12 }: { rows?: number }) {
  return (
    <div
      className={styles.tableFrame}
      aria-hidden="true"
      style={{ '--grid-cols': GRID_TEMPLATE_COLUMNS } as CSSProperties}
    >
      <div className={styles.header}>
        {LEAD_COLUMNS.map((col) => (
          <div
            key={col.key}
            className={`${styles.headerCell} ${col.align === 'right' ? styles.right : ''}`}
          >
            {col.label}
          </div>
        ))}
      </div>
      <div className={styles.scrollArea}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className={styles.skelRow} style={{ height: ROW_HEIGHT }}>
            {LEAD_COLUMNS.map((col) => (
              <div key={col.key} className={styles.cell}>
                <div className={styles.skelBar} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
