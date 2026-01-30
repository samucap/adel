import { Event, Market } from "@/types/dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

interface EventDetailProps {
    event: Event
    onSelectMarket: (id: string) => void
    onBack: () => void
}

export function EventDetail({ event, onSelectMarket }: EventDetailProps) {
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden bg-muted border">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
                        <p className="text-muted-foreground mt-2 line-clamp-3">
                            {event.description}
                        </p>
                    </div>

                    <div className="flex gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="text-muted-foreground">Volume</span>
                            <span className="font-mono font-medium text-lg">
                                ${event.volume.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground">Liquidity</span>
                            <span className="font-mono font-medium text-lg">
                                ${event.liquidity.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Markets List */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Markets</h2>
                <div className="flex flex-col gap-3">
                    {event.markets.map(market => (
                        <MarketRow key={market.id} market={market} onClick={() => onSelectMarket(market.id)} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function MarketRow({ market, onClick }: { market: Market, onClick: () => void }) {
    // Parse outcome prices safely
    let prices = ["-", "-"]
    try {
        prices = JSON.parse(market.outcomePrices)
    } catch (e) { }

    // Parse outcomes safely
    let outcomes = ["Yes", "No"]
    try {
        outcomes = JSON.parse(market.outcomes)
    } catch (e) { }


    return (
        <div
            onClick={onClick}
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
        >
            <div className="flex items-center gap-4 flex-1">
                <img src={market.image || market.icon} alt="" className="w-10 h-10 rounded-full object-cover bg-muted" />
                <span className="font-medium group-hover:underline decoration-primary underline-offset-4">
                    {market.question}
                </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* Display Top Outcome Price */}
                <div className="flex gap-2">
                    {outcomes.map((outcome, idx) => {
                        const price = parseFloat(prices[idx] || "0");
                        const percent = Math.round(price * 100);
                        return (
                            <Badge key={idx} variant={idx === 0 ? "default" : "secondary"} className="text-sm px-3 py-1 font-mono">
                                {outcome} {percent}%
                            </Badge>
                        )
                    })}
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-foreground">
                    <ArrowUpRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
