"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useEventStore } from "@/stores/eventStore"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Link as LinkIcon,
  BarChart3,
  Eye,
  EyeOff
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CHART_COLORS_HEX } from "@/lib/chart-utils"
import { Outcome } from "@/types"

export function EventMarketsPanel() {
  const { currEv, currMkt, setCurrentMarket, visibleOutcomes, toggleOutcomeVisibility } = useEventStore()

  const outcomes = useMemo(() => currEv?.displayData.outcomes || [], [currEv])

  const handleOutcomeSelect = (outcome: Outcome) => {
    setCurrentMarket(outcome)
  }

  const handleVisibilityToggle = (outcomeId: string, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent triggering the row click
    toggleOutcomeVisibility(outcomeId)
  }

  // Safety check - don't render if no outcomes
  if (!outcomes || outcomes.length === 0) {
    return (
      <div className="w-full h-full bg-black border border-[#39FF14]/20 rounded-lg flex items-center justify-center">
        <div className="text-center text-[#00F0FF] font-mono">
          <div className="text-sm">No market outcomes available</div>
        </div>
      </div>
    )
  }

  if (!currEv) {
    return (
      <div className="w-full h-full bg-black border border-[#39FF14]/20 rounded-lg flex items-center justify-center">
        <div className="text-center text-[#00F0FF] font-mono">
          No event selected
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-black border border-[#39FF14]/20 rounded-lg overflow-hidden flex flex-col">
      <Tabs defaultValue="markets" className="h-full flex flex-col">
        <TabsList className="w-full border-b border-[#39FF14]/20 bg-transparent rounded-none h-auto p-0">
          <TabsTrigger
            value="markets"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00F0FF] data-[state=active]:text-[#00F0FF] px-4 py-2"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Markets
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00F0FF] data-[state=active]:text-[#00F0FF] px-4 py-2"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Comments
          </TabsTrigger>
          <TabsTrigger
            value="related"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00F0FF] data-[state=active]:text-[#00F0FF] px-4 py-2"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Related
          </TabsTrigger>
        </TabsList>

        <TabsContent value="markets" className="flex-1 overflow-hidden m-0">
          <div className="h-full overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="sticky top-0 bg-black/90 backdrop-blur-sm border-b border-[#39FF14]/20 p-4">
              <div className="grid grid-cols-12 gap-2 text-xs font-mono text-[#00F0FF] font-medium">
                <div className="col-span-3">Outcome</div>
                <div className="col-span-2 text-center">Probability</div>
                <div className="col-span-2 text-center">YES Price</div>
                <div className="col-span-2 text-center">NO Price</div>
                <div className="col-span-2 text-center">Volume 24h</div>
                <div className="col-span-1 text-center">24h</div>
              </div>
            </div>

            {/* Markets Table */}
            <div className="divide-y divide-[#39FF14]/10">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={outcome.id}
                  onClick={() => handleOutcomeSelect(outcome)}
                  className={cn(
                    "grid grid-cols-12 gap-2 p-4 cursor-pointer transition-all duration-200 hover:bg-[#39FF14]/5",
                    currMkt?.id === outcome.id
                      ? "bg-[#39FF14]/10 border-l-4 border-[#39FF14]"
                      : "hover:border-l-4 hover:border-[#39FF14]/50"
                  )}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Outcome Name */}
                  <div className="col-span-3 flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CHART_COLORS_HEX[index % CHART_COLORS_HEX.length] }}
                    />
                    <div className="font-medium text-white line-clamp-2 text-sm flex-1">
                      {outcome.label}
                    </div>
                    <button
                      onClick={(e) => handleVisibilityToggle(outcome.id || "", e)}
                      className="opacity-60 hover:opacity-100 transition-opacity p-1"
                    >
                      {visibleOutcomes.has(outcome.id || "") ? (
                        <Eye className="w-4 h-4 text-[#39FF14]" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Probability */}
                  <div className="col-span-2 flex items-center justify-center">
                    <Badge
                      variant="outline"
                      className="border-[#39FF14]/50 text-[#39FF14] font-mono"
                    >
                      {(outcome.price * 100).toFixed(1)}%
                    </Badge>
                  </div>

                  {/* YES Price */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="font-mono text-[#39FF14] text-sm">
                      {(outcome.price * 100).toFixed(1)}¢
                    </div>
                  </div>

                  {/* NO Price */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="font-mono text-[#FF4D00] text-sm">
                      {((1 - outcome.price) * 100).toFixed(1)}¢
                    </div>
                  </div>

                  {/* Volume 24h */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="font-mono text-[#00F0FF] text-xs">
                      -{/* Volume data not available per outcome */}
                    </div>
                  </div>

                  {/* 24h Change */}
                  <div className="col-span-1 flex items-center justify-center">
                    {outcome.change24h !== undefined ? (
                      <div className={cn(
                        "flex items-center gap-1 font-mono text-xs",
                        outcome.change24h >= 0 ? "text-[#39FF14]" : "text-[#FF4D00]"
                      )}>
                        {outcome.change24h >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(outcome.change24h * 100).toFixed(1)}%
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {outcomes.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No market outcomes available</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="comments" className="flex-1 overflow-hidden m-0">
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-[#00F0FF] opacity-50" />
              <h3 className="text-lg font-mono text-[#00F0FF] mb-2">Comments</h3>
              <p className="text-muted-foreground">Real-time discussion and analysis coming soon</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="related" className="flex-1 overflow-hidden m-0">
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <LinkIcon className="w-16 h-16 mx-auto mb-4 text-[#39FF14] opacity-50" />
              <h3 className="text-lg font-mono text-[#39FF14] mb-2">Related Markets</h3>
              <p className="text-muted-foreground">Discover correlated prediction markets</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}