'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ROW_HEIGHT } from '@/components/leads/columns';

/**
 * Virtualizes the leads rows: only the rows in view (plus overscan) are rendered.
 * Returns the scroll-container ref, the rows to render, the spacer height, the
 * last rendered index (for infinite scroll), and the visible 1-based range (for
 * the count line).
 */
export function useLeadsVirtualizer(count: number) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const lastIndex = virtualRows.length > 0 ? virtualRows[virtualRows.length - 1].index : -1;

  return {
    scrollRef,
    virtualRows,
    totalSize: rowVirtualizer.getTotalSize(),
    lastIndex,
    firstVisibleRow: virtualRows.length > 0 ? virtualRows[0].index + 1 : 0,
    lastVisibleRow: lastIndex + 1,
  };
}
