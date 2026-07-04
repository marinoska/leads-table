import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/leads
 *
 * Build a paginated, filterable, sortable leads endpoint using Prisma.
 *
 * 1. Seed the database with 10,000 realistic leads (once)
 * 2. Implement the GET handler with query params:
 *    - limit, offset, status, search, sortBy, sortOrder
 * 3. Use Prisma queries (findMany, count) — not raw SQL or JS filtering
 * 4. Validate all inputs — return 400 for invalid params
 *
 * See README.md for full details.
 */

export async function GET(request: NextRequest) {
  // TODO: implement paginated, filterable, sortable endpoint
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}