import { NextRequest, NextResponse } from "next/server";

const GAMMA_API = "https://gamma-api.polymarket.com";

// ── Event Detail Handler ───────────────────────────────────────
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // For event detail, we can use either slug or conditionId
        const isConditionId = id.startsWith("0x");

        let url: string;
        if (isConditionId) {
            // If it's a conditionId, we might need to find the event that contains this market
            // For now, assume it's an event ID and try direct lookup
            url = `${GAMMA_API}/events?id=${id}`;
        } else {
            // Slug-based lookup
            url = `${GAMMA_API}/events?slug=${id}`;
        }

        const res = await fetch(url, {
            headers: { Accept: "application/json" },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            throw new Error(`Gamma API ${res.status}`);
        }

        const events = await res.json();
        const event = Array.isArray(events) ? events[0] : events;

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: event.id,
            title: event.title,
            description: event.description,
            slug: event.slug,
            image: event.image,
            category: event.category,
            endDate: event.endDate,
            active: event.active,
            volume: event.volume,
            liquidity: event.liquidity,
            markets: event.markets,
        });
    } catch (error) {
        console.error(`[Proxy Error] event/${id}:`, error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Internal proxy error",
            },
            { status: 500 }
        );
    }
}