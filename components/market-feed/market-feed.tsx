import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Event } from '@/types';
import { EventCard } from './event-card';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { SortControls } from './sort-controls';

interface MarketFeedProps {
    events: Event[];
}

// Memoized EventCard for performance
const MemoizedEventCard = React.memo(EventCard);

export function MarketFeed({ events }: MarketFeedProps) {
    const { viewMode } = useAppStore();

    return (
        <div className="space-y-4">
            {/* Header removed as controls are moved to CategoryNav */}

            {viewMode === 'grid' ? (
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
                    {events.map(event => (
                        <MemoizedEventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <DataTable columns={columns} data={events} />
            )}

            {events.length === 0 && (
                <div className="py-20 text-center text-muted-foreground">
                    No markets found for this category.
                </div>
            )}
        </div>
    );
}
