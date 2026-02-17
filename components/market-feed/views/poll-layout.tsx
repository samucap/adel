"use client";

import React from 'react';
import { CleanEvent } from '@/types';
import { cn } from '@/lib/utils';
import { SafeImage } from '../safe-image';

interface PollLayoutProps {
    event: CleanEvent;
}

export function PollLayout({ event }: PollLayoutProps) {
    const { outcomes } = event.displayData;
    const { image: eventImage } = event;

    if (!outcomes || outcomes.length === 0) {
        return <div className="text-xs text-muted-foreground">Poll data unavailable</div>;
    }

    const topOutcomes = [...outcomes]
        .sort((a, b) => b.price - a.price)
        .slice(0, 5);

    return (
        <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {topOutcomes.map((outcome, index) => {
                    const percent = Math.round(outcome.price * 100);
                    const isTop = index === 0;
                    const imgSrc = outcome.image || eventImage;

                    return (
                        <div
                            key={outcome.id ?? index}
                            className={cn(
                                "flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-md border transition-all",
                                "min-w-[80px] max-w-[90px]",
                                isTop
                                    ? "border-primary/50 bg-primary/5"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                            )}
                        >
                            {/* Outcome Image */}
                            <div className={cn(
                                "rounded-full overflow-hidden border flex items-center justify-center",
                                isTop ? "h-8 w-8 border-primary/30" : "h-6 w-6 border-white/20"
                            )}>
                                {imgSrc ? (
                                    <SafeImage
                                        src={imgSrc}
                                        alt={outcome.label}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className={cn(
                                        "h-full w-full flex items-center justify-center text-[10px] font-bold uppercase",
                                        isTop ? "bg-primary/20 text-primary" : "bg-white/10 text-muted-foreground"
                                    )}>
                                        {outcome.label.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Probability */}
                            <div className={cn(
                                "text-center",
                                isTop ? "text-sm font-bold text-primary" : "text-xs font-semibold"
                            )}>
                                {percent}%
                            </div>

                            {/* Label */}
                            <div className={cn(
                                "text-center text-[9px] leading-tight line-clamp-2",
                                isTop ? "text-foreground" : "text-muted-foreground"
                            )}>
                                {outcome.label}
                            </div>

                            {isTop && (
                                <div className="px-1 py-0.5 bg-primary/20 text-primary text-[8px] font-bold uppercase tracking-wider rounded">
                                    Top
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {outcomes.length > 5 && (
                <div className="flex justify-between items-center text-[9px] text-muted-foreground">
                    <span>{outcomes.length} total outcomes</span>
                    <span>Top 5 shown</span>
                </div>
            )}
        </div>
    );
}
