import { STATUSES, type Status } from '@/lib/constants';
import styles from './leads.module.css';

interface LeadsFiltersProps {
  search: string;
  status: Status | '';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: Status | '') => void;
}

/**
 * Search box + status dropdown. Controlled and presentational — the filter state
 * (and debounce) live in the container; both feed the server-side query.
 */
export function LeadsFilters({ search, status, onSearchChange, onStatusChange }: LeadsFiltersProps) {
  return (
    <div className={styles.filters}>
      <input
        type="search"
        className={styles.searchInput}
        placeholder="Search name, company, or email…"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Search leads"
      />
      <select
        className={styles.statusSelect}
        value={status}
        onChange={(event) => onStatusChange(event.target.value as Status | '')}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {STATUSES.map((statusOption) => (
          <option key={statusOption} value={statusOption}>
            {statusOption[0].toUpperCase() + statusOption.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
