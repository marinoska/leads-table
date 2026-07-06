'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/leads/ErrorState';
import styles from '@/components/leads/leads.module.css';

/**
 * Route error boundary (Next.js convention). Catches render-time crashes in the
 * leads page tree — a distinct failure class from the data-fetch errors React
 * Query already handles inline — and shows the shared error card with a reset.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.page}>
      <ErrorState message="Something went wrong." retryLabel="Try again" onRetry={reset} />
    </main>
  );
}
