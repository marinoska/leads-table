'use client';

import { useEffect } from 'react';

interface UseInfiniteScrollOptions {
  /** Index of the last rendered row; the trigger fires when it reaches the end. */
  lastIndex: number;
  count: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

/**
 * Fetches the next page once the last row is rendered (i.e. scrolled into view).
 * Guarded on hasNextPage/isFetchingNextPage so it never double-requests.
 */
export function useInfiniteScroll({
  lastIndex,
  count,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseInfiniteScrollOptions) {
  useEffect(() => {
    if (lastIndex >= count - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [lastIndex, count, hasNextPage, isFetchingNextPage, fetchNextPage]);
}
