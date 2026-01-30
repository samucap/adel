"use client"

import { useState, useMemo } from "react"
import { Event, Market } from "@/types/dashboard"
import testData from "@/app/test.json"
import { EventList } from "./event-list"
import { EventDetail } from "./event-detail"
import { MarketDetail } from "./market-detail"
import { Button } from "@/components/ui/button"
import { ChevronRight, Home } from "lucide-react"

export function DashboardShell() {
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
    const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null)

    // Cast the json data to our type
    const events = testData as unknown as Event[]

    const selectedEvent = useMemo(() =>
        events.find(e => e.id === selectedEventId),
        [events, selectedEventId])

    const selectedMarket = useMemo(() =>
        selectedEvent?.markets.find(m => m.id === selectedMarketId),
        [selectedEvent, selectedMarketId])

    // Navigation Handlers
    const goHome = () => {
        setSelectedEventId(null)
        setSelectedMarketId(null)
    }

    const selectEvent = (id: string) => {
        setSelectedEventId(id)
        setSelectedMarketId(null)
    }

    const selectMarket = (id: string) => {
        setSelectedMarketId(id)
    }

    // Breadcrumbs rendering
    const renderBreadcrumbs = () => {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Button variant="ghost" size="sm" className="h-auto p-0 hover:text-foreground" onClick={goHome}>
                    <Home className="w-4 h-4" />
                </Button>
                {selectedEvent && (
                    <>
                        <ChevronRight className="w-4 h-4" />
                        <Button variant="ghost" size="sm" className="h-auto p-0 hover:text-foreground font-medium" onClick={() => selectMarket("")}>
                            {selectedEvent.title}
                        </Button>
                    </>
                )}
                {selectedMarket && (
                    <>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground font-medium truncate max-w-[200px]">
                            {selectedMarket.question}
                        </span>
                    </>
                )}
            </div>
        )
    }

    // View Switching Logic
    if (selectedEvent && selectedMarket) {
        return (
            <div className="flex flex-col h-full">
                {renderBreadcrumbs()}
                <MarketDetail event={selectedEvent} market={selectedMarket} onBack={() => setSelectedMarketId(null)} />
            </div>
        )
    }

    if (selectedEvent) {
        return (
            <div className="flex flex-col h-full">
                {renderBreadcrumbs()}
                <EventDetail event={selectedEvent} onSelectMarket={selectMarket} onBack={goHome} />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Explore Events</h1>
            </div>
            <EventList events={events} onSelectEvent={selectEvent} />
        </div>
    )
}
