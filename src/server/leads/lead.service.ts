import { findLeadById, saveEnrichment } from './lead.repository';
import { isEnrichmentConfigured, researchCompany } from '../enrichment/openai';
import { EnrichmentError } from '../enrichment/enrichment-error';

/**
 * Enriches a lead: look it up, guard against missing / already-enriched / not
 * configured, then call the LLM and persist the summary. Returns the updated
 * lead.
 *
 * Each guard throws an EnrichmentError (which carries the HTTP status the route
 * maps to). The checks run in a deliberate order — existence before the config
 * gate — so a missing lead is a 404 even with no API key. A genuine LLM/network
 * error is left to throw as-is; the route turns that into a 502.
 */
export async function enrichLead(id: string) {
  const lead = await findLeadById(id);
  if (!lead) throw new EnrichmentError('not_found');
  if (lead.enrichment !== null) throw new EnrichmentError('already_enriched');
  if (!isEnrichmentConfigured()) throw new EnrichmentError('not_configured');

  const summary = await researchCompany(lead.website);
  return saveEnrichment(id, summary);
}
