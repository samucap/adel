"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useEventStore } from "@/stores/eventStore"
import { useOrderbooks } from "@/lib/polymarket-hooks"
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

  // Get real orderbook data
  const tokenIds = Array.from(currEv?.displayData.outcomes?.map(o => JSON.parse(o.clobTokenIds)) || []).flat()
  const { data: orderbooks } = useOrderbooks(tokenIds)
  const orderbook = orderbooks?.[0] || null

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
      <div className="w-full h-full bg-black border border-[#39FF14]/20 rounded-lg flex items-center justify-center">
        <div className="text-center text-[#00F0FF] font-mono">
          No market selected
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-black border border-[#39FF14]/20 rounded-lg overflow-hidden flex flex-col">
      {/* Key Stats */}
      <div className="p-4 border-b border-[#39FF14]/20 space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#00F0FF] font-mono">Current Price</span>
          <motion.span
            className="text-2xl font-mono font-bold text-[#39FF14]"
            key={(currentPrice * 100).toFixed(1)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {(currentPrice * 100).toFixed(1)}%
          </motion.span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Activity className="w-3 h-3" />
              Volume 24h
            </div>
            <div className="font-mono text-[#00F0FF]">
              ${(volume24h / 1000000).toFixed(1)}M
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="w-3 h-3" />
              Liquidity
            </div>
            <div className="font-mono text-[#39FF14]">
              ${(liquidity / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>
      </div>

      {/* Trading Interface */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="orderbook" className="h-full flex flex-col">
          <TabsList className="w-full border-b border-[#39FF14]/20 bg-transparent rounded-none h-auto p-0 flex-shrink-0">
            <TabsTrigger
              value="orderbook"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00F0FF] data-[state=active]:text-[#00F0FF] px-4 py-2"
            >
              Orderbook
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00F0FF] data-[state=active]:text-[#00F0FF] px-4 py-2"
            >
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orderbook" className="flex-1 overflow-hidden m-0">
            <div className="p-4 h-full flex flex-col overflow-y-auto custom-scrollbar">
              {/* Orderbook Header */}
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="text-xs border-[#00F0FF]/50 text-[#00F0FF]">
                  Live Orderbook
                </Badge>
              </div>

              {/* Orderbook Content - Ladder Layout */}
              {orderbook ? (
                <div className="flex-1 flex flex-col">
                  {/* Combined Orderbook - both asks and bids in descending order */}
                  <div className="flex-1 space-y-1">
                    {/* Asks (Sell Orders) - sorted descending (highest price first) */}
                    {orderbook.asks
                      .slice()
                      .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
                      .slice(0, 8)
                      .map((ask, i) => (
                        <OrderbookRow
                          key={`ask-${i}`}
                          price={ask.price}
                          size={ask.size}
                          type="ask"
                        />
                      ))}

                    {/* Spread Indicator */}
                    {orderbook.asks.length > 0 && orderbook.bids.length > 0 && (
                      <div className="text-center py-1 border-y border-[#39FF14]/20 my-1">
                        <div className="text-[10px] text-[#00F0FF] font-mono bg-black/50 px-2 py-0.5 rounded">
                          Spread: {(() => {
                            const bestAsk = Math.min(...orderbook.asks.map(a => parseFloat(a.price)))
                            const bestBid = Math.max(...orderbook.bids.map(b => parseFloat(b.price)))
                            const spread = ((bestAsk - bestBid) * 100).toFixed(1)
                            return `${spread}¢`
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Bids (Buy Orders) - sorted descending (highest price first) */}
                    {orderbook.bids
                      .slice()
                      .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
                      .slice(0, 8)
                      .map((bid, i) => (
                        <OrderbookRow
                          key={`bid-${i}`}
                          price={bid.price}
                          size={bid.size}
                          type="bid"
                        />
                      ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="text-xs font-mono">Loading orderbook...</div>
                  </div>
                </div>
              )}
            </div>

            {/* Buy Buttons */}
            <div className="p-4 border-t border-[#39FF14]/20 bg-[#141419] shrink-0">
              <div className="flex gap-3">
                <button className="flex-1 bg-[#39FF14] hover:bg-[#39FF14]/80 text-black font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all flex justify-center items-center gap-2">
                  Buy YES <span className="bg-black/20 px-1.5 py-0.5 rounded text-[10px] tracking-wider">{currMkt ? (currMkt.price * 100).toFixed(1) : '0.0'}¢</span>
                </button>
                <button className="flex-1 bg-[#FF4D00] hover:bg-[#FF4D00]/80 text-white font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(255,77,0,0.3)] transition-all flex justify-center items-center gap-2">
                  Buy NO <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] tracking-wider">{currMkt ? ((1 - currMkt.price) * 100).toFixed(1) : '0.0'}¢</span>
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="flex-1 overflow-hidden m-0">
            <div className="flex-1 flex flex-col min-h-0 bg-[#141419]/30">

              {/* AI Sentiment Action Bar */}
              <div className="p-3 border-b border-[#39FF14]/20 bg-[#141419] flex items-center justify-between shrink-0">
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <MessageSquare size={14} /> Live Chatter
                </span>
                <button
                  onClick={handleGenerateSentiment}
                  disabled={commentSentiment.loading}
                  className="bg-[#39FF14]/20 hover:bg-[#39FF14]/30 border border-[#39FF14]/50 text-[#39FF14] hover:text-white px-3 py-1.5 rounded text-[10px] font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {commentSentiment.loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  ✨ Summarize Vibe
                </button>
              </div>

              {/* AI Sentiment Result Area */}
              {commentSentiment.loading && (
                <div className="p-3 bg-[#39FF14]/20 border-b border-[#39FF14]/20 text-[#39FF14] text-xs flex items-center gap-2 shrink-0">
                  <Loader2 size={12} className="animate-spin" /> Analyzing crowd sentiment...
                </div>
              )}
              {commentSentiment.data && !commentSentiment.loading && (
                <div className="p-3 bg-[#39FF14]/20 border-b border-[#39FF14]/20 text-[#39FF14] text-xs shrink-0 flex items-start gap-2">
                  <Bot size={14} className="mt-0.5 text-[#39FF14] shrink-0" />
                  <p className="leading-relaxed">{commentSentiment.data}</p>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {mockComments.map((comment, i) => (
                  <div key={i} className="bg-[#1a1a20] p-3 rounded-lg border border-[#39FF14]/10 shrink-0">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#00F0FF] text-xs">{comment.user}</span>
                        {comment.hasPosition && <span className="bg-[#39FF14]/20 text-[#39FF14] text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Holder</span>}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="text-sm text-white">{comment.text}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-[#39FF14]/20 bg-[#141419] shrink-0">
                <input type="text" placeholder="Add a comment..." className="w-full bg-black border border-[#39FF14]/20 rounded-lg py-2.5 px-3 text-sm outline-none focus:border-[#00F0FF] transition-colors text-white" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ── Orderbook Row Component ──────────────────────────────────────
function OrderbookRow({
  price,
  size,
  type,
}: {
  price: string;
  size: string;
  type: "bid" | "ask";
}) {
  const numPrice = parseFloat(price);
  const numSize = parseFloat(size);

  // Calculate max size from all visible orderbook entries for proper normalization
  const maxSize = 10000; // Adjust based on typical order sizes
  const barWidth = Math.min((numSize / maxSize) * 100, 100);

  return (
    <motion.div
      className="flex items-center gap-2 text-[11px] font-mono relative py-1 px-2 rounded hover:bg-white/5 transition-colors"
      whileHover={{ scale: 1.01 }}
    >
      {/* Depth bar background */}
      <div
        className={cn(
          "absolute top-0 bottom-0 rounded-sm opacity-30",
          type === "bid" ? "bg-[#39FF14] left-0" : "bg-[#FF4D00] right-0"
        )}
        style={{
          width: `${barWidth}%`,
          [type === "bid" ? "left" : "right"]: 0,
        }}
      />
      <span
        className={cn(
          "w-16 relative z-10 font-bold",
          type === "bid" ? "text-[#39FF14]" : "text-[#FF4D00]"
        )}
      >
        {(numPrice * 100).toFixed(1)}¢
      </span>
      <span className="flex-1 text-right relative z-10 text-white font-mono">
        {numSize.toLocaleString()}
      </span>
    </motion.div>
  );
}