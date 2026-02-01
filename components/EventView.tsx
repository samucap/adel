"use client"

import { useState } from "react"
import { Event, Market } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, DollarSign, Share2, Trophy } from "lucide-react"
import Link from "next/link"
import { MarketChart } from "@/components/dashboard/market-chart"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { mockChartData, mockActivities } from "@/lib/mock-data"



export function EventView({ event }: { event: Event }) {
    // Logic to select text/main market
    // "if sports market/event, moneyline market's main market. if it's non-sport look for highest trading volume market"

    const mainMarket = event.isSports
        ? event.markets.find(m => m.marketType === 'moneyline') || event.markets[0]
        : event.markets.reduce((prev, current) => (prev.volume > current.volume) ? prev : current, event.markets[0])

    const isNegRisk = event.markets.length > 2 && event.markets.every(m => m.marketType !== 'spread' && m.marketType !== 'over_under'); // simplified heuristic

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <header className="border-b bg-muted/10 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/markets" className="text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            {event.isSports && <Trophy className="w-4 h-4 text-amber-500" />}
                            <h1 className="text-xl font-bold tracking-tight">{event.title}</h1>
                            <Badge variant="outline" className="text-xs bg-muted/50">{mainMarket.category}</Badge>
                            {isNegRisk && <Badge variant="destructive" className="text-[10px]">Negative Risk</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Ends {event.endDate}
                            </span>
                            <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" /> Vol: ${(event.volume / 1000).toFixed(0)}k
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <div className="text-2xl font-mono font-bold text-amber-500">{Math.round(mainMarket.price * 100)}%</div>
                        <div className="text-xs text-muted-foreground">Current Probability</div>
                    </div>
                    <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                </div>
            </header>

            {/* Content grid */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4">
                {/* Left (or Top): Chart & Tabs */}
                <div className="lg:col-span-3 flex flex-col border-r bg-background overflow-y-auto">
                    <div className="min-h-[400px] border-b p-4">
                        <MarketChart data={mockChartData} type="area" />
                    </div>

                    <div className="p-4">
                        <Tabs defaultValue="trades" className="w-full">
                            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 pb-2 gap-6">
                                <TabsTrigger value="trades" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-0 py-2">Trades</TabsTrigger>
                                <TabsTrigger value="orderbook" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-0 py-2">Order Book</TabsTrigger>
                                <TabsTrigger value="holders" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-0 py-2">Holders</TabsTrigger>
                                <TabsTrigger value="comments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-0 py-2">Comments</TabsTrigger>
                            </TabsList>
                            <div className="mt-4 min-h-[300px]">
                                <TabsContent value="trades">
                                    <ActivityFeed activities={mockActivities} />
                                </TabsContent>
                                <TabsContent value="orderbook">
                                    <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
                                        Order Book Component Placeholder
                                    </div>
                                </TabsContent>
                                <TabsContent value="holders">
                                    <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
                                        Holders List Placeholder
                                    </div>
                                </TabsContent>
                                <TabsContent value="comments">
                                    <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
                                        Comments Section Placeholder
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>

                {/* Right: Trading / Outcome Panel */}
                <div className="bg-muted/5 p-4 overflow-y-auto border-l">
                    <Card>
                        <CardHeader>
                            <CardTitle>Outcomes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {event.markets.map(market => (
                                <div key={market.id} className="group p-3 rounded-lg border hover:border-primary transition-colors bg-card cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-sm">{market.title}</span>
                                        <span className="font-mono font-bold">{Math.round(market.price * 100)}%</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="flex-1 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20">
                                            Yes {Math.round(market.price * 100)}¢
                                        </Button>
                                        <Button size="sm" className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20">
                                            No {100 - Math.round(market.price * 100)}¢
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

// End of component
