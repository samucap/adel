"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mockLiquidityDepth } from "@/lib/mock-data"
import { Layers } from "lucide-react"

export function LiquidityLadder() {
    const maxVol = Math.max(...mockLiquidityDepth.map(d => d.volume));

    return (
        <Card className="h-full border-border bg-card/80 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    Market Depth
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col justify-center min-h-[250px]">
                <div className="flex-1 flex items-end justify-center px-4 gap-1">
                    {mockLiquidityDepth.map((level, i) => {
                        const heightPct = (level.volume / maxVol) * 100;
                        const isBid = level.type === 'bid';

                        return (
                            <div key={i} className="flex-1 flex flex-col items-center group relative">
                                {/* Bar */}
                                <div
                                    className={`w-full rounded-t-sm transition-all duration-500 relative ${isBid ? "bg-[#4AE0A5]/40 hover:bg-[#4AE0A5]/60" : "bg-[#ED254E]/40 hover:bg-[#ED254E]/60"
                                        }`}
                                    style={{ height: `${heightPct}%` }}
                                >
                                    {/* Slippage Risk indicator at top if high */}
                                    {level.slippageRisk === 'high' && (
                                        <div className="absolute -top-3 w-full flex justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Label line below */}
                                <div className={`w-full h-0.5 mt-1 ${isBid ? "bg-[#4AE0A5]" : "bg-[#ED254E]"}`}></div>

                                {/* Axis Label */}
                                <span className="text-[10px] text-muted-foreground mt-1 font-mono">
                                    {level.price.toFixed(1)}
                                </span>

                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#132925] border border-[#243F39] p-2 rounded shadow-xl z-20 whitespace-nowrap">
                                    <div className="font-bold text-[#E8EDEB]">{isBid ? "BID" : "ASK"} @ {level.price}</div>
                                    <div className="text-xs text-[#A0ACAD]">Vol: ${level.volume.toLocaleString()}</div>
                                    <div className="text-xs text-[#A0ACAD]">Risk: <span className={level.slippageRisk === 'high' ? 'text-red-400' : 'text-green-400'}>{level.slippageRisk.toUpperCase()}</span></div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* X-Axis Label */}
                <div className="text-center text-[10px] text-muted-foreground py-2 uppercase tracking-widest">
                    Probability
                </div>
            </CardContent>
        </Card>
    )
}
