"use client"

import { useState, useMemo } from "react"
import { CleanEvent, Outcome } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, DollarSign, Share2, Trophy } from "lucide-react"
import Link from "next/link"
import { MarketChart } from "@/components/dashboard/market-chart"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { mockChartData, mockActivities } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function EventView({ event }: { event: CleanEvent }) {
    // State for selected outcome
    const [selectedOutcomeId, setSelectedOutcomeId] = useState<string>(
        event.displayData.outcomes?.[0]?.id ?? ""
    );

    // Get all outcomes for easy lookup
    const allOutcomes = useMemo(() => {
        return event.displayData.outcomes ?? [];
    }, [event]);

    // Derived current outcome
    const currentOutcome = useMemo(() =>
        allOutcomes.find(o => o.id === selectedOutcomeId) || allOutcomes[0],
        [allOutcomes, selectedOutcomeId]);

    const isNegRisk = event.layout === 'POLL';

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
                            {event.layout === 'SPORTS' && <Trophy className="w-4 h-4 text-amber-500" />}
                            <h1 className="text-xl font-bold tracking-tight">{event.title} <span className="text-muted-foreground font-normal">/ {currentOutcome?.label || 'Unknown'}</span></h1>
                            {/* Category Badge if needed, but we have title context */}
                            {isNegRisk && <Badge variant="destructive" className="text-[10px]">Poll</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {event.isLive ? 'Live' : 'Upcoming'}
                            </span>
                            <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" /> Vol: {event.stats.volumeUSD}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Highest Prob Display for Current Outcome */}
                    <div className="text-right hidden md:block">
                        <div className="text-2xl font-mono font-bold text-amber-500">
                            {currentOutcome ? Math.round(currentOutcome.price * 100) : 0}%
                        </div>
                        <div className="text-xs text-muted-foreground">Probability</div>
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
                            <CardTitle>Markets</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {allOutcomes.map(outcome => {
                                const price = Math.round(outcome.price * 100);

                                return (
                                    <div
                                        key={outcome.id}
                                        onClick={() => setSelectedOutcomeId(outcome.id || "")}
                                        className={cn(
                                            "group p-3 rounded-lg border transition-all cursor-pointer",
                                            selectedOutcomeId === (outcome.id || "")
                                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                                : "bg-card hover:border-primary/50"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-medium text-sm line-clamp-2">
                                                {outcome.label}
                                            </span>
                                            <span className="font-mono font-bold text-primary">
                                                {price}%
                                            </span>
                                        </div>
                                        <div className="flex gap-2 pointer-events-none">
                                            <div className="flex-1 bg-primary/10 text-primary border border-primary/20 text-xs py-1 px-2 rounded text-center">
                                                {outcome.label} {price}¢
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

// End of component
