"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useEventStore } from "@/stores/eventStore"
import { useOrderbook } from "@/lib/polymarket-hooks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  Activity,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock trades data (real trades would come from WebSocket)
const mockTrades = [
  { id: 1, price: 0.642, size: 500, timestamp: Date.now() - 1000, side: 'buy' },
  { id: 2, price: 0.641, size: 1200, timestamp: Date.now() - 3000, side: 'sell' },
  { id: 3, price: 0.643, size: 800, timestamp: Date.now() - 5000, side: 'buy' },
  { id: 4, price: 0.640, size: 300, timestamp: Date.now() - 8000, side: 'sell' },
  { id: 5, price: 0.644, size: 1500, timestamp: Date.now() - 10000, side: 'buy' },
]

export function MarketSidebar() {
  const { currEv, currMkt, selectedOutcome, getCurrentMarketTokenId } = useEventStore()

  // Get real orderbook data
  const tokenId = getCurrentMarketTokenId()
  const { data: orderbook } = useOrderbook(tokenId || "")

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
              value="trades"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00F0FF] data-[state=active]:text-[#00F0FF] px-4 py-2"
            >
              Trades
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
                  {/* Asks (top) - sorted ascending (lowest price first, nearest to spread) */}
                  <div className="flex-1 space-y-1">
                    <div className="text-xs text-[#FF4D00] font-mono mb-2 flex items-center gap-1">
                      <ChevronUp className="w-3 h-3" />
                      Asks (Sell Orders)
                    </div>
                    {orderbook.asks
                      .slice()
                      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
                      .slice(0, 10)
                      .map((ask, i) => (
                        <OrderbookRow
                          key={`ask-${i}`}
                          price={ask.price}
                          size={ask.size}
                          type="ask"
                        />
                      ))}
                  </div>

                  {/* Spread Indicator */}
                  {orderbook.asks.length > 0 && orderbook.bids.length > 0 && (
                    <div className="text-center py-2 border-y border-[#39FF14]/20 my-2">
                      <div className="text-xs text-[#00F0FF] font-mono bg-black/50 px-2 py-1 rounded">
                        Spread: {(() => {
                          const bestAsk = Math.min(...orderbook.asks.map(a => parseFloat(a.price)))
                          const bestBid = Math.max(...orderbook.bids.map(b => parseFloat(b.price)))
                          const spread = ((bestAsk - bestBid) * 100).toFixed(1)
                          return `${spread}¢`
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Bids (bottom) - sorted descending (highest price first, nearest to spread) */}
                  <div className="flex-1 space-y-1">
                    <div className="text-xs text-[#39FF14] font-mono mb-2 flex items-center gap-1">
                      <ChevronDown className="w-3 h-3" />
                      Bids (Buy Orders)
                    </div>
                    {orderbook.bids
                      .slice()
                      .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
                      .slice(0, 10)
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
          </TabsContent>

          <TabsContent value="trades" className="flex-1 overflow-hidden m-0">
            <div className="p-4 h-full overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                {mockTrades.map((trade) => (
                  <motion.div
                    key={trade.id}
                    className="flex items-center justify-between p-2 bg-black/50 border border-[#39FF14]/10 rounded text-xs font-mono"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        trade.side === 'buy' ? "bg-[#39FF14]" : "bg-[#FF4D00]"
                      )} />
                      <span className="text-[#00F0FF]">{(trade.price * 100).toFixed(1)}¢</span>
                    </div>
                    <span className="text-white">{trade.size.toLocaleString()}</span>
                  </motion.div>
                ))}
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