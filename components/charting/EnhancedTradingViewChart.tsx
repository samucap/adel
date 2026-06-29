"use client"

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { Maximize2, Minimize2, BarChart3, Wifi, WifiOff, TrendingUp, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEventStore } from '@/stores/eventStore'
import { usePolymarketWebSocket, polymarketWS } from '@/lib/websocket-service'
import { CHART_COLORS_HEX } from '@/lib/chart-utils'
import type { PricePoint } from '@/types'
import {
  createChart,
  LineSeries,
  ColorType,
  LineStyle,
  type UTCTimestamp,
  type IChartApi,
  type ISeriesApi,
  type MouseEventParams,
  PriceScaleMode
} from 'lightweight-charts'

interface OutcomeOption {
  id: string
  label: string
  color: string
}

interface OutcomeSeries {
  id: string
  label: string
  color: string
  data: PricePoint[]
  clobTokenId?: string // added for chart updates
}

interface TooltipEntry {
  label: string
  color: string
  value: number
  change24h?: number
}

interface TooltipData {
  x: number
  y: number
  time: string
  entries: TooltipEntry[]
}

interface EnhancedTradingViewChartProps {
  outcomeOptions: OutcomeOption[]   // ALL outcomes (for toggle pills)
  outcomeSeries: OutcomeSeries[]    // Visible outcomes with data (for lines)
  visibleOutcomes: Set<string>
  onToggleOutcome: (outcomeId: string) => void
  height?: number
  className?: string
}

export function EnhancedTradingViewChart({
  outcomeOptions,
  outcomeSeries,
  visibleOutcomes,
  onToggleOutcome,
  height = 400,
  className = ''
}: EnhancedTradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartApiRef = useRef<{
    isRemoved: boolean
    api: IChartApi | null
    seriesMap: Map<string, { series: ISeriesApi<'Line', any, any, any>, label: string, color: string, clobTokenId?: string }>
  }>({
    isRemoved: false,
    api: null,
    seriesMap: new Map()
  })

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null)


  const { currMkt, selectedOutcome, chartInterval, setChartInterval } = useEventStore()
  const { isConnected, connectionStatus } = usePolymarketWebSocket()

  // WebSocket integration for real-time updates
  useEffect(() => {
    if (!isConnected) return

    let cleanupPrice: (() => void) | undefined

    try {
      cleanupPrice = polymarketWS.onPriceUpdate((data) => {
        // Update the chart series if it exists in our series map
        const matchingInfo = Array.from(chartApiRef.current.seriesMap.values())
          .find(info => info.clobTokenId === data.tokenId);
        if (matchingInfo?.series && typeof data.price === 'number') {
          try {
            const newPoint = {
              time: Math.floor(Date.now() / 1000) as UTCTimestamp,
              value: data.price,
            };
            matchingInfo.series.update(newPoint);
          } catch (error) {
            console.warn('Error updating chart series:', error);
          }
        }
      })
    } catch (error) {
      console.warn('Error setting up WebSocket listeners:', error)
    }

    return () => {
      try {
        cleanupPrice?.()
      } catch (error) {
        console.warn('Error cleaning up WebSocket listeners:', error)
      }
    }
  }, [isConnected])

  // Chart lifecycle with useLayoutEffect (like example.ts)
  useLayoutEffect(() => {
    if (!containerRef.current) return

    const chartApi = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "#121212" },
        textColor: "#A0A0A0",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1F1F1F", style: LineStyle.Dotted },
        horzLines: { color: "#1F1F1F", style: LineStyle.Dotted },
      },
      crosshair: {
        vertLine: {
          color: "#39FF14",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#39FF14",
        },
        horzLine: {
          color: "#39FF14",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#39FF14",
        },
      },
      rightPriceScale: {
        borderColor: "#1F1F1F",
        mode: PriceScaleMode.Normal,
      },
      timeScale: {
        borderColor: "#1F1F1F",
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: UTCTimestamp) => {
          const date = new Date(time * 1000)
          return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        },
      },
      handleScroll: { vertTouchDrag: true },
    })


    // Store in ref
    chartApiRef.current.api = chartApi
    // Note: resizeObserver was removed - chart autoSize handles resizing

    // Set up crosshair tooltip
    chartApi.subscribeCrosshairMove((param: MouseEventParams) => {
      if (param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.y < 0 ||
        !containerRef.current) {
        setTooltipData(null)
        return
      }

      // Build tooltip entries from all visible series
      const entries: TooltipEntry[] = []
      for (const [tokenId, seriesInfo] of chartApiRef.current.seriesMap.entries()) {
        const seriesData = param.seriesData.get(seriesInfo.series)
        if (seriesData && 'value' in seriesData && typeof seriesData.value === 'number') {
          entries.push({
            label: seriesInfo.label,
            color: seriesInfo.color,
            value: seriesData.value,
          })
        }
      }

      if (entries.length > 0) {
        const timeString = typeof param.time === 'string'
          ? param.time
          : new Date(Number(param.time) * 1000).toISOString().slice(0, 10)
        setTooltipData({
          x: param.point.x,
          y: param.point.y,
          time: timeString,
          entries,
        })
      } else {
        setTooltipData(null)
      }
    })

    setIsLoading(false)
  }, [])

  // Series reconciliation - add/remove LineSeries based on visibleOutcomes
  useEffect(() => {

    if (!chartApiRef.current.api || chartApiRef.current.isRemoved) return;

    const chart = chartApiRef.current.api;
    const seriesMap = chartApiRef.current.seriesMap;
    const visibleSeries = outcomeSeries.filter(series => visibleOutcomes.has(series.id));


    // Remove series that are no longer visible
    for (const [seriesId, seriesInfo] of seriesMap.entries()) {
      if (!visibleSeries.find(s => s.id === seriesId)) {

        try {
          if (!chartApiRef.current.isRemoved) {
            chart.removeSeries(seriesInfo.series);
          }
          seriesMap.delete(seriesId);
        } catch (error) {
          console.warn('Error removing series:', error);
        }
      }
    }

    // Add or update visible series
    for (let i = 0; i < visibleSeries.length; i++) {
      const series = visibleSeries[i];
      const color = series.color; // Use color from series data, not re-indexed

      let seriesInfo = seriesMap.get(series.id);

      // Ensure seriesInfo exists
      if (!seriesInfo) {

        const lineSeries = chart.addSeries(LineSeries, {
          color,
          lineWidth: 2,
        });
        seriesInfo = { series: lineSeries, label: series.label, color, clobTokenId: series.clobTokenId };
        seriesMap.set(series.id, seriesInfo);
      }

      // Transform data (handle missing data)
      const chartData = (series.data || []).map(point => ({
        time: point.t as UTCTimestamp,
        value: point.p * 100,
      }));

      const uniqueChartData = chartData.filter((point, index, self) =>
        index === 0 || point.time !== self[index - 1].time
      );
      // Ensure time is defined to avoid runtime errors in lightweight-charts
      const safeChartData = uniqueChartData.filter(p => p.time !== undefined && p.time !== null);
      seriesInfo.series.setData(safeChartData);
    }

    // Fit content to show all data
    if (visibleSeries.length > 0) {
      try {
        chart.timeScale().fitContent();
      } catch (error) {
        console.warn('Error fitting content:', error);
      }
    }
  }, [outcomeSeries, visibleOutcomes]);

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
      <div className="flex items-center justify-between p-3 border-b border-[#39FF14]/20 bg-black/30 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          {/* Outcome Toggle Pills */}
          <div className="flex items-center gap-1">
            {outcomeOptions.map((option, i) => {
              const isVisible = visibleOutcomes.has(option.id)
              const color = CHART_COLORS_HEX[i % CHART_COLORS_HEX.length]
              return (
                <button
                  key={`${option.id}-${i}`}
                  onClick={() => onToggleOutcome(option.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-mono transition-all",
                    isVisible
                      ? "bg-white/10 border border-white/20"
                      : "bg-black/50 border border-white/10 opacity-60"
                  )}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: option.color ? option.color : color }}
                  />
                  <span className="text-white truncate max-w-[60px]">
                    {option.label}
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
            {['1h', '6h', '1d', '1w', '1m', 'max'].map((tf) => (
              <button
                key={tf}
                onClick={() => setChartInterval(tf)}
                className={cn(
                  "px-2 py-1 text-[10px] uppercase font-mono font-bold rounded transition-colors",
                  chartInterval === tf
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
      <div className="flex flex-1">
        <div
          ref={containerRef}
          className="flex-1 relative"
          style={{ height: isFullscreen ? 'calc(100vh - 120px)' : height }}
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

          {/* Crosshair Tooltip Overlay */}
          {tooltipData && (
            <div
              className="absolute pointer-events-none z-20 bg-black/90 border border-[#39FF14]/50 rounded-lg px-3 py-2 shadow-lg max-w-xs"
              style={{
                left: Math.min(tooltipData.x + 15, (containerRef.current?.clientWidth || 0) - 200),
                top: Math.max(10, tooltipData.y - 100),
              }}
            >
              <div className="text-xs text-[#00F0FF] font-mono mb-2">
                {tooltipData.time}
              </div>
              <div className="space-y-1">
                {tooltipData.entries.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs font-mono">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-white truncate max-w-[80px] flex-1">
                      {entry.label}
                    </span>
                    <span className="text-[#39FF14] font-bold">{entry.value.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}