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
        <div className="flex flex-col gap-2">
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                {topOutcomes.map((outcome, index) => {
                    const percent = Math.round(outcome.price * 100);
                    const isTop = index === 0;
                    const imgSrc = outcome.image || eventImage;

                    return (
                        <div
                            key={outcome.id ?? index}
                            className={cn(
                                "flex w-22 shrink-0 flex-col items-center gap-1 rounded-md border p-2 transition-colors",
                                isTop ? "border-primary/40 bg-selected" : "border-border bg-surface-raised hover:bg-hover"
                            )}
                        >
                            {/* Outcome Image */}
                            <div className={cn(
                                "flex items-center justify-center overflow-hidden rounded-full border",
                                isTop ? "size-8 border-primary/40" : "size-6 border-border"
                            )}>
                                {imgSrc ? (
                                    <SafeImage
                                        src={imgSrc}
                                        alt={outcome.label}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className={cn(
                                        "flex size-full items-center justify-center text-2xs font-bold uppercase",
                                        isTop ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground"
                                    )}>
                                        {outcome.label.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Probability */}
                            <div className={cn(
                                "text-center font-mono",
                                isTop ? "text-sm font-bold text-primary" : "text-xs font-semibold text-foreground"
                            )}>
                                {percent}%
                            </div>

                            {/* Label */}
                            <div className={cn(
                                "line-clamp-2 text-center text-2xs leading-tight",
                                isTop ? "text-primary" : "text-muted-foreground"
                            )}>
                                {outcome.label}
                            </div>

                            {isTop && (
                                <div className="rounded-sm bg-primary/12 px-1 py-0.5 text-2xs font-bold tracking-wider text-primary uppercase">
                                    Top
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {outcomes.length > 5 && (
                <div className="flex items-center justify-between text-2xs text-muted-foreground">
                    <span>{outcomes.length} total outcomes</span>
                    <span>Top 5 shown</span>
                </div>
            )}
        </div>
    );
}
