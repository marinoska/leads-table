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

/**
 * Renders one lead row. Row height is fixed via CSS (no content-driven jumps),
 * and an empty email/website degrades to a muted dash.
 */
export function LeadRow({ lead }: { lead: Lead }) {
  return (
    <tr>
      <td className={styles.td} title={lead.name}>
        {lead.name}
      </td>
      <td className={styles.td} title={lead.company}>
        {lead.company}
      </td>
      <td className={styles.td} title={lead.email}>
        {lead.email ? (
          <a className={styles.link} href={`mailto:${lead.email}`}>
            {lead.email}
          </a>
        ) : (
          <span className={styles.muted}>—</span>
        )}
      </td>
      <td className={styles.td} title={lead.website}>
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
      </td>
      <td className={styles.td}>
        <StatusBadge status={lead.status} />
      </td>
      <td className={`${styles.td} ${styles.right}`}>{lead.score}</td>
      <td className={styles.td}>{formatDate(lead.createdAt)}</td>
    </tr>
  );
}
