"use client"

import { ResponsiveContainer, Treemap, Tooltip } from "recharts"
import { mockTreemapData } from "@/lib/mock-data"
import { useTheme } from "next-themes"

const COLORS = ['#8889DD', '#9597E4', '#8DC77B', '#A5D297', '#E2CF45', '#F8C12D'];

const CustomContent = (props: any) => {
    const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : 'rgba(255,255,255,0)',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            {depth === 1 ? (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 7}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={14}
                >
                    {name}
                </text>
            ) : null}
            {depth === 1 ? (
                <text
                    x={x + 4}
                    y={y + 18}
                    fill="#fff"
                    fontSize={16}
                    fillOpacity={0.9}
                >
                    {index + 1}
                </text>
            ) : null}
        </g>
    );
};

export function MarketTreemap() {
    // Note: Recharts Treemap customization can be tricky with types. 
    // Using a simpler render for robustness.
    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <Treemap
                    data={mockTreemapData}
                    dataKey="size"
                    aspectRatio={4 / 3}
                    stroke="#fff"
                    fill="#3b3b3b" // Default fill
                    content={<CustomContent colors={COLORS} />}
                >
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <span className="font-bold text-foreground">{payload[0].payload.name}</span>
                                        <div className="flex flex-col text-xs text-muted-foreground">
                                            <span>Vol: ${(payload[0].value as number).toLocaleString()}</span>
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                </Treemap>
            </ResponsiveContainer>
        </div>
    )
}
