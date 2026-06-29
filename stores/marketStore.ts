import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { CleanEvent } from "@/types";
import { Category } from "@/types/dashboard";
import { fetchCats, fetchEvents } from "@/lib/services";
import { MOCK_CLEAN_EVENTS } from "@/components/market-feed/mock-data";
import { useEventStore } from "@/stores/eventStore";

export interface MarketState {
  topNav: Category[];
  topNavLoading: boolean;
  topNavError: string | null;
  currCat: string;
  events: CleanEvent[];
  eventsLoading: boolean;
  eventsError: string | null;
  loadCats: () => Promise<void>;
  loadEvents: (category?: string) => Promise<void>;
  navigateToEvent: (eventId: string) => void;
}

// Initialize the store with subscribeWithSelector middleware for efficient selector subscriptions
export const useMarketStore = create<MarketState>()(subscribeWithSelector((set, get) => ({
  topNav: [],
  topNavLoading: false,
  topNavError: null,
  currCat: "all",
  events: [],
  eventsLoading: false,
  eventsError: null,
  loadCats: async () => {
    set({ topNavLoading: true, topNavError: null });
    try {
      const categories = await fetchCats();
      set({ topNav: categories, topNavLoading: false });
    } catch (error) {
      console.error("Failed to load categories:", error);
      set({ topNav: [], topNavLoading: false, topNavError: "API connection failed." });
    }
  },
  loadEvents: async (category?: string) => {
    if (category) set({ currCat: category });
    const activeCat = category || get().currCat;
    set({ eventsLoading: true, eventsError: null });
    try {
      const catParam = activeCat !== "all" ? activeCat : undefined;
      const events = await fetchEvents(catParam);
      set({ events, eventsLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to load events";
      console.error("Failed to load events:", error);
      set({ events: MOCK_CLEAN_EVENTS, eventsLoading: false, eventsError: errorMsg });
    }
  },
  navigateToEvent: (eventId: string) => {
    const { events } = get();
    const event = events.find((e) => e.id === eventId);
    if (event) {
      useEventStore.getState().initializeFromEvent(event);
    }
  },
})));