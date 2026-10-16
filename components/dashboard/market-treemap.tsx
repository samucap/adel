"use client"

import { ResponsiveContainer, Treemap, Tooltip } from "recharts"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { PanelHeader } from "@/components/dashboard/panel-header"
import { PanelStatus } from "@/components/dashboard/panel-status"
import { useDashboard, type TreemapLeaf } from "@/lib/dashboard"

// Tile fill blends the direction color into the surface by momentum strength.
function tileFill(drift: number | undefined) {
    if (!drift) return "var(--surface-raised)"
    const pct = Math.round(25 + Math.min(Math.abs(drift) / 5, 1) * 45)
    return `color-mix(in oklab, var(${drift > 0 ? "--positive" : "--negative"}) ${pct}%, var(--surface))`
}

const CustomContent = (props: any) => {
    const { x, y, width, height, name, drift } = props;

    if (width < 30 || height < 30) return null;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={6}
                ry={6}
                style={{ fill: tileFill(drift), stroke: "var(--background)", strokeWidth: 2 }}
            />
            {width > 50 && height > 40 && (
                <>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 - 8}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="var(--text)"
                        fontSize={Math.min(14, width / 6)}
                        fontWeight="700"
                        style={{ pointerEvents: "none" }}
                    >
                        {name}
                    </text>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 + 10}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="var(--text)"
                        fontSize={Math.min(12, width / 8)}
                        fontWeight="600"
                        fontFamily="var(--font-mono)"
                        style={{ pointerEvents: "none" }}
                    >
                        {drift > 0 ? "+" : ""}{Number(drift).toFixed(1)}%
                    </text>
                </>
            )}
        </g>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="rounded-md border border-border bg-popover p-3 text-xs shadow-lg">
                <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-foreground">{data.name}</span>
                    <span className="rounded-sm bg-muted px-1.5 py-0.5 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {data.category || "Market"}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    <span className="text-muted-foreground">Volume</span>
                    <span className="text-right font-mono font-medium text-foreground">
                        ${((data.value || data.size) / 1000000).toFixed(1)}M
                    </span>

                    <span className="text-muted-foreground">Momentum</span>
                    <span className={cn(
                        "text-right font-mono font-bold",
                        data.drift > 0 ? "text-positive" : data.drift < 0 ? "text-negative" : "text-muted-foreground"
                    )}>
                        {data.drift > 0 ? "+" : ""}{Number(data.drift).toFixed(1)}%
                    </span>

                    <span className="text-muted-foreground">Liq / volume</span>
                    <span className="text-right font-mono text-foreground">{data.liquidityRatio?.toFixed(2) || "N/A"}</span>
                </div>
            </div>
        );
    }
    return null;
};

export function MarketTreemap() {
    const [mounted, setMounted] = useState(false);
    const query = useDashboard<TreemapLeaf[]>("/dashboard/treemap")

    useEffect(() => {
        setMounted(true);
    }, []);

    const treemapData = (query.data ?? []).map((leaf) => ({
        name: leaf.name,
        value: leaf.size,
        size: leaf.size,
        drift: leaf.drift,
        liquidityRatio: leaf.liquidityRatio,
        category: leaf.category,
    }))

    if (!mounted || query.isPending) return <Card className="h-full animate-pulse" />;

    return (
        <Card className="h-full">
            <PanelHeader
                title="Market Momentum Map"
                actions={
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-positive" />Bullish</span>
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-negative" />Bearish</span>
                    </div>
                }
            />
            <PanelStatus query={query} empty={treemapData.length === 0} emptyText="No category volume in the latest snapshot.">
                <div className="relative min-h-72 flex-1">
                    <div className="absolute inset-0">
                        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 200 }}>
                            <Treemap
                                data={treemapData}
                                dataKey="value"
                                aspectRatio={4 / 3}
                                content={<CustomContent />}
                                isAnimationActive={true}
                                animationDuration={750}
                                animationEasing="ease-out"
                            >
                                <Tooltip content={<CustomTooltip />} cursor={false} />
                            </Treemap>
                        </ResponsiveContainer>
                    </div>
                </div>
            </PanelStatus>
        </Card>
    )
}
