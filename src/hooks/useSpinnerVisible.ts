'use client';

import { useEffect, useState } from 'react';

/**
 * Keeps a loading spinner visible for at least `minVisibleMs` once it turns on,
 * so very fast async work (local fetches here are ~5ms) doesn't flash the spinner
 * for a few milliseconds. Returns whether the spinner should be shown.
 */
export function useSpinnerVisible(loading: boolean, minVisibleMs: number): boolean {
  const [visible, setVisible] = useState(loading);

  useEffect(() => {
    if (loading) {
      setVisible(true);
      return;
    }
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), minVisibleMs);
    return () => clearTimeout(timer);
  }, [loading, minVisibleMs, visible]);

  return visible;
}
