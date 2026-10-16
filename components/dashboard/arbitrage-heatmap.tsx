"use client"

import { Card } from "@/components/ui/card"
import { PanelHeader } from "@/components/dashboard/panel-header"
import { PanelStatus } from "@/components/dashboard/panel-status"
import { useDashboard } from "@/lib/dashboard"
import { ArrowRightLeft } from "lucide-react"

export function ArbitrageHeatmap() {
    const query = useDashboard<unknown[]>("/dashboard/arbitrage")

    return (
        <Card className="h-full">
            <PanelHeader icon={ArrowRightLeft} title="Arbitrage Scanner" description="Cross-platform price discrepancies" />
            <PanelStatus
                query={query}
                empty={(query.data ?? []).length === 0}
                emptyText="No cross-venue prices are stored."
            >
                <div />
            </PanelStatus>
        </Card>
    )
}
