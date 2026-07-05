import type { Lead } from '@/types';
import { LEAD_COLUMNS } from './columns';
import { LeadRow } from './LeadRow';
import styles from './leads.module.css';

export interface LeadsTableProps {
  leads: Lead[];
}

/**
 * Presentational table — receives leads as props and renders them.
 * No fetching, no API knowledge; safe to reuse anywhere.
 */
export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <colgroup>
          {LEAD_COLUMNS.map((col) => (
            <col key={col.key} style={{ width: col.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {LEAD_COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`${styles.th} ${col.align === 'right' ? styles.right : ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
