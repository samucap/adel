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
    fetchMarketDetail,
    fetchPriceHistory,
    fetchOrderbook,
    fetchEventDetail,
    fetchTokenIdsForOutcomes,
    type MarketDetail,
    type TokenIdMapping,
} from "./polymarket-api";
import type { PricePoint, Orderbook, Outcome } from "@/types";

const STALE_5MIN = 5 * 60 * 1000;

// ── Market Detail ─────────────────────────────────────────────
export function useMarketDetail(
    conditionId: string,
    options?: Partial<UseQueryOptions<MarketDetail>>
) {
    return useQuery<MarketDetail>({
        queryKey: ["market", conditionId],
        queryFn: () => fetchMarketDetail(conditionId),
        staleTime: STALE_5MIN,
        enabled: !!conditionId,
        ...options,
    });
}

// ── Token ID Resolution for Outcomes ──────────────────────────
export function useMarketTokenIds(outcomes: Outcome[]) {
    return useQuery<TokenIdMapping[]>({
        queryKey: ["tokenIds", outcomes.map(o => o.id).join(",")],
        queryFn: () => fetchTokenIdsForOutcomes(outcomes),
        staleTime: STALE_5MIN,
        enabled: outcomes.length > 0 && outcomes.every(o => !!o.id),
    });
}

// ── Single Price History ──────────────────────────────────────
export function usePriceHistory(tokenId: string, fidelity: number = 60) {
    return useQuery<PricePoint[]>({
        queryKey: ["priceHistory", tokenId, fidelity],
        queryFn: () => fetchPriceHistory(tokenId, fidelity),
        staleTime: STALE_5MIN,
        enabled: !!tokenId,
    });
}

// ── Multi-Outcome Price History ───────────────────────────────
export function useMultiPriceHistory(
    tokenMappings: TokenIdMapping[],
    fidelity: number = 60
) {
    return useQueries({
        queries: tokenMappings.map(mapping => ({
            queryKey: ["priceHistory", mapping.tokenId, fidelity],
            queryFn: () => fetchPriceHistory(mapping.tokenId, fidelity),
            staleTime: STALE_5MIN,
            enabled: !!mapping.tokenId,
        })),
    });
}

// ── Orderbook ──────────────────────────────────────────────────
export function useOrderbook(tokenId: string) {
    return useQuery<Orderbook>({
        queryKey: ["orderbook", tokenId],
        queryFn: () => fetchOrderbook(tokenId),
        staleTime: 10_000, // 10s — orderbooks move fast
        enabled: !!tokenId,
        refetchInterval: 10_000,
    });
}

// ── Event Description ──────────────────────────────────────────
export function useEventDescription(eventId: string) {
    return useQuery<{ description: string }>({
        queryKey: ["eventDescription", eventId],
        queryFn: async () => {
            const eventDetail = await fetchEventDetail(eventId);
            return { description: eventDetail.description };
        },
        staleTime: STALE_5MIN,
        enabled: !!eventId,
    });
}