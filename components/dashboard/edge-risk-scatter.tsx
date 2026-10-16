"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { PanelHeader } from "@/components/dashboard/panel-header"
import { PanelStatus } from "@/components/dashboard/panel-status"
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { chartTheme } from "@/lib/chart-utils"
import { seriesVar } from "@/lib/tokens"
import { formatUsd, useDashboard, type EdgePoint } from "@/lib/dashboard"

const ScatterTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: EdgePoint }> }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className="rounded-md border border-border bg-popover p-2 text-xs shadow-lg">
                <p className="mb-1 font-semibold text-foreground">{data.name}</p>
                <div className="space-y-0.5 font-mono text-muted-foreground">
                    <p>Edge: <span className="text-foreground">{data.edgeBps.toFixed(1)} bps</span></p>
                    <p>Spread: <span className="text-foreground">{(data.spread * 100).toFixed(2)}%</span></p>
                    <p>24h vol: <span className="text-foreground">{formatUsd(data.volume24h)}</span></p>
                </div>
            </div>
        )
    }
    return null
}

export function EdgeRiskScatter() {
    const [mounted, setMounted] = useState(false)
    const query = useDashboard<EdgePoint[]>("/dashboard/edge")

    useEffect(() => {
        setMounted(true)
    }, [])

    const points = query.data ?? []
    const categories = Array.from(new Set(points.map((point) => point.category)))

    return (
        <Card className="h-full">
            <PanelHeader title="Edge vs. Spread" description="Model edge against the stored book spread" />
            {!mounted || query.isPending ? (
                <div className="min-h-64 flex-1 animate-pulse bg-muted/40" />
            ) : (
                <PanelStatus query={query} empty={points.length === 0} emptyText="No edge board rows are stored.">
                    <div className="relative min-h-64 flex-1 p-2">
                        <div className="absolute inset-0">
                            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 200 }}>
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} opacity={0.5} />
                                    <XAxis
                                        type="number"
                                        dataKey="edgeBps"
                                        name="Edge"
                                        stroke={chartTheme.axis}
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{ value: "Edge (bps)", position: "bottom", fill: chartTheme.axis, fontSize: 10 }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="spread"
                                        name="Spread"
                                        stroke={chartTheme.axis}
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                                    />
                                    <ZAxis type="number" dataKey="volume24h" range={[50, 400]} name="Volume" />
                                    <Tooltip cursor={{ strokeDasharray: "3 3", stroke: chartTheme.axis }} content={<ScatterTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: "var(--text-xs)", paddingTop: "8px", color: "var(--muted)" }} iconSize={8} />
                                    {categories.map((category, index) => (
                                        <Scatter
                                            key={category}
                                            name={category}
                                            data={points.filter((point) => point.category === category)}
                                            fill={seriesVar(index)}
                                        />
                                    ))}
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </PanelStatus>
            )}
        </Card>
    )
}
