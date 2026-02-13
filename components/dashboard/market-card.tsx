"use client"

import React, { useMemo } from 'react';
import { Gift, Bookmark, MessageSquare, TrendingUp } from 'lucide-react';
import { Event, Market } from "@/types/dashboard"
import { Gauge } from "@/components/ui/gauge"
import { cn, formatCurrency } from "@/lib/utils"

interface MarketCardProps {
    event: Event
    onClick?: () => void
}

export function MarketCard({ event, onClick }: MarketCardProps) {
    // -------------------------------------------------------------------------
    // 1. Determine Primary Market (for Gauge & Main Display)
    // -------------------------------------------------------------------------
    const primaryMarket = useMemo(() => {
        if (!event.markets || event.markets.length === 0) return null
        // Prefer active markets, or the first one
        return event.markets.find(m => m.active) || event.markets[0]
    }, [event.markets])

    // -------------------------------------------------------------------------
    // 2. Calculate Chance / Gauge Value
    // -------------------------------------------------------------------------
    const chanceValue = useMemo(() => {
        if (!primaryMarket) return 50

        // Try to parse outcomePrices
        try {
            const prices = JSON.parse(primaryMarket.outcomePrices) as string[]
            // Assuming 2 outcomes usually [Yes, No] or [Long, Short]
            // We want the probability of the first outcome (usually "Yes")
            if (prices && prices.length > 0) {
                return parseFloat(prices[0]) * 100
            }
        } catch (e) {
            // fallback
        }

        // Fallback to bestAsk if available and prices parse failed
        if (primaryMarket.bestAsk) {
            return primaryMarket.bestAsk * 100
        }

        return 50 // Default neutral if no data
    }, [primaryMarket])

    // -------------------------------------------------------------------------
    // 3. Parse Outcomes for Buttons
    // -------------------------------------------------------------------------
    const outcomes = useMemo(() => {
        if (!primaryMarket) return []
        try {
            const labels = JSON.parse(primaryMarket.outcomes) as string[]
            const prices = JSON.parse(primaryMarket.outcomePrices) as string[]

            return labels.map((label, idx) => ({
                label,
                price: prices[idx] ? parseFloat(prices[idx]) : 0,
                color: idx === 0 ? 'green' : (idx === 1 ? 'red' : 'blue') // Simple color mapping
            }))
        } catch (e) {
            return []
        }
    }, [primaryMarket])

    const showGauge = true // We can toggle this based on event type if needed

    // -------------------------------------------------------------------------
    // Render Helpers
    // -------------------------------------------------------------------------

    const renderBinaryOutcomes = () => {
        return (
            <div className="flex gap-2 mt-3 z-10 relative">
                {outcomes.map((outcome, idx) => (
                    <button
                        key={idx}
                        className={cn(
                            "flex-1 flex flex-col items-center justify-center rounded py-2 px-3 text-sm font-medium transition-colors relative overflow-hidden group border border-transparent",
                            outcome.color === 'green' && "bg-[#0E281A] text-[#27F293] hover:border-[#27F293]/30 hover:bg-[#133D26]",
                            outcome.color === 'red' && "bg-[#291415] text-[#F34045] hover:border-[#F34045]/30 hover:bg-[#3D1A1C]",
                            outcome.color === 'blue' && "bg-[#101E33] text-[#3B82F6] hover:border-[#3B82F6]/30 hover:bg-[#152844]",
                            !outcome.color && "bg-muted text-gray-300 hover:bg-muted/80"
                        )}
                        onClick={(e) => {
                            e.stopPropagation()
                            // Handle buy/trade click future
                        }}
                    >
                        <span className="z-10">{outcome.label}</span>
                        <span className="text-xs opacity-80 z-10">
                            {Math.round(outcome.price * 100)}%
                        </span>
                    </button>
                ))}
            </div>
        )
    }

    // Default image
    const imageSrc = event.image || "/placeholder.svg"

    return (
        <div
            className="bg-[#1C1C1E] border border-[#2C2D31] rounded-xl p-4 hover:border-gray-500 hover:shadow-lg hover:shadow-black/20 transition-all flex flex-col h-full group relative cursor-pointer"
            onClick={onClick}
        >
            {/* Live / New / Hot Badge */}
            <div className="flex gap-2 mb-2 absolute top-4 left-4 z-10 pointer-events-none">
                {event.active && (
                    <div className="flex items-center gap-1 bg-[#291415] text-[#F34045] text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-[#F34045]/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F34045] animate-pulse"></div>
                        LIVE
                    </div>
                )}
                {event.new && (
                    <div className="flex items-center gap-1 bg-[#282512] text-[#EAB308] text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-[#EAB308]/20">
                        <span className="text-[#EAB308]">+</span>
                        NEW
                    </div>
                )}
                {event.featured && (
                    <div className="flex items-center gap-1 bg-[#2b1736] text-[#c084fc] text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-[#c084fc]/20">
                        <TrendingUp size={10} />
                        HOT
                    </div>
                )}
            </div>

            {/* Header Area */}
            <div className="flex gap-3 mb-1">
                <div className="w-16 h-16 flex-shrink-0 mt-1 relative">
                    <img
                        src={imageSrc}
                        alt={event.title}
                        className="w-full h-full rounded-lg shadow-md object-cover border border-[#2C2D31] group-hover:border-gray-600 transition-colors"
                    />
                </div>

                <div className="flex-1 min-w-0 flex justify-between gap-2">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-white text-[15px] font-medium leading-snug line-clamp-3 group-hover:text-blue-400 transition-colors">
                            {event.title}
                        </h3>
                    </div>

                    {showGauge && (
                        <div className="flex-shrink-0 pt-1">
                            <Gauge
                                value={chanceValue}
                                label="Chance"
                                color={chanceValue > 50 ? "#27F293" : "#F34045"}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Outcomes Area */}
            <div className="mt-auto">
                {renderBinaryOutcomes()}
            </div>

            {/* Markets List - Scrollable */}
            {event.markets && event.markets.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[#2C2D31]/50">
                    <p className="text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Markets</p>
                    <div className="max-h-24 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {event.markets.map(market => (
                            <div key={market.id} className="text-xs py-1 px-1.5 rounded-sm hover:bg-[#2C2D31] transition-colors cursor-pointer border border-transparent hover:border-gray-700/50 text-gray-300">
                                <div className="line-clamp-2 leading-snug">{market.question}</div>

                                {market.active && (
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                            {market.outcomePrices ? "Live" : "Pending"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer Info */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500 pt-3 border-t border-[#2C2D31]/50">
                <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-medium">{formatCurrency(event.volume)} Vol.</span>

                    {/* Liq Indicator */}
                    <span className="w-0.5 h-0.5 rounded-full bg-gray-600"></span>
                    <span className="text-gray-400 font-medium">{formatCurrency(event.liquidity)} Liq.</span>
                </div>

                <div className="flex items-center gap-3">
                    {event.commentCount > 0 && (
                        <div className="flex items-center gap-1 hover:text-gray-300 cursor-pointer">
                            <MessageSquare size={12} />
                            <span>{event.commentCount}</span>
                        </div>
                    )}
                    <button className="hover:text-white transition-colors relative z-10" onClick={(e) => {
                        e.stopPropagation();
                        // Handle gift/bookmark
                    }}>
                        <Gift size={14} />
                    </button>
                    <button className="hover:text-white transition-colors relative z-10" onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        <Bookmark size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
