import { NextRequest, NextResponse } from "next/server";

const CLOB_API = "https://clob.polymarket.com";

// ── Orderbook Handler ──────────────────────────────────────────
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get("token_id");

    if (!tokenId) {
        return NextResponse.json(
            { error: "token_id required" },
            { status: 400 }
        );
    }

    try {
        const url = `${CLOB_API}/book?token_id=${tokenId}`;
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
        });

        if (!res.ok) {
            throw new Error(`CLOB API ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(`[Proxy Error] book:`, error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Internal proxy error",
            },
            { status: 500 }
        );
    }
}