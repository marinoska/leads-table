'use client';

import { useEffect } from 'react';

interface UseInfiniteScrollOptions {
  /** Index of the last rendered row; the trigger fires when it reaches the end. */
  lastIndex: number;
  count: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  /** When the last page fetch failed, pause auto-loading until a manual retry. */
  isFetchNextPageError: boolean;
  fetchNextPage: () => void;
}

/**
 * Fetches the next page once the last row is rendered (i.e. scrolled into view).
 * Guarded on hasNextPage/isFetchingNextPage so it never double-requests, and on
 * isFetchNextPageError so a failed page doesn't retry in a loop — the user
 * retries manually.
 */
export function useInfiniteScroll({
  lastIndex,
  count,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  fetchNextPage,
}: UseInfiniteScrollOptions) {
  useEffect(() => {
    if (
      lastIndex >= count - 1 &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isFetchNextPageError
    ) {
      fetchNextPage();
    }
  }, [lastIndex, count, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);
}
