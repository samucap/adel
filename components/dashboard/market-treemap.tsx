"use client"

import { ResponsiveContainer, Treemap, Tooltip } from "recharts"
import { mockTreemapData, type TreemapNode } from "@/lib/mock-data"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Flatten data for simpler treemap rendering
const flattenTreemapData = (data: TreemapNode[]) => {
    const flattened: any[] = []
    data.forEach(category => {
        if (category.children) {
            category.children.forEach(child => {
                flattened.push({
                    name: child.name,
                    value: child.size,
                    size: child.size,
                    drift: child.drift,
                    liquidityRatio: child.liquidityRatio,
                    volatilityEdge: child.volatilityEdge,
                    image: child.image,
                    category: category.name,
                    categoryColor: category.color,
                })
            })
        }
    })
    return flattened
}

// Custom content renderer for Treemap nodes
const CustomContent = (props: any) => {
    const { x, y, width, height, name, drift, categoryColor } = props;

    // Don't render if too small
    if (width < 30 || height < 30) return null;

    // Determine color based on drift (momentum)
    let fill = "#334155"; // slate-700
    let stroke = "#1e293b"; // slate-800
    const labelColor = "#f8fafc"; // slate-50

    if (drift !== undefined) {
        const intensity = Math.min(Math.abs(drift) / 5, 1);

        if (drift > 0) {
            // Emerald (Success/Green)
            fill = `hsla(150, 80%, ${30 + intensity * 20}%, 1)`;
            stroke = "#064e3b"; // emerald-900
        } else if (drift < 0) {
            // Rose (Error/Red)
            fill = `hsla(340, 85%, ${40 + intensity * 10}%, 1)`;
            stroke = "#881337"; // rose-900
        }
    }

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: 2,
                    rx: 6,
                    ry: 6,
                }}
            />
            {width > 50 && height > 40 && (
                <>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 - 8}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={labelColor}
                        fontSize={Math.min(14, width / 6)}
                        fontWeight="700"
                        style={{ pointerEvents: 'none' }}
                    >
                        {name}
                    </text>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 + 10}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="rgba(255,255,255,0.8)"
                        fontSize={Math.min(12, width / 8)}
                        fontWeight="600"
                        style={{ pointerEvents: 'none' }}
                    >
                        {drift > 0 ? '+' : ''}{drift}%
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
            <div className="rounded-xl border border-white/10 bg-black/90 p-4 shadow-2xl backdrop-blur-xl">
                <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="font-bold text-white text-lg">{data.name}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/5">
                        {data.category || "Market"}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <span className="text-slate-400">Volume</span>
                    <span className="text-right font-mono text-white font-medium">
                        ${((data.value || data.size) / 1000000).toFixed(1)}M
                    </span>

                    <span className="text-slate-400">Momentum</span>
                    <span className={cn(
                        "text-right font-mono font-bold",
                        data.drift > 0 ? "text-emerald-400" : data.drift < 0 ? "text-rose-400" : "text-slate-400"
                    )}>
                        {data.drift > 0 ? '+' : ''}{data.drift}%
                    </span>

                    <span className="text-slate-400">Liquidity Score</span>
                    <span className="text-right font-mono text-white">{data.liquidityRatio?.toFixed(2) || "N/A"}x</span>

                    <span className="text-slate-400">Vol. Edge</span>
                    <span className="text-right font-mono text-cyan-400">{data.volatilityEdge?.toFixed(2) || "N/A"}</span>
                </div>
            </div>
        );
    }
    return null;
};

export function MarketTreemap() {
    const [mounted, setMounted] = useState(false);
    const [treemapData, setTreemapData] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        // Flatten the data for simpler rendering
        setTreemapData(flattenTreemapData(mockTreemapData));
    }, []);

    if (!mounted) return <div className="h-full w-full min-h-[300px] animate-pulse bg-white/5 rounded-xl border border-white/5" />;

    return (
        <div className="h-full w-full min-h-[350px] flex flex-col">
            {/* Header / Legend */}
            <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-sm font-semibold text-white/90 uppercase tracking-widest">Market Momentum Map</h3>
                <div className="flex items-center gap-3 text-xs font-medium bg-black/20 p-1 px-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-emerald-100">Bullish</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                        <span className="text-rose-100">Bearish</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[300px] relative overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
                {treemapData.length > 0 ? (
                    <div className="absolute inset-0">
                        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 200 }}>
                            <Treemap
                                data={treemapData}
                                dataKey="value"
                                aspectRatio={4 / 3}
                                stroke="#1e293b"
                                fill="#334155"
                                content={<CustomContent />}
                                isAnimationActive={true}
                                animationDuration={750}
                                animationEasing="ease-out"
                            >
                                <Tooltip content={<CustomTooltip />} cursor={false} />
                            </Treemap>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Loading treemap data...
                    </div>
                )}
            </div>
        </div>
    )
}

