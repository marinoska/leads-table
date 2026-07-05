import { z } from 'zod';
import { STATUSES } from '@/lib/constants';

export const listLeadsQuerySchema = z.object({
  limit: z.coerce
    .number({ error: 'limit must be a number' })
    .int('limit must be an integer')
    .min(0, 'limit must be 0 or greater')
    .max(100, 'limit must be 100 or less')
    .default(20),
  offset: z.coerce
    .number({ error: 'offset must be a number' })
    .int('offset must be an integer')
    .min(0, 'offset must be 0 or greater')
    .default(0),
  status: z.enum(STATUSES, { error: `status must be one of: ${STATUSES.join(', ')}` }).optional(),
  search: z.string().trim().min(1, 'search must not be empty').optional(),
  sortBy: z.enum(['name', 'score', 'createdAt'], {
    error: 'sortBy must be one of: name, score, createdAt',
  }).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc'], { error: "sortOrder must be 'asc' or 'desc'" }).default('desc'),
});

export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>;
