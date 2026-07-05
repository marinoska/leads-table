import { prisma } from '@/lib/prisma';
import { Prisma } from '../../../generated/prisma';
import type { ListLeadsQuery } from './lead.schema';

/** Data access for leads: builds the Prisma filter/sort from validated query params. */
export async function listLeads({ limit, offset, status, search, sortBy, sortOrder }: ListLeadsQuery) {
  // SQLite's LIKE (what `contains` compiles to) is case-insensitive for ASCII,
  // so no `mode: 'insensitive'` is needed (and it isn't supported on SQLite).
  const where: Prisma.LeadWhereInput = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { company: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      // secondary sort on the unique id keeps pagination stable when the primary
      // sort field has ties (e.g. equal createdAt / score).
      orderBy: [{ [sortBy]: sortOrder }, { id: 'asc' }] as Prisma.LeadOrderByWithRelationInput[],
      skip: offset,
      take: limit,
    }),
    prisma.lead.count({ where }),
  ]);

  return { data, total, limit, offset, hasMore: offset + limit < total };
}
