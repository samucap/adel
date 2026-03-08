import { NextRequest, NextResponse } from "next/server";

const CLOB_API = "https://clob.polymarket.com";

// ── Price History Handler ──────────────────────────────────────
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get("token_id");
    const fidelity = searchParams.get("fidelity") || "60";

    if (!tokenId) {
        return NextResponse.json(
            { error: "token_id required" },
            { status: 400 }
        );
    }

    try {
        const url = `${CLOB_API}/prices-history?market=${tokenId}&interval=max&fidelity=${fidelity}`;
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
        });

        if (!res.ok) {
            throw new Error(`CLOB API ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        return NextResponse.json(data.history || data || []);
    } catch (error) {
        console.error(`[Proxy Error] prices:`, error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Internal proxy error",
            },
            { status: 500 }
        );
    }
}