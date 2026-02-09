"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockDashboardStats } from "@/lib/mock-data"
import { Activity, DollarSign, Users, BarChart3, Coins, Layers } from "lucide-react"

export function DashboardStats() {
    return (
        <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-full items-center p-2">
            <StatsCard
                title="TVL"
                value={`$${(mockDashboardStats.tvl / 1000000).toFixed(1)}M`}
                trend="+5.2%"
                icon={DollarSign}
                accentColor="#DCF763"
            />
            <StatsCard
                title="Volume (24h)"
                value={`$${(mockDashboardStats.volume24h / 1000000).toFixed(1)}M`}
                trend="+20.1%"
                icon={Activity}
                accentColor="#70D6FF"
            />
            <StatsCard
                title="Open Interest"
                value={`$${(mockDashboardStats.openInterest / 1000000).toFixed(1)}M`}
                trend="+12.4%"
                icon={BarChart3}
                accentColor="#4AE0A5"
            />
            <StatsCard
                title="Fees (24h)"
                value={`$${(mockDashboardStats.fees24h / 1000).toFixed(0)}k`}
                trend="+8.5%"
                icon={Coins}
                accentColor="#DCF763"
            />
            <StatsCard
                title="Active Traders"
                value={mockDashboardStats.activeTraders.toLocaleString()}
                trend="+180"
                icon={Users}
                accentColor="#ED254E"
            />
            <StatsCard
                title="Active Markets"
                value={mockDashboardStats.activeMarkets.toLocaleString()}
                trend="New: 12"
                icon={Layers}
                accentColor="#A0ACAD"
            />
        </div>
    )
}

function StatsCard({ title, value, trend, icon: Icon, accentColor }: { title: string, value: string, trend: string, icon: any, accentColor: string }) {
    return (
        <Card className="h-full flex flex-col justify-center border-border/60 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-200 hover:border-primary/30 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
                <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
                <div
                    className="p-1 rounded-md transition-colors"
                    style={{ backgroundColor: `${accentColor}15` }}
                >
                    <Icon className="h-3 w-3" style={{ color: accentColor }} />
                </div>
            </CardHeader>
            <CardContent className="px-3 pb-3">
                <div className="text-lg font-bold font-mono tracking-tight">{value}</div>
                <div className="text-[9px] text-muted-foreground mt-0.5 flex items-center">
                    <span className="font-medium mr-1" style={{ color: trend.startsWith('+') || trend.startsWith('New') ? '#4AE0A5' : '#ED254E' }}>{trend}</span>
                    <span className="opacity-70">24h</span>
                </div>
            </CardContent>
        </Card>
    )
}
