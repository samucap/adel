"use client"

import { useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { CategoryNav } from "@/components/category-nav"
import { EventCard } from "@/components/dashboard/event-card"
import { Loader2 } from "lucide-react"

export default function MarketsPage() {
    const {
        events,
        eventsLoading,
        searchQuery,
        filterBy,
        sortBy,
    } = useAppStore()

    const displayEvents = useMemo(() => {
        if (!events) return []

        // Filter
        let filtered = events.filter(event => {
            if (searchQuery) {
                const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.ticker.toLowerCase().includes(searchQuery.toLowerCase())
                if (!matchesSearch) return false
            }

            if (filterBy === 'active') {
                if (!event.active) return false
            }

            return true
        })

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                case 'ending':
                    return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
                case 'trending':
                    // Use 24h volume as proxy for trending if no explicit trending score
                    return (b.volume24hr || 0) - (a.volume24hr || 0)
                case 'volume':
                default:
                    return (b.volume || 0) - (a.volume || 0)
            }
        })

        return filtered
    }, [events, searchQuery, filterBy, sortBy])

    return (
        <div className="flex flex-col gap-6">
            <CategoryNav />

            {eventsLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                </div>
            ) : displayEvents.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    No events found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
