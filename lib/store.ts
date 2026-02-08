import { create } from "zustand"
import { Event, Market, Category } from "@/types/dashboard"
import { fetchCats, fetchEvents, fetchMarketById } from "./services"

interface AppState {
    // Top navigation - list of categories from API
    topNav: Category[]
    topNavLoading: boolean
    currCat: string

    // Events list
    events: Event[]
    eventsLoading: boolean
    eventsError: string | null

    // Current selected event
    currEv: Event | null

    // Current selected market
    currMkt: Market | null

    // Actions
    setCurrentEvent: (event: Event | null) => void
    setCurrentMarket: (market: Market | null) => void
    loadCats: () => Promise<void>
    loadEvents: (category?: string) => Promise<void>
    loadMarket: (id: string) => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
    // Initial state
    topNav: [],
    currCat: "all",
    topNavLoading: false,

    events: [],
    eventsLoading: false,
    eventsError: null,

    currEv: null,
    currMkt: null,

    // Actions
    setCurrentEvent: (event) => set({ currEv: event }),

    setCurrentMarket: (market) => set({ currMkt: market }),

    loadCats: async () => {
        set({ topNavLoading: true })
        try {
            const categories = await fetchCats()
            set({ topNav: categories, topNavLoading: false })
        } catch (error) {
            console.error("Failed to load categories:", error)
            set({ topNavLoading: false })
        }
    },

    loadEvents: async (category?: string) => {
        set({ eventsLoading: true, eventsError: null })
        try {
            const events = await fetchEvents(category)
            set({ events, eventsLoading: false })
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Failed to load events"
            set({ eventsError: errorMsg, eventsLoading: false })
        }
    },

    loadMarket: async (id: string) => {
        try {
            const market = await fetchMarketById(id)
            set({ currMkt: market })
        } catch (error) {
            console.error("Failed to load market:", error)
            set({ currMkt: null })
        }
    },
}))
