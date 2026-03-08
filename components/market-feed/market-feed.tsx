import React from 'react';
import { useAppStore } from '@/lib/store';
import { CleanEvent } from '@/types';
import { EventCard } from './event-card';

interface MarketFeedProps {
    events: CleanEvent[];
}

// Memoized EventCard for performance
const MemoizedEventCard = React.memo(EventCard);

export function MarketFeed({ events }: MarketFeedProps) {
    const { viewMode } = useAppStore();

    return (
        <div className="space-y-4">
            {viewMode === 'grid' ? (
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
                    {events.map(event => (
                        <MemoizedEventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                //TODO: add data table view
                // table headers: Market (outcome.label|market.groupItemTitle), prices (yes in green/no in red prices),
                // volume (clob), liquidity (clob), start date if now < start date, else timer for time remaining (endDate - now)
                <div className="p-4 border rounded bg-muted/20 text-center">
                    Table view temporarily unavailable during migration.
                </div>
            )}

            {events.length === 0 && (
                <div className="py-20 text-center text-muted-foreground">
                    No markets found for this category.
                </div>
            )}
        </div>
    );
}

