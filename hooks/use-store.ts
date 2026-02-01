import { create } from 'zustand'
import { Market, Event, mockMarkets, mockEvents, userProfileValues } from '@/lib/mock-data'

interface AppState {
    currentEventId: string | null
    currentMarketId: string | null
    user: typeof userProfileValues
    markets: Market[]
    events: Event[]

    // Actions
    selectEvent: (id: string | null) => void
    selectMarket: (id: string | null) => void
}

export const useStore = create<AppState>((set) => ({
    currentEventId: null,
    currentMarketId: null,
    user: userProfileValues,
    markets: mockMarkets,
    events: mockEvents,

    selectEvent: (id) => set({ currentEventId: id }),
    selectMarket: (id) => set({ currentMarketId: id }),
}))
