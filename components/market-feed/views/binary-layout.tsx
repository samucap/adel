"use client";

import React from 'react';
import { CleanEvent } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BinaryLayoutProps {
    event: CleanEvent;
}

export function BinaryLayout({ event }: BinaryLayoutProps) {
    const { outcomes } = event.displayData;

    // Guard against missing outcomes
    if (!outcomes || outcomes.length === 0) {
        console.warn('[BinaryLayout] No outcomes for event:', event.id, event.title, event.displayData);
        return (
            <div className="text-xs text-muted-foreground">
                Binary data unavailable
                <span className="block text-[9px] opacity-50 mt-1">Event: {event.id}</span>
            </div>
        );
    }

    // For Binary "Will X happen?", Index 0 is the "Yes" outcome
    const yesOutcome = outcomes[0];

    const pricePercent = Math.round(yesOutcome.price * 100);
    const change = yesOutcome.change24h || 0;
    const isRising = change >= 0;

    return (
        <div className="flex flex-col h-full justify-between pt-1">
            <div className="flex items-end justify-between mb-4">
                {/* Huge Font Price Display */}
                <div>
                    <div className={cn(
                        "text-4xl font-black tracking-tighter drop-shadow-lg",
                        "text-primary"
                    )}>
                        {pricePercent}%
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <span>{yesOutcome.label} Chance</span>
                        {/* Change Indicator: +X.X% Green or -X.X% Red */}
                        {change !== 0 && (
                            <span className={cn(
                                "bg-white/5 px-1 rounded",
                                isRising ? "text-green-400" : "text-red-400"
                            )}>
                                {isRising ? '+' : ''}{(change * 100).toFixed(1)}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Probability Progress Bar */}
                <div className="h-2 w-full bg-[#1a1a20] rounded-full overflow-hidden">
                  <div className="h-full bg-primary shadow-[0_0_10px_rgba(57,255,20,0.5)] transition-all duration-1000" style={{width: `${pricePercent}%`}}></div>
                </div>

                {/* Sparkline Placeholder */}
                <div className="h-10 w-24 opacity-30">
                    <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                        <path
                            d="M 0 30 C 20 30, 20 10, 40 20 S 60 40, 80 20 S 100 0, 100 0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={isRising ? "text-primary" : "text-destructive"}
                        />
                    </svg>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
                <Button
                    className="h-9 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 border border-green-500/20 font-bold tracking-wide"
                    variant="ghost"
                >
                    BUY YES
                </Button>
                <Button
                    className="h-9 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 font-bold tracking-wide"
                    variant="ghost"
                >
                    BUY NO
                </Button>
            </div>
        </div>
    );
}
