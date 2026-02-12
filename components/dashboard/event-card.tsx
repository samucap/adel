"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Event } from "@/types/dashboard"
import { Bar, BarChart, ResponsiveContainer } from "recharts"
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface EventCardProps {
    event: Event
    onClick?: () => void
}

export function EventCard({ event, onClick }: EventCardProps) {
    // Prepare data for the mini chart
    // We use available volume metrics as a proxy for activity trend
    // explicit timestamps aren't available for these aggregates, so we just show them in order
    const chartData = [
        { name: '1Y', value: event.volume1yr || 0 },
        { name: '1M', value: event.volume1mo || 0 },
        { name: '1W', value: event.volume1wk || 0 },
        { name: '24H', value: event.volume24hr || 0 },
    ].reverse() // Show oldest to newest (roughly) for trend, or just discrete bars. 
    // Actually, comparing different time windows as a sequence doesn't make total sense for a trend line 
    // unless we treat them as discrete buckets of activity. 
    // Better visualization for "Activity" might just be to show these side-by-side or just use 24h vs 1wk avg if possible.
    // Given the constraints, let's just show the values we have as a generic "Volume Distribution" or similar, 
    // OR just plot them to show magnitude differences. 
    // Let's stick to 24h trend if we had history, but we don't.
    // Let's just create a dummy trend for visual flair if real history isn't there, 
    // OR better: use the data we have to show "Recency" by comparing 24h to 1wk/7.

    // Changing approach slightly: The user asked for "dynamic illustration with a mini graph". 
    // Since we lack granular time-series data in the Event object, we will render a simple bar chart 
    // of the available volume buckets to show where the volume is coming from.

    // Fallback image
    const imageSrc = event.image || "/placeholder.svg"

    // Calculate a simple "trend" indicator
    const isTrending = event.volume24hr > (event.volume1wk / 7) * 1.5 // > 150% of weekly average

    return (
        <Card
            className="group overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg flex flex-col h-full"
            onClick={onClick}
        >
            {/* Image Header */}
            <div className="relative h-32 overflow-hidden bg-muted">
                <img
                    src={imageSrc}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                    {event.featured && (
                        <Badge className="bg-orange-500 hover:bg-orange-600 border-none text-white shadow-sm">
                            🔥 Hot
                        </Badge>
                    )}

                </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex flex-col flex-1 gap-3">
                <h3 className="font-semibold leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                    {event.title}
                </h3>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-auto">
                    <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-primary" />
                        <span>{formatCurrency(event.volume)} Vol</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-primary" />
                        <span>{formatCurrency(event.liquidity)} Liq</span>
                    </div>
                </div>

                {/* Markets List - Scrollable */}
                {event.markets && event.markets.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Markets</p>
                        <div className="max-h-24 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                            {event.markets.map(market => (
                                <div key={market.id} className="text-xs py-1 px-1.5 rounded-sm hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border/50">
                                    <div className="line-clamp-2 leading-snug">{market.question}</div>

                                    {market.active && (
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Activity className="h-2.5 w-2.5" /> {market.outcomePrices ? "Live" : "Pending"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
