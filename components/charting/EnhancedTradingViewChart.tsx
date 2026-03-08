"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Maximize2, Minimize2, BarChart3, Wifi, WifiOff, TrendingUp, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEventStore } from '@/stores/eventStore'
import { usePolymarketWebSocket } from '@/lib/websocket-service'
import { CHART_COLORS_HEX } from '@/lib/chart-utils'
import type { PricePoint } from '@/types'

interface OutcomeSeries {
  id: string
  label: string
  color: string
  data: PricePoint[]
}

interface EnhancedTradingViewChartProps {
  outcomeSeries: OutcomeSeries[]
  visibleOutcomes: Set<string>
  onToggleOutcome: (outcomeId: string) => void
  height?: number
  className?: string
}

export function EnhancedTradingViewChart({
  outcomeSeries,
  visibleOutcomes,
  onToggleOutcome,
  height = 400,
  className = ''
}: EnhancedTradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const [chartLoaded, setChartLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [interval, setInterval] = useState('1d')
  const [isLoading, setIsLoading] = useState(false)

  const { currMkt, selectedOutcome } = useEventStore()
  const { isConnected, connectionStatus } = usePolymarketWebSocket()

  // Initialize chart with dynamic import (lazy-load)
  const initChart = useCallback(async () => {
    if (!containerRef.current) return

    const lc = await import("lightweight-charts")

    // Clean up existing chart
    if (chartRef.current) {
      chartRef.current.remove()
    }

    const chart = lc.createChart(containerRef.current, {
      layout: {
        background: { type: lc.ColorType.Solid, color: "#121212" },
        textColor: "#A0A0A0",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1F1F1F", style: lc.LineStyle.Dotted },
        horzLines: { color: "#1F1F1F", style: lc.LineStyle.Dotted },
      },
      crosshair: {
        vertLine: {
          color: "#39FF14",
          width: 1,
          style: lc.LineStyle.Dashed,
          labelBackgroundColor: "#39FF14",
        },
        horzLine: {
          color: "#39FF14",
          width: 1,
          style: lc.LineStyle.Dashed,
          labelBackgroundColor: "#39FF14",
        },
      },
      rightPriceScale: {
        borderColor: "#1F1F1F",
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: "#1F1F1F",
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: { vertTouchDrag: false },
    })

    chartRef.current = chart
    setChartLoaded(true)

    // Handle resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        chart.applyOptions({ width, height })
      }
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
    }
  }, [])

  useEffect(() => {
    initChart()
    return () => {
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }
    }
  }, [initChart])

  // Update data when outcomeSeries changes
  useEffect(() => {
    if (!chartRef.current || !outcomeSeries.length) return

    const loadData = async () => {
      try {
        const lc = await import("lightweight-charts")

        // Clear existing series by recreating chart
        initChart()

        // Wait for chart to be ready
        setTimeout(async () => {
          if (!chartRef.current) return

          const visibleSeries = outcomeSeries.filter(series => visibleOutcomes.has(series.id))

          for (let i = 0; i < visibleSeries.length; i++) {
            const series = visibleSeries[i]
            const colorIndex = i % CHART_COLORS_HEX.length
            const color = CHART_COLORS_HEX[colorIndex]

            // Only add series if we have data
            if (!series.data || series.data.length === 0) continue

            // Sort by time and deduplicate
            const sortedData = series.data
              .map((p) => ({ time: p.t as number, value: p.p }))
              .sort((a, b) => a.time - b.time)
              .filter((p, i, arr) => i === 0 || p.time !== arr[i - 1].time)

            // Skip if no valid data after processing
            if (sortedData.length === 0) continue

            const lineSeries = chartRef.current.addLineSeries({
              color,
              lineWidth: 2,
              priceFormat: {
                type: "custom" as const,
                formatter: (price: number) => `${(price * 100).toFixed(1)}¢`,
              },
            })

            lineSeries.setData(sortedData)
          }

          // Fit content to show all data
          if (visibleSeries.length > 0) {
            chartRef.current.timeScale().fitContent()
          }
        }, 100)
      } catch (error) {
        console.error('Error loading chart data:', error)
      }
    }

    loadData()
  }, [outcomeSeries, visibleOutcomes, chartLoaded, initChart])

  useEffect(() => {
    // Simulate loading state
    if (outcomeSeries.length > 0) {
      setIsLoading(true)
      const timer = setTimeout(() => setIsLoading(false), 500)
      return () => clearTimeout(timer)
    }
  }, [outcomeSeries])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!currMkt) {
    return (
      <div className={`flex items-center justify-center border border-dashed border-muted-foreground/25 rounded-lg ${className}`}
           style={{ height }}>
        <div className="text-center text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a market to view chart</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={`relative bg-black border border-[#39FF14]/20 rounded-lg overflow-hidden ${className} ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
      style={{ height: isFullscreen ? 'auto' : height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#39FF14]/20 bg-black/50">
        <div className="flex items-center gap-3">
          {/* Outcome Toggle Pills */}
          <div className="flex items-center gap-1">
            {outcomeSeries.map((series, index) => {
              const colorIndex = index % CHART_COLORS_HEX.length
              const isVisible = visibleOutcomes.has(series.id)
              return (
                <button
                  key={series.id}
                  onClick={() => onToggleOutcome(series.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-mono transition-all",
                    isVisible
                      ? "bg-white/10 border border-white/20"
                      : "bg-black/50 border border-white/10 opacity-60"
                  )}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: CHART_COLORS_HEX[colorIndex] }}
                  />
                  <span className="text-white truncate max-w-[60px]">
                    {series.label}
                  </span>
                  {isVisible ? (
                    <Eye className="w-3 h-3 text-white" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-white/50" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-1 text-xs">
            {connectionStatus === 'connected' ? (
              <>
                <Wifi className="w-3 h-3 text-[#39FF14]" />
                <span className="text-[#39FF14]">Live</span>
              </>
            ) : connectionStatus === 'connecting' ? (
              <>
                <div className="w-3 h-3 border border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
                <span className="text-[#00F0FF]">Connecting...</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-[#FF4D00]" />
                <span className="text-[#FF4D00]">Offline</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <div className="bg-muted/20 border border-border/50 rounded flex p-0.5 gap-0.5">
            {['1h', '6h', '1d', '1w', 'max'].map((tf) => (
              <button
                key={tf}
                onClick={() => setInterval(tf)}
                className={cn(
                  "px-2 py-1 text-[10px] uppercase font-mono font-bold rounded transition-colors",
                  interval === tf
                    ? "bg-background shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tf}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-[#39FF14] hover:text-[#00F0FF] hover:bg-[#39FF14]/10"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Chart Container */}
      <div
        className="w-full relative"
        style={{ height: isFullscreen ? 'calc(100vh - 120px)' : height - 60 }}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
            <div className="text-[#00F0FF] font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 animate-pulse" />
              Loading Chart Data...
            </div>
          </div>
        )}

        {/* Chart */}
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{ height: isFullscreen ? 'calc(100vh - 120px)' : height - 60 }}
          role="img"
          aria-label="Price chart"
        />

        {/* Current Price Display - show for primary visible outcome */}
        {outcomeSeries.length > 0 && visibleOutcomes.size > 0 && (
          <div className="absolute left-4 top-4 bg-black/80 border border-[#39FF14]/50 rounded px-2 py-1">
            <div className="text-[#39FF14] font-mono text-sm font-bold">
              {outcomeSeries
                .filter(series => visibleOutcomes.has(series.id))
                .map(series => {
                  const latestPrice = series.data[series.data.length - 1]?.p || 0
                  return `${(latestPrice * 100).toFixed(1)}¢`
                })
                .join(' / ')}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}