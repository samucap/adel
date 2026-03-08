import { NextRequest, NextResponse } from "next/server";

const GAMMA_API = "https://gamma-api.polymarket.com";

// ── Helper: safely parse JSON strings from Gamma ───────────────
function safeParseJsonArray(str: string | undefined | null): string[] {
    if (!str) return [];
    try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// ── Helper: extract Yes/No prices from a Gamma market object ───
function extractPrices(market: Record<string, unknown>): {
    yesPrice: number;
    noPrice: number;
    yesTokenId: string;
    noTokenId: string;
} {
    // Gamma returns outcomePrices as a JSON string like '["0.3", "0.7"]'
    // and outcomes as '["Yes", "No"]'
    const outcomes = safeParseJsonArray(market.outcomes as string);
    const prices = safeParseJsonArray(market.outcomePrices as string);
    const tokenIds = safeParseJsonArray(market.clobTokenIds as string);

    const yesIdx = outcomes.findIndex(
        (o) => o.toLowerCase() === "yes"
    );
    const noIdx = outcomes.findIndex(
        (o) => o.toLowerCase() === "no"
    );

    return {
        yesPrice: yesIdx >= 0 ? Number(prices[yesIdx] || 0.5) : Number(prices[0] || 0.5),
        noPrice: noIdx >= 0 ? Number(prices[noIdx] || 0.5) : Number(prices[1] || 0.5),
        yesTokenId: yesIdx >= 0 ? (tokenIds[yesIdx] || "") : (tokenIds[0] || ""),
        noTokenId: noIdx >= 0 ? (tokenIds[noIdx] || "") : (tokenIds[1] || ""),
    };
}

// ── Market Detail Handler ──────────────────────────────────────
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string[] }> }
) {
    const { slug } = await params;
    const id = slug[0]; // Get the first part of the slug

    console.log(`[Market Route] Received request for ID: ${id}, URL: ${request.url}`);

    try {

        console.log(`[Market Route] Handling request for ID: ${id}`);

        // For testing - temporarily return a simple response
        // return NextResponse.json({
        //     id,
        //     message: "Route is working",
        //     timestamp: new Date().toISOString()
        // });

        // Determine if this is a conditionId (starts with 0x) or a slug
        const isConditionId = id.startsWith("0x");

        let eventData: Record<string, unknown> | null = null;
        let primaryMarket: any = null;

        if (isConditionId) {
            // For conditionId, search markets endpoint with the condition_id as a filter
            const url = `${GAMMA_API}/markets?condition_id=${id}`;
            const res = await fetch(url, {
                headers: { Accept: "application/json" },
                next: { revalidate: 60 },
            });

            if (res.ok) {
                const markets = await res.json();
                if (Array.isArray(markets) && markets.length > 0) {
                    primaryMarket = markets[0];
                    // Build a synthetic event-like response
                    eventData = primaryMarket;
                }
            }
        } else {
            // Slug-based: fetch from events endpoint
            const url = `${GAMMA_API}/events?slug=${id}`;
            const res = await fetch(url, {
                headers: { Accept: "application/json" },
                next: { revalidate: 60 },
            });

            if (!res.ok) {
                throw new Error(`Gamma API ${res.status}`);
            }

            const events = await res.json();
            const event = Array.isArray(events) ? events[0] : events;

            if (event) {
                eventData = event;
                const eventMarkets = Array.isArray(event.markets) ? event.markets : [];
                primaryMarket = eventMarkets[0] || null;
            }
        }

        if (!eventData && !primaryMarket) {
            return NextResponse.json({ error: "Market not found" }, { status: 404 });
        }

        // Extract prices from the primary market's outcomePrices field
        const { yesPrice, noPrice, yesTokenId, noTokenId } = primaryMarket
            ? extractPrices(primaryMarket)
            : { yesPrice: 0.5, noPrice: 0.5, yesTokenId: "", noTokenId: "" };

        // Use event-level data if available, fallback to market
        const source = eventData || primaryMarket;
        const mkt = primaryMarket || {};

        return NextResponse.json({
            conditionId: mkt.conditionId || id,
            question: source.title || mkt.question || "",
            description: source.description || mkt.description || "",
            slug: source.slug || mkt.slug || "",
            image: source.image || mkt.image || "",
            icon: source.icon || mkt.icon || "",
            yesPrice,
            noPrice,
            yesTokenId,
            noTokenId,
            volume: Number(source.volume || source.volumeNum || mkt.volume || 0),
            liquidity: Number(source.liquidity || mkt.liquidity || 0),
            openInterest: Number(mkt.openInterest || 0),
            endDate: source.endDate || mkt.endDateIso || mkt.endDate || null,
            category: source.category || "",
            active: source.active ?? mkt.active ?? true,
            closed: source.closed ?? mkt.closed ?? false,
            tags: Array.isArray(source.tags)
                ? source.tags.map((t: { label?: string }) => typeof t === "string" ? t : (t.label || ""))
                : [],
            change24h: Number(mkt.oneDayPriceChange || 0),
        });
    } catch (error) {
        console.error(`[Proxy Error] market/${id}:`, error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Internal proxy error",
            },
            { status: 500 }
        );
    }
}