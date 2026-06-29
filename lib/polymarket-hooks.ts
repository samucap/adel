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
    fetchMultiPriceHistory,
} from "./polymarket-api";
import type { MultiPriceResponse, PricePoint, Orderbook, Outcome, TopHoldersResponse } from "@/types";

// ── Interval to Fidelity Mapping ────────────────────────────────
//TODO: REVIEW
const INTERVAL_FIDELITY_MAP: Record<string, number> = {
    "1h": 1,
    "6h": 1,
    "1d": 10,
    "1w": 480,
    "1m": 720,
    "max": 1440,
};

// ── Token ID Resolution for Outcomes ──────────────────────────
export function useMarketTokenIds(outcomes: Outcome[]) {
    return useQuery<TokenIdMapping[]>({
        queryKey: ["tokenIds"],
        queryFn: async () => {
            return outcomes.map((outcome, i) => {
                const clobTokenIds = JSON.parse(outcome.clobTokenIds) as string[];
                return {
                    marketId: outcome.id || '',
                    conditionId: '',
                    clobTokenId: clobTokenIds[0] || '',
                    clobTokenIdNo: clobTokenIds[1] || '',
                    outcomeIndex: i,
                };
            });
        },
        staleTime: Infinity,
        enabled: !!outcomes,
    });
}

// ── Single Price History ──────────────────────────────────────
export function usePriceHistory(tokenId: string, fidelity: number = 60, interval: string = "1m") {
    return useQuery<PricePoint[]>({
        queryKey: ["priceHistory", tokenId, fidelity, interval],
        queryFn: () => fetchPriceHistory(tokenId, fidelity, interval),
        staleTime: Infinity,
        enabled: !!tokenId,
    });
}

// ── Multi-Outcome Price History ───────────────────────────────
export function useMultiPriceHistory(
    tokenIds: string[],
    interval: string = "1m"
) {
    const fidelity = INTERVAL_FIDELITY_MAP[interval] || 60;
    return useQuery<MultiPriceResponse>({
        queryKey: ["multiPriceHistory", tokenIds, fidelity, interval],
        queryFn: () => fetchMultiPriceHistory(tokenIds, fidelity, interval),
        staleTime: Infinity,
    })
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
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: conditionIds.length > 0,
    });
}

// Event descriptions now come from events-v2 subtitle field