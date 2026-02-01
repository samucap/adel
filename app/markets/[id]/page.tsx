"use client"

import { NavLayout } from "@/components/nav-layout"
import { mockEvents } from "@/lib/mock-data"
import { useParams } from "next/navigation"
import { EventView } from "@/components/EventView"

export default function EventDetailPage() {
    const params = useParams()
    const id = params.id as string

    // logic to find event: matches event.id OR contains market with id
    const event = mockEvents.find(e =>
        e.id === id || e.markets.some(m => m.id === id)
    ) || mockEvents[0]

    return (
        <NavLayout>
            <div className="h-[calc(100vh-4rem)] flex flex-col">
                <EventView event={event} />
            </div>
        </NavLayout>
    )
}

