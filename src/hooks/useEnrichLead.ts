'use client';

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import type { Lead, LeadsResponse } from '@/types';
import { enrichLead } from '@/lib/api/leads';
import { leadKeys } from '@/lib/api/queryKeys';

/** Replaces one lead across every cached page, leaving the other rows untouched. */
function patchLead(
  data: InfiniteData<LeadsResponse> | undefined,
  updated: Lead,
): InfiniteData<LeadsResponse> | undefined {
  if (!data) return data;

  /** Swaps `updated` in for the lead of the same id, keeping the rest by reference. */
  function replaceLead(leads: Lead[]): Lead[] {
    return leads.map((lead) => (lead.id === updated.id ? updated : lead));
  }

  return {
    ...data,
    pages: data.pages.map((page) => ({ ...page, data: replaceLead(page.data) })),
  };
}

/**
 * Per-row enrichment mutation. Each cell gets its own instance, so two rows can
 * enrich at once without blocking each other. On success it patches just that
 * lead into every cached leads query (no refetch, no scroll jump); the write is
 * in the hook-level onSuccess so it still lands if the row scrolled out of view.
 */
export function useEnrichLead(leadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => enrichLead(leadId),
    onSuccess: (updated) => {
      queryClient.setQueriesData<InfiniteData<LeadsResponse>>(
        { queryKey: leadKeys.all },
        (data) => patchLead(data, updated),
      );
    },
  });
}
