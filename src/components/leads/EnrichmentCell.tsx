'use client';

import { useEnrichLead } from '@/hooks/useEnrichLead';
import styles from './leads.module.css';

interface EnrichmentCellProps {
  leadId: string;
  enrichment: string | null;
}

/**
 * Enrichment column cell. Already-enriched leads show the truncated summary as a
 * button that pops up the full text (native Popover API — renders in the top
 * layer, so the table's overflow doesn't clip it, and it light-dismisses). An
 * un-enriched lead shows an Enrich button that, per row, swaps to an in-cell
 * spinner and then the text — or to a Retry button on failure. Its own mutation
 * state keeps one row's loading from affecting any other.
 */
export function EnrichmentCell({ leadId, enrichment }: EnrichmentCellProps) {
  const { mutate, isPending, isError, error } = useEnrichLead(leadId);

  if (enrichment !== null) {
    const popoverId = `enrichment-${leadId}`;
    return (
      <div role="cell" className={styles.cell}>
        <button type="button" className={styles.enrichText} popoverTarget={popoverId}>
          {enrichment}
        </button>
        <div id={popoverId} popover="auto" className={styles.enrichPopover}>
          {enrichment}
        </div>
      </div>
    );
  }

  return (
    <div role="cell" className={styles.cell}>
      {isPending ? (
        <span className={styles.cellSpinner} role="status" aria-label="Enriching" />
      ) : isError ? (
        <button
          type="button"
          className={`${styles.enrichButton} ${styles.enrichError}`}
          title={error.message}
          onClick={() => mutate()}
        >
          Retry
        </button>
      ) : (
        <button type="button" className={styles.enrichButton} onClick={() => mutate()}>
          Enrich
        </button>
      )}
    </div>
  );
}
