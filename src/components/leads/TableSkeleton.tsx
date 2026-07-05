import { LEAD_COLUMNS } from './columns';
import styles from './leads.module.css';

/**
 * Placeholder table shown during the initial load. Uses the same columns/widths
 * as <LeadsTable /> so the swap to real data causes no layout shift.
 */
export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className={styles.tableWrap} aria-hidden="true">
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
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {LEAD_COLUMNS.map((col) => (
                <td key={col.key} className={styles.td}>
                  <div className={styles.skelBar} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
