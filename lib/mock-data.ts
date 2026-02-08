import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type MarketType = "moneyline" | "spread" | "over_under" | "standard";

export type Market = {
  id: string
  title: string
  volume: number
  liquidity: number
  price: number
  change24h: number
  category: string
  isHot: boolean
  isWhaleActive: boolean
  // New fields
  marketType?: MarketType
  group?: string // e.g., "Winner", "MVP"
}

export type Event = {
  id: string
  title: string
  description: string
  markets: Market[]
  endDate: string
  volume: number
  // New fields
  gameId?: string
  gameStartTime?: string
  league?: string
  isSports?: boolean
}

// Mock Data Generators

export const mockDashboardStats = {
  tvl: 45200000, // $45.2M
  volume24h: 12500000, // $12.5M
  volume7d: 85400000, // $85.4M
  fees24h: 250000, // $250k
  activeTraders: 8500,
  openInterest: 32000000, // $32M
  activeMarkets: 1240,
  topGainer: "+145%",
}

export const mockMarkets: Market[] = [
  { id: "m1", title: "Trump vs Biden 2024", volume: 15400000, liquidity: 5000000, price: 0.52, change24h: 2.5, category: "Politics", isHot: true, isWhaleActive: true, marketType: "standard" },
  { id: "m2", title: "Fed Rate Cut in March", volume: 8200000, liquidity: 2100000, price: 0.12, change24h: -5.4, category: "Economics", isHot: true, isWhaleActive: false, marketType: "standard" },
  { id: "m3", title: "Bitcoin > 100k by Q2", volume: 4100000, liquidity: 1200000, price: 0.33, change24h: 8.2, category: "Crypto", isHot: false, isWhaleActive: true, marketType: "standard" },
  { id: "m4", title: "SpaceX Starship Launch Success", volume: 900000, liquidity: 300000, price: 0.88, change24h: 1.1, category: "Science", isHot: false, isWhaleActive: false, marketType: "standard" },
  { id: "m5", title: "Chiefs vs 49ers (Winner)", volume: 6500000, liquidity: 1800000, price: 0.45, change24h: -1.2, category: "Sports", isHot: true, isWhaleActive: true, marketType: "moneyline", group: "Winner" },
  { id: "m6", title: "Taylor Swift Engagement 2024", volume: 3200000, liquidity: 900000, price: 0.15, change24h: 12.5, category: "Pop Culture", isHot: true, isWhaleActive: false, marketType: "standard" },
  { id: "m7", title: "GPT-5 Release Date", volume: 1200000, liquidity: 400000, price: 0.72, change24h: 0.5, category: "Tech", isHot: false, isWhaleActive: true, marketType: "standard" },
  { id: "m8", title: "Oil Price > $100", volume: 2200000, liquidity: 800000, price: 0.28, change24h: -3.1, category: "Economics", isHot: false, isWhaleActive: false, marketType: "standard" },
]

export const mockEvents: Event[] = [
  {
    id: "e1",
    title: "US Presidential Election 2024",
    description: "Who will win the 2024 US Presidential Election? Analyze polls, funding, and momentum.",
    markets: [mockMarkets[0]],
    endDate: "2024-11-05",
    volume: 24500000,
    isSports: false,
    league: "N/A"
  },
  {
    id: "e2",
    title: "Super Bowl LVIII",
    description: "Kansas City Chiefs vs San Francisco 49ers. Super Bowl LVIII.",
    markets: [mockMarkets[4]],
    endDate: "2024-02-11",
    volume: 8500000,
    isSports: true,
    league: "NFL",
    gameId: "sb-lviii",
    gameStartTime: "2024-02-11T23:30:00Z"
  }
]

export const mockTreemapData = [
  {
    name: "Politics",
    children: [
      { name: "S", size: 1000000 },
      { name: "M", size: 5000000 },
      { name: "L", size: 15000000 },
    ],
  },
  {
    name: "Economics",
    children: [
      { name: "Rates", size: 8200000 },
      { name: "Commodities", size: 2200000 },
    ],
  },
  {
    name: "Crypto",
    children: [
      { name: "BTC", size: 4100000 },
      { name: "ETH", size: 1500000 },
    ],
  },
  {
    name: "Sports",
    children: [
      { name: "NFL", size: 6500000 },
      { name: "NBA", size: 2000000 },
    ],
  },
];

export const userProfileValues = {
  balance: 14520.50,
  pnlDay: 320.15,
  pnlTotal: 4500.00,
  positions: 5,
  rank: 124,
}

// Extra Mock Data
export const mockChartData = [
  { date: "00:00", yes: 45, no: 55 },
  { date: "04:00", yes: 48, no: 52 },
  { date: "08:00", yes: 52, no: 48 },
  { date: "12:00", yes: 50, no: 50 },
  { date: "16:00", yes: 55, no: 45 },
  { date: "20:00", yes: 58, no: 42 },
  { date: "Now", yes: 60, no: 40 },
]

export const mockActivities = [
  { id: "1", user: "trader_1", action: "buy" as const, market: "This Market", outcome: "Yes", amount: "$500", odds: 58, time: "1m ago" },
  { id: "2", user: "whale_x", action: "sell" as const, market: "This Market", outcome: "Yes", amount: "$5,000", odds: 60, time: "5m ago" },
  { id: "3", user: "arb_bot", action: "buy" as const, market: "This Market", outcome: "No", amount: "$1,200", odds: 42, time: "12m ago" },
]
