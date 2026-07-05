import { NextRequest, NextResponse } from 'next/server';
import { parseSearchParams, validationError } from '@/lib/api/validation';
import { listLeadsQuerySchema } from '@/server/leads/lead.schema';
import { listLeads } from '@/server/leads/lead.repository';

/**
 * GET /api/leads — paginated, filterable, sortable list of leads.
 * Validates the query params, delegates the query to the lead repository,
 * then shapes the paginated response. Invalid params → 400.
 */
export async function GET(request: NextRequest) {
  const parsed = parseSearchParams(request.nextUrl.searchParams, listLeadsQuerySchema);
  if (!parsed.success) return validationError(parsed.error);

  return NextResponse.json(await listLeads(parsed.data));
}
