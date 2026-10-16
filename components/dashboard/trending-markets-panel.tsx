"use client"

import { Card } from "@/components/ui/card"
import { PanelHeader } from "@/components/dashboard/panel-header"
import { PanelStatus } from "@/components/dashboard/panel-status"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatUsd, useDashboard, type TrendingMarket } from "@/lib/dashboard"
import { formatEndDate } from "@/lib/duration"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts"

export function TrendingMarketsPanel() {
    const query = useDashboard<TrendingMarket[]>("/dashboard/trending")
    const markets = query.data ?? []

    return (
        <Card className="h-full">
            <PanelHeader icon={TrendingUp} title="Trending Markets" />
            <PanelStatus query={query} empty={markets.length === 0} emptyText="No markets with 24h volume in the latest snapshot.">
                <ScrollArea className="flex-1">
                    <div className="divide-y divide-border">
                        {markets.map((market) => {
                            const up = market.drift > 0
                            return (
                                <div key={market.id} className="group px-3 py-2 transition-colors hover:bg-hover">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex items-center gap-2">
                                                <Badge variant="secondary" className="h-4 rounded-sm px-1 font-mono text-2xs uppercase tracking-wider">
                                                    {market.category}
                                                </Badge>
                                                <span className="whitespace-nowrap text-xs text-muted-foreground">{formatEndDate(market.endDate)}</span>
                                            </div>
                                            <h4 className="mb-2 truncate text-sm font-medium leading-tight transition-colors group-hover:text-primary">
                                                {market.title}
                                            </h4>
                                            <div className="flex items-center gap-4 text-xs">
                                                <div className="flex flex-col">
                                                    <span className="text-2xs uppercase text-muted-foreground">Prob</span>
                                                    <span className="font-mono font-medium">{(market.probability * 100).toFixed(0)}%</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-2xs uppercase text-muted-foreground">Drift</span>
                                                    <div className={`flex items-center font-mono font-medium ${up ? "text-positive" : market.drift < 0 ? "text-negative" : "text-muted-foreground"}`}>
                                                        {up ? <ArrowUpRight className="mr-0.5 size-3" /> : market.drift < 0 ? <ArrowDownRight className="mr-0.5 size-3" /> : null}
                                                        {(Math.abs(market.drift) * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-2xs uppercase text-muted-foreground">24h vol</span>
                                                    <span className="font-mono font-medium">{formatUsd(market.volume24h)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-12 w-24 self-center">
                                            {market.sparkline.length > 1 ? (
                                                <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 96, height: 48 }}>
                                                    <LineChart data={market.sparkline.map((val, i) => ({ i, val }))}>
                                                        <Line
                                                            type="monotone"
                                                            dataKey="val"
                                                            stroke={up ? "var(--positive)" : "var(--negative)"}
                                                            strokeWidth={2}
                                                            dot={false}
                                                        />
                                                        <YAxis domain={["dataMin", "dataMax"]} hide />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </PanelStatus>
        </Card>
    )
}
