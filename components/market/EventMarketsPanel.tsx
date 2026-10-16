"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useEventStore } from "@/stores/eventStore"
import { useTopHolders } from "@/lib/polymarket-hooks"
import { formatEndLabel } from "@/lib/duration"
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
import { seriesVar } from "@/lib/tokens"
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
  const { data: topHoldersData, isLoading: holdersLoading } = useTopHolders(conditionIds?.length ? conditionIds : [])

  if (!currEv) {
    router.push('/markets')
    return null
  }

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
      <div className="flex h-40 items-center justify-center rounded-lg border border-border bg-card text-sm text-muted-foreground">
        No market outcomes available
      </div>
    )
  }

  

  return (
    <div className="flex h-120 flex-col overflow-hidden rounded-lg border border-border bg-card">
      <Tabs defaultValue="markets" className="flex min-h-0 flex-1 flex-col gap-0">
        <TabsList className="w-full border-b border-border bg-transparent rounded-none h-auto p-0">
          <TabsTrigger
            value="markets"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <BarChart3 className="size-4" />
            Markets
          </TabsTrigger>
          <TabsTrigger
            value="info"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <Info className="size-4" />
            Event Info
          </TabsTrigger>
          <TabsTrigger
            value="holders"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <Users className="size-4" />
            Top Holders
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <Sparkles className="size-4" />
            AI Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="markets" className="m-0 min-h-0 flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-border bg-card px-3 py-2">
              <div className="grid grid-cols-12 gap-2 text-2xs font-medium tracking-wider text-muted-foreground uppercase">
                <div className="col-span-3">Outcome</div>
                <div className="col-span-2 text-center">Probability</div>
                <div className="col-span-2 text-center">YES Price</div>
                <div className="col-span-2 text-center">NO Price</div>
                <div className="col-span-2 text-center">Volume 24h</div>
                <div className="col-span-1 text-center">24h</div>
              </div>
            </div>

            {/* Markets Table */}
            <div className="divide-y divide-border">
              {outcomes.map((outcome, index) => (
                <div
                  key={`${outcome.id}-${index}`}
                  onClick={() => handleOutcomeSelect(outcome)}
                  className={cn(
                    "grid cursor-pointer grid-cols-12 gap-2 border-l-2 px-3 py-2 transition-colors",
                    currMkt?.id === outcome.id
                      ? "border-primary bg-selected"
                      : "border-transparent hover:bg-hover"
                  )}
                >
                  {/* Outcome Name */}
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: seriesVar(index) }} />
                    <div className={cn("line-clamp-2 flex-1 text-sm font-medium", currMkt?.id === outcome.id ? "text-primary" : "text-foreground")}>
                      {outcome.label}
                    </div>
                    <button
                      onClick={(e) => handleVisibilityToggle(outcome.id || "", e)}
                      aria-label="Toggle on chart"
                      className="focus-ring rounded-sm p-1 text-muted-foreground hover:text-foreground"
                    >
                      {visibleOutcomes.has(outcome.id || "") ? (
                        <Eye className="size-4 text-primary" />
                      ) : (
                        <EyeOff className="size-4" />
                      )}
                    </button>
                  </div>

                  {/* Probability */}
                  <div className="col-span-2 flex items-center justify-center">
                    <Badge
                      variant="outline"
                      className="rounded-sm font-mono"
                    >
                      {(outcome.price * 100).toFixed(1)}%
                    </Badge>
                  </div>

                  {/* YES Price */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="font-mono text-sm text-positive">
                      {(outcome.price * 100).toFixed(1)}¢
                    </div>
                  </div>

                  {/* NO Price */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="font-mono text-sm text-negative">
                      {((1 - outcome.price) * 100).toFixed(1)}¢
                    </div>
                  </div>

                  {/* Volume 24h */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="font-mono text-xs text-muted-foreground">
                      -
                    </div>
                  </div>

                  {/* 24h Change */}
                  <div className="col-span-1 flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">-</span>
                  </div>
                </div>
              ))}
            </div>

            {outcomes.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <BarChart3 className="mx-auto mb-3 size-10" />
                <p>No market outcomes available</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="info" className="custom-scrollbar m-0 min-h-0 flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="rounded-sm">
                    {currEv?.layout || 'Market'}
                  </Badge>
                  <Badge variant="outline" className="rounded-sm font-mono">
                    Vol: {currEv?.volume24hrClob ? `$${(currEv.volume24hrClob / 1000000).toFixed(1)}M` : '$0M'}
                  </Badge>
                </div>
                <h2 className="text-xl leading-tight font-bold tracking-tight text-foreground">{currEv?.title}</h2>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Resolves</div>
                <div className="text-foreground font-semibold">
                  {currEv?.endDate ? formatEndLabel(currEv.endDate) : "TBD"}
                </div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-4">
              {currEv?.description || 'This market will resolve to "Yes" if the referenced event completes according to standard resolution rules. Oracle sources will verify the final outcome at expiration.'}
            </p>

            <div className="mb-4">
              <Button
                onClick={handleSimplifyRules}
                disabled={simplifiedRules.loading}
                className="bg-primary/12 text-primary border border-primary/40 hover:bg-primary/20 px-4 py-2 rounded-md text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50 mb-3"
              >
                {simplifiedRules.loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                ✨ Simplify Rules with AI
              </Button>
              {simplifiedRules.data && !simplifiedRules.loading && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                  <Bot size={18} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-primary text-sm leading-relaxed">{simplifiedRules.data}</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="holders" className="m-0 min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full flex-col">
            <div className="sticky top-0 z-10 grid grid-cols-4 border-b border-border bg-card px-3 py-2 text-right text-2xs font-medium tracking-wider text-muted-foreground uppercase">
              <div className="text-left">Wallet Address</div>
              <div>Position</div>
              <div>Shares Held</div>
              <div>Outcome</div>
            </div>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
              {holdersLoading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="mx-auto mb-4 size-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                  <p>Loading top holders...</p>
                </div>
              ) : topHoldersData?.holders && topHoldersData.holders.length > 0 ? (
                topHoldersData.holders.flatMap(metaHolder =>
                  metaHolder.holders.map((holder, i) => (
                    <div key={`${metaHolder.token}-${i}`} className="grid grid-cols-4 border-b border-border px-3 py-2 text-right text-sm transition-colors hover:bg-hover">
                      <div className="text-left font-mono text-primary flex items-center gap-2">
                        <Users size={12} className="text-muted-foreground" />
                        {holder.proxyWallet.slice(0, 6)}...{holder.proxyWallet.slice(-4)}
                      </div>
                      <div className="text-foreground font-medium">
                        {holder.outcomeIndex === 0 ? 'YES' : 'NO'}
                      </div>
                      <div className="text-foreground font-medium">
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
                    <p className="text-xs mt-2 text-negative">
                      Token IDs required for holder data
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="m-0 min-h-0 flex-1 overflow-hidden">
          <div className="custom-scrollbar flex h-full flex-col overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Bot className="text-primary" size={20} /> Market Intelligence
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Powered by Gemini Pro Quant Model</p>
              </div>
              <Button
                onClick={handleGenerateIntelligence}
                disabled={marketIntelligence.loading}
                className="bg-primary/12 text-primary border border-primary/40 hover:bg-primary/20 px-4 py-2 rounded-md text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shrink-0"
              >
                {marketIntelligence.loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {marketIntelligence.loading ? "Analyzing Tape..." : "✨ Generate Brief"}
              </Button>
            </div>

            {marketIntelligence.loading && (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground animate-pulse border border-border rounded-lg bg-surface-raised shrink-0">
                <Bot size={32} className="mb-3 text-muted-foreground" />
                <p>Processing order flow & sentiment...</p>
              </div>
            )}

            {!marketIntelligence.loading && !marketIntelligence.data && !marketIntelligence.error && (
              <div className="flex items-center justify-center py-8 text-muted-foreground border border-border border-dashed rounded-lg bg-surface-raised shrink-0">
                <p>Click generate to analyze current market trajectory.</p>
              </div>
            )}

            {marketIntelligence.error && (
              <div className="flex items-center justify-center py-8 text-negative border border-negative/20 rounded-lg bg-negative/5 shrink-0">
                <p>{marketIntelligence.error}</p>
              </div>
            )}

            {marketIntelligence.data && !marketIntelligence.loading && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 relative shrink-0">
                <div className="absolute top-0 left-0 h-full w-1 rounded-l-lg bg-primary" />
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{marketIntelligence.data}</p>
              </div>
            )}

            {/* AI Scenario Simulator */}
            <div className="mt-4 border-t border-border pt-4 shrink-0">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <Activity className="text-primary" size={18} /> ✨ AI Scenario Simulator
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Test a hypothetical news headline to see how the AI predicts market probability will react.</p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={scenarioInput}
                  onChange={(e) => setScenarioInput(e.target.value)}
                  placeholder="e.g. CPI prints 0.5% higher than expected..."
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors outline-none focus:border-primary"
                  onKeyDown={(e) => e.key === 'Enter' && handleSimulateScenario()}
                />
                <Button
                  onClick={handleSimulateScenario}
                  disabled={scenarioImpact.loading || !scenarioInput.trim()}
                  className="bg-primary/12 text-primary border border-primary/40 hover:bg-primary/20 px-4 py-2 rounded-md text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shrink-0"
                >
                  {scenarioImpact.loading ? <Loader2 size={14} className="animate-spin" /> : "Simulate"}
                </Button>
              </div>

              {scenarioImpact.loading && (
                <div className="p-4 flex items-center gap-3 text-muted-foreground animate-pulse border border-border rounded-lg bg-surface-raised">
                  <Bot size={20} className="text-muted-foreground" />
                  <span className="text-xs">Simulating market impact...</span>
                </div>
              )}

              {scenarioImpact.error && (
                <div className="p-4 text-negative border border-negative/20 rounded-lg bg-negative/5 text-xs">
                  {scenarioImpact.error}
                </div>
              )}

              {scenarioImpact.data && !scenarioImpact.loading && (
                <div className="bg-primary/10 border border-border rounded-lg p-4 flex items-start gap-3">
                  <Bot size={18} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-primary text-sm leading-relaxed">{scenarioImpact.data}</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}