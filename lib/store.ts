import { create } from "zustand"
import { Market, Category } from "@/types/dashboard"
import { CleanEvent } from "@/types"
import { fetchCats, fetchEvents, fetchMarketById } from "./services"
import { backupCategories } from "./backup-data"
import { MOCK_CLEAN_EVENTS } from "@/components/market-feed/mock-data"

export interface FilterOptions {
    tag_id?: string
    // Time remaining
    end_date_max?: string       // ISO date string upper bound
    // Created date  
    start_date_min?: string     // ISO date string lower bound
    // Outcome prices
    outcome_price_min?: number  // decimal 0-1
    outcome_price_max?: number
    // Min Spread (cents → basis points for API)
    spread_max?: number
    // Min Volume
    volumeMin?: number
    // Min Liquidity
    liquidityMin?: number
    // Min Daily Reward
    rewardMin?: number
    // Status
    active?: boolean
    closed?: boolean
}

interface AppState {
    // Top navigation - list of categories from API
    topNav: Category[]
    topNavLoading: boolean
    topNavError: string | null
    currCat: string

    // Events list
    events: CleanEvent[]
    eventsLoading: boolean
    eventsError: string | null

    // Current selected event
    currEv: CleanEvent | null

    // Current selected market
    currMkt: Market | null

    // UI State - Filters and Sorting
    sortBy: string
    sortOrder: 'asc' | 'desc'
    filterBy: string
    viewMode: 'grid' | 'table'
    filters: FilterOptions

    // Actions
    setCurrentEvent: (event: CleanEvent | null) => void
    setCurrentMarket: (market: Market | null) => void
    setSortBy: (value: string) => void
    setSortOrder: (value: 'asc' | 'desc') => void
    setFilterBy: (value: string) => void
    setViewMode: (value: 'grid' | 'table') => void
    setFilters: (filters: FilterOptions) => void
    clearFilters: () => void
    searchQuery: string
    setSearchQuery: (query: string) => void
    loadCats: () => Promise<void>
    loadEvents: (category?: string) => Promise<void>
    loadMarket: (id: string) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
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
    sortBy: "volume24hr",
    sortOrder: "desc" as const,
    filterBy: "all",
    viewMode: "grid",
    filters: {},

    // Actions
    setCurrentEvent: (event) => set({ currEv: event }),

    setCurrentMarket: (market) => set({ currMkt: market }),

    setSortBy: (value) => set({ sortBy: value }),

    setSortOrder: (value) => set({ sortOrder: value }),

    setFilterBy: (value) => set({ filterBy: value }),

    setViewMode: (value) => set({ viewMode: value }),

    setFilters: (filters) => set({ filters }),
    clearFilters: () => set({ filters: {} }),

    searchQuery: "",
    setSearchQuery: (query: string) => set({ searchQuery: query }),

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
        // Persist category if provided, otherwise use the stored one
        if (category) {
            set({ currCat: category })
        }
        const activeCat = category || get().currCat
        set({ eventsLoading: true, eventsError: null })
        try {
            const { filters, sortBy, sortOrder } = get()
            const catParam = activeCat !== "all" ? activeCat : undefined
            const events = await fetchEvents(catParam, filters, sortBy, sortOrder === 'asc')
            set({ events, eventsLoading: false })
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Failed to load events"
            console.error("Failed to load events:", error)
            set({
                events: MOCK_CLEAN_EVENTS,
                eventsLoading: false,
                eventsError: errorMsg
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
