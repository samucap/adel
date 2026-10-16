"use client"

import { CategoryNav } from "@/components/category-nav"
import { MarketFeed } from "@/components/market-feed/market-feed"
import { useMarketStore } from "@/stores/marketStore"

export default function MarketsPage() {
    const { events, eventsLoading, eventsError } = useMarketStore();

    return (
        <div className="flex flex-col gap-3">
            <div className="sticky top-0 z-30 border-b border-border bg-background pb-2">
                <CategoryNav />
            </div>

            {eventsLoading ? (
                <div className="animate-pulse py-12 text-center text-sm text-muted-foreground">Loading markets...</div>
            ) : eventsError ? (
                <div className="py-12 text-center">
                    <div className="mb-2 text-negative">Failed to load markets</div>
                    <div className="text-sm text-muted-foreground">{eventsError}</div>
                </div>
            ) : (
                <MarketFeed events={events} />
            )}
        </div>
    )
}
