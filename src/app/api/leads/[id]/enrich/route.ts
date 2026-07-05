import { NextRequest, NextResponse } from 'next/server';
import { enrichLead } from '@/server/enrichment/enrichment.service';
import { EnrichmentError } from '@/server/enrichment/enrichment.error';

/**
 * POST /api/leads/[id]/enrich — AI-enriches a single lead (bonus).
 * Thin controller: delegate to the service; an expected EnrichmentError maps to
 * its own status, and any other (LLM/network) error becomes a 502 to retry.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const lead = await enrichLead(id);
    return NextResponse.json(lead);
  } catch (error) {
    if (error instanceof EnrichmentError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Enrichment failed' }, { status: 502 });
  }
}
