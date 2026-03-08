import { create } from "zustand"
import { CleanEvent, Outcome } from "@/types"

export type SelectedOutcome = "YES" | "NO"

interface EventStoreState {
  // Current active event
  currEv: CleanEvent | null

  // Current selected market (sub-market/candidate)
  currMkt: Outcome | null

  // Selected outcome for trading ("YES" or "NO")
  selectedOutcome: SelectedOutcome

  // Chart visibility - which outcomes are shown on the chart
  visibleOutcomes: Set<string>

  // Token ID cache - marketId -> tokenId mappings
  outcomeTokenIds: Map<string, string>

  // Actions
  setCurrentEvent: (event: CleanEvent | null) => void
  setCurrentMarket: (market: Outcome | null) => void
  setSelectedOutcome: (outcome: SelectedOutcome) => void
  toggleOutcomeVisibility: (outcomeId: string) => void
  setOutcomeTokenId: (marketId: string, tokenId: string) => void

  // Helper functions
  initializeFromEvent: (event: CleanEvent, marketId?: string) => void
  getCurrentMarketTokenId: () => string | null
  getOppositeOutcome: () => SelectedOutcome
  cleanup: () => void
}

export const useEventStore = create<EventStoreState>((set, get) => ({
  // Initial state
  currEv: null,
  currMkt: null,
  selectedOutcome: "YES",
  visibleOutcomes: new Set<string>(),
  outcomeTokenIds: new Map<string, string>(),

  // Actions
  setCurrentEvent: (event) => set({ currEv: event }),

  setCurrentMarket: (market) => set({ currMkt: market }),

  setSelectedOutcome: (outcome) => set({ selectedOutcome: outcome }),

  toggleOutcomeVisibility: (outcomeId: string) => {
    set(state => {
      const newVisibleOutcomes = new Set(state.visibleOutcomes)
      if (newVisibleOutcomes.has(outcomeId)) {
        newVisibleOutcomes.delete(outcomeId)
      } else {
        newVisibleOutcomes.add(outcomeId)
      }
      return { visibleOutcomes: newVisibleOutcomes }
    })
  },

  setOutcomeTokenId: (marketId: string, tokenId: string) => {
    set(state => {
      const newTokenIds = new Map(state.outcomeTokenIds)
      newTokenIds.set(marketId, tokenId)
      return { outcomeTokenIds: newTokenIds }
    })
  },

  // Initialize state from event, optionally setting a specific market
  initializeFromEvent: (event, marketId) => {
    const primaryMarket = marketId
      ? event.displayData.outcomes?.find(o => o.id === marketId)
      : event.displayData.outcomes?.[0] || null

    // Auto-select top 4 outcomes for chart visibility (sorted by probability desc)
    const outcomes = event.displayData.outcomes || []
    const top4Outcomes = outcomes
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, 4)
      .map(o => o.id || "")
      .filter(id => id !== "")

    set({
      currEv: event,
      currMkt: primaryMarket,
      selectedOutcome: "YES", // Default to YES
      visibleOutcomes: new Set(top4Outcomes),
      outcomeTokenIds: new Map<string, string>(), // Reset token ID cache
    })
  },

  // Get the token ID for the current market based on selected outcome
  getCurrentMarketTokenId: () => {
    const { currMkt, selectedOutcome } = get()
    if (!currMkt?.id) return null

    // For Polymarket, token IDs are typically in format: MARKET_ID_YES or MARKET_ID_NO
    return `${currMkt.id}_${selectedOutcome}`
  },

  // Get the opposite outcome for switching
  getOppositeOutcome: () => {
    const { selectedOutcome } = get()
    return selectedOutcome === "YES" ? "NO" : "YES"
  },

  // Reset store state (for page unmount)
  cleanup: () => {
    set({
      currEv: null,
      currMkt: null,
      selectedOutcome: "YES",
      visibleOutcomes: new Set<string>(),
      outcomeTokenIds: new Map<string, string>(),
    })
  },
}))