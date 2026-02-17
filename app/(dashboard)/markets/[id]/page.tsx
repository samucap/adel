"use client"

import { useParams } from "next/navigation"
import { EventView } from "@/components/EventView"
import { useAppStore } from "@/lib/store"
import { CleanEvent } from "@/types"
import { useEffect, useState } from "react"

export default function EventDetailPage() {
    const params = useParams()
    const id = params.id as string
    const { events } = useAppStore()
    const [event, setEvent] = useState<CleanEvent | null>(null)

    useEffect(() => {
        // Find event by ID from the store
        const foundEvent = events.find(e => e.id === id) || null
        setEvent(foundEvent)
    }, [events, id])

    if (!event) return <div>Event not found</div>;

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <EventView event={event} />
        </div>
    )
}
