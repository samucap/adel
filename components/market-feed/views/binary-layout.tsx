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
                <span className="mt-1 block text-2xs">Event: {event.id}</span>
            </div>
        );
    }

    // For Binary "Will X happen?", Index 0 is the "Yes" outcome
    const yesOutcome = outcomes[0];

    const pricePercent = Math.round(yesOutcome.price * 100);
    const change = yesOutcome.change24h || 0;
    const isRising = change >= 0;

    return (
        <div className="flex h-full flex-col gap-3">
            <div>
                <div className="font-mono text-4xl font-bold tracking-tight text-primary">{pricePercent}%</div>
                <div className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    <span>{yesOutcome.label} Chance</span>
                    {change !== 0 && (
                        <span
                            className={cn(
                                "rounded-sm px-1 font-mono",
                                isRising ? "bg-positive/12 text-positive" : "bg-negative/12 text-negative",
                            )}
                        >
                            {isRising ? "+" : ""}
                            {(change * 100).toFixed(1)}%
                        </span>
                    )}
                </div>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary transition-[width] duration-700" style={{ width: `${pricePercent}%` }} />
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2">
                <Button variant="ghost" className="h-9 border border-positive/20 bg-positive/12 font-semibold text-positive hover:bg-positive/20 hover:text-positive">
                    BUY YES
                </Button>
                <Button variant="ghost" className="h-9 border border-negative/20 bg-negative/12 font-semibold text-negative hover:bg-negative/20 hover:text-negative">
                    BUY NO
                </Button>
            </div>
        </div>
    );
}
