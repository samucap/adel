"use client"

import { memo, useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useEventStore } from "@/stores/eventStore"
import { fetchOrderbooks } from "@/lib/polymarket-api"
import { applyDelta, applySnapshot, type Book } from "@/lib/orderbook"
import { polymarketWS } from "@/lib/websocket-service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  Activity,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Bot,
  Loader2,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock comments data
const mockComments = [
  { user: "WhaleTrader99", text: "Volume spike incoming, Fed minutes leak?", time: "2m ago", hasPosition: true },
  { user: "AlgoBot_01", text: "Arb opportunity closed between 95 and 96.", time: "5m ago", hasPosition: false },
  { user: "YieldFarmer", text: "I'm holding YES until expiration.", time: "12m ago", hasPosition: true },
  { user: "RateWatcher", text: "Bids are stacking up heavy at 94c.", time: "15m ago", hasPosition: false },
  { user: "MacroGod", text: "CPI print tomorrow will shift this to 99c.", time: "30m ago", hasPosition: true },
]

export function MarketSidebar() {
  const { currEv, currMkt, selectedOutcome, getCurrentMarketTokenId } = useEventStore()

  // AI Comment Sentiment State
  const [commentSentiment, setCommentSentiment] = useState<{ loading: boolean, data: string | null, error: string | null }>({ loading: false, data: null, error: null })

  const tokenId = getCurrentMarketTokenId()
  const bookQuery = useQuery({
    queryKey: ["orderbook", tokenId],
    queryFn: () => fetchOrderbooks([tokenId!]),
    enabled: Boolean(tokenId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
  const [book, setBook] = useState<Book | null>(null)

  useEffect(() => {
    setBook(null)
    if (!tokenId) return

    polymarketWS.connect()
    polymarketWS.subscribeToMarket("", tokenId)
    const offSnapshot = polymarketWS.onOrderbookUpdate((update) => {
      if (update.tokenId !== tokenId) return
      setBook(applySnapshot(update))
    })
    const offDelta = polymarketWS.onOrderbookDelta((delta) => {
      if (delta.tokenId !== tokenId) return
      setBook((prev) => (prev ? applyDelta(prev, delta) : prev))
    })

    return () => {
      offSnapshot()
      offDelta()
      polymarketWS.unsubscribeFromMarket("", tokenId)
    }
  }, [tokenId])

  useEffect(() => {
    const snap = bookQuery.data?.[0]
    if (!tokenId || !snap) return
    setBook((prev) => prev ?? applySnapshot(snap))
  }, [bookQuery.data, tokenId])

  // AI Sentiment Handler
  const handleGenerateSentiment = async () => {
    setCommentSentiment({ loading: true, data: null, error: null })
    try {
      // Mock AI response
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCommentSentiment({
        loading: false,
        data: "Mixed sentiment detected. Bullish positioning from institutional traders balanced by cautious commentary from rate watchers. Overall market psychology leans slightly bullish with 65% of recent comments expressing confidence in the YES outcome.",
        error: null
      })
    } catch (err) {
      setCommentSentiment({ loading: false, data: null, error: "Failed to analyze sentiment." })
    }
  }

  const currentPrice = currMkt?.price || 0
  const volume24h = currEv?.volume24hrClob || 0
  const liquidity = currEv?.liquidityClob || 0

  if (!currEv || !currMkt) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-border bg-card text-sm text-muted-foreground">
        No market selected
      </div>
    )
  }

  return (
    <div className="flex h-160 flex-col overflow-hidden rounded-lg border border-border bg-card">
      {/* Key Stats */}
      <div className="flex shrink-0 flex-col gap-3 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Price</span>
          <span className="font-mono text-2xl font-bold text-foreground">
            {(currentPrice * 100).toFixed(1)}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Activity className="size-3" />
              Volume 24h
            </div>
            <div className="font-mono text-foreground">
              ${(volume24h / 1000000).toFixed(1)}M
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="size-3" />
              Liquidity
            </div>
            <div className="font-mono text-foreground">
              ${(liquidity / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>
      </div>

      {/* Trading Interface */}
      <div className="flex min-h-0 flex-1 flex-col">
        <Tabs defaultValue="orderbook" className="flex min-h-0 flex-1 flex-col gap-0">
          <TabsList className="h-auto w-full shrink-0 rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="orderbook"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              Orderbook
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orderbook" className="m-0 flex min-h-0 flex-1 flex-col">
            <div className="custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
              {/* Orderbook Header */}
              <div className="mb-3 flex items-center justify-between">
                <Badge variant="outline" className="rounded-sm text-xs">
                  Live Orderbook
                </Badge>
              </div>

              {/* Orderbook Content - Ladder Layout */}
              {book ? (
                <OrderbookLadder book={book} />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="text-xs font-mono">
                      {bookQuery.isError ? "Orderbook unavailable" : "Loading orderbook..."}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Buy Buttons */}
            <div className="shrink-0 border-t border-border p-4">
              <div className="flex gap-2">
                <button className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-md bg-positive py-2.5 font-bold text-primary-foreground transition-colors hover:bg-positive/80">
                  Buy YES <span className="rounded-sm bg-background/20 px-1.5 py-0.5 font-mono text-2xs">{currMkt ? (currMkt.price * 100).toFixed(1) : '0.0'}¢</span>
                </button>
                <button className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-md bg-negative py-2.5 font-bold text-primary-foreground transition-colors hover:bg-negative/80">
                  Buy NO <span className="rounded-sm bg-background/20 px-1.5 py-0.5 font-mono text-2xs">{currMkt ? ((1 - currMkt.price) * 100).toFixed(1) : '0.0'}¢</span>
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="m-0 flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col">

              {/* AI Sentiment Action Bar */}
              <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2">
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <MessageSquare size={14} /> Live Chatter
                </span>
                <button
                  onClick={handleGenerateSentiment}
                  disabled={commentSentiment.loading}
                  className="focus-ring flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/12 px-3 py-1.5 text-2xs font-bold text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
                >
                  {commentSentiment.loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  ✨ Summarize Vibe
                </button>
              </div>

              {/* AI Sentiment Result Area */}
              {commentSentiment.loading && (
                <div className="flex shrink-0 items-center gap-2 border-b border-border bg-primary/10 px-4 py-2 text-xs text-primary">
                  <Loader2 size={12} className="animate-spin" /> Analyzing crowd sentiment...
                </div>
              )}
              {commentSentiment.data && !commentSentiment.loading && (
                <div className="flex shrink-0 items-start gap-2 border-b border-border bg-primary/10 px-4 py-2 text-xs text-primary">
                  <Bot size={14} className="mt-0.5 shrink-0" />
                  <p className="leading-relaxed">{commentSentiment.data}</p>
                </div>
              )}

              <div className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
                {mockComments.map((comment, i) => (
                  <div key={i} className="shrink-0 rounded-md border border-border bg-surface-raised px-3 py-2">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">{comment.user}</span>
                        {comment.hasPosition && <span className="rounded-sm bg-positive/12 px-1.5 py-0.5 text-2xs font-bold text-positive uppercase">Holder</span>}
                      </div>
                      <span className="text-2xs text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="text-sm text-foreground">{comment.text}</p>
                  </div>
                ))}
              </div>

              <div className="shrink-0 border-t border-border p-4">
                <input type="text" placeholder="Add a comment..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors outline-none focus:border-primary" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const VISIBLE_LEVELS = 8

function OrderbookLadder({ book }: { book: Book }) {
  const asks = book.asks.slice(0, VISIBLE_LEVELS)
  const bids = book.bids.slice(0, VISIBLE_LEVELS)
  const maxSize = Math.max(1, ...asks.map((level) => level.size), ...bids.map((level) => level.size))
  const bestAsk = asks[0]?.price
  const bestBid = bids[0]?.price

  if (asks.length === 0 && bids.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-xs font-mono text-muted-foreground">
        No orders
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col justify-end gap-0.5">
      {/* Ascending in the DOM. Reversed so the best (lowest) ask sits on the spread. */}
      <div className="flex flex-col-reverse gap-0.5">
        {asks.map((level) => (
          <OrderbookRow
            key={level.price}
            price={level.price}
            size={level.size}
            maxSize={maxSize}
            type="ask"
          />
        ))}
      </div>

      {bestAsk !== undefined && bestBid !== undefined && (
        <div className="my-1 border-y border-border py-1 text-center">
          <div className="font-mono text-2xs text-muted-foreground">
            Spread: {((bestAsk - bestBid) * 100).toFixed(1)}¢
          </div>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {bids.map((level) => (
          <OrderbookRow
            key={level.price}
            price={level.price}
            size={level.size}
            maxSize={maxSize}
            type="bid"
          />
        ))}
      </div>
    </div>
  )
}

const OrderbookRow = memo(function OrderbookRow({
  price,
  size,
  maxSize,
  type,
}: {
  price: number
  size: number
  maxSize: number
  type: "bid" | "ask"
}) {
  const barWidth = Math.min((size / maxSize) * 100, 100)

  return (
    <div className="relative flex items-center gap-2 rounded-sm px-2 py-1 font-mono text-xs transition-colors hover:bg-hover">
      {/* Depth bar background */}
      <div
        className={cn(
          "absolute inset-y-0 rounded-sm",
          type === "bid" ? "left-0 bg-positive/20" : "right-0 bg-negative/20"
        )}
        style={{ width: `${barWidth}%` }}
      />
      <span
        className={cn(
          "relative w-16 font-bold",
          type === "bid" ? "text-positive" : "text-negative"
        )}
      >
        {(price * 100).toFixed(1)}¢
      </span>
      <span className="relative flex-1 text-right text-foreground">
        {size.toLocaleString()}
      </span>
    </div>
  )
})