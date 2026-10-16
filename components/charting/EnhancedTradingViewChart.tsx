"use client"

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'
import { Maximize2, Minimize2, BarChart3, Wifi, WifiOff, TrendingUp, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEventStore } from '@/stores/eventStore'
import { usePolymarketWebSocket, polymarketWS } from '@/lib/websocket-service'
import { readToken, resolveColor } from '@/lib/tokens'
import {
  formatChartTime,
  formatProbability,
  formatTickMark,
  priceToPercent,
  probabilityPriceFormat,
  toLinePoints,
  zoomLogicalRange,
} from '@/lib/chart-series'
import type { PricePoint } from '@/types'
import {
  createChart,
  LineSeries,
  ColorType,
  LineStyle,
  TickMarkType,
  type Time,
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
  loading?: boolean
  height?: number
  className?: string
}

export function EnhancedTradingViewChart({
  outcomeOptions,
  outcomeSeries,
  visibleOutcomes,
  onToggleOutcome,
  loading = false,
  height = 400,
  className = ''
}: EnhancedTradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartApiRef = useRef<{
    isRemoved: boolean
    api: IChartApi | null
    seriesMap: Map<string, { series: ISeriesApi<"Line">, label: string, color: string, clobTokenId?: string, dataKey: string, visible: boolean }>
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
            matchingInfo.series.update({
              time: Math.floor(Date.now() / 1000) as UTCTimestamp,
              value: priceToPercent(data.price),
            });
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

    chartApiRef.current.isRemoved = false
    // Canvas can't read CSS vars, so resolve the tokens once at creation.
    const border = readToken('--border')
    const accent = readToken('--accent')
    const chartApi = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: readToken('--surface') },
        textColor: readToken('--muted'),
        fontFamily: readToken('--font-mono') || 'monospace',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: border, style: LineStyle.Dotted },
        horzLines: { color: border, style: LineStyle.Dotted },
      },
      crosshair: {
        vertLine: { color: accent, width: 1, style: LineStyle.Dashed, labelBackgroundColor: accent },
        horzLine: { color: accent, width: 1, style: LineStyle.Dashed, labelBackgroundColor: accent },
      },
      rightPriceScale: {
        borderColor: border,
        mode: PriceScaleMode.Normal,
        alignLabels: true,
        minimumWidth: 72,
        scaleMargins: { top: 0.08, bottom: 0.08 },
      },
      localization: {
        priceFormatter: formatProbability,
        timeFormatter: (time: Time) => formatChartTime(time),
      },
      timeScale: {
        borderColor: border,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 6,
        tickMarkFormatter: (time: Time, tickMarkType: TickMarkType) => formatTickMark(time, tickMarkType),
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
      for (const seriesInfo of chartApiRef.current.seriesMap.values()) {
        if (!seriesInfo.visible) continue
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
        const timeString = formatChartTime(param.time)
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
    return () => {
      chartApiRef.current.isRemoved = true
      chartApi.remove()
      chartApiRef.current.api = null
      chartApiRef.current.seriesMap.clear()
    }
  }, [])

  // Keep one series per outcome. Toggles only flip `visible` so the chart is not recreated.
  useEffect(() => {
    if (!chartApiRef.current.api || chartApiRef.current.isRemoved) return

    const chart = chartApiRef.current.api
    const seriesMap = chartApiRef.current.seriesMap
    const ids = new Set(outcomeSeries.map((series) => series.id))
    let dataChanged = false

    for (const [seriesId, seriesInfo] of seriesMap.entries()) {
      if (ids.has(seriesId)) continue
      try {
        chart.removeSeries(seriesInfo.series)
      } catch (error) {
        console.warn('Error removing series:', error)
      }
      seriesMap.delete(seriesId)
    }

    for (const series of outcomeSeries) {
      const points = toLinePoints(series.data || [])
      let seriesInfo = seriesMap.get(series.id)
      const hasPoints = points.length > 0 || Boolean(seriesInfo?.dataKey)
      const show = visibleOutcomes.has(series.id) && hasPoints

      if (!seriesInfo) {
        if (points.length === 0) continue
        const lineSeries = chart.addSeries(LineSeries, {
          color: resolveColor(series.color),
          lineWidth: 2,
          priceFormat: probabilityPriceFormat,
          visible: show,
          priceLineVisible: show,
          lastValueVisible: show,
        })
        seriesInfo = {
          series: lineSeries,
          label: series.label,
          color: series.color,
          clobTokenId: series.clobTokenId,
          dataKey: "",
          visible: show,
        }
        seriesMap.set(series.id, seriesInfo)
      }

      const last = points[points.length - 1]
      const dataKey = last ? `${points.length}:${points[0].time}:${last.time}:${last.value}` : ""
      const keepWhileLoading = points.length === 0 && loading && seriesInfo.dataKey !== ""
      if (!keepWhileLoading && dataKey !== seriesInfo.dataKey) {
        seriesInfo.series.setData(points)
        seriesInfo.dataKey = dataKey
        dataChanged = true
      }

      if (seriesInfo.visible !== show) {
        seriesInfo.series.applyOptions({
          visible: show,
          priceLineVisible: show,
          lastValueVisible: show,
        })
        seriesInfo.visible = show
      }
      seriesInfo.label = series.label
      seriesInfo.color = series.color
      seriesInfo.clobTokenId = series.clobTokenId
    }

    if (dataChanged) {
      try {
        chart.timeScale().fitContent()
      } catch (error) {
        console.warn('Error fitting content:', error)
      }
    }
  }, [outcomeSeries, visibleOutcomes, loading])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const zoomChart = (factor: number) => {
    const chart = chartApiRef.current.api
    if (!chart || chartApiRef.current.isRemoved) return
    const next = zoomLogicalRange(chart.timeScale().getVisibleLogicalRange(), factor)
    if (next) chart.timeScale().setVisibleLogicalRange(next)
  }

  const anyShown = outcomeOptions.some((option) => visibleOutcomes.has(option.id))

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg border border-border bg-card", className, isFullscreen && "fixed inset-4 z-50")}
    >
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {/* Outcome Toggle Pills */}
          <div className="flex flex-wrap items-center gap-1">
            {outcomeOptions.map((option, i) => {
              const isVisible = visibleOutcomes.has(option.id)
              return (
                <button
                  key={`${option.id}-${i}`}
                  onClick={() => onToggleOutcome(option.id)}
                  aria-pressed={isVisible}
                  className={cn(
                    "focus-ring flex items-center gap-1.5 rounded-full border px-2 py-1 font-mono text-xs transition-colors",
                    isVisible
                      ? "border-border bg-selected text-primary"
                      : "border-transparent text-muted-foreground hover:bg-hover"
                  )}
                >
                  <span className="size-2 rounded-full" style={{ backgroundColor: option.color }} />
                  <span className="max-w-24 truncate">{option.label}</span>
                  {isVisible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-1 text-xs">
            {connectionStatus === 'connected' ? (
              <>
                <Wifi className="size-3 text-positive" />
                <span className="text-positive">Live</span>
              </>
            ) : connectionStatus === 'connecting' ? (
              <>
                <div className="size-3 animate-spin rounded-full border border-primary border-t-transparent" />
                <span className="text-primary">Connecting...</span>
              </>
            ) : (
              <>
                <WifiOff className="size-3 text-negative" />
                <span className="text-negative">Offline</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <div className="flex gap-0.5 rounded-md border border-border p-0.5">
            <button
              type="button"
              onClick={() => zoomChart(1 / 1.6)}
              className="focus-ring rounded-sm px-2 py-1 font-mono text-2xs font-bold text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
            >
              Narrow
            </button>
            <button
              type="button"
              onClick={() => zoomChart(1.6)}
              className="focus-ring rounded-sm px-2 py-1 font-mono text-2xs font-bold text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
            >
              Widen
            </button>
          </div>
          <div className="flex gap-0.5 rounded-md border border-border p-0.5">
            {['1h', '6h', '1d', '1w', '1m', 'max'].map((tf) => (
              <button
                key={tf}
                onClick={() => setChartInterval(tf)}
                className={cn(
                  "focus-ring rounded-sm px-2 py-1 font-mono text-2xs font-bold uppercase transition-colors",
                  chartInterval === tf
                    ? "bg-selected text-primary"
                    : "text-muted-foreground hover:bg-hover hover:text-foreground",
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
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="size-8 p-0 text-muted-foreground hover:text-foreground"
          >
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Chart Container */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: isFullscreen ? 'calc(100dvh - 7.5rem)' : height }}
      >
          {/* Loading Overlay */}
          {!currMkt && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-card text-sm text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="mx-auto mb-3 size-10" />
                <p>Select a market to view chart</p>
              </div>
            </div>
          )}
          {currMkt && (isLoading || (loading && outcomeSeries.every((series) => !series.data?.length))) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-card">
              <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
                <TrendingUp className="size-4 animate-pulse" />
                Loading Chart Data...
              </div>
            </div>
          )}
          {!isLoading && !loading && !anyShown && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <p className="font-mono text-sm text-muted-foreground">All outcomes hidden</p>
            </div>
          )}

          {/* Crosshair Tooltip Overlay */}
          {tooltipData && (
            <div
              className="pointer-events-none absolute z-20 max-w-xs rounded-md border border-border bg-popover px-3 py-2 shadow-lg"
              style={{
                left: tooltipData.x + 15,
                top: Math.max(10, tooltipData.y - 100),
              }}
            >
              <div className="mb-2 font-mono text-xs text-muted-foreground">
                {tooltipData.time}
              </div>
              <div className="space-y-1">
                {tooltipData.entries.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs font-mono">
                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="max-w-24 flex-1 truncate text-foreground">{entry.label}</span>
                    <span className="font-bold text-foreground">{entry.value.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  )
}