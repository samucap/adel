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
import { mockActivities, mockDashboardStats } from "@/lib/mock-data"
import { BentoCard, BentoGrid } from "@/components/dashboard/bento-grid"
import { DashboardPanelWrapper } from "@/components/dashboard/panel-wrapper"
import { DashboardAlerts } from "@/components/dashboard/dashboard-alerts"
import { useAppStore } from "@/lib/store"
import { useEffect } from "react"
import { Activity, DollarSign, Users, BarChart3, Coins, Layers } from "lucide-react"

export default function DashboardPage() {

    return (
        <div className="flex flex-col gap-4 p-3">
            <DashboardAlerts />

            {/* Unified Masonry/Bento Grid */}
            <BentoGrid cols={6}>
                {/* Stats Row - compact metric cards */}
                <BentoCard size="sm">
                    <StatsCard
                        title="TVL"
                        value={`$${(mockDashboardStats.tvl / 1000000).toFixed(1)}M`}
                        trend="+5.2%"
                        icon={DollarSign}
                        accentColor="#DCF763"
                    />
                </BentoCard>
                <BentoCard size="sm">
                    <StatsCard
                        title="Volume (24h)"
                        value={`$${(mockDashboardStats.volume24h / 1000000).toFixed(1)}M`}
                        trend="+20.1%"
                        icon={Activity}
                        accentColor="#70D6FF"
                    />
                </BentoCard>
                <BentoCard size="sm">
                    <StatsCard
                        title="Open Interest"
                        value={`$${(mockDashboardStats.openInterest / 1000000).toFixed(1)}M`}
                        trend="+12.4%"
                        icon={BarChart3}
                        accentColor="#4AE0A5"
                    />
                </BentoCard>
                <BentoCard size="sm">
                    <StatsCard
                        title="Active Traders"
                        value={mockDashboardStats.activeTraders.toLocaleString()}
                        trend="+180"
                        icon={Users}
                        accentColor="#ED254E"
                    />
                </BentoCard>
                <BentoCard size="sm">
                    <StatsCard
                        title="Fees (24h)"
                        value={`$${(mockDashboardStats.fees24h / 1000).toFixed(0)}k`}
                        trend="+8.5%"
                        icon={Coins}
                        accentColor="#DCF763"
                    />
                </BentoCard>
                <BentoCard size="sm">
                    <StatsCard
                        title="Active Markets"
                        value={mockDashboardStats.activeMarkets.toLocaleString()}
                        trend="New: 12"
                        icon={Layers}
                        accentColor="#A0ACAD"
                    />
                </BentoCard>
                {/* Critical Panels - larger space for complex lists */}
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

                {/* Activity Feed - tall vertical panel for scrolling list */}
                <BentoCard size="md">
                    <DashboardPanelWrapper
                        panelId="activity"
                        defaultComponent={<ActivityFeed activities={mockActivities} />}
                    />
                </BentoCard>

                {/* Treemap - needs more horizontal space for visualization */}
                <BentoCard size="xl">
                    <DashboardPanelWrapper
                        panelId="treemap"
                        defaultComponent={<MarketTreemap />}
                    />
                </BentoCard>

                {/* Arbitrage Heatmap - wide visualization */}
                <BentoCard size="xl">
                    <DashboardPanelWrapper
                        panelId="arbitrage"
                        defaultComponent={<ArbitrageHeatmap />}
                    />
                </BentoCard>

                {/* Analytics panels - standard size for charts */}
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
        </div>
    )
}
