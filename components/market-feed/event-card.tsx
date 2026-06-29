"use client";

import React, { useMemo } from "react";
import { CleanEvent } from "@/types";
import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn, formatTimeRemaining, formatCurrency } from "@/lib/utils";
import { PollLayout } from "./views/poll-layout";
import { SportsLayout } from "./views/sports-layout";
import { SportsGroupLayout } from "./views/sports-group-layout";
import { BinaryLayout } from "./views/binary-layout";
import { SafeImage } from "./safe-image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEventStore } from "@/stores/eventStore";

interface EventCardProps {
  event: CleanEvent;
}

export function EventCard({ event }: EventCardProps) {
  const { initializeFromEvent } = useEventStore();

  const {
    title,
    ticker,
    layout,
    isLive,
    image,
    stats,
    statusBadge,
    volume24hrClob,
    liquidity,
  } = event;

  const { volumeUSD, spreadBP = 0 } = stats;
  const isDisputed = statusBadge === "DISPUTED";
  const timeRemaining = useMemo(() => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endDate = new Date(event.endDate);
    let msRemaining: number;

    if (now < startTime) {
      msRemaining = startTime.getTime() - now.getTime();
    } else if (now < endDate) {
      msRemaining = endDate.getTime() - now.getTime();
    } else {
      return null; // Event has ended
    }

    return msRemaining > 0 ? formatTimeRemaining(msRemaining) : null;
  }, [event.startTime, event.endDate]);

  const renderContent = () => {
    switch (layout) {
      case "POLL":
        return <PollLayout event={event} />;
      case "SPORTS":
        return <SportsLayout event={event} />;
      case "SPORTS_GROUP":
        return <SportsGroupLayout event={event} />;
      case "BINARY":
        return <BinaryLayout event={event} />;
      default:
        return (
          <div className="p-4 text-xs text-muted-foreground">
            Unsupported Layout: {layout}
          </div>
        );
    }
  };

  const isHighSpread = (spreadBP || 0) > 50;
  // Event navigation is now handled by Link component

  return (
    <div>
      <Link
        href={`/markets/${event.id}`}
        className="block h-full transition-all duration-300 hover:-translate-y-1"
        onClick={() => initializeFromEvent(event)}
      >
        <Card
          className={cn(
            "relative overflow-hidden flex flex-col h-full group rounded-2xl min-h-[220px]",
            "bg-[#0D1B18]/80 backdrop-blur-sm border-white/5",
            "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20 transition-all duration-500",
            isDisputed && "border-red-500/30 bg-red-950/10",
          )}
        >
          {/* Header */}
          <div className="p-4 pb-2 flex-1 flex flex-col gap-3">
            <div className="flex justify-between items-start gap-3">
              {/* Event Image */}
              {image && (
                <div className="h-12 w-12 rounded-md overflow-hidden bg-muted shrink-0 border border-white/10 group-hover:border-primary/30 transition-colors">
                  <SafeImage
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-1 flex-1 min-w-0">
                {/* Ticker & Live Status */}
                <div className="flex items-center gap-2">
                  {isLive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {title}
                </h3>
              </div>

              {/* Critical Badges */}
              <div className="flex flex-col gap-1 items-end pl-1">
                {isDisputed && (
                  <Badge
                    variant="destructive"
                    className="h-5 px-1.5 gap-1 text-[10px] uppercase font-bold tracking-wider animate-pulse"
                  >
                    <AlertTriangle className="h-3 w-3" />
                  </Badge>
                )}
                {isHighSpread && (
                  <Badge
                    variant="outline"
                    className="h-5 px-1.5 gap-1 text-[10px] text-amber-400 border-amber-500/30 bg-amber-500/10 uppercase font-bold tracking-wider"
                  >
                    <Activity className="h-3 w-3" />
                  </Badge>
                )}
              </div>
            </div>

            {/* Sub-View Content */}
            <div className="flex-1 mt-1">{renderContent()}</div>
          </div>

          {/* Footer / Stats */}
          <div className="p-3 mt-auto border-t border-white/5 bg-black/20 flex justify-between items-center text-[10px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="h-5 px-1.5 gap-1 text-[10px] text-amber-400 border-amber-500/30 bg-amber-500/10 uppercase font-bold tracking-wider"
              >
                <span className="font-mono">
                  {formatCurrency(volume24hrClob, "USD")} Vol
                </span>
              </Badge>
              <Badge>{formatCurrency(liquidity, "USD")} Liq</Badge>
              {timeRemaining !== null && (
                <Badge>
                  {new Date() < new Date(event.startTime)
                    ? `Starts in: ${timeRemaining}`
                    : `Ends in: ${timeRemaining}`}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}

