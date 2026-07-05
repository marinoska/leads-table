import type { Lead } from '@/types';
import styles from './leads.module.css';

const BADGE_CLASS: Record<Lead['status'], string> = {
  new: styles.badgeNew,
  qualified: styles.badgeQualified,
  unqualified: styles.badgeUnqualified,
  contacted: styles.badgeContacted,
};

/** Maps a lead status to a colored pill. Badge-style logic stays isolated here. */
export function StatusBadge({ status }: { status: Lead['status'] }) {
  return <span className={`${styles.badge} ${BADGE_CLASS[status] ?? ''}`}>{status}</span>;
}
