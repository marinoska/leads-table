export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  website: string;
  status: 'new' | 'qualified' | 'unqualified' | 'contacted';
  score: number;        // 0–100
  enrichment: string | null;
  createdAt: string;    // ISO date
}