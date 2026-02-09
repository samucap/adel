"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { CategoryNav } from "@/components/category-nav"

export default function MarketsPage() {
    const { events, eventsLoading, eventsError } = useAppStore()

    return (
        <div className="flex flex-col h-full">
            {/* Category Navigation at top */}
            <CategoryNav />

            {/* Events List */}
            <div className="flex-1 overflow-auto">
                {eventsLoading && (
                    <div className="text-center py-12 text-muted-foreground">Loading events...</div>
                )}

                {eventsError && (
                    <div className="text-center py-12 text-red-500">Error: {eventsError}</div>
                )}

                {!eventsLoading && !eventsError && events.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">No events found</div>
                )}

                {/* TODO: sort by volume, volume24hr, ending soon */}

                {!eventsLoading && !eventsError && events.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <Link key={event.id} href={`/markets/${event.id}`} className="block group">
                                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline">{event.ticker || 'Event'}</Badge>
                                            <Badge className={event.negRisk ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"}>
                                                ${(event.volume / 1000000).toFixed(1)}M Vol
                                            </Badge>
                                        </div>
                                        <CardTitle className="pt-2">{event.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                            {event.description}
                                        </p>
                                        {event.markets && event.markets.length > 0 && (
                                            <div className="space-y-2">
                                                {event.markets.slice(0, 2).map((market) => (
                                                    <div key={market.id} className="flex justify-between text-sm bg-muted/50 p-2 rounded">
                                                        <span>{market.question}</span>
                                                        <span className="font-mono font-bold">{market.lastTradePrice ? Math.round(market.lastTradePrice * 100) : 0}%</span>
                                                    </div>
                                                ))}
                                                {event.markets.length > 2 && (
                                                    <div className="text-xs text-center text-muted-foreground pt-1">
                                                        + {event.markets.length - 2} more markets
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
