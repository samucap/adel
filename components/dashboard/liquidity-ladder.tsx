"use client"

import { Layers } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PanelHeader } from "@/components/dashboard/panel-header"
import { PanelStatus } from "@/components/dashboard/panel-status"
import { useDashboard, type DepthLevel } from "@/lib/dashboard"
import { cn } from "@/lib/utils"

export function LiquidityLadder() {
    const query = useDashboard<DepthLevel[]>("/dashboard/depth")
    const levels = query.data ?? []
    const maxVol = levels.reduce((max, level) => Math.max(max, level.size), 0)

    return (
        <Card className="h-full">
            <PanelHeader icon={Layers} title="Market Depth" />
            <PanelStatus query={query} empty={levels.length === 0} emptyText="No order book snapshots are stored.">
                <div className="flex min-h-64 flex-1 flex-col p-4">
                    <div className="flex flex-1 items-end gap-1">
                        {levels.map((level, i) => {
                            const isBid = level.type === "bid"
                            return (
                                <div key={i} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                                    <div
                                        className={cn(
                                            "relative w-full rounded-t-sm transition-colors",
                                            isBid ? "bg-positive/20 group-hover:bg-positive/30" : "bg-negative/20 group-hover:bg-negative/30",
                                        )}
                                        style={{ height: `${maxVol > 0 ? (level.size / maxVol) * 100 : 0}%` }}
                                    />
                                    <div className={cn("mt-1 h-0.5 w-full", isBid ? "bg-positive" : "bg-negative")} />
                                    <span className="mt-1 font-mono text-2xs text-muted-foreground">{level.price.toFixed(2)}</span>
                                    <div className="absolute bottom-full z-20 mb-2 hidden rounded-md border border-border bg-popover px-3 py-2 whitespace-nowrap shadow-lg group-hover:block">
                                        <div className="text-xs font-semibold text-foreground">
                                            {isBid ? "BID" : "ASK"} @ {level.price}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Size: {level.size.toLocaleString()}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="pt-2 text-center text-2xs tracking-widest text-muted-foreground uppercase">Probability</div>
                </div>
            </PanelStatus>
        </Card>
    )
}
