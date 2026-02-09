"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { mockArbitrageData } from "@/lib/mock-data"
import { ArrowRightLeft, DollarSign, AlertTriangle } from "lucide-react"

export function ArbitrageHeatmap() {
    return (
        <Card className="h-full border-border bg-card/80 backdrop-blur-sm overflow-hidden flex flex-col">
            <CardHeader className="pb-3 reduce-padding">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <ArrowRightLeft className="h-4 w-4 text-primary" />
                            Arbitrage Scanner
                        </CardTitle>
                        <CardDescription>Cross-platform price discrepancies</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
                <div className="w-full text-sm text-left">
                    <div className="grid grid-cols-12 gap-2 p-3 border-b border-border/50 bg-muted/30 font-medium text-xs text-muted-foreground uppercase tracking-wider sticky top-0 backdrop-blur z-10">
                        <div className="col-span-4">Market</div>
                        <div className="col-span-2 text-center">Polymarket</div>
                        <div className="col-span-2 text-center">Kalshi</div>
                        <div className="col-span-2 text-center">Betfair</div>
                        <div className="col-span-2 text-right">Spread</div>
                    </div>

                    <div className="divide-y divide-border/30">
                        {mockArbitrageData.map((arb) => {
                            const maxProb = Math.max(arb.platforms.polymarket, arb.platforms.kalshi, arb.platforms.betfair);
                            const minProb = Math.min(arb.platforms.polymarket, arb.platforms.kalshi, arb.platforms.betfair);
                            const spread = (maxProb - minProb) * 100;
                            const isHighArb = spread > 5;

                            return (
                                <div key={arb.id} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-muted/30 transition-colors group">
                                    <div className="col-span-4 font-medium truncate pr-2">
                                        <div className="truncate" title={arb.event}>{arb.event}</div>
                                        <div className="flex gap-2 mt-1">
                                            {arb.isArb && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500">
                                                    ARB
                                                </span>
                                            )}
                                            <span className="text-[10px] text-muted-foreground">Z: {arb.zScore}</span>
                                        </div>
                                    </div>

                                    {/* Platform Cells - Color coded by deviation from mean */}
                                    <PlatformCell value={arb.platforms.polymarket} isMax={arb.platforms.polymarket === maxProb} isMin={arb.platforms.polymarket === minProb} />
                                    <PlatformCell value={arb.platforms.kalshi} isMax={arb.platforms.kalshi === maxProb} isMin={arb.platforms.kalshi === minProb} />
                                    <PlatformCell value={arb.platforms.betfair} isMax={arb.platforms.betfair === maxProb} isMin={arb.platforms.betfair === minProb} />

                                    <div className="col-span-2 text-right">
                                        <div className={`font-mono font-bold ${isHighArb ? "text-green-500" : "text-muted-foreground"}`}>
                                            {spread.toFixed(1)}%
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-0.5">
                                            Liq: {(arb.liquidity * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function PlatformCell({ value, isMax, isMin }: { value: number, isMax: boolean, isMin: boolean }) {
    let bgClass = "";

    if (isMax) bgClass = "bg-red-500/10 text-red-400 border-red-500/20";
    if (isMin) bgClass = "bg-green-500/10 text-green-400 border-green-500/20";

    return (
        <div className="col-span-2 flex justify-center">
            <div className={`px-2 py-1 rounded text-xs font-mono border border-transparent ${bgClass}`}>
                {(value * 100).toFixed(1)}
            </div>
        </div>
    )
}
