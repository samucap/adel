"use client"

import React, { useEffect } from "react"
import { CategoryNav } from "@/components/category-nav"
import { MarketFeed } from "@/components/market-feed/market-feed"
import { useAppStore } from "@/lib/store"
import { adaptDashboardEvents } from "@/lib/market-adapter"

export default function MarketsPage() {
    const { events: dashboardEvents, loadEvents, sortBy } = useAppStore();

    const events = React.useMemo(() => {
        return adaptDashboardEvents(dashboardEvents || []);
    }, [dashboardEvents]);

    useEffect(() => {
        loadEvents();
    }, [loadEvents, sortBy]);

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
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
                    <MarketFeed events={events} />
                </div>
            </div>
        </div>
    )
}
