import { create } from "zustand"
import { Event, Market, Category } from "@/types/dashboard"
import { fetchCats, fetchEvents, fetchMarketById } from "./services"
import { backupCategories, backupEvents } from "./backup-data"

interface AppState {
    // Top navigation - list of categories from API
    topNav: Category[]
    topNavLoading: boolean
    topNavError: string | null
    currCat: string

    // Events list
    events: Event[]
    eventsLoading: boolean
    eventsError: string | null

    // Current selected event
    currEv: Event | null

    // Current selected market
    currMkt: Market | null

    // UI State - Filters and Sorting
    sortBy: string
    filterBy: string

    // Actions
    setCurrentEvent: (event: Event | null) => void
    setCurrentMarket: (market: Market | null) => void
    setSortBy: (value: string) => void
    setFilterBy: (value: string) => void
    loadCats: () => Promise<void>
    loadEvents: (category?: string) => Promise<void>
    loadMarket: (id: string) => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
    // Initial state
    topNav: [],
    currCat: "all",
    topNavLoading: false,
    topNavError: null,

    events: [],
    eventsLoading: false,
    eventsError: null,

    currEv: null,
    currMkt: null,

    // UI State
    sortBy: "volume",
    filterBy: "all",

    // Actions
    setCurrentEvent: (event) => set({ currEv: event }),

    setCurrentMarket: (market) => set({ currMkt: market }),

    setSortBy: (value) => set({ sortBy: value }),

    setFilterBy: (value) => set({ filterBy: value }),

    loadCats: async () => {
        set({ topNavLoading: true, topNavError: null })
        try {
            const categories = await fetchCats()
            set({ topNav: categories, topNavLoading: false })
        } catch (error) {
            console.error("Failed to load categories:", error)
            // Fallback to backup data
            set({
                topNav: backupCategories,
                topNavLoading: false,
                topNavError: "API connection failed. Showing offline mode."
            })
        }
    },

    loadEvents: async (category?: string) => {
        set({ eventsLoading: true, eventsError: null })
        try {
            const events = await fetchEvents(category)
            set({ events, eventsLoading: false })
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Failed to load events"
            console.error("Failed to load events:", error)
            // Fallback to backup data
            set({
                events: backupEvents,
                eventsLoading: false,
                eventsError: `Connection error: ${errorMsg}. Using stale data.`
            })
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
