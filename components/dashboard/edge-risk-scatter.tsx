import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, Legend, Cell, ReferenceLine } from "recharts"
import { mockScatterData } from "@/lib/mock-data"
import { chartTooltipStyleHex, chartTheme, CHART_COLORS_HEX } from "@/lib/chart-utils"

// Group data by category for coloring
const getDataByCategory = (category: string) => mockScatterData.filter(d => d.category === category);
const categories = Array.from(new Set(mockScatterData.map(d => d.category)));

const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={chartTooltipStyleHex} className="p-2 shadow-lg backdrop-blur-md">
                <p className="font-bold mb-1">{data.name}</p>
                <div className="text-xs space-y-1">
                    <p className="text-[#DCF763]">Edge: {data.edge.toFixed(2)}</p>
                    <p className="text-[#70D6FF]">Yield: {data.yield.toFixed(1)}%</p>
                    <p className="text-[#A0ACAD]">Acc: {data.accuracy}%</p>
                </div>
            </div>
        );
    }
    return null;
};

export function EdgeRiskScatter() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <Card className="h-full border-border bg-card/80 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Edge vs. Risk Frontier</CardTitle>
                <CardDescription>Volatility-adjusted edge vs. Yield equivalent return</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[250px] p-2 animate-pulse bg-muted/10" />
        </Card>
    );

    return (
        <Card className="h-full border-border bg-card/80 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Edge vs. Risk Frontier</CardTitle>
                <CardDescription>Volatility-adjusted edge vs. Yield equivalent return</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[250px] p-2 relative">
                <div className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} opacity={0.5} />

                            {/* Quadrant Lines */}
                            <ReferenceLine x={0} stroke={chartTheme.axis} strokeWidth={1} />
                            <ReferenceLine y={10} stroke={chartTheme.axis} strokeDasharray="3 3" />

                            <XAxis
                                type="number"
                                dataKey="edge"
                                name="Edge (Vol Adj)"
                                unit=""
                                stroke={chartTheme.axis}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Volatility Adj. Edge', position: 'bottom', fill: chartTheme.axis, fontSize: 10 }}
                            />
                            <YAxis
                                type="number"
                                dataKey="yield"
                                name="Yield %"
                                unit="%"
                                stroke={chartTheme.axis}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Yield Equiv. %', angle: -90, position: 'insideLeft', fill: chartTheme.axis, fontSize: 10 }}
                            />
                            <ZAxis type="number" dataKey="size" range={[50, 400]} name="Open Interest" />

                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                content={<ScatterTooltip />}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                                iconSize={8}
                            />

                            {categories.map((cat, index) => (
                                <Scatter
                                    key={cat}
                                    name={cat}
                                    data={getDataByCategory(cat)}
                                    fill={CHART_COLORS_HEX[index % CHART_COLORS_HEX.length]}
                                />
                            ))}
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
