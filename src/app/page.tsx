import { LeadsTableClient } from '@/components/leads/LeadsTableClient';
import styles from '@/components/leads/leads.module.css';

/**
 * Leads page — Server Component. Renders the page shell only; all data
 * fetching and interaction lives in <LeadsTableClient /> (a Client Component).
 */
export default function Home() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Leads</h1>
      <LeadsTableClient />
    </main>
  );
}
