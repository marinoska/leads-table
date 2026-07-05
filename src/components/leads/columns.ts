/**
 * Single source of truth for the leads table columns.
 * Shared by the header and the data rows (via GRID_TEMPLATE_COLUMNS) so their
 * column widths never drift.
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

/** Fixed row height (px). Keeps the virtual math exact and layout shift-free. */
export const ROW_HEIGHT = 44;

/** Shared CSS grid template so the header and data rows stay column-aligned. */
export const GRID_TEMPLATE_COLUMNS = LEAD_COLUMNS.map((col) => col.width).join(' ');
