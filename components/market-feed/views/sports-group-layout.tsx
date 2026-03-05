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
        <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {topOutcomes.map((outcome, index) => {
                    const percent = Math.round(outcome.price * 100);
                    const isFavorite = index === 0;
                    const imgSrc = outcome.image || eventImage;
                    const teamColor = outcome.color;

                    return (
                        <div
                            key={outcome.id ?? index}
                            className={cn(
                                "flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-md border transition-all",
                                "min-w-[85px] max-w-[95px]",
                                isFavorite
                                    ? "border-green-500/50 bg-green-900/10 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                            )}
                        >
                            {/* Team Logo */}
                            <div className={cn(
                                "rounded-full overflow-hidden border-2 flex items-center justify-center",
                                isFavorite ? "h-9 w-9 border-green-500/40" : "h-7 w-7 border-white/20"
                            )}
                                style={teamColor && !isFavorite ? { borderColor: teamColor } : undefined}
                            >
                                {imgSrc ? (
                                    <SafeImage
                                        src={imgSrc}
                                        alt={outcome.label}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className={cn(
                                        "h-full w-full flex items-center justify-center text-[10px] font-bold uppercase",
                                        isFavorite ? "bg-green-500/20 text-green-400" : "bg-white/10 text-muted-foreground"
                                    )}>
                                        {outcome.label.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Probability */}
                            <div className={cn(
                                "text-center",
                                isFavorite ? "text-sm font-bold text-green-400" : "text-xs font-semibold text-red-400"
                            )}>
                                {percent}%
                            </div>

                            {/* Team Name */}
                            <div className={cn(
                                "text-center text-[9px] leading-tight line-clamp-2 font-medium",
                                isFavorite ? "text-foreground" : "text-muted-foreground"
                            )}>
                                {outcome.label}
                            </div>

                            {isFavorite && (
                                <div className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[8px] font-bold uppercase tracking-wider rounded border border-green-500/30">
                                    Favorite
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {outcomes.length > 5 && (
                <div className="flex justify-between items-center text-[9px] text-muted-foreground">
                    <span>{outcomes.length} total teams</span>
                    <span>Top 5 shown</span>
                </div>
            )}
        </div>
    );
}