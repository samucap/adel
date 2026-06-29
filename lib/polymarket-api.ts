/* ═══════════════════════════════════════════════════════════════
   Polymarket API Service
   All calls go through Next.js API routes → proxied to Polymarket
   to avoid CORS & rate-limiting on the client.
   ═══════════════════════════════════════════════════════════════ */

import type {
    PricePoint,
    MultiPriceResponse,
    Orderbook,
    TopHoldersResponse,
} from "@/types";

// Direct Polymarket API endpoints (no proxy needed)
const CLOB_API = "https://clob.polymarket.com"
const DATA_API = "https://data-api.polymarket.com"

// ── Helper: safe JSON fetch with timeout ───────────────────────
async function fetchJSON<T>(url: string, init?: RequestInit, timeoutMs: number = 15_000): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

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

// Market details are now available from events-v2 response, no need for separate API calls

// ── Price History ──────────────────────────────────────────────
export async function fetchPriceHistory(
    tokenId: string,
    fidelity: number = 60,
    interval: string = "max"
): Promise<PricePoint[]> {
    const data = await fetchJSON<{ history: PricePoint[] }>(
        `${CLOB_API}/prices-history?market=${tokenId}&interval=${interval}&fidelity=${fidelity}`
    );
    return data.history;
}

// ── Multi-Outcome Price History ───────────────────────────────
export async function fetchMultiPriceHistory(
    tokenIds: string[],
    fidelity: number = 60,
    interval: string = "max"
): Promise<MultiPriceResponse> {
    const data = await fetchJSON<MultiPriceResponse>(
        `${CLOB_API}/batch-prices-history`, {
        method: "POST",
        body: JSON.stringify({
            markets: tokenIds,
            interval: interval,
            fidelity: fidelity,
        })
    });
    return data;
}

// ── Batch Orderbooks ─────────────────────────────────────────────
export async function fetchOrderbooks(tokenIds: string[]): Promise<Orderbook[]> {
    const requestBody = tokenIds.map(tokenId => ({ token_id: tokenId }));
    return fetchJSON<Orderbook[]>(`${CLOB_API}/books`, {
        method: "POST",
        body: JSON.stringify(requestBody),
    });
}

// Event descriptions now come from events-v2 subtitle field

// ── Top Holders ──────────────────────────────────────────────────
export async function fetchTopHolders(
    conditionIds: string[],
    limit: number = 20
): Promise<TopHoldersResponse> {
    const marketParam = conditionIds.join(',');
    return fetchJSON<TopHoldersResponse>(`${DATA_API}/holders?market=${marketParam}&limit=${limit}`);
}

// ── Batch fetch token IDs for multiple outcomes ────────────────
export interface TokenIdMapping {
    marketId: string;
    conditionId: string;     // For holders API (0x-prefixed 64-hex)
    clobTokenId: string;     // YES token for prices/orderbooks (0x-prefixed ERC1155)
    clobTokenIdNo?: string;  // NO token for orderbook display (0x-prefixed ERC1155)
    outcomeIndex: number;
    negRisk?: boolean;
}

// ── Gamma API endpoint ──────────────────────
const GAMMA_API = "https://gamma-api.polymarket.com"

// ── Helper: parse JSON string arrays from Gamma API ────────────
function safeParseJsonArray(str: string | undefined | null): string[] {
    if (!str) return [];
    try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export async function fetchTokenIdsForOutcomes(
    outcomes: Array<{ id?: string; marketId?: string }>
): Promise<TokenIdMapping[]> {
    // Create promises for all outcomes (parallel execution)
    const promises = outcomes.map(async (outcome, i) => {
        const marketId = outcome.id || outcome.marketId;

        if (!marketId) {
            throw new Error(`Outcome ${i} has no marketId`);
        }

        try {
            // Call Gamma API through proxy to get the real conditionId and clobTokenIds
            // Use shorter timeout (8s) since we're running in parallel
            const marketData = await fetchJSON<{
                conditionId: string;
                clobTokenIds: string[]; // JSON string array like '["0x...", "0x..."]'
            }>(`${GAMMA_API}/markets/${encodeURIComponent(marketId)}`, undefined, 8000);

            const clobTokenIds = safeParseJsonArray(marketData.clobTokenIds.join(','));
            return {
                marketId,
                conditionId: marketData.conditionId,
                clobTokenId: clobTokenIds[0] || '', // YES token (index 0)
                clobTokenIdNo: clobTokenIds[1] || '', // NO token (index 1)
                outcomeIndex: i,
                negRisk: false, // Default to false; can be updated if negRisk info is available in events-v2
            };
        } catch (error) {
            console.warn(`Failed to fetch token IDs for market ${marketId}:`, error);
            // Fallback: use empty conditionId so downstream consumers skip this entry
            return {
                marketId,
                conditionId: '', // Empty fallback - prevents bad IDs from reaching holders API
                clobTokenId: '', // Empty fallback
                outcomeIndex: i,
                negRisk: false,
            };
        }
    });

    // Wait for all promises to settle (parallel execution)
    const results = await Promise.allSettled(promises);

    // Process results in order (maintaining outcomeIndex order)
    return results.map((result, i) => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            console.warn(`Promise ${i} rejected:`, result.reason);
            // Return fallback for rejected promises
            return {
                marketId: outcomes[i].id || outcomes[i].marketId || '',
                conditionId: '',
                clobTokenId: '',
                outcomeIndex: i,
                negRisk: false,
                clobTokenIdNo: '',
            };
        }
    });
}