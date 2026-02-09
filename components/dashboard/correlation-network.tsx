"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mockCorrelationData } from "@/lib/mock-data"
import { Network } from "lucide-react"
import { useEffect, useRef, useState } from "react"
// We'll use a simple D3 simulation if possible, or a lightweight custom implementation
// For this environment, let's build a static-but-interactive SVG visualization 
// to avoid heavy D3 dependencies if they aren't installed, but "force-graph" style.

export function CorrelationNetwork() {
    // Pre-calculated positions for the mock data to simulate a force layout
    // In a real app, use d3-force
    const nodes = [
        { id: "Bitcoin", x: 50, y: 50, color: "#F7931A" },
        { id: "Ethereum", x: 70, y: 40, color: "#627EEA" },
        { id: "Solana", x: 60, y: 65, color: "#00FFA3" },
        { id: "FedRates", x: 30, y: 50, color: "#DCF763" },
        { id: "Inflation", x: 20, y: 65, color: "#ED254E" },
        { id: "StockMarket", x: 40, y: 30, color: "#70D6FF" },
        { id: "USElection", x: 80, y: 20, color: "#E8EDEB" },
        { id: "Regulations", x: 85, y: 50, color: "#A0ACAD" },
    ];

    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    return (
        <Card className="h-full border-border bg-card/80 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Network className="h-4 w-4 text-primary" />
                    Correlation Matrix
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 relative min-h-[250px]">
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 80" className="w-full h-full">
                        {/* Links */}
                        {mockCorrelationData.links.map((link, i) => {
                            const source = nodes.find(n => n.id === link.source);
                            const target = nodes.find(n => n.id === link.target);

                            if (!source || !target) return null;

                            const isPositive = link.value > 0;
                            const isHovered = hoveredNode && (link.source === hoveredNode || link.target === hoveredNode);
                            const opacity = hoveredNode ? (isHovered ? 1 : 0.1) : 0.6;
                            const width = Math.abs(link.value) * 2;

                            return (
                                <line
                                    key={i}
                                    x1={source.x}
                                    y1={source.y}
                                    x2={target.x}
                                    y2={target.y}
                                    stroke={isPositive ? "#4AE0A5" : "#ED254E"} // Green positive, Red negative inverse
                                    strokeWidth={width}
                                    strokeOpacity={opacity}
                                    strokeDasharray={link.value < -0.5 ? "2 1" : "0"} // Dashed for strong negative
                                    className="transition-all duration-300"
                                />
                            )
                        })}

                        {/* Nodes */}
                        {nodes.map((node) => {
                            const isHovered = hoveredNode === node.id;
                            const isDimmed = hoveredNode && hoveredNode !== node.id &&
                                !mockCorrelationData.links.some(l =>
                                    (l.source === hoveredNode && l.target === node.id) ||
                                    (l.target === hoveredNode && l.source === node.id)
                                );

                            return (
                                <g
                                    key={node.id}
                                    className="cursor-pointer transition-all duration-300"
                                    onMouseEnter={() => setHoveredNode(node.id)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    style={{ opacity: isDimmed ? 0.3 : 1 }}
                                >
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={isHovered ? 6 : 4}
                                        fill="#132925"
                                        stroke={node.color}
                                        strokeWidth={isHovered ? 2 : 1.5}
                                    />
                                    <text
                                        x={node.x}
                                        y={node.y + 8}
                                        textAnchor="middle"
                                        fontSize={3}
                                        fill="#A0ACAD"
                                        className="pointer-events-none select-none"
                                        fontWeight={isHovered ? "bold" : "normal"}
                                    >
                                        {node.id}
                                    </text>
                                </g>
                            )
                        })}
                    </svg>

                    {/* Floating Legend */}
                    <div className="absolute bottom-2 right-2 flex flex-col gap-1 bg-card/90 p-2 rounded border border-border/50 text-[10px] backdrop-blur">
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-[#4AE0A5]"></span>
                            <span>Positive Corr</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-[#ED254E] border-dashed border-b border-[#ED254E]"></span>
                            <span>Negative Corr</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
