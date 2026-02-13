import React from 'react';
import { Event } from '@/types';
import { cn } from '@/lib/utils';
import { SafeImage } from '../safe-image';

interface PollViewProps {
    event: Event;
}

export function PollView({ event }: PollViewProps) {
    // 1. Flatten Candidates
    const allMarkets = [event.primaryMarket, ...(event.markets || [])].filter(m => !!m);

    // 2. Map to displayable items
    const candidates = allMarkets.map(m => {
        const outcomes = m.outcomes || [];
        const yes = outcomes.find(o => o.label.toLowerCase() === 'yes') || outcomes[0];
        const price = yes?.price ?? 0;

        // Label Resolution
        const label = m.groupItemTitle || m.question || yes?.label || "Option";

        // Image Resolution: Check Event Teams first, then Market Image, then Fallback
        let image = m.outcomes?.[0]?.image || event.image;
        if (event.teams && event.teams.length > 0) {
            // Fuzzy match label to team name
            const team = event.teams.find(t =>
                label.toLowerCase().includes(t.name.toLowerCase()) ||
                t.name.toLowerCase().includes(label.toLowerCase()) ||
                (t.code && label.includes(t.code))
            );
            if (team) image = team.image;
        }

        return {
            id: m.id,
            label,
            price,
            percent: Math.round(price * 100),
            image,
            liquidity: m.liquidity ?? 0
        };
    });

    // 3. Filter & Sort
    // Filter: Prob > 1% OR Liquidity > $100 (to keep significant ones)
    // User asked to "list markets with percentages and liquidity above certain amount"
    const visibleCandidates = candidates
        .filter(c => c.percent >= 1 || c.liquidity > 100)
        .sort((a, b) => b.price - a.price);

    const isNegRisk = event.negRisk;

    if (visibleCandidates.length === 0) {
        return <div className="text-xs text-muted-foreground p-2">No active markets available.</div>;
    }

    return (
        <div className="flex flex-col gap-1.5 pt-2">
            <div className="max-h-[200px] overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
                {visibleCandidates.map((candidate) => (
                    <div
                        key={candidate.id}
                        className={cn(
                            "relative flex items-center justify-between p-2 rounded-md border text-sm overflow-hidden transition-colors group",
                            "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                        )}
                    >
                        {/* Progress Bar Background */}
                        <div
                            className={cn(
                                "absolute inset-y-0 left-0 opacity-15 transition-all duration-500",
                                isNegRisk ? "bg-primary" : "bg-blue-500"
                            )}
                            style={{ width: `${candidate.percent}%` }}
                        />

                        {/* Content */}
                        <div className="relative flex items-center gap-3 w-full z-10">
                            {/* Outcome Image */}
                            <div className="h-6 w-6 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                                <SafeImage
                                    src={candidate.image}
                                    alt={candidate.label}
                                    className="h-full w-full object-cover"
                                    fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.label)}&background=random`}
                                />
                            </div>

                            {/* Label */}
                            <span className="font-medium text-slate-200 truncate flex-1" title={candidate.label}>
                                {candidate.label}
                            </span>

                            {/* Price / Percent */}
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "font-bold font-mono text-xs",
                                    isNegRisk ? "text-primary" : "text-blue-400"
                                )}>
                                    {candidate.percent}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Footer hint if truncated? */}
            {candidates.length > visibleCandidates.length && (
                <div className="text-[10px] text-center text-muted-foreground pt-1">
                    + {candidates.length - visibleCandidates.length} smaller markets hidden
                </div>
            )}
        </div>
    );
}

// Custom Scrollbar styling handled in globals.css usually, or usage standard 'scrollbar-thin' if plugin available.
// For now, overflow-y-auto is sufficient.
