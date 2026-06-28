"use client"

import { useEffect } from "react"
import { CategoryNav } from "@/components/category-nav"
import { MarketFeed } from "@/components/market-feed/market-feed"
import { useMarketStore } from "@/stores/marketStore"

export default function MarketsPage() {
    const { events, eventsLoading, eventsError, loadEvents } = useMarketStore();

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    return (
        <div className="relative min-h-screen">
            {/* Sticky Category/Filter Nav */}
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
                <div className="p-4 py-2">
                    <CategoryNav />
                </div>
            </div>

            {/* Content Area with Staggered Animation */}
            <div className="p-4 md:p-6 space-y-6">
                {eventsLoading ? (
                    <div className="py-20 text-center text-muted-foreground">
                        <div className="animate-pulse">Loading markets...</div>
                    </div>
                ) : eventsError ? (
                    <div className="py-20 text-center">
                        <div className="text-red-400 mb-2">Failed to load markets</div>
                        <div className="text-sm text-muted-foreground">{eventsError}</div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
                        <MarketFeed events={events} />
                    </div>
                )}
            </div>
        </div>
    )
}
