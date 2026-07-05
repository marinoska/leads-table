import { prisma } from '@/lib/prisma';

/** Looks up a single lead by id (null if it doesn't exist). */
export function findLeadById(id: string) {
  return prisma.lead.findUnique({ where: { id } });
}

/** Persists the enrichment summary on a lead and returns the updated row. */
export function saveEnrichment(id: string, enrichment: string) {
  return prisma.lead.update({ where: { id }, data: { enrichment } });
}
