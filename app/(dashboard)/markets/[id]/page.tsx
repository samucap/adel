"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useEventStore } from "@/stores/eventStore";
import { useMarketStore } from "@/stores/marketStore";
import {
  useMarketTokenIds,
  useMultiPriceHistory,
} from "@/lib/polymarket-hooks";
import { seriesVar } from "@/lib/tokens";
import { EnhancedTradingViewChart } from "@/components/charting/EnhancedTradingViewChart";
import { MarketSidebar } from "@/components/market/MarketSidebar";
import { EventMarketsPanel } from "@/components/market/EventMarketsPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatEndLabel } from "@/lib/duration";

export default function MarketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    currEv,
    visibleOutcomes,
    toggleOutcomeVisibility,
    chartInterval,
    setOutcomeTokenId,
    initializeFromEvent,
  } = useEventStore();

  // Fallback: if currEv is null or doesn't match the URL id (refresh, direct link, Strict Mode remount),
  // look it up from the already-loaded market store events and re-initialize.
  const marketEvents = useMarketStore((s) => s.events);
  useEffect(() => {
    if (!currEv || currEv.id !== id) {
      const found = marketEvents.find((e) => e.id === id);
      if (found) {
        initializeFromEvent(found);
      }
    }
  }, [id, currEv, marketEvents, initializeFromEvent]);

  // Get token IDs for all outcomes
  const outcomes = currEv?.displayData?.outcomes || [];
  const tokenMappings = outcomes.map((outcome, i) => {
    const clobTokenIds = JSON.parse(outcome.clobTokenIds) as string[];
    return {
      marketId: outcome.id || '',
      conditionId: '',
      clobTokenId: clobTokenIds[0] || '',
      clobTokenIdNo: clobTokenIds[1] || '',
      outcomeIndex: i,
    };
  });

  // Extract condition IDs for holders API
  const conditionIds = useMemo(
    () => tokenMappings.map((tm) => tm.conditionId).filter(Boolean),
    [tokenMappings],
  );

  // Populate store with resolved token mappings
  useEffect(() => {
    if (tokenMappings) {
      tokenMappings.forEach((mapping) => {
        setOutcomeTokenId(mapping.marketId, mapping);
      });
    }
  }, [setOutcomeTokenId]);

  // History for every outcome the toggles can show. Visibility only hides a line.
  const tokenIds = tokenMappings.map((tm) => tm.clobTokenId).filter(Boolean);
  const multiPriceQuery = useMultiPriceHistory(tokenIds, chartInterval);

  // ALL outcomes with metadata (for chart toggle pills)
  const outcomeOptions = useMemo(
    () =>
      outcomes.map((outcome, index) => ({
        id: outcome.id || `outcome-${index}`,
        label: outcome.label,
        color: seriesVar(index),
      })),
    [outcomes],
  );

  const outcomeSeries = useMemo(() => {
    return tokenMappings.map((mapping, idx) => {
      const clobTokenId = mapping?.clobTokenId;
      const data = (clobTokenId && multiPriceQuery.data?.history?.[clobTokenId])
        ? multiPriceQuery.data.history[clobTokenId]
        : [];
      const option = outcomeOptions.find((o) => o.id === mapping?.marketId);
      return {
        id: mapping?.marketId ?? "",
        label: option?.label ?? "",
        color: option?.color ?? seriesVar(idx),
        data,
        clobTokenId: clobTokenId ?? "",
      };
    });
  }, [multiPriceQuery.data, tokenMappings, outcomeOptions]);

  const handleRetry = () => {
    window.location.reload();
  };

  // Event not yet resolved — show loading or not-found
  if (!currEv || currEv.id !== id) {
    // If market events are loaded but this ID isn't among them, show not-found
    if (marketEvents.length > 0 && !marketEvents.find((e) => e.id === id)) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-negative/12">
            <AlertCircle className="size-7 text-negative" />
          </div>
          <div>
            <h2 className="mb-1 text-lg font-semibold text-foreground">Market Not Found</h2>
            <p className="text-sm text-muted-foreground">
              This market doesn&apos;t exist or is no longer available.
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <Button onClick={handleRetry}>
              <RefreshCw className="size-4" />
              Retry
            </Button>
            <Button variant="outline" asChild>
              <Link href="/markets">
                <ArrowLeft className="size-4" />
                Back to Markets
              </Link>
            </Button>
          </div>
        </div>
      );
    }

    // Still loading / waiting for store to hydrate
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-md" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <Skeleton className="h-125 rounded-lg" />
          <Skeleton className="h-125 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <header className="flex items-start gap-3 border-b border-border pb-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0 text-muted-foreground hover:text-foreground">
          <Link href="/markets" aria-label="Back to markets">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="line-clamp-2 text-xl font-bold tracking-tight text-foreground">{currEv.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", currEv.isLive ? "animate-pulse bg-positive" : "bg-muted-foreground")} />
              {currEv.isLive ? "Live" : "Upcoming"}
            </span>
            <span>Vol: {currEv.stats.volumeUSD}</span>
            <span className="font-mono">{formatEndLabel(currEv.endDate)}</span>
          </div>
        </div>
      </header>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex min-w-0 flex-col gap-3">
          <EnhancedTradingViewChart
            outcomeOptions={outcomeOptions}
            outcomeSeries={outcomeSeries}
            visibleOutcomes={visibleOutcomes}
            onToggleOutcome={toggleOutcomeVisibility}
            loading={multiPriceQuery.isPending}
            height={500}
          />
          <EventMarketsPanel conditionIds={conditionIds} />
        </div>

        <div className="min-w-0 lg:sticky lg:top-0 lg:self-start">
          <MarketSidebar />
        </div>
      </div>
    </div>
  );
}
