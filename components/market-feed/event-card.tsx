"use client";

import React, { useMemo } from "react";
import { CleanEvent } from "@/types";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Activity } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { formatDuration } from "@/lib/duration";
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
  const timeLabel = useMemo(() => {
    const now = Date.now();
    const startTime = new Date(event.startTime).getTime();
    const endDate = new Date(event.endDate).getTime();

    if (Number.isNaN(endDate) || now >= endDate) return "ended";
    if (!Number.isNaN(startTime) && now < startTime) {
      return `Starts in ${formatDuration(startTime - now)}`;
    }
    return `Ends in ${formatDuration(endDate - now)}`;
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

  const badgeClass = "h-5 rounded-sm px-1.5 font-mono text-2xs";

  return (
    <Link
      href={`/markets/${event.id}`}
      className="focus-ring group block h-full rounded-lg"
      onClick={() => initializeFromEvent(event)}
    >
      <Card
        className={cn(
          "h-full min-h-56 transition-colors group-hover:border-primary/40",
          isDisputed && "border-negative/40",
        )}
      >
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            {image && (
              <div className="size-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                <SafeImage src={image} alt={title} className="size-full object-cover" />
              </div>
            )}

            <div className="flex min-w-0 flex-1 items-start gap-2">
              {isLive && (
                <span className="relative mt-1.5 flex size-2 shrink-0" aria-label="Live">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-positive opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-positive" />
                </span>
              )}
              <h3 className="line-clamp-2 text-sm leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
                {title}
              </h3>
            </div>

            {(isDisputed || isHighSpread) && (
              <div className="flex flex-col items-end gap-1">
                {isDisputed && (
                  <Badge variant="destructive" className="h-5 rounded-sm px-1.5" title="Disputed">
                    <AlertTriangle />
                  </Badge>
                )}
                {isHighSpread && (
                  <Badge variant="outline" className="h-5 rounded-sm border-warning/40 bg-warning/10 px-1.5 text-warning" title="High spread">
                    <Activity />
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex-1">{renderContent()}</div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3">
          <Badge variant="secondary" className={badgeClass}>
            {formatCurrency(volume24hrClob, "USD")} Vol
          </Badge>
          <Badge variant="secondary" className={badgeClass}>
            {formatCurrency(liquidity, "USD")} Liq
          </Badge>
          <Badge variant="secondary" className={badgeClass}>
            {timeLabel}
          </Badge>
        </div>
      </Card>
    </Link>
  );
}
