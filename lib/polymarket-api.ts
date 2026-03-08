/* ═══════════════════════════════════════════════════════════════
   Polymarket API Service
   All calls go through Next.js API routes → proxied to Polymarket
   to avoid CORS & rate-limiting on the client.
   ═══════════════════════════════════════════════════════════════ */

import type {
    PricePoint,
    Orderbook,
} from "@/types";

const BASE = "/api/proxy";

// ── Helper: safe JSON fetch with timeout ───────────────────────
async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
        const res = await fetch(url, {
            ...init,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...init?.headers,
            },
        });
        if (!res.ok) {
            throw new Error(`API ${res.status}: ${res.statusText}`);
        }
        return res.json() as Promise<T>;
    } finally {
        clearTimeout(timeout);
    }
}

// ── Fetch a Single Market Detail ───────────────────────────────
export interface MarketDetail {
    conditionId: string;
    question: string;
    description: string;
    slug: string;
    image: string;
    icon: string;
    yesPrice: number;
    noPrice: number;
    yesTokenId: string;
    noTokenId: string;
    volume: number;
    liquidity: number;
    openInterest: number;
    endDate: string | null;
    category: string;
    active: boolean;
    closed: boolean;
    tags: string[];
    change24h: number;
}

export async function fetchMarketDetail(
    conditionId: string
): Promise<MarketDetail> {
    return fetchJSON<MarketDetail>(`${BASE}/market/${conditionId}`);
}

// ── Price History ──────────────────────────────────────────────
export async function fetchPriceHistory(
    tokenId: string,
    fidelity: number = 60
): Promise<PricePoint[]> {
    return fetchJSON<PricePoint[]>(
        `${BASE}/prices?token_id=${tokenId}&fidelity=${fidelity}`
    );
}

// ── Orderbook ──────────────────────────────────────────────────
export async function fetchOrderbook(tokenId: string): Promise<Orderbook> {
    return fetchJSON<Orderbook>(`${BASE}/book?token_id=${tokenId}`);
}

// ── Event Detail ───────────────────────────────────────────────
export interface EventDetail {
    id: string;
    title: string;
    description: string;
    slug: string;
    image: string;
    category: string;
    endDate: string;
    active: boolean;
    volume: number;
    liquidity: number;
    markets: any[];
}

export async function fetchEventDetail(eventId: string): Promise<EventDetail> {
    return fetchJSON<EventDetail>(`${BASE}/event/${eventId}`);
}

// ── Batch fetch token IDs for multiple outcomes ────────────────
export interface TokenIdMapping {
    marketId: string;
    tokenId: string;
    outcomeIndex: number;
}

export async function fetchTokenIdsForOutcomes(
    outcomes: Array<{ id?: string; marketId?: string }>
): Promise<TokenIdMapping[]> {
    // For now, let's use a simplified approach where we try to get token IDs
    // This may need to be updated based on actual Polymarket API structure for multi-outcome markets
    const mappings: TokenIdMapping[] = [];

    for (let i = 0; i < outcomes.length; i++) {
        const outcome = outcomes[i];
        const marketId = outcome.id || outcome.marketId;

        if (!marketId) continue;

        try {
            // For multi-outcome markets, each outcome may have its own token ID
            // For now, we'll try to fetch market details and see what we get
            const marketDetail = await fetchMarketDetail(marketId);

            // If this is a binary market (has yes/no token IDs), use the appropriate one
            // For multi-outcome, we might need to handle differently
            let tokenId = marketDetail.yesTokenId;

            if (tokenId) {
                mappings.push({
                    marketId,
                    tokenId,
                    outcomeIndex: i,
                });
            } else {
                // Fallback: use marketId as tokenId for now (this may not work)
                console.warn(`No token ID found for market ${marketId}, using marketId as fallback`);
                mappings.push({
                    marketId,
                    tokenId: marketId,
                    outcomeIndex: i,
                });
            }
        } catch (error) {
            console.warn(`Failed to fetch token ID for market ${marketId}:`, error);
            // For development, use marketId as fallback
            mappings.push({
                marketId,
                tokenId: marketId,
                outcomeIndex: i,
            });
        }
    }

    return mappings;
}