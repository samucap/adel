"use client"

import { mockEvents } from "@/lib/mock-data"
import { useParams } from "next/navigation"
import { EventView } from "@/components/EventView"
import { adaptDashboardEvents } from "@/lib/market-adapter"

export default function EventDetailPage() {
    const params = useParams()
    const id = params.id as string

    // logic to find event: matches event.id OR contains market with id
    const rawEvent = mockEvents.find(e =>
        e.id === id || e.markets.some(m => m.id === id)
    ) || mockEvents[0]

    // Adapt to standard Event type
    const adaptedEvents = adaptDashboardEvents([rawEvent as any]);
    const event = adaptedEvents[0];

    if (!event) return <div>Event not found</div>;

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            Market Detail Page
        </div>
    )
}
