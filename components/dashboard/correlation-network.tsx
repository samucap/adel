"use client"

import { Network } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PanelHeader } from "@/components/dashboard/panel-header"
import { PanelStatus } from "@/components/dashboard/panel-status"
import { useDashboard, type CorrelationResponse } from "@/lib/dashboard"

export function CorrelationNetwork() {
    const query = useDashboard<CorrelationResponse>("/dashboard/correlation")
    const links = query.data?.links ?? []

    return (
        <Card className="h-full">
            <PanelHeader icon={Network} title="Correlation Matrix" />
            <PanelStatus query={query} empty={links.length === 0} emptyText="No correlation matrix is stored.">
                <div />
            </PanelStatus>
        </Card>
    )
}
