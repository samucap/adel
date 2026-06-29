import { create } from "zustand";
import { CleanEvent, Outcome } from "@/types";
import type { TokenIdMapping } from "@/lib/polymarket-api";

export type SelectedOutcome = "YES" | "NO";

interface EventStoreState {
  // Current active event
  currEv: CleanEvent | null;

  // Current selected market (sub-market/candidate)
  currMkt: Outcome | null;

  // Selected outcome for trading ("YES" or "NO")
  selectedOutcome: SelectedOutcome;

  // Chart visibility - which outcomes are shown on the chart
  visibleOutcomes: Set<string>;

  // Chart interval for price history
  chartInterval: string;

  // Token ID cache - marketId -> TokenIdMapping mappings
  outcomeTokenIds: Map<string, TokenIdMapping>;

  // Actions
  setCurrentEvent: (event: CleanEvent | null) => void;
  setCurrentMarket: (market: Outcome | null) => void;
  setSelectedOutcome: (outcome: SelectedOutcome) => void;
  toggleOutcomeVisibility: (outcomeId: string) => void;
  setChartInterval: (interval: string) => void;
  setOutcomeTokenId: (marketId: string, tokenMapping: TokenIdMapping) => void;

  // Helper functions
  initializeFromEvent: (event: CleanEvent, marketId?: string) => void;
  getCurrentMarketTokenId: () => string | null;
  getOppositeOutcome: () => SelectedOutcome;
  cleanup: () => void;
}

export const useEventStore = create<EventStoreState>((set, get) => ({
  // Initial state
  currEv: null,
  currMkt: null,
  selectedOutcome: "YES",
  visibleOutcomes: new Set<string>(),
  chartInterval: "1d",
  outcomeTokenIds: new Map<string, TokenIdMapping>(),

  // Actions
  setCurrentEvent: (event) => set({ currEv: event }),

  setCurrentMarket: (market) => set({ currMkt: market }),

  setSelectedOutcome: (outcome) => set({ selectedOutcome: outcome }),

  toggleOutcomeVisibility: (outcomeId: string) => {
    set((state) => {
      const newVisibleOutcomes = new Set(state.visibleOutcomes);
      if (newVisibleOutcomes.has(outcomeId)) {
        newVisibleOutcomes.delete(outcomeId);
      } else {
        newVisibleOutcomes.add(outcomeId);
      }
      return { visibleOutcomes: newVisibleOutcomes };
    });
  },

  setChartInterval: (interval: string) => set({ chartInterval: interval }),

  setOutcomeTokenId: (marketId: string, tokenMapping: TokenIdMapping) => {
    set((state) => {
      const newTokenIds = new Map(state.outcomeTokenIds);
      newTokenIds.set(marketId, tokenMapping);
      return { outcomeTokenIds: newTokenIds };
    });
  },

  // Initialize state from event, optionally setting a specific market
  initializeFromEvent: (event, marketId) => {
    const outcomes = event.displayData.outcomes || [];
    const primaryMarket = marketId
      ? outcomes.find((o) => o.id === marketId)
      : outcomes[0] || null;

    let visibleIds: Set<string>;
    const TOP_N = 5;
    const sorted = outcomes.sort(
      (a, b) => (b.price || 0) - (a.price || 0),
    );
    visibleIds = new Set(
      sorted
        .slice(0, TOP_N)
        .map((o) => o.id || "")
        .filter(Boolean),
    );

    set({
      currEv: event,
      currMkt: primaryMarket,
      selectedOutcome: "YES",
      visibleOutcomes: visibleIds,
      outcomeTokenIds: new Map<string, TokenIdMapping>(),
    });
  },

  // Get the token ID for the current market based on selected outcome
  getCurrentMarketTokenId: () => {
    const { currMkt, selectedOutcome } = get();
    if (!currMkt?.clobTokenIds) return null;

    try {
      const tokenIds = JSON.parse(currMkt.clobTokenIds) as string[];
      // tokenIds[0] = YES token, tokenIds[1] = NO token
      return selectedOutcome === "YES"
        ? tokenIds[0] || ""
        : tokenIds[1] || tokenIds[0] || "";
    } catch (error) {
      console.warn("Failed to parse clobTokenIds:", error);
      return null;
    }
  },

  // Get the opposite outcome for switching
  getOppositeOutcome: () => {
    const { selectedOutcome } = get();
    return selectedOutcome === "YES" ? "NO" : "YES";
  },

  // Reset store state (for page unmount)
  cleanup: () => {
    set({
      currEv: null,
      currMkt: null,
      selectedOutcome: "YES",
      visibleOutcomes: new Set<string>(),
      chartInterval: "1d",
      outcomeTokenIds: new Map<string, TokenIdMapping>(),
    });
  },
}));

