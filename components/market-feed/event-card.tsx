"use client";

import React, { useMemo } from 'react';
import { Event } from '@/types';
import { Card, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, DollarSign, TrendingUp, TrendingDown, MessageSquare, Gift, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PollView } from './views/poll-view';
import { MatchupView } from './views/matchup-view';
import { BinaryView } from './views/binary-view';
import { SafeImage } from './safe-image';
import { Gauge } from './gauge';
import { Sparkline } from './sparkline';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BorderBeam } from '@/components/ui/border-beam';
import { NumberTicker } from '@/components/ui/number-ticker';

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    const {
        title = "Untitled Market",
        stats = { volumeUSD: "$0", liquidityRating: 'low', change24h: 0, isHot: false },
        type = 'binary',
        startDate,
        image,
        chartData,
        featured
    } = event || {};

    const { volumeUSD = '$0', change24h = 0, isHot = false, spreadBp } = stats;

    const renderContent = () => {
        switch (type) {
            case 'election':
            case 'multi':
                return <PollView event={event} />;
            case 'sports':
                return <MatchupView event={event} />;
            case 'binary':
            default:
                return <BinaryView event={event} />;
        }
    };

    // Calculate probability for Gauge
    const gaugeValue = useMemo(() => {
        const outcomes = event.primaryMarket?.outcomes || [];
        const yes = outcomes.find(o => o.label.toLowerCase() === 'yes') || outcomes[0];
        return Math.round((yes?.price || 0) * 100);
    }, [event]);

    // Determine High Probability Outcome
    const highProbOutcome = useMemo(() => {
        if (!event.primaryMarket?.outcomes) return null;
        return event.primaryMarket.outcomes.reduce((prev, current) =>
            (prev.price > current.price) ? prev : current
            , event.primaryMarket.outcomes[0]);
    }, [event]);

    // Check for rewards (gift icon)
    const hasRewards = (event.liquidityClob || 0) > 0 || (event as any).rewards;

    return (
        <Link href={`/markets/${event.id}`} className="block h-full transition-transform duration-300 hover:-translate-y-1">
            <Card
                className={cn(
                    "relative overflow-hidden flex flex-col h-full group",
                    // Base Background & Border
                    "bg-[#0D1B18]/80 backdrop-blur-sm border-white/5",
                    // Hover Effects: Border color
                    "hover:border-primary/40 hover:shadow-lg transition-all duration-500"
                )}
            >
                {/* Border Beam for Featured Items */}
                {featured && (
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <BorderBeam size={250} duration={12} delay={9} borderWidth={1.5} colorFrom="var(--primary)" colorTo="var(--secondary)" />
                    </div>
                )}

                {/* Badges: Category (only if needed/context allows, hardcoded check for now or passed prop) */}
                {/* For now, we always show category if available and no other badges are taking priority, or just standard position */}
                <div className="absolute top-3 left-3 z-20 flex gap-2">
                    {/* Replaced Hot/Featured with Category Badge or nothing if not "All" context - Assuming "All" for now or checking store in parent */}
                    {/* We'll just show the Category badge as requested for "All" view. 
                        Since we don't have context here, we can optionally show it or let parent control.
                        User asked: "replace for category badge when category all". 
                        We'll assume we show it. */}
                    {/* TODO: Pass context to know if we are in 'all' category */}
                    <Badge variant="outline" className="bg-black/40 border-white/10 text-xs backdrop-blur-md">
                        {/* Derive category from slug or first tag? Using mocked 'type' or similar for now if no direct category field */}
                        {(event as any).category || (event.slug ? event.slug.split('/')[0] : "Market")}
                    </Badge>
                </div>

                <div className="p-4 pb-2 flex-1 relative z-10 flex flex-col gap-4">
                    {/* Header: Image + Title + Gauge */}
                    <div className="flex gap-3">
                        {/* Image Container */}
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-white/10 group-hover:border-primary/30 transition-colors shadow-lg">
                            <SafeImage src={image} alt={title} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <CardTitle className="text-base font-semibold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                {title}
                            </CardTitle>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    <span className="font-mono text-white/80">{volumeUSD} Vol</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Activity className="h-3 w-3" />
                                    <span className="font-mono text-white/80">
                                        Liq: ${stats.liquidityRating === 'high' ? '100k+' : '10k+'} {/* Placeholder logic, need real liq value */}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Percent Chance (Highest) */}
                        <div className="flex-shrink-0 flex flex-col items-end justify-start">
                            <div className="text-2xl font-bold tracking-tighter text-primary">
                                {highProbOutcome ? Math.round(highProbOutcome.price * 100) : 0}%
                            </div>
                            {highProbOutcome && (
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wide max-w-[60px] truncate text-right">
                                    {highProbOutcome.label}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Area (Views) */}
                    <div className="flex-1">
                        {renderContent()}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 mt-auto border-t border-white/5 bg-black/20 flex justify-between items-center text-[10px] text-muted-foreground relative z-10">

                    {/* Sparkline & Change */}
                    <div className="flex items-center gap-3">
                        {chartData && chartData.length > 1 ? (
                            <Sparkline
                                data={chartData}
                                width={60}
                                height={20}
                                className={cn(
                                    "opacity-50 group-hover:opacity-100 transition-opacity",
                                    change24h >= 0 ? "text-primary" : "text-destructive"
                                )}
                                color="currentColor"
                            />
                        ) : (
                            <div className="flex items-center gap-1 text-xs opacity-60">
                                <Activity className="h-3 w-3" />
                                <span>No Data</span>
                            </div>
                        )}
                        <div className={cn(
                            "flex items-center gap-0.5 font-medium",
                            change24h > 0 ? "text-primary" : change24h < 0 ? "text-destructive" : "text-muted-foreground"
                        )}>
                            {change24h > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            <span>{Math.abs(change24h).toFixed(1)}%</span>
                        </div>
                    </div>

                    {/* Actions (Visual) */}
                    <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        {hasRewards && (
                            <div className="flex items-center text-amber-400 animate-pulse" title="Rewards Available">
                                <Gift className="h-3.5 w-3.5" />
                            </div>
                        )}
                        <button className="hover:text-white transition-colors"><MessageSquare className="h-3.5 w-3.5" /></button>
                        <button className="hover:text-white transition-colors"><Bookmark className="h-3.5 w-3.5" /></button>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
