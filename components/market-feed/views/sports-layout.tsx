"use client";

import React from 'react';
import { CleanEvent, Participant } from '@/types';
import { cn } from '@/lib/utils';
import { SafeImage } from '../safe-image';

interface SportsLayoutProps {
    event: CleanEvent;
}

export function SportsLayout({ event }: SportsLayoutProps) {
    const { participants, outcomes } = event.displayData;

    // Guard against missing data
    if (!participants || participants.length < 2) {
        return <div className="text-xs text-muted-foreground">Matchup data unavailable</div>;
    }

    // Find home and away teams by role
    const homeParticipant = participants.find(p => p.role === 'home');
    const awayParticipant = participants.find(p => p.role === 'away');

    if (!homeParticipant || !awayParticipant) {
        return <div className="text-xs text-muted-foreground">Team data incomplete</div>;
    }

    // Detect draw outcome (soccer three-way market)
    const drawOutcome = outcomes?.find(
        o => o.sportsMarketType === 'draw' ||
            ['draw', 'tie', 'x'].includes(o.label.toLowerCase()) ||
            o.label.toLowerCase().startsWith('draw (')
    );

    // Get probabilities from outcomes by matching names
    const getProbability = (participant: Participant): number => {
        if (!outcomes) return participant.probability || 0;
        const outcome = outcomes.find(o => o.label === participant.name);
        return outcome ? outcome.price : (participant.probability || 0);
    };

    const homeProbability = getProbability(homeParticipant);
    const awayProbability = getProbability(awayParticipant);

    // Determine favorite (higher probability)
    const isHomeFavorite = homeProbability >= awayProbability;

    const renderTeam = (participant: Participant, isHome: boolean) => {
        const probability = getProbability(participant);
        const percent = Math.round(probability * 100);
        const isFavorite = (isHome && isHomeFavorite) || (!isHome && !isHomeFavorite);

        return (
            <div className={cn(
                "group/team flex flex-1 flex-col items-center justify-center gap-1 rounded-md border p-2 transition-colors",
                isFavorite ? "border-primary/40 bg-selected" : "border-transparent hover:bg-hover"
            )}>
                <div className="relative size-10">
                    <SafeImage
                        src={participant.imageUrl || event.image}
                        alt={participant.name}
                        className="size-full object-contain"
                    />
                </div>
                <span className={cn(
                    "line-clamp-1 w-full px-1 text-center text-2xs font-bold tracking-wider uppercase",
                    isFavorite ? "text-primary" : "text-muted-foreground group-hover/team:text-foreground"
                )} title={participant.name}>
                    {participant.name}
                </span>

                {/* Price / Odds Display */}
                <div className={cn(
                    "min-w-12 rounded-sm py-0.5 text-center font-mono text-xs font-bold",
                    isFavorite ? "bg-primary/12 text-primary" : "bg-muted text-foreground"
                )}>
                    {percent}%
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-full items-center justify-between gap-2">
            {/* Away Team (Left per "Away @ Home" convention) */}
            {renderTeam(awayParticipant, false)}

            {/* Draw column or VS divider */}
            {drawOutcome ? (
                <div className="flex min-w-13 flex-col items-center justify-center gap-1 rounded-md p-2 transition-colors hover:bg-hover">
                    <span className="text-2xs font-bold tracking-wider text-muted-foreground uppercase">
                        Draw
                    </span>
                    <div className="min-w-12 rounded-sm bg-muted py-0.5 text-center font-mono text-xs font-bold text-foreground">
                        {Math.round(drawOutcome.price * 100)}%
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <div className="h-8 w-px bg-border" />
                    <span className="text-2xs font-bold italic">AT</span>
                    <div className="h-8 w-px bg-border" />
                </div>
            )}

            {/* Home Team (Right) */}
            {renderTeam(homeParticipant, true)}
        </div>
    );
}
