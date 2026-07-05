/**
 * The expected, mappable enrichment failures and how each maps to an HTTP status
 * + client message. Single source of truth: the service throws by `reason`, the
 * route reads the status/message off the thrown error.
 */
export const ENRICH_FAILURES = {
  not_found: { status: 404, message: 'Lead not found' },
  already_enriched: { status: 400, message: 'Lead is already enriched' },
  not_configured: { status: 501, message: 'Enrichment is not configured' },
} as const;

export type EnrichFailure = keyof typeof ENRICH_FAILURES;

/** Thrown by the enrichment service for an expected failure the route can map. */
export class EnrichmentError extends Error {
  readonly status: number;

  constructor(readonly reason: EnrichFailure) {
    super(ENRICH_FAILURES[reason].message);
    this.name = 'EnrichmentError';
    this.status = ENRICH_FAILURES[reason].status;
  }
}
