'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * App-wide client providers. The QueryClient is created once per browser tab
 * (via useState's lazy initializer) so it survives re-renders but is never
 * shared across requests.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
