import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/leads/[id]/enrich
 *
 * BONUS TASK — AI Enrichment
 *
 * 1. Look up the lead by ID
 * 2. Call an LLM to research the company based on their website
 * 3. Save the enrichment text to the database
 * 4. Return the updated lead
 *
 * See README.md for full details.
 */

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // TODO: implement AI enrichment
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}