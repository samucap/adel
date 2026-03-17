/* ═══════════════════════════════════════════════════════════════
   TanStack Query Hooks
   Centralized data-fetching hooks with 5-min stale time,
   background refetch, and error boundaries.
   ═══════════════════════════════════════════════════════════════ */

import {
    useQuery,
    useQueries,
    type UseQueryOptions,
} from "@tanstack/react-query";
import {
    fetchPriceHistory,
    fetchOrderbooks,
    fetchTokenIdsForOutcomes,
    fetchTopHolders,
    type TokenIdMapping,
} from "./polymarket-api";
import type { PricePoint, Orderbook, Outcome, TopHoldersResponse } from "@/types";

const STALE_5MIN = 5 * 60 * 1000;

// ── Interval to Fidelity Mapping ────────────────────────────────
const INTERVAL_FIDELITY_MAP: Record<string, number> = {
    "1h": 1,   // ~60 data points
    "6h": 2,   // ~180 data points
    "1d": 10,  // ~144 data points
    "1w": 60,  // ~168 data points
    "max": 60, // Full range
};

// ── Token ID Resolution for Outcomes ──────────────────────────
export function useMarketTokenIds(outcomes: Outcome[]) {
    return useQuery<TokenIdMapping[]>({
        queryKey: ["tokenIds", outcomes.map(o => o.id).join(",")],
        queryFn: async () => {
            return outcomes.map((outcome, i) => {
                const tokenIds = JSON.parse(outcome.clobTokenIds) as string[];
                return {
                    marketId: outcome.id || '',
                    conditionId: '',
                    clobTokenId: tokenIds[0] || '',
                    clobTokenIdNo: tokenIds[1] || '',
                    outcomeIndex: i,
                };
            });
        },
        staleTime: STALE_5MIN,
        enabled: outcomes.length > 0,
    });
}

// ── Single Price History ──────────────────────────────────────
export function usePriceHistory(tokenId: string, fidelity: number = 60, interval: string = "max") {
    return useQuery<PricePoint[]>({
        queryKey: ["priceHistory", tokenId, fidelity, interval],
        queryFn: () => fetchPriceHistory(tokenId, fidelity, interval),
        staleTime: STALE_5MIN,
        enabled: !!tokenId,
    });
}

// ── Multi-Outcome Price History ───────────────────────────────
export function useMultiPriceHistory(
    tokenMappings: TokenIdMapping[],
    interval: string = "1d"
) {
    const fidelity = INTERVAL_FIDELITY_MAP[interval] || 60;
    return useQueries({
        queries: tokenMappings.map(mapping => ({
            queryKey: ["priceHistory", mapping.clobTokenId, fidelity, interval],
            queryFn: () => fetchPriceHistory(mapping.clobTokenId, fidelity, interval),
            staleTime: STALE_5MIN,
            enabled: !!mapping.clobTokenId,
        })),
    });
}

// ── Batch Orderbooks ────────────────────────────────────────────
export function useOrderbooks(tokenIds: string[]) {
    return useQuery<Orderbook[]>({
        queryKey: ["batchOrderbooks", tokenIds.sort().join(",")],
        queryFn: () => fetchOrderbooks(tokenIds),
        staleTime: 10_000, // 10s — orderbooks move fast
        enabled: tokenIds.length > 0,
        refetchInterval: 10_000,
    });
}

// ── Top Holders ─────────────────────────────────────────────────
export function useTopHolders(conditionIds: string[], limit: number = 20) {
    return useQuery<TopHoldersResponse>({
        queryKey: ["topHolders", conditionIds.sort().join(","), limit],
        queryFn: () => fetchTopHolders(conditionIds, limit),
        staleTime: STALE_5MIN,
        enabled: conditionIds.length > 0,
    });
}

// Event descriptions now come from events-v2 subtitle field