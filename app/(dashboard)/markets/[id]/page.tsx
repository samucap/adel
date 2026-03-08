"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { useEventStore } from "@/stores/eventStore"
import { polymarketWS } from "@/lib/websocket-service"
import { useMarketTokenIds, useMultiPriceHistory, useEventDescription } from "@/lib/polymarket-hooks"
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
    const { currEv, initializeFromEvent, visibleOutcomes, toggleOutcomeVisibility } = useEventStore()

    // Get event description
    const { data: eventDescription } = useEventDescription(currEv?.id || "")

    // Get token IDs for all outcomes - only when currEv exists
    const outcomes = currEv?.displayData.outcomes || []
    const { data: tokenMappings } = useMarketTokenIds(outcomes)

    // Get price history for visible outcomes
    const visibleTokenMappings = tokenMappings?.filter(tm =>
      visibleOutcomes.has(tm.marketId)
    ) || []
    const priceHistoryQueries = useMultiPriceHistory(visibleTokenMappings)

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [eventsLoaded, setEventsLoaded] = useState(false)

    // Load events once on mount
    useEffect(() => {
        const loadEventsOnce = async () => {
            if (eventsLoaded) return

            try {
                if (events.length === 0) {
                    await loadEvents()
                }
                setEventsLoaded(true)
            } catch (err) {
                console.error("Failed to load events:", err)
                setError("Failed to load market data")
                setIsLoading(false)
            }
        }

        loadEventsOnce()
    }, [eventsLoaded, events.length, loadEvents])

    // Find and initialize event when events are loaded or ID changes
    useEffect(() => {
        if (!eventsLoaded || !id) return

        const event = events.find(e => e.id === id)

        if (!event) {
            setError("Market not found")
            setIsLoading(false)
            return
        }

        // Initialize the event store only if we have valid event data
        if (event.displayData?.outcomes && event.displayData.outcomes.length > 0) {
            initializeFromEvent(event)
        }
        setIsLoading(false)
    }, [eventsLoaded, id, events, initializeFromEvent])

    // Redirect to markets page if no event is found
    useEffect(() => {
        if (!isLoading && !currEv && !error) {
            router.push('/markets')
        }
    }, [currEv, isLoading, error, router])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Clear event store state
            useEventStore.getState().cleanup()
            // Disconnect WebSocket
            polymarketWS.disconnect()
        }
    }, [])

    const handleRetry = () => {
        window.location.reload()
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="h-[calc(100vh-4rem)] bg-black p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header Skeleton */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="w-64 h-6" />
                            <Skeleton className="w-32 h-4" />
                        </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
                        {/* Chart Area */}
                        <div className="lg:col-span-3">
                            <Skeleton className="w-full h-full rounded-lg" />
                        </div>

                        {/* Sidebar */}
                        <div>
                            <Skeleton className="w-full h-full rounded-lg" />
                        </div>
                    </div>

                    {/* Placeholder Panel */}
                    <Skeleton className="w-full h-48 rounded-lg" />
                </div>
            </div>
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

    // Prepare outcome series data for the chart
    const outcomeSeries = visibleTokenMappings
        .map((tokenMapping, index) => {
            const outcome = outcomes.find(o => o.id === tokenMapping.marketId)
            if (!outcome) return null

            // Find the corresponding price history query result by index
            const priceHistory = priceHistoryQueries[index]?.data || []
            const colorIndex = index % CHART_COLORS_HEX.length

            return {
                id: outcome.id || `outcome-${index}`,
                label: outcome.label,
                color: CHART_COLORS_HEX[colorIndex],
                data: priceHistory,
            }
        })
        .filter((series): series is NonNullable<typeof series> => series !== null && series.data.length > 0)

    return (
        <div className="h-[calc(100vh-4rem)] bg-black overflow-hidden">
            {/* Header */}
            <header className="border-b border-[#39FF14]/20 px-6 py-4 bg-black/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/markets">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#00F0FF] hover:text-[#39FF14] hover:bg-[#39FF14]/10"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <motion.h1
                                className="text-xl font-bold tracking-tight text-white line-clamp-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                {currEv.title}
                            </motion.h1>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${currEv.isLive ? 'bg-[#39FF14] animate-pulse' : 'bg-gray-500'}`} />
                                    {currEv.isLive ? 'Live' : 'Upcoming'}
                                </span>
                                <span>Vol: {currEv.stats.volumeUSD}</span>
                                <span className="text-[#00F0FF] font-mono">
                                    End: {new Date(currEv.endDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <div className="max-w-7xl mx-auto p-6 h-full">
                    <div className="flex flex-1 gap-6 min-h-0">
                        {/* Left Column: Chart + Event Markets (70%) */}
                        <div className="w-[70%] flex flex-col gap-6 min-h-0">
                            {/* Main Chart */}
                            <div className="flex-[3] min-h-0">
                                {outcomeSeries.length > 0 ? (
                                    <EnhancedTradingViewChart
                                        outcomeSeries={outcomeSeries}
                                        visibleOutcomes={visibleOutcomes}
                                        onToggleOutcome={toggleOutcomeVisibility}
                                        height={500}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-black border border-[#39FF14]/20 rounded-lg flex items-center justify-center">
                                        <div className="text-center text-[#00F0FF] font-mono">
                                            <div className="text-sm">Loading chart data...</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Event Markets Panel */}
                            <div className="flex-[2] min-h-0 overflow-hidden">
                                <EventMarketsPanel />
                            </div>
                        </div>

                        {/* Right Column: Sidebar (30%) */}
                        <div className="w-[30%] min-h-0 overflow-hidden">
                            <MarketSidebar />
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Description Section */}
            {eventDescription?.description && (
                <motion.div
                    className="max-w-7xl mx-auto px-6 pb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="bg-black border border-[#39FF14]/20 rounded-lg p-6">
                        <h3 className="text-lg font-mono text-[#00F0FF] mb-4">
                            About This Market
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {eventDescription.description}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
