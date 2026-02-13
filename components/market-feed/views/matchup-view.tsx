import React from 'react';
import { Event } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SafeImage } from '../safe-image';

interface MatchupViewProps {
    event: Event;
}

export function MatchupView({ event }: MatchupViewProps) {
    const outcomes = event.primaryMarket?.outcomes || [];
    const teams = event.teams || [];

    // Map outcomes to teams. Usually index 0 = Team 1, index 1 = Team 2
    // If teams data is missing, fallback to outcomes
    const homeTeam = teams[0] || { name: outcomes[0]?.label || 'Home', logo: outcomes[0]?.logo ? outcomes[0]?.logo : 'placeholder' };
    const awayTeam = teams[1] || { name: outcomes[1]?.label || 'Away', logo: outcomes[1]?.logo ? outcomes[1]?.logo : 'placeholder' };

    const homeOutcome = outcomes[0] ?? { price: 0.5 };
    const awayOutcome = outcomes[1] ?? { price: 0.5 };

    const homePrice = homeOutcome.price;
    const awayPrice = awayOutcome.price;

    const isLive = new Date() >= new Date(event.startDate);

    return (
        <div className="relative flex justify-between gap-2 h-full items-center pt-2">
            {isLive && (
                <Badge
                    variant="destructive"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 animate-pulse text-[10px] px-1.5 py-0 h-4"
                >
                    LIVE
                </Badge>
            )}

            {/* Home Team (Left) */}
            <div className="flex-1 flex flex-col items-center justify-center p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group gap-1">
                <div className="h-10 w-10 relative">
                    <SafeImage
                        src={homeTeam.logo}
                        alt={homeTeam.name}
                        className="object-contain w-full h-full drop-shadow-md"
                        fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(homeTeam.name)}&background=transparent`}
                    />
                </div>
                <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider mb-0.5 line-clamp-1 group-hover:text-primary transition-colors text-center w-full px-1",
                    homePrice > 0.5 ? "text-primary" : "text-muted-foreground"
                )} title={homeTeam.name}>
                    {homeTeam.name}
                </span>
                <div className={cn(
                    "min-w-[40px] text-center py-0.5 rounded text-xs font-mono font-bold transition-all",
                    homePrice > 0.5 ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
                )}>
                    {(homePrice * 100).toFixed(0)}%
                </div>
            </div>

            <div className="text-muted-foreground/20 font-light text-xs pt-4">VS</div>

            {/* Away Team (Right) */}
            <div className="flex-1 flex flex-col items-center justify-center p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group gap-1">
                <div className="h-10 w-10 relative">
                    <SafeImage
                        src={awayTeam.logo}
                        alt={awayTeam.name}
                        className="object-contain w-full h-full drop-shadow-md"
                        fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(awayTeam.name)}&background=transparent`}
                    />
                </div>
                <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider mb-0.5 line-clamp-1 group-hover:text-primary transition-colors text-center w-full px-1",
                    awayPrice > 0.5 ? "text-primary" : "text-muted-foreground"
                )} title={awayTeam.name}>
                    {awayTeam.name}
                </span>
                <div className={cn(
                    "min-w-[40px] text-center py-0.5 rounded text-xs font-mono font-bold transition-all",
                    awayPrice > 0.5 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                    {(awayPrice * 100).toFixed(0)}%
                </div>
            </div>

            {/* Split Probability Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800/50 rounded-full overflow-hidden flex">
                <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${homePrice * 100}%` }}
                />
                <div
                    className="h-full bg-slate-700 transition-all duration-500"
                    style={{ width: `${awayPrice * 100}%` }}
                />
            </div>
        </div>
    );
}
