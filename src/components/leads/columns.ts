/**
 * Single source of truth for the leads table columns.
 * Shared by <LeadsTable /> and <TableSkeleton /> so their widths/headers can
 * never drift — which keeps the skeleton→data swap free of layout shift.
 */
export interface LeadColumn {
  key: string;
  label: string;
  width: string;
  align?: 'right';
}

export const LEAD_COLUMNS: LeadColumn[] = [
  { key: 'name', label: 'Name', width: '16%' },
  { key: 'company', label: 'Company', width: '16%' },
  { key: 'email', label: 'Email', width: '20%' },
  { key: 'website', label: 'Website', width: '16%' },
  { key: 'status', label: 'Status', width: '10%' },
  { key: 'score', label: 'Score', width: '8%', align: 'right' },
  { key: 'createdAt', label: 'Created At', width: '14%' },
];
