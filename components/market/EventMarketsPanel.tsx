"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useEventStore } from "@/stores/eventStore"
import { useTopHolders } from "@/lib/polymarket-hooks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Link as LinkIcon,
  BarChart3,
  Eye,
  EyeOff,
  Info,
  Users,
  Sparkles,
  Bot,
  Loader2,
  Activity
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CHART_COLORS_HEX } from "@/lib/chart-utils"
import { Outcome } from "@/types"

interface EventMarketsPanelProps {
  conditionIds?: string[];
}

export function EventMarketsPanel({ conditionIds }: EventMarketsPanelProps = {}) {
  const { currEv, currMkt, setCurrentMarket, visibleOutcomes, toggleOutcomeVisibility } = useEventStore()
  const router = useRouter()

  // AI State
  const [marketIntelligence, setMarketIntelligence] = useState<{ loading: boolean, data: string | null, error: string | null }>({ loading: false, data: null, error: null })
  const [commentSentiment, setCommentSentiment] = useState<{ loading: boolean, data: string | null, error: string | null }>({ loading: false, data: null, error: null })
  const [scenarioInput, setScenarioInput] = useState('')
  const [scenarioImpact, setScenarioImpact] = useState<{ loading: boolean, data: string | null, error: string | null }>({ loading: false, data: null, error: null })
  const [simplifiedRules, setSimplifiedRules] = useState<{ loading: boolean, data: string | null, error: string | null }>({ loading: false, data: null, error: null })

  const outcomes = useMemo(() => currEv?.displayData.outcomes || [], [currEv])

  if (!currEv) {
    router.push('/markets')
    return null
  }

  // Get top holders data - only fetch if we have condition IDs
  const { data: topHoldersData, isLoading: holdersLoading } = useTopHolders(conditionIds?.length ? conditionIds : [])

  const handleOutcomeSelect = (outcome: Outcome) => {
    setCurrentMarket(outcome)
  }

  const handleVisibilityToggle = (outcomeId: string, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent triggering the row click
    toggleOutcomeVisibility(outcomeId)
  }

  // AI Actions (placeholder implementations)
  const handleGenerateIntelligence = async () => {
    setMarketIntelligence({ loading: true, data: null, error: null })
    try {
      // Mock AI response
      await new Promise(resolve => setTimeout(resolve, 2000))
      setMarketIntelligence({
        loading: false,
        data: "Current implied probability of 95.5% suggests strong market confidence in the Fed's March rate cut. Order flow indicates institutional positioning with significant volume accumulation at higher price levels. Watch for CPI data releases as key risk catalysts.",
        error: null
      })
    } catch (err) {
      setMarketIntelligence({ loading: false, data: null, error: "Failed to generate market intelligence. Please try again." })
    }
  }

  const handleGenerateSentiment = async () => {
    setCommentSentiment({ loading: true, data: null, error: null })
    try {
      // Mock AI response
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCommentSentiment({
        loading: false,
        data: "Mixed sentiment detected. Bullish positioning from institutional traders (WhaleTrader99, AlgoBot_01) balanced by cautious commentary from rate watchers. Overall market psychology leans slightly bullish with 65% of recent comments expressing confidence in the YES outcome.",
        error: null
      })
    } catch (err) {
      setCommentSentiment({ loading: false, data: null, error: "Failed to analyze sentiment." })
    }
  }

  const handleSimulateScenario = async () => {
    if (!scenarioInput.trim()) return
    setScenarioImpact({ loading: true, data: null, error: null })
    try {
      // Mock AI response
      await new Promise(resolve => setTimeout(resolve, 1800))
      setScenarioImpact({
        loading: false,
        data: "Bullish impact expected. If CPI prints 0.5% higher than expected, the probability would likely decrease to approximately 78-82%. This represents a 13-17 percentage point drop, creating significant selling pressure as market participants reprice the likelihood of a March rate cut.",
        error: null
      })
    } catch (err) {
      setScenarioImpact({ loading: false, data: null, error: "Failed to simulate scenario." })
    }
  }

  const handleSimplifyRules = async () => {
    setSimplifiedRules({ loading: true, data: null, error: null })
    try {
      // Mock AI response
      await new Promise(resolve => setTimeout(resolve, 1200))
      setSimplifiedRules({
        loading: false,
        data: "This market resolves YES if the Federal Reserve announces and implements an interest rate cut in March 2026. The outcome is determined by official Fed statements and policy actions, not by market expectations or commentary.",
        error: null
      })
    } catch (err) {
      setSimplifiedRules({ loading: false, data: null, error: "Failed to simplify rules." })
    }
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
            value="info"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00F0FF] data-[state=active]:text-[#00F0FF] px-4 py-2"
          >
            <Info className="w-4 h-4 mr-2" />
            Event Info
          </TabsTrigger>
          <TabsTrigger
            value="holders"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00F0FF] data-[state=active]:text-[#00F0FF] px-4 py-2"
          >
            <Users className="w-4 h-4 mr-2" />
            Top Holders
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00F0FF] data-[state=active]:text-[#00F0FF] px-4 py-2"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Analysis
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
                  key={`${outcome.id}-${index}`}
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
                      -
                    </div>
                  </div>

                  {/* 24h Change */}
                  <div className="col-span-1 flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">-</span>
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

        <TabsContent value="info" className="flex-1 overflow-hidden m-0">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-[#00F0FF] border-[#00F0FF]/50">
                    {currEv?.layout || 'Market'}
                  </Badge>
                  <Badge variant="outline" className="border-[#39FF14]/50 text-[#39FF14]">
                    Vol: {currEv?.volume24hrClob ? `$${(currEv.volume24hrClob / 1000000).toFixed(1)}M` : '$0M'}
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">{currEv?.title}</h2>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Resolves</div>
                <div className="text-white font-semibold">
                  {currEv?.endDate ? new Date(currEv.endDate).toLocaleDateString() : 'TBD'}
                </div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {currEv?.description || 'This market will resolve to "Yes" if the referenced event completes according to standard resolution rules. Oracle sources will verify the final outcome at expiration.'}
            </p>

            <div className="mb-6">
              <Button
                onClick={handleSimplifyRules}
                disabled={simplifiedRules.loading}
                className="bg-[#39FF14]/20 hover:bg-[#39FF14]/30 border border-[#39FF14]/50 text-[#39FF14] hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50 mb-3"
              >
                {simplifiedRules.loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                ✨ Simplify Rules with AI
              </Button>
              {simplifiedRules.data && !simplifiedRules.loading && (
                <div className="bg-[#00F0FF]/10 border border-[#00F0FF]/20 rounded-lg p-4 flex items-start gap-3">
                  <Bot size={18} className="text-[#00F0FF] shrink-0 mt-0.5" />
                  <p className="text-[#00F0FF] text-sm leading-relaxed">{simplifiedRules.data}</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="holders" className="flex-1 overflow-hidden m-0">
          <div className="flex flex-col h-full">
            <div className="sticky top-0 bg-black/90 backdrop-blur z-10 grid grid-cols-4 text-right text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-6 py-2 border-b border-[#39FF14]/20 bg-[#141419]">
              <div className="text-left">Wallet Address</div>
              <div>Position</div>
              <div>Shares Held</div>
              <div>Outcome</div>
            </div>
            <div className="overflow-y-auto">
              {holdersLoading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="w-6 h-6 border-2 border-[#00F0FF]/30 border-t-[#00F0FF] rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Loading top holders...</p>
                </div>
              ) : topHoldersData?.holders && topHoldersData.holders.length > 0 ? (
                topHoldersData.holders.flatMap(metaHolder =>
                  metaHolder.holders.map((holder, i) => (
                    <div key={`${metaHolder.token}-${i}`} className="grid grid-cols-4 text-right py-4 px-6 border-b border-[#39FF14]/10 hover:bg-[#39FF14]/5 text-sm transition-colors">
                      <div className="text-left font-mono text-[#00F0FF] flex items-center gap-2">
                        <Users size={12} className="text-muted-foreground" />
                        {holder.proxyWallet.slice(0, 6)}...{holder.proxyWallet.slice(-4)}
                      </div>
                      <div className="text-white font-medium">
                        {holder.outcomeIndex === 0 ? 'YES' : 'NO'}
                      </div>
                      <div className="text-white font-medium">
                        {holder.amount.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">
                        {holder.name || holder.pseudonym || 'Anonymous'}
                      </div>
                    </div>
                  ))
                )
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Users size={24} className="mx-auto mb-4 opacity-50" />
                  <p>
                    {conditionIds && conditionIds.length > 0
                      ? "No holder data available"
                      : "Market token data not loaded yet"}
                  </p>
                  {conditionIds && conditionIds.length === 0 && (
                    <p className="text-xs mt-2 text-[#FF4D00]">
                      Token IDs required for holder data
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="flex-1 overflow-hidden m-0">
          <div className="flex flex-col h-full p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bot className="text-[#00F0FF]" size={20} /> Market Intelligence
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Powered by Gemini Pro Quant Model</p>
              </div>
              <Button
                onClick={handleGenerateIntelligence}
                disabled={marketIntelligence.loading}
                className="bg-[#00F0FF]/20 hover:bg-[#00F0FF]/40 text-[#00F0FF] border border-[#00F0FF]/50 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shrink-0"
              >
                {marketIntelligence.loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {marketIntelligence.loading ? "Analyzing Tape..." : "✨ Generate Brief"}
              </Button>
            </div>

            {marketIntelligence.loading && (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground animate-pulse border border-[#39FF14]/20 rounded-xl bg-[#141419] shrink-0">
                <Bot size={32} className="mb-3 text-[#00F0FF]/50 opacity-50" />
                <p>Processing order flow & sentiment...</p>
              </div>
            )}

            {!marketIntelligence.loading && !marketIntelligence.data && !marketIntelligence.error && (
              <div className="flex items-center justify-center py-8 text-muted-foreground border border-[#39FF14]/20 border-dashed rounded-xl bg-[#141419]/50 shrink-0">
                <p>Click generate to analyze current market trajectory.</p>
              </div>
            )}

            {marketIntelligence.error && (
              <div className="flex items-center justify-center py-8 text-[#FF4D00] border border-[#FF4D00]/20 rounded-xl bg-[#FF4D00]/5 shrink-0">
                <p>{marketIntelligence.error}</p>
              </div>
            )}

            {marketIntelligence.data && !marketIntelligence.loading && (
              <div className="bg-[#00F0FF]/10 border border-[#00F0FF]/20 rounded-xl p-5 relative shrink-0">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00F0FF] to-[#39FF14] rounded-l-xl"></div>
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{marketIntelligence.data}</p>
              </div>
            )}

            {/* AI Scenario Simulator */}
            <div className="mt-8 border-t border-[#39FF14]/20 pt-6 shrink-0">
              <h3 className="text-md font-bold text-white flex items-center gap-2 mb-4">
                <Activity className="text-[#00F0FF]" size={18} /> ✨ AI Scenario Simulator
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Test a hypothetical news headline to see how the AI predicts market probability will react.</p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={scenarioInput}
                  onChange={(e) => setScenarioInput(e.target.value)}
                  placeholder="e.g. CPI prints 0.5% higher than expected..."
                  className="flex-1 bg-black border border-[#39FF14]/20 rounded-lg py-2 px-3 text-sm outline-none focus:border-[#00F0FF] transition-colors text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleSimulateScenario()}
                />
                <Button
                  onClick={handleSimulateScenario}
                  disabled={scenarioImpact.loading || !scenarioInput.trim()}
                  className="bg-[#39FF14]/20 hover:bg-[#39FF14]/40 text-[#39FF14] border border-[#39FF14]/50 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shrink-0"
                >
                  {scenarioImpact.loading ? <Loader2 size={14} className="animate-spin" /> : "Simulate"}
                </Button>
              </div>

              {scenarioImpact.loading && (
                <div className="p-4 flex items-center gap-3 text-muted-foreground animate-pulse border border-[#39FF14]/20 rounded-xl bg-[#141419]">
                  <Bot size={20} className="text-[#00F0FF]/50 opacity-50" />
                  <span className="text-xs">Simulating market impact...</span>
                </div>
              )}

              {scenarioImpact.error && (
                <div className="p-4 text-[#FF4D00] border border-[#FF4D00]/20 rounded-xl bg-[#FF4D00]/5 text-xs">
                  {scenarioImpact.error}
                </div>
              )}

              {scenarioImpact.data && !scenarioImpact.loading && (
                <div className="bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-xl p-4 flex items-start gap-3">
                  <Bot size={18} className="text-[#39FF14] shrink-0 mt-0.5" />
                  <p className="text-[#39FF14] text-sm leading-relaxed">{scenarioImpact.data}</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}