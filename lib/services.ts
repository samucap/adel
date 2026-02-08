import { Event, Market, Category } from "@/types/dashboard"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

/**
 * Fetch top navigation categories
 */
export async function fetchCats(): Promise<Category[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/top-nav`)

        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching categories:", error)
        // Return mock data for now
        return [
            { label: "Crypto", slug: "crypto", related: [] },
            { label: "Politics", slug: "politics", related: [] },
            { label: "Sports", slug: "sports", related: ["nfl", "nba", "mlb", "soccer"] },
            { label: "Business", slug: "business", related: [] },
            { label: "Pop Culture", slug: "pop-culture", related: [] },
            { label: "Science", slug: "science", related: [] },
        ]
    }
}

/**
 * Fetch events with optional category filter
 */
export async function fetchEvents(category?: string): Promise<Event[]> {
    try {
        const params = new URLSearchParams()
        if (category) params.set("category", category)

        const url = `${API_BASE_URL}/events${params.toString() ? `?${params.toString()}` : ""}`
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching events:", error)
        // Return mock events that conform to the Event type
        return getMockEvents()
    }
}

/**
 * Generate mock events that conform to types/dashboard.ts Event interface
 */
function getMockEvents(): Event[] {
    return [
        {
            id: "e1",
            ticker: "PRES24",
            slug: "us-presidential-election-2024",
            title: "US Presidential Election 2024",
            description: "Who will win the 2024 US Presidential Election?",
            startDate: "2024-01-01",
            creationDate: "2024-01-01",
            endDate: "2024-11-05",
            image: "",
            icon: "",
            active: true,
            closed: false,
            archived: false,
            new: false,
            featured: true,
            restricted: false,
            liquidity: 5000000,
            volume: 24500000,
            openInterest: 8000000,
            sortBy: "volume",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            competitive: 0.5,
            volume24hr: 1200000,
            volume1wk: 5000000,
            volume1mo: 15000000,
            volume1yr: 24500000,
            enableOrderBook: true,
            liquidityClob: 3000000,
            negRisk: false,
            negRiskMarketID: "",
            commentCount: 1250,
            markets: [
                {
                    id: "m1",
                    question: "Will Trump win?",
                    conditionId: "c1",
                    slug: "trump-win",
                    endDate: "2024-11-05",
                    startDate: "2024-01-01",
                    image: "",
                    icon: "",
                    description: "Trump wins the 2024 presidential election",
                    outcomes: '["Yes", "No"]',
                    outcomePrices: '["0.52", "0.48"]',
                    volume: "15400000",
                    volumeNum: 15400000,
                    liquidity: 5000000,
                    active: true,
                    closed: false,
                    rewardsMinSize: 0,
                    rewardsMaxSpread: 0,
                    spread: 0.02,
                    bestAsk: 0.53,
                    lastTradePrice: 0.52,
                }
            ]
        },
        {
            id: "e2",
            ticker: "SBLVIII",
            slug: "super-bowl-lviii",
            title: "Super Bowl LVIII",
            description: "Kansas City Chiefs vs San Francisco 49ers",
            startDate: "2024-02-01",
            creationDate: "2024-02-01",
            endDate: "2024-02-11",
            image: "",
            icon: "",
            active: true,
            closed: false,
            archived: false,
            new: false,
            featured: true,
            restricted: false,
            liquidity: 1800000,
            volume: 8500000,
            openInterest: 2500000,
            sortBy: "volume",
            createdAt: "2024-02-01T00:00:00Z",
            updatedAt: "2024-02-01T00:00:00Z",
            competitive: 0.48,
            volume24hr: 650000,
            volume1wk: 3000000,
            volume1mo: 8500000,
            volume1yr: 8500000,
            enableOrderBook: true,
            liquidityClob: 1200000,
            negRisk: true,
            negRiskMarketID: "",
            commentCount: 890,
            markets: [
                {
                    id: "m2",
                    question: "Chiefs to win?",
                    conditionId: "c2",
                    slug: "chiefs-win",
                    endDate: "2024-02-11",
                    startDate: "2024-02-01",
                    image: "",
                    icon: "",
                    description: "Kansas City Chiefs win Super Bowl LVIII",
                    outcomes: '["Yes", "No"]',
                    outcomePrices: '["0.55", "0.45"]',
                    volume: "6500000",
                    volumeNum: 6500000,
                    liquidity: 1800000,
                    active: true,
                    closed: false,
                    rewardsMinSize: 0,
                    rewardsMaxSpread: 0,
                    spread: 0.03,
                    bestAsk: 0.56,
                    lastTradePrice: 0.55,
                }
            ]
        },
        {
            id: "e3",
            ticker: "BTC100K",
            slug: "bitcoin-100k",
            title: "Bitcoin $100K",
            description: "Will Bitcoin reach $100,000 in 2024?",
            startDate: "2024-01-01",
            creationDate: "2024-01-01",
            endDate: "2024-12-31",
            image: "",
            icon: "",
            active: true,
            closed: false,
            archived: false,
            new: false,
            featured: true,
            restricted: false,
            liquidity: 1200000,
            volume: 4100000,
            openInterest: 1500000,
            sortBy: "volume",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            competitive: 0.33,
            volume24hr: 350000,
            volume1wk: 1200000,
            volume1mo: 3000000,
            volume1yr: 4100000,
            enableOrderBook: true,
            liquidityClob: 800000,
            negRisk: false,
            negRiskMarketID: "",
            commentCount: 2100,
            markets: [
                {
                    id: "m3",
                    question: "Bitcoin > $100K by Dec 2024?",
                    conditionId: "c3",
                    slug: "btc-100k-2024",
                    endDate: "2024-12-31",
                    startDate: "2024-01-01",
                    image: "",
                    icon: "",
                    description: "Bitcoin reaches $100,000 before end of 2024",
                    outcomes: '["Yes", "No"]',
                    outcomePrices: '["0.33", "0.67"]',
                    volume: "4100000",
                    volumeNum: 4100000,
                    liquidity: 1200000,
                    active: true,
                    closed: false,
                    rewardsMinSize: 0,
                    rewardsMaxSpread: 0,
                    spread: 0.04,
                    bestAsk: 0.35,
                    lastTradePrice: 0.33,
                }
            ]
        }
    ]
}

/**
 * Fetch market details by ID
 */
export async function fetchMarketById(id: string): Promise<Market | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/markets/${id}`)

        if (!response.ok) {
            throw new Error(`Failed to fetch market: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching market:", error)
        return null
    }
}
