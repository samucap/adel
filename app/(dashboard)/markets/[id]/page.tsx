"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useEventStore } from "@/stores/eventStore";
import { useMarketStore } from "@/stores/marketStore";
import {
  useMarketTokenIds,
  useMultiPriceHistory,
} from "@/lib/polymarket-hooks";
import { CHART_COLORS_HEX } from "@/lib/chart-utils";
import { EnhancedTradingViewChart } from "@/components/charting/EnhancedTradingViewChart";
import { MarketSidebar } from "@/components/market/MarketSidebar";
import { EventMarketsPanel } from "@/components/market/EventMarketsPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

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
  const { data: tokenMappings } = useMarketTokenIds(outcomes);

  // Extract condition IDs for holders API
  const conditionIds = useMemo(
    () => tokenMappings?.map((tm) => tm.conditionId).filter(Boolean) || [],
    [tokenMappings],
  );

  // Populate store with resolved token mappings
  useEffect(() => {
    if (tokenMappings) {
      tokenMappings.forEach((mapping) => {
        setOutcomeTokenId(mapping.marketId, mapping);
      });
    }
  }, [tokenMappings, setOutcomeTokenId]);

  // Get price history for visible outcomes
  const visibleTokenMappings =
    tokenMappings?.filter((tm) => visibleOutcomes.has(tm.marketId)) || [];
  const priceHistoryQueries = useMultiPriceHistory(
    visibleTokenMappings,
    chartInterval,
  );

  // ALL outcomes with metadata (for chart toggle pills)
  const outcomeOptions = useMemo(
    () =>
      outcomes.map((outcome, index) => ({
        id: outcome.id || `outcome-${index}`,
        label: outcome.label,
        color: CHART_COLORS_HEX[index % CHART_COLORS_HEX.length],
      })),
    [outcomes],
  );

  // Build outcomeSeries (visible outcomes with price data)
  const outcomeSeries = useMemo(() => {
    return priceHistoryQueries.map((query, idx) => {
      const mapping = visibleTokenMappings[idx];
      const data = query.data ?? [];
      const option = outcomeOptions.find((o) => o.id === mapping?.marketId);
      return {
        id: mapping?.marketId ?? "",
        label: option?.label ?? "",
        color: option?.color ?? CHART_COLORS_HEX[idx % CHART_COLORS_HEX.length],
        data,
        clobTokenId: mapping?.clobTokenId ?? "",
      };
    });
  }, [priceHistoryQueries, visibleTokenMappings, outcomeOptions]);

  const handleRetry = () => {
    window.location.reload();
  };

  // Event not yet resolved — show loading or not-found
  if (!currEv || currEv.id !== id) {
    // If market events are loaded but this ID isn't among them, show not-found
    if (marketEvents.length > 0 && !marketEvents.find((e) => e.id === id)) {
      return (
        <div className="h-[calc(100vh-4rem)] bg-black flex items-center justify-center p-6">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-[#FF4D00]/20 rounded-full">
              <AlertCircle className="w-8 h-8 text-[#FF4D00]" />
            </div>
            <div>
              <h2 className="text-xl font-mono text-[#FF4D00] mb-2">
                Market Not Found
              </h2>
              <p className="text-muted-foreground">
                This market doesn&apos;t exist or is no longer available.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => handleRetry()}
                className="bg-[#39FF14] hover:bg-[#39FF14]/80 text-black font-mono"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Link href="/markets">
                <Button
                  variant="outline"
                  className="border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Markets
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      );
    }

    // Still loading / waiting for store to hydrate
    return (
      <motion.div
        className="h-[calc(100vh-4rem)] bg-black p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Skeleton className="w-10 h-10 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <Skeleton className="w-64 h-6 animate-pulse" />
              <Skeleton className="w-32 h-4 animate-pulse" />
            </div>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="lg:col-span-3">
              <Skeleton className="w-full h-full rounded-lg animate-pulse" />
            </div>
            <div>
              <Skeleton className="w-full h-full rounded-lg animate-pulse" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-black overflow-hidden">
      {/* Header */}
      <motion.header
        className="border-b border-[#39FF14]/20 px-6 py-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/markets">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#00F0FF] hover:text-[#39FF14] hover:bg-[#39FF14]/10"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <div>
              <motion.h1
                className="text-xl font-bold tracking-tight text-white line-clamp-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {currEv.title}
              </motion.h1>
              <motion.div
                className="flex items-center gap-4 text-sm text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${currEv.isLive ? "bg-[#39FF14] animate-pulse" : "bg-gray-500"}`}
                  />
                  {currEv.isLive ? "Live" : "Upcoming"}
                </span>
                <span>Vol: {currEv.stats.volumeUSD}</span>
                <span className="text-[#00F0FF] font-mono">
                  End: {new Date(currEv.endDate).toLocaleDateString()}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto p-6 h-full">
          <div className="flex flex-1 gap-6 min-h-0">
            {/* Left Column: Chart + Event Markets (65%) */}
            <div className="w-[60%] flex flex-col gap-6 min-h-0 max-h-[calc(100vh-12rem)]">
              {/* Main Chart */}
              <motion.div
                className="w-full flex flex-col min-h-0 max-h-[calc(100vh-12rem)]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {tokenMappings ? (
                  outcomeSeries.length > 0 ? (
                    <EnhancedTradingViewChart
                      outcomeOptions={outcomeOptions}
                      outcomeSeries={outcomeSeries}
                      visibleOutcomes={visibleOutcomes}
                      onToggleOutcome={toggleOutcomeVisibility}
                      height={500}
                    />
                  ) : (
                    <motion.div
                      className="w-full h-full bg-black border border-[#39FF14]/20 rounded-lg flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="text-center text-[#00F0FF] font-mono space-y-3">
                        <div className="w-8 h-8 border-2 border-[#00F0FF]/30 border-t-[#00F0FF] rounded-full animate-spin mx-auto"></div>
                        <div className="text-sm">Loading chart data...</div>
                      </div>
                    </motion.div>
                  )
                ) : (
                  <motion.div
                    className="w-full h-full bg-black border border-[#39FF14]/20 rounded-lg flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-center text-[#00F0FF] font-mono space-y-3">
                      <div className="w-8 h-8 border-2 border-[#39FF14]/30 border-t-[#39FF14] rounded-full animate-spin mx-auto"></div>
                      <div className="text-sm">Fetching market tokens...</div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Event Markets Panel */}
              <motion.div
                className="flex-[2] min-h-0 overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <EventMarketsPanel conditionIds={conditionIds} />
              </motion.div>
            </div>

            {/* Right Column: Sidebar (40%) */}
            <motion.div
              className="w-[40%] min-h-0 overflow-hidden max-h-[calc(100vh-12rem)]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <MarketSidebar />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
