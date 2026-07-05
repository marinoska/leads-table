/**
 * Single source of truth for the leads table columns.
 * Shared by the header and the data rows (via GRID_TEMPLATE_COLUMNS) so their
 * column widths never drift.
 */
import type { LeadSortField } from '@/lib/api/leads';

export interface LeadColumn {
  key: string;
  label: string;
  width: string;
  align?: 'right';
  /** Present on sortable columns; the value is the API `sortBy` field. */
  sortKey?: LeadSortField;
}

export const LEAD_COLUMNS: LeadColumn[] = [
  { key: 'name', label: 'Name', width: '14%', sortKey: 'name' },
  { key: 'company', label: 'Company', width: '14%' },
  { key: 'email', label: 'Email', width: '16%' },
  { key: 'website', label: 'Website', width: '12%' },
  { key: 'status', label: 'Status', width: '9%' },
  { key: 'score', label: 'Score', width: '7%', align: 'right', sortKey: 'score' },
  { key: 'createdAt', label: 'Created At', width: '12%', sortKey: 'createdAt' },
  { key: 'enrichment', label: 'Enrichment', width: '16%' },
];

/** Fixed row height (px). Keeps the virtual math exact and layout shift-free. */
export const ROW_HEIGHT = 44;

/** Shared CSS grid template so the header and data rows stay column-aligned. */
export const GRID_TEMPLATE_COLUMNS = LEAD_COLUMNS.map((col) => col.width).join(' ');
