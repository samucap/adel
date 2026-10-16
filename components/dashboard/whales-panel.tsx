"use client"

import { Card } from "@/components/ui/card"
import { PanelHeader } from "@/components/dashboard/panel-header"
import { PanelStatus } from "@/components/dashboard/panel-status"
import { formatUsd, useDashboard, type WhaleRow } from "@/lib/dashboard"
import { Crown, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

export function WhalesPanel() {
    const query = useDashboard<WhaleRow[]>("/dashboard/whales")
    const whales = query.data ?? []

    return (
        <Card className="h-full">
            <PanelHeader icon={Crown} title="Top Traders" description="Net flow, not PnL" />
            <PanelStatus query={query} empty={whales.length === 0} emptyText="No whale flow in the latest snapshot.">
                <div className="grid shrink-0 grid-cols-12 gap-2 border-b border-border px-3 py-2 text-2xs font-medium uppercase tracking-wider text-muted-foreground">
                    <div className="col-span-2 text-center">#</div>
                    <div className="col-span-5">Trader</div>
                    <div className="col-span-5 text-right">Net flow</div>
                </div>
                <div className="custom-scrollbar min-h-0 flex-1 divide-y divide-border overflow-y-auto">
                    {whales.map((trader) => (
                        <div key={trader.rank} className="grid grid-cols-12 items-center gap-2 px-3 py-2 transition-colors hover:bg-hover">
                            <div className="col-span-2 text-center font-mono text-xs text-muted-foreground">
                                {trader.rank === 1 ? <Trophy className="mx-auto size-3 text-warning" /> : trader.rank}
                            </div>
                            <div className="col-span-5 truncate text-sm font-medium">{trader.account}</div>
                            <div className={cn("col-span-5 text-right font-mono text-sm font-medium", trader.netFlow >= 0 ? "text-positive" : "text-negative")}>
                                {trader.netFlow >= 0 ? "+" : ""}{formatUsd(trader.netFlow)}
                            </div>
                        </div>
                    ))}
                </div>
            </PanelStatus>
        </Card>
    )
}
