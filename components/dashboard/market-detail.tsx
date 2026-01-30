import { Event, Market } from "@/types/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface MarketDetailProps {
    event: Event
    market: Market
    onBack: () => void
}

export function MarketDetail({ event, market, onBack }: MarketDetailProps) {
    let outcomes = ["Yes", "No"]
    let prices = ["0.5", "0.5"]
    try {
        outcomes = JSON.parse(market.outcomes)
        prices = JSON.parse(market.outcomePrices)
    } catch (e) { }

    return (
        <div className="max-w-5xl mx-auto w-full space-y-6">
            <div className="flex items-start gap-4">
                <img src={market.image || event.image} className="w-16 h-16 rounded-lg object-cover border" />
                <div>
                    <h1 className="text-2xl font-bold leading-tight">{market.question}</h1>
                    <p className="text-muted-foreground text-sm mt-1">{event.title}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Outcomes & Buy UI */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Outcomes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {outcomes.map((outcome, idx) => {
                                const price = parseFloat(prices[idx] || "0");
                                const percent = Math.round(price * 100);
                                const isYes = outcome === "Yes";

                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span>{outcome}</span>
                                            <span className={isYes ? "text-green-500" : "text-red-500"}>
                                                {percent}% <span className="text-muted-foreground text-xs font-normal">({price}¢)</span>
                                            </span>
                                        </div>
                                        <Progress value={percent} className="h-2" indicatorClassName={isYes ? "bg-green-500" : "bg-red-500"} />
                                        <div className="flex gap-2 pt-1">
                                            <Button className="w-full" variant={isYes ? "default" : "secondary"}>
                                                Buy {outcome}
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="orderbook">
                        <TabsList className="w-full justify-start">
                            <TabsTrigger value="orderbook">Order Book</TabsTrigger>
                            <TabsTrigger value="history">Trade History</TabsTrigger>
                            <TabsTrigger value="info">Market Info</TabsTrigger>
                        </TabsList>
                        <TabsContent value="orderbook" className="min-h-[200px] border rounded-lg p-4 bg-card">
                            <div className="flex justify-between text-xs text-muted-foreground mb-2">
                                <span>Bids</span>
                                <span>Asks</span>
                            </div>
                            <div className="space-y-1 font-mono text-sm">
                                <div className="flex justify-between">
                                    <span className="text-green-500">0.52 (10k)</span>
                                    <span className="text-red-500">0.54 (5k)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-500/70">0.51 (22k)</span>
                                    <span className="text-red-500/70">0.55 (12k)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-500/50">0.50 (50k)</span>
                                    <span className="text-red-500/50">0.56 (8k)</span>
                                </div>
                            </div>
                            <div className="mt-8 text-center text-muted-foreground text-sm">
                                Live Order Book Mockup
                            </div>
                        </TabsContent>
                        <TabsContent value="info" className="p-4 border rounded-lg bg-card text-sm space-y-4">
                            <div>
                                <h4 className="font-semibold mb-1">Description</h4>
                                <p className="text-muted-foreground whitespace-pre-wrap">{market.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-muted-foreground">Start Date</span>
                                    <p>{new Date(market.startDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">End Date</span>
                                    <p>{new Date(market.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column: Stats */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Market Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Volume</span>
                                <span className="font-mono">${market.volumeNum.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Liquidity</span>
                                <span className="font-mono">${market.liquidity ? market.liquidity.toLocaleString() : "-"}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Created</span>
                                <span>{market.createdAt ? new Date(market.createdAt).toLocaleDateString() : "-"}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
