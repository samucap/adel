"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mockTopTraders } from "@/lib/mock-data"
import { Crown, Trophy } from "lucide-react"

export function WhalesPanel() {
    return (
        <Card className="h-full border-border bg-card/80 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    Top Traders
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-2 p-3 border-b border-border/50 bg-muted/30 font-medium text-xs text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-2 text-center">#</div>
                        <div className="col-span-5">Trader</div>
                        <div className="col-span-5 text-right">PnL (24h)</div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {mockTopTraders.map((trader) => (
                            <div key={trader.rank} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0">
                                <div className="col-span-2 text-center font-mono text-xs text-muted-foreground">
                                    {trader.rank === 1 ? <Trophy className="h-3 w-3 text-yellow-500 mx-auto" /> : trader.rank}
                                </div>
                                <div className="col-span-5 flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                        {trader.name[0].toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium truncate">{trader.name}</span>
                                </div>
                                <div className="col-span-5 text-right font-mono text-sm font-medium text-green-500">
                                    +${trader.pnl.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
