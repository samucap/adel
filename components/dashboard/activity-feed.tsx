"use client"

import { Card } from "@/components/ui/card"
import { PanelHeader } from "@/components/dashboard/panel-header"
import { PanelStatus } from "@/components/dashboard/panel-status"
import { cn } from "@/lib/utils"
import { useDashboard, type DashboardActivity } from "@/lib/dashboard"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export function ActivityFeed() {
    const query = useDashboard<DashboardActivity[]>("/dashboard/activity")
    const activities = query.data ?? []

    return (
        <Card className="h-full">
            <PanelHeader title="Recent Activity" />
            <PanelStatus query={query} empty={activities.length === 0} emptyText="No trades are stored.">
                <div className="custom-scrollbar min-h-0 flex-1 divide-y divide-border overflow-y-auto">
                    {activities.map((activity) => {
                        const buy = activity.action === "buy"
                        const when = new Date(activity.time).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
                        return (
                            <div key={activity.id} className="flex items-start gap-3 px-3 py-2 transition-colors hover:bg-hover">
                                <div className={cn("rounded-md p-1.5", buy ? "bg-positive/12 text-positive" : "bg-negative/12 text-negative")}>
                                    {buy ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <p className="mb-1 text-sm leading-none">
                                                <span className="font-mono font-semibold text-foreground">{activity.user}</span>{" "}
                                                <span className="text-muted-foreground">{buy ? "bought" : "sold"}</span>{" "}
                                                <span className={buy ? "text-positive" : "text-negative"}>{activity.outcome}</span>
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground" title={activity.market}>
                                                {activity.market}
                                            </p>
                                        </div>
                                        <span className="whitespace-nowrap text-xs text-muted-foreground">{when}</span>
                                    </div>
                                    <div className="mt-1 font-mono text-xs font-medium text-foreground">
                                        {activity.shares.toLocaleString()} shares
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </PanelStatus>
        </Card>
    )
}
