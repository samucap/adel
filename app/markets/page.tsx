"use client"

import { NavLayout } from "@/components/nav-layout"
import { DataTable } from "@/components/data-table/data-table"
import { columns } from "@/components/dashboard/market-columns"
import { MarketFilters } from "@/components/dashboard/market-filters"
import { mockMarkets, mockEvents } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
export default function MarketsPage() {
    // In a real app, this would be a server component or useQuery
    // For now we use the mock events
    const events = mockEvents

    return (
        <NavLayout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Active Events</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <Link key={event.id} href={`/markets/${event.id}`} className="block group">
                            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline">{event.league || 'Event'}</Badge>
                                        <Badge className={event.isSports ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"}>
                                            ${(event.volume / 1000000).toFixed(1)}M Vol
                                        </Badge>
                                    </div>
                                    <CardTitle className="pt-2">{event.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                        {event.description}
                                    </p>
                                    <div className="space-y-2">
                                        {event.markets.slice(0, 2).map((market) => (
                                            <div key={market.id} className="flex justify-between text-sm bg-muted/50 p-2 rounded">
                                                <span>{market.title}</span>
                                                <span className="font-mono font-bold">{Math.round(market.price * 100)}%</span>
                                            </div>
                                        ))}
                                        {event.markets.length > 2 && (
                                            <div className="text-xs text-center text-muted-foreground pt-1">
                                                + {event.markets.length - 2} more markets
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </NavLayout>
    )
}
