import React from 'react';
import { Event } from '@/types';

interface BinaryViewProps {
    event: Event;
}

export function BinaryView({ event }: BinaryViewProps) {
    const outcomes = event.primaryMarket?.outcomes || [];
    // Assuming binary is Yes/No. 
    // If not "Yes" explicitly, take first outcome.
    const yesOutcome = outcomes.find(o => o.label.toLowerCase() === 'yes') || outcomes[0];

    // Safety check
    if (!yesOutcome) {
        return <div className="text-xs text-muted-foreground">Data unavailable</div>;
    }

    const price = yesOutcome.price ?? 0;
    const pricePercent = price * 100;

    // Sparkline or simple bar
    // Orion spec says "BinaryCard probability={yesProb}" example uses just prob.
    // user snippet: return <BinaryCard probability={yesProb} />;

    const change24h = event.stats?.change24h ?? 0;
    const isRising = change24h >= 0;

    return (
        <div className="space-y-3">
            <div className="flex items-end justify-between">
                <div>
                    <div className="text-3xl font-bold tracking-tighter text-primary shadow-[0_0_20px_rgba(220,247,99,0.2)]">
                        {pricePercent.toFixed(0)}%
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                        {yesOutcome.label} Chance
                    </div>
                </div>
                {/* Sparkline Visual Placeholder */}
                <div className="h-8 w-16 bg-slate-800/50 rounded flex items-end overflow-hidden pb-[1px] px-[1px] gap-[1px]">
                    {[...Array(5)].map((_, i) => (
                        <div key={i}
                            className={`w-full ${isRising ? 'bg-primary/50' : 'bg-destructive/50'}`}
                            style={{ height: `${Math.random() * 80 + 20}%` }}
                        />
                    ))}
                </div>
            </div>

            <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 shadow-[0_0_10px_rgba(220,247,99,0.4)] ${isRising ? 'bg-primary' : 'bg-destructive'}`}
                    style={{ width: `${pricePercent}%` }}
                />
            </div>
        </div>
    );
}
