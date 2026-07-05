import { memo, useMemo } from 'react';
import type { Lead } from '@/types';
import { StatusBadge } from './StatusBadge';
import styles from './leads.module.css';

const dateFmt = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '—' : dateFmt.format(date);
}

interface LeadRowProps {
  lead: Lead;
  /** 0-based data index; +2 gives the ARIA row index (header is row 1). */
  rowIndex: number;
  /** Row height (px) and top offset (px), both supplied by the virtualizer. */
  size: number;
  start: number;
}

/**
 * Renders one lead row as a grid row. The virtualizer positions it via `size` /
 * `start`; fixed height means no content-driven layout shift, and an empty
 * email/website degrades to a muted dash.
 *
 * Memoized (below) with primitive props, so scrolling only re-renders the rows
 * entering or leaving the window — a still-visible row's props don't change.
 */
function LeadRowComponent({ lead, rowIndex, size, start }: LeadRowProps) {
  const style = useMemo(
    () => ({ height: size, transform: `translateY(${start}px)` }),
    [size, start],
  );
  return (
    <div role="row" aria-rowindex={rowIndex + 2} className={styles.row} style={style}>
      <div role="cell" className={styles.cell} title={lead.name}>
        {lead.name}
      </div>
      <div role="cell" className={styles.cell} title={lead.company}>
        {lead.company}
      </div>
      <div role="cell" className={styles.cell} title={lead.email}>
        {lead.email ? (
          <a className={styles.link} href={`mailto:${lead.email}`}>
            {lead.email}
          </a>
        ) : (
          <span className={styles.muted}>—</span>
        )}
      </div>
      <div role="cell" className={styles.cell} title={lead.website}>
        {lead.website ? (
          <a
            className={styles.link}
            href={`https://${lead.website}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lead.website}
          </a>
        ) : (
          <span className={styles.muted}>—</span>
        )}
      </div>
      <div role="cell" className={styles.cell}>
        <StatusBadge status={lead.status} />
      </div>
      <div role="cell" className={`${styles.cell} ${styles.right}`}>
        {lead.score}
      </div>
      <div role="cell" className={styles.cell}>
        {formatDate(lead.createdAt)}
      </div>
    </div>
  );
}

export const LeadRow = memo(LeadRowComponent);
