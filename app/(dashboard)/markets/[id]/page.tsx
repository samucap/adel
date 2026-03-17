"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { useEventStore } from "@/stores/eventStore"
import { polymarketWS } from "@/lib/websocket-service"
import { useMarketTokenIds, useMultiPriceHistory } from "@/lib/polymarket-hooks"
import { CHART_COLORS_HEX } from "@/lib/chart-utils"
import { EnhancedTradingViewChart } from "@/components/charting/EnhancedTradingViewChart"
import { MarketSidebar } from "@/components/market/MarketSidebar"
import { EventMarketsPanel } from "@/components/market/EventMarketsPanel"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function MarketDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const { events, loadEvents, eventsLoading, eventsError } = useAppStore()
    const { currEv, initializeFromEvent, visibleOutcomes, toggleOutcomeVisibility, chartInterval, setOutcomeTokenId } = useEventStore()

    // Get token IDs for all outcomes
    const outcomes = currEv?.displayData?.outcomes || []
    const { data: tokenMappings } = useMarketTokenIds(outcomes)

    // Extract condition IDs for holders API
    const conditionIds = useMemo(() =>
      tokenMappings?.map(tm => tm.conditionId).filter(Boolean) || [],
      [tokenMappings]
    )

    // Debug logging (remove in production)
    // console.log('Markets page:', {
    //   id,
    //   events: events?.length,
    //   currEv: !!currEv,
    //   tokenMappings: tokenMappings?.length,
    //   conditionIds: conditionIds?.length,
    //   outcomes: currEv?.displayData?.outcomes?.length
    // })

    // Populate store with resolved token mappings
    useEffect(() => {
      if (tokenMappings) {
        tokenMappings.forEach(mapping => {
          setOutcomeTokenId(mapping.marketId, mapping)
        })
      }
    }, [tokenMappings, setOutcomeTokenId])

    // Get price history for visible outcomes
    const visibleTokenMappings = tokenMappings?.filter(tm =>
      visibleOutcomes.has(tm.marketId)
    ) || []
    const priceHistoryQueries = useMultiPriceHistory(visibleTokenMappings, chartInterval)

    // Build two data structures: outcomeOptions (all outcomes) and outcomeSeries (visible with data)
    // These hooks must be called before any conditional returns to maintain hook order

    // ALL outcomes with metadata (for chart toggle pills)
    const outcomeOptions = useMemo(() =>
      outcomes.map((outcome, index) => ({
        id: outcome.id || `outcome-${index}`,
        label: outcome.label,
        color: CHART_COLORS_HEX[index % CHART_COLORS_HEX.length],
      })),
      [outcomes]
    )

    // Only visible outcomes with fetched data (for chart lines)
    const outcomeSeries = useMemo(() =>
      visibleTokenMappings
        .map((tm, index) => {
          const outcome = outcomes.find(o => o.id === tm.marketId)
          if (!outcome) return null
          const globalIndex = outcomes.findIndex(o => o.id === tm.marketId)
          return {
            id: outcome.id || `outcome-${index}`,
            label: outcome.label,
            color: CHART_COLORS_HEX[globalIndex % CHART_COLORS_HEX.length],
            data: priceHistoryQueries[index]?.data || [],
          }
        })
        .filter((s): s is NonNullable<typeof s> => s !== null && s.data.length > 0),
      [visibleTokenMappings, outcomes, priceHistoryQueries]
    )

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [eventsLoaded, setEventsLoaded] = useState(false)

    // TODO: actually this needs to re-route to /markets again. and trying to fetch events unnecessarily
    // Load events if not already loaded
    useEffect(() => {
        let cancelled = false

        const loadEventsIfNeeded = async () => {
            if (eventsLoaded || cancelled) return

            try {
                // Check if events are already loaded (from previous navigation)
                if (events.length === 0) {
                    await loadEvents()
                }
                if (!cancelled) {
                    setEventsLoaded(true)
                }
            } catch (err) {
                console.error("Failed to load events:", err)
                if (!cancelled) {
                    setError("Failed to load market data")
                    setIsLoading(false)
                }
            }
        }

        loadEventsIfNeeded()

        return () => {
            cancelled = true
        }
    }, [eventsLoaded, events.length, loadEvents])

    // Timeout for loading state
    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                if (events.length === 0) {
                    setError("Failed to load market data - timeout")
                    setIsLoading(false)
                }
            }, 10000) // 10 second timeout
            return () => clearTimeout(timer)
        }
    }, [isLoading, events.length])

    // Find and initialize event when events change or ID changes
    useEffect(() => {
        if (!id || events.length === 0) return

        const event = events.find(e => e.id === id)

        if (!event) {
            setError(`Market with ID "${id}" not found`)
            setIsLoading(false)
            return
        }

        // Initialize the event store with the found event (only if not already initialized for this event)
        if (event.displayData?.outcomes && event.displayData.outcomes.length > 0) {
            if (currEv?.id !== id) {
                initializeFromEvent(event)
            }
        } else {
            setError("Market has no valid outcomes")
        }
        setIsLoading(false)
    }, [id, events, initializeFromEvent])

    // No redirect needed - let the error state handle it

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Clear event store state
            useEventStore.getState().cleanup()
            // Note: WebSocket cleanup is handled by the usePolymarketWebSocket hook
        }
    }, [])

    const handleRetry = () => {
        window.location.reload()
    }

    // Loading state with animated skeletons
    if (isLoading) {
        return (
            <motion.div
                className="h-[calc(100vh-4rem)] bg-black p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header Skeleton */}
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

                    {/* Main Content Skeleton */}
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Chart Area */}
                        <div className="lg:col-span-3">
                            <Skeleton className="w-full h-full rounded-lg animate-pulse" />
                        </div>

                        {/* Sidebar */}
                        <div>
                            <Skeleton className="w-full h-full rounded-lg animate-pulse" />
                        </div>
                    </motion.div>

                    {/* Placeholder Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Skeleton className="w-full h-48 rounded-lg animate-pulse" />
                    </motion.div>
                </div>
            </motion.div>
        )
    }

    // Error state
    if (error) {
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
                            Market Not Available
                        </h2>
                        <p className="text-muted-foreground">
                            {error}
                        </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <Button
                            onClick={handleRetry}
                            className="bg-[#39FF14] hover:bg-[#39FF14]/80 text-black font-mono"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                        </Button>
                        <Link href="/markets">
                            <Button variant="outline" className="border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/10">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Markets
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        )
    }

    // No event found
    if (!currEv) {
        return (
            <div className="h-[calc(100vh-4rem)] bg-black flex items-center justify-center p-6">
                <motion.div
                    className="text-center space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-[#00F0FF]/20 rounded-full">
                        <ArrowLeft className="w-8 h-8 text-[#00F0FF]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-mono text-[#00F0FF] mb-2">
                            Invalid markets selected
                        </h2>
                    </div>
                </motion.div>
            </div>
        )
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
                                    <div className={`w-2 h-2 rounded-full ${currEv.isLive ? 'bg-[#39FF14] animate-pulse' : 'bg-gray-500'}`} />
                                    {currEv.isLive ? 'Live' : 'Upcoming'}
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
                                className="flex-[3] min-h-0 max-h-[calc(100vh-12rem)]"
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
                                {currEv ? <EventMarketsPanel conditionIds={conditionIds} /> : <motion.div
                                    className="w-full h-full bg-black border border-[#39FF14]/20 rounded-lg flex items-center justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="text-center text-[#00F0FF] font-mono">
                                        No event selected
                                    </div>
                                </motion.div>}
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
    )
}
