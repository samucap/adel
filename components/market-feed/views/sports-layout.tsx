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
                "flex-1 flex flex-col items-center justify-center p-2 rounded-md transition-all cursor-pointer group gap-1 border border-transparent",
                "hover:bg-white/5",
                // Green Border/Glow for favorite
                isFavorite ? "border-green-500/50 bg-green-900/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]" : "hover:border-white/10"
            )}>
                <div className="h-10 w-10 relative mb-1">
                    <SafeImage
                        src={participant.imageUrl || event.image}
                        alt={participant.name}
                        className="object-contain w-full h-full drop-shadow-md"
                    />
                </div>
                <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider mb-0.5 line-clamp-1 text-center w-full px-1",
                    isFavorite ? "text-green-400" : "text-muted-foreground group-hover:text-foreground"
                )} title={participant.name}>
                    {participant.name}
                </span>

                {/* Price / Odds Display */}
                <div className={cn(
                    "min-w-[48px] text-center py-0.5 rounded text-xs font-mono font-bold",
                    isFavorite ? "bg-green-500/20 text-green-400" : "bg-slate-800 text-slate-300"
                )}>
                    {percent}%
                </div>
            </div>
        );
    };

    return (
        <div className="flex justify-between gap-2 h-full items-center pt-2 relative">
            {/* Away Team (Left per "Away @ Home" convention) */}
            {renderTeam(awayParticipant, false)}

            {/* Draw column or VS divider */}
            {drawOutcome ? (
                <div className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-md transition-all cursor-pointer border border-transparent gap-1",
                    "hover:bg-white/5 hover:border-white/10",
                    "min-w-[52px]"
                )}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Draw
                    </span>
                    <div className="min-w-[48px] text-center py-0.5 rounded text-xs font-mono font-bold bg-amber-500/15 text-amber-400">
                        {Math.round(drawOutcome.price * 100)}%
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-1 opacity-20">
                    <div className="h-8 w-px bg-white"></div>
                    <span className="text-[10px] font-black italic">AT</span>
                    <div className="h-8 w-px bg-white"></div>
                </div>
            )}

            {/* Home Team (Right) */}
            {renderTeam(homeParticipant, true)}
        </div>
    );
}
