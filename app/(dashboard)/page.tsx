"use client"

import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { MarketTreemap } from "@/components/dashboard/market-treemap"
import { TrendingMarketsPanel } from "@/components/dashboard/trending-markets-panel"
import { ArbitrageHeatmap } from "@/components/dashboard/arbitrage-heatmap"
import { EdgeRiskScatter } from "@/components/dashboard/edge-risk-scatter"
import { CorrelationNetwork } from "@/components/dashboard/correlation-network"
import { LiquidityLadder } from "@/components/dashboard/liquidity-ladder"
import { WhalesPanel } from "@/components/dashboard/whales-panel"
import { StatsCard } from "@/components/dashboard/stat-card"
import { BentoCard, BentoGrid } from "@/components/dashboard/bento-grid"
import { DashboardPanelWrapper } from "@/components/dashboard/panel-wrapper"
import { DashboardAlerts } from "@/components/dashboard/dashboard-alerts"
import { Activity, DollarSign, Users, BarChart3, Coins, Layers } from "lucide-react"
import { formatAsOf, formatPercentChange, formatUsd, useDashboard, type DashboardStats } from "@/lib/dashboard"

export default function DashboardPage() {
    return (
        <>
            <DashboardAlerts />
            <BentoGrid cols={6}>
                <DashboardStatsRow />
                <BentoCard size="md">
                    <DashboardPanelWrapper
                        panelId="trending"
                        defaultComponent={<TrendingMarketsPanel />}
                    />
                </BentoCard>
                <BentoCard size="md">
                    <DashboardPanelWrapper
                        panelId="whales"
                        defaultComponent={<WhalesPanel />}
                    />
                </BentoCard>
                <BentoCard size="md">
                    <DashboardPanelWrapper
                        panelId="activity"
                        defaultComponent={<ActivityFeed />}
                    />
                </BentoCard>
                <BentoCard size="xl">
                    <DashboardPanelWrapper
                        panelId="treemap"
                        defaultComponent={<MarketTreemap />}
                    />
                </BentoCard>
                <BentoCard size="xl">
                    <DashboardPanelWrapper
                        panelId="arbitrage"
                        defaultComponent={<ArbitrageHeatmap />}
                    />
                </BentoCard>
                <BentoCard size="md">
                    <DashboardPanelWrapper
                        panelId="scatter"
                        defaultComponent={<EdgeRiskScatter />}
                    />
                </BentoCard>
                <BentoCard size="md">
                    <DashboardPanelWrapper
                        panelId="correlation"
                        defaultComponent={<CorrelationNetwork />}
                    />
                </BentoCard>
                <BentoCard size="md">
                    <DashboardPanelWrapper
                        panelId="liquidity"
                        defaultComponent={<LiquidityLadder />}
                    />
                </BentoCard>
            </BentoGrid>
        </>
    )
}

function DashboardStatsRow() {
    const query = useDashboard<DashboardStats>("/dashboard/stats")

    if (query.isPending) {
        return (
            <>
                {Array.from({ length: 6 }).map((_, i) => (
                    <BentoCard size="sm" key={i}>
                        <div className="h-full animate-pulse rounded-lg bg-muted/40" />
                    </BentoCard>
                ))}
            </>
        )
    }

    if (query.isError || !query.data) {
        return (
            <BentoCard size="xl">
                <div className="flex h-full items-center justify-between gap-3 p-4">
                    <p className="text-sm text-negative">Couldn&apos;t load market stats.</p>
                    <button type="button" onClick={() => query.refetch()} className="focus-ring text-xs font-semibold uppercase">
                        Retry
                    </button>
                </div>
            </BentoCard>
        )
    }

    const stats = query.data
    const asOf = formatAsOf(stats.marketsAsOf)
    const tradesAsOf = formatAsOf(stats.tradesAsOf)
    const traderDelta = stats.activeTradersChange
    const traderTrend = traderDelta == null ? null : `${traderDelta > 0 ? "+" : ""}${traderDelta.toLocaleString()}`

    return (
        <>
            <BentoCard size="sm">
                <StatsCard title="TVL" value={formatUsd(stats.tvl)} detail={`as of ${asOf}`} icon={DollarSign} />
            </BentoCard>
            <BentoCard size="sm">
                <StatsCard title="Volume (24h)" value={formatUsd(stats.volume24h)} detail={`as of ${asOf}`} icon={Activity} />
            </BentoCard>
            <BentoCard size="sm">
                <StatsCard
                    title="Open Interest"
                    value={formatUsd(stats.openInterest)}
                    trend={formatPercentChange(stats.openInterestChange)}
                    detail={`24h · ${asOf}`}
                    icon={BarChart3}
                />
            </BentoCard>
            <BentoCard size="sm">
                <StatsCard
                    title="Active Traders"
                    value={stats.activeTraders.toLocaleString()}
                    trend={traderTrend}
                    detail={`vs prior day · ${tradesAsOf}`}
                    icon={Users}
                />
            </BentoCard>
            <BentoCard size="sm">
                <StatsCard title="Fees (24h)" value="—" detail="not stored" icon={Coins} />
            </BentoCard>
            <BentoCard size="sm">
                <StatsCard
                    title="Active Markets"
                    value={stats.activeMarkets.toLocaleString()}
                    detail="with 24h volume"
                    icon={Layers}
                />
            </BentoCard>
        </>
    )
}
