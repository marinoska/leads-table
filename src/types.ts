import type { Status } from '@/lib/constants';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  website: string;
  status: Status;
  score: number;        // 0–100
  enrichment: string | null;
  createdAt: string;    // ISO date
}

/** Shape of `GET /api/leads` — mirrors the repository's paginated response. */
export interface LeadsResponse {
  data: Lead[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}