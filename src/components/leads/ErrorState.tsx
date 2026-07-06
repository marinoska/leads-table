import styles from './leads.module.css';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  retryLabel?: string;
}

/**
 * Shared error card — a message plus a retry button. Used by the failed leads
 * load and the route error boundary.
 */
export function ErrorState({ message, onRetry, retryLabel = 'Retry' }: ErrorStateProps) {
  return (
    <div className={styles.stateBox} role="alert">
      <p className={styles.errorText}>{message}</p>
      <button type="button" className={styles.retryButton} onClick={onRetry}>
        {retryLabel}
      </button>
    </div>
  );
}
