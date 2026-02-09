"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockTrendingMarkets } from "@/lib/mock-data"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Filter } from "lucide-react"
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts"
import { useState, useEffect } from "react"

export function TrendingMarketsPanel() {
    const [filter, setFilter] = useState("all")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Sort markets by volume growth desc
    const sortedMarkets = [...mockTrendingMarkets].sort((a, b) => b.volumeGrowth24h - a.volumeGrowth24h)

    if (!mounted) return <Card className="h-full border-border bg-card/80 backdrop-blur-sm animate-pulse" />;


    return (
        <Card className="h-full flex flex-col border-border bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card/95 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Trending Markets</h3>
                </div>
                <div className="flex gap-2">
                    <Select defaultValue="24h">
                        <SelectTrigger className="h-7 w-[70px] text-xs">
                            <SelectValue placeholder="Time" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="24h">24h</SelectItem>
                            <SelectItem value="7d">7d</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <Filter className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="divide-y divide-border/50">
                    {sortedMarkets.map((market) => (
                        <div key={market.id} className="p-3 hover:bg-muted/50 transition-colors cursor-pointer group">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1 rounded-sm font-mono uppercase tracking-wider">
                                            {market.category}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">{market.resolutionDate}</span>
                                    </div>
                                    <h4 className="text-sm font-medium leading-tight mb-2 group-hover:text-primary transition-colors truncate">
                                        {market.title}
                                    </h4>

                                    <div className="flex items-center gap-4 text-xs">
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground text-[10px] uppercase">Prob</span>
                                            <span className="font-mono font-medium">{(market.probability * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground text-[10px] uppercase">Drift</span>
                                            <div className={`flex items-center font-mono font-medium ${market.probabilityDrift > 0 ? "text-green-500" : "text-red-500"}`}>
                                                {market.probabilityDrift > 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                                                {Math.abs(market.probabilityDrift)}%
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground text-[10px] uppercase">Vol Growth</span>
                                            <span className="font-mono font-medium text-primary">+{market.volumeGrowth24h}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mini Sparkline */}
                                <div className="w-24 h-12 self-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={market.sparklineData.map((val, i) => ({ i, val }))}>
                                            <Line
                                                type="monotone"
                                                dataKey="val"
                                                stroke={market.probabilityDrift > 0 ? "#4AE0A5" : "#ED254E"}
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                            <YAxis domain={['dataMin', 'dataMax']} hide />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Card>
    )
}
