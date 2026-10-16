"use client";

import React from 'react';
import { CleanEvent } from '@/types';
import { cn } from '@/lib/utils';
import { SafeImage } from '../safe-image';

interface SportsGroupLayoutProps {
    event: CleanEvent;
}

export function SportsGroupLayout({ event }: SportsGroupLayoutProps) {
    const { outcomes } = event.displayData;
    const { image: eventImage } = event;

    if (!outcomes || outcomes.length === 0) {
        return <div className="text-xs text-muted-foreground">Tournament data unavailable</div>;
    }

    const topOutcomes = [...outcomes]
        .sort((a, b) => b.price - a.price)
        .slice(0, 5);

    return (
        <div className="flex flex-col gap-2">
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                {topOutcomes.map((outcome, index) => {
                    const percent = Math.round(outcome.price * 100);
                    const isFavorite = index === 0;
                    const imgSrc = outcome.image || eventImage;
                    const teamColor = outcome.color;

                    return (
                        <div
                            key={outcome.id ?? index}
                            className={cn(
                                "flex w-22 shrink-0 flex-col items-center gap-1 rounded-md border p-2 transition-colors",
                                isFavorite ? "border-primary/40 bg-selected" : "border-border bg-surface-raised hover:bg-hover"
                            )}
                        >
                            {/* Team Logo */}
                            <div className={cn(
                                "flex items-center justify-center overflow-hidden rounded-full border-2",
                                isFavorite ? "size-9 border-primary/40" : "size-7 border-border"
                            )}
                                style={teamColor && !isFavorite ? { borderColor: teamColor } : undefined}
                            >
                                {imgSrc ? (
                                    <SafeImage
                                        src={imgSrc}
                                        alt={outcome.label}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className={cn(
                                        "flex size-full items-center justify-center text-2xs font-bold uppercase",
                                        isFavorite ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground"
                                    )}>
                                        {outcome.label.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Probability */}
                            <div className={cn(
                                "text-center font-mono",
                                isFavorite ? "text-sm font-bold text-primary" : "text-xs font-semibold text-foreground"
                            )}>
                                {percent}%
                            </div>

                            {/* Team Name */}
                            <div className={cn(
                                "line-clamp-2 text-center text-2xs leading-tight font-medium",
                                isFavorite ? "text-primary" : "text-muted-foreground"
                            )}>
                                {outcome.label}
                            </div>

                            {isFavorite && (
                                <div className="rounded-sm bg-primary/12 px-1 py-0.5 text-2xs font-bold tracking-wider text-primary uppercase">
                                    Favorite
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {outcomes.length > 5 && (
                <div className="flex items-center justify-between text-2xs text-muted-foreground">
                    <span>{outcomes.length} total teams</span>
                    <span>Top 5 shown</span>
                </div>
            )}
        </div>
    );
}