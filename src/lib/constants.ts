export const STATUSES = ['new', 'qualified', 'unqualified', 'contacted'] as const;

export type Status = (typeof STATUSES)[number];
