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

// --- New Types for Quant Dashboard ---

export type TreemapNode = {
  name: string
  size: number // Open Interest or Volume
  drift: number // Implied probability drift (positive = green, negative = red)
  liquidityRatio: number
  volatilityEdge: number
  children?: TreemapNode[]
  color?: string
  image?: string
}

export type TrendingMarket = {
  id: string
  title: string
  category: string
  volume24h: number
  volumeGrowth24h: number // Percentage
  probability: number
  probabilityDrift: number // 24h change
  sparklineData: number[] // Last 24h hourly points
  resolutionDate: string
}

export type ArbitrageOpp = {
  id: string
  event: string
  platforms: {
    polymarket: number
    kalshi: number
    betfair: number
  }
  spreadIndex: number // Max difference
  zScore: number
  liquidity: number
  isArb: boolean
}

export type ScatterPoint = {
  id: string
  name: string
  category: string
  edge: number // Volatility adjusted edge (X)
  yield: number // Yield equivalent return (Y)
  size: number // Open Interest
  accuracy: number // Resolution accuracy score
}

export type NetworkNode = {
  id: string
  group: number // Cluster ID
  val: number // Size
  label: string
}

export type NetworkLink = {
  source: string
  target: string
  value: number // Correlation strength (-1 to 1)
}

export type LiquidityLevel = {
  price: number
  volume: number
  type: 'bid' | 'ask'
  slippageRisk: 'low' | 'medium' | 'high'
}

// --- Mock Data Generators ---

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

// --- Enhanced Mock Data for Visualizations ---

export const mockTreemapData: TreemapNode[] = [
  {
    name: "Politics",
    size: 45000000,
    drift: 0,
    liquidityRatio: 0,
    volatilityEdge: 0,
    color: "#3b82f6", // blue-500
    children: [
      { name: "US Pres", size: 25000000, drift: 2.5, liquidityRatio: 0.8, volatilityEdge: 1.2, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Great_Seal_of_the_United_States_%28obverse%29.svg/2048px-Great_Seal_of_the_United_States_%28obverse%29.svg.png" },
      { name: "Congressional", size: 12000000, drift: -1.2, liquidityRatio: 0.6, volatilityEdge: 0.8, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Seal_of_the_United_States_Congress.svg/1200px-Seal_of_the_United_States_Congress.svg.png" },
      { name: "Global", size: 8000000, drift: 0.5, liquidityRatio: 0.4, volatilityEdge: 0.9, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/International_Flag_of_Planet_Earth.svg/1200px-International_Flag_of_Planet_Earth.svg.png" },
    ],
  },
  {
    name: "Economics",
    size: 28000000,
    drift: 0,
    liquidityRatio: 0,
    volatilityEdge: 0,
    color: "#10b981", // emerald-500
    children: [
      { name: "Fed Rates", size: 15000000, drift: -4.5, liquidityRatio: 0.9, volatilityEdge: 1.5, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Seal_of_the_United_States_Federal_Reserve_System.svg/1200px-Seal_of_the_United_States_Federal_Reserve_System.svg.png" },
      { name: "Recession", size: 8000000, drift: 1.1, liquidityRatio: 0.5, volatilityEdge: 1.1, image: "https://cdn-icons-png.flaticon.com/512/2454/2454282.png" },
      { name: "Jobs", size: 5000000, drift: -0.2, liquidityRatio: 0.3, volatilityEdge: 0.6, image: "https://cdn-icons-png.flaticon.com/512/3281/3281289.png" },
    ],
  },
  {
    name: "Crypto",
    size: 22000000,
    drift: 0,
    liquidityRatio: 0,
    volatilityEdge: 0,
    color: "#f59e0b", // amber-500
    children: [
      { name: "Bitcoin", size: 12000000, drift: 5.2, liquidityRatio: 0.95, volatilityEdge: 1.8, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png" },
      { name: "Ethereum", size: 6000000, drift: 3.8, liquidityRatio: 0.85, volatilityEdge: 1.6, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png" },
      { name: "Solana", size: 4000000, drift: 8.5, liquidityRatio: 0.7, volatilityEdge: 2.2, image: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png" },
    ],
  },
  {
    name: "Sports",
    size: 18000000,
    drift: 0,
    liquidityRatio: 0,
    volatilityEdge: 0,
    color: "#f43f5e", // rose-500
    children: [
      { name: "NFL", size: 10000000, drift: -0.5, liquidityRatio: 0.9, volatilityEdge: 0.5, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/National_Football_League_logo.svg/1200px-National_Football_League_logo.svg.png" },
      { name: "NBA", size: 5000000, drift: 1.2, liquidityRatio: 0.8, volatilityEdge: 0.7, image: "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/National_Basketball_Association_logo.svg/1200px-National_Basketball_Association_logo.svg.png" },
      { name: "Soccer", size: 3000000, drift: 0.1, liquidityRatio: 0.6, volatilityEdge: 0.4, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/FIFA_World_Cup.svg/1200px-FIFA_World_Cup.svg.png" },
    ],
  },
];

export const mockTrendingMarkets: TrendingMarket[] = [
  { id: "t1", title: "Bitcoin > 100k Q2", category: "Crypto", volume24h: 1200000, volumeGrowth24h: 145, probability: 0.32, probabilityDrift: 5.2, sparklineData: [25, 26, 26, 27, 28, 29, 29, 30, 31, 31, 32, 32], resolutionDate: "Jun 2024" },
  { id: "t2", title: "Fed Interest Rate Cut", category: "Eco", volume24h: 850000, volumeGrowth24h: 82, probability: 0.15, probabilityDrift: -4.1, sparklineData: [20, 19, 19, 18, 17, 16, 16, 15, 15, 14, 15, 15], resolutionDate: "Mar 2024" },
  { id: "t3", title: "Super Bowl Winner", category: "Sports", volume24h: 2100000, volumeGrowth24h: 65, probability: 0.55, probabilityDrift: 1.2, sparklineData: [52, 53, 53, 54, 54, 55, 54, 55, 55, 56, 55, 55], resolutionDate: "Feb 2024" },
  { id: "t4", title: "GTA VI Release Date", category: "Gaming", volume24h: 450000, volumeGrowth24h: 42, probability: 0.68, probabilityDrift: 0.5, sparklineData: [67, 67, 68, 68, 68, 68, 69, 68, 68, 68, 68, 68], resolutionDate: "Dec 2025" },
  { id: "t5", title: "AI Regulation passed", category: "Pol", volume24h: 320000, volumeGrowth24h: 38, probability: 0.42, probabilityDrift: 2.1, sparklineData: [38, 39, 39, 40, 40, 41, 41, 42, 42, 42, 42, 42], resolutionDate: "Dec 2024" },
  { id: "t6", title: "SpaceX Launch Success", category: "Sci", volume24h: 280000, volumeGrowth24h: 24, probability: 0.88, probabilityDrift: 1.5, sparklineData: [85, 86, 86, 87, 87, 87, 88, 88, 88, 88, 88, 88], resolutionDate: "Apr 2024" },
  { id: "t7", title: "S&P 500 ATH", category: "Eco", volume24h: 650000, volumeGrowth24h: 18, probability: 0.72, probabilityDrift: 0.8, sparklineData: [70, 71, 71, 72, 72, 72, 72, 72, 73, 72, 72, 72], resolutionDate: "Dec 2024" },
  { id: "t8", title: "Oppenheimer Best Picture", category: "Ent", volume24h: 410000, volumeGrowth24h: 12, probability: 0.91, probabilityDrift: 0.2, sparklineData: [90, 90, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91], resolutionDate: "Mar 2024" },
  { id: "t9", title: "Temp Anomaly > 1.5C", category: "Sci", volume24h: 150000, volumeGrowth24h: 8, probability: 0.64, probabilityDrift: 0.4, sparklineData: [63, 63, 64, 64, 64, 64, 64, 64, 65, 64, 64, 64], resolutionDate: "Dec 2024" },
  { id: "t10", title: "Eurovision Winner", category: "Ent", volume24h: 220000, volumeGrowth24h: 156, probability: 0.22, probabilityDrift: 8.5, sparklineData: [12, 14, 15, 18, 20, 21, 23, 24, 22, 22, 22, 22], resolutionDate: "May 2024" },
];

export const mockArbitrageData: ArbitrageOpp[] = [
  { id: "a1", event: "US Election Winner", platforms: { polymarket: 0.52, kalshi: 0.55, betfair: 0.51 }, spreadIndex: 0.04, zScore: 2.1, liquidity: 0.9, isArb: true },
  { id: "a2", event: "Fed Rate Cut Mar", platforms: { polymarket: 0.12, kalshi: 0.18, betfair: 0.14 }, spreadIndex: 0.06, zScore: 3.4, liquidity: 0.7, isArb: true },
  { id: "a3", event: "Bitcoin > 100k", platforms: { polymarket: 0.33, kalshi: 0.31, betfair: 0.33 }, spreadIndex: 0.02, zScore: 0.8, liquidity: 0.85, isArb: false },
  { id: "a4", event: "Super Bowl Winner", platforms: { polymarket: 0.45, kalshi: 0.46, betfair: 0.44 }, spreadIndex: 0.02, zScore: 0.5, liquidity: 0.95, isArb: false },
  { id: "a5", event: "Oscars Best Picture", platforms: { polymarket: 0.91, kalshi: 0.88, betfair: 0.89 }, spreadIndex: 0.03, zScore: 1.8, liquidity: 0.6, isArb: false },
];

export const mockScatterData: ScatterPoint[] = [
  { id: "s1", name: "US Election", category: "Politics", edge: 2.4, yield: 12.5, size: 45, accuracy: 85 },
  { id: "s2", name: "Bitcoin Q2", category: "Crypto", edge: 1.8, yield: 24.2, size: 28, accuracy: 72 },
  { id: "s3", name: "Fed Rates", category: "Economics", edge: -0.5, yield: 4.5, size: 35, accuracy: 92 },
  { id: "s4", name: "Super Bowl", category: "Sports", edge: 1.2, yield: 8.4, size: 32, accuracy: 88 },
  { id: "s5", name: "GTA VI", category: "Entertainment", edge: 0.8, yield: 15.1, size: 18, accuracy: 65 },
  { id: "s6", name: "SpaceX", category: "Science", edge: 0.4, yield: 6.2, size: 12, accuracy: 78 },
  { id: "s7", name: "Inflation", category: "Economics", edge: 1.5, yield: 9.8, size: 25, accuracy: 90 },
  { id: "s8", name: "Ethereum ETF", category: "Crypto", edge: 3.1, yield: 18.5, size: 22, accuracy: 75 },
  { id: "s9", name: "Oil Prices", category: "Economics", edge: -1.2, yield: 2.1, size: 40, accuracy: 94 },
  { id: "s10", name: "AI Regs", category: "Politics", edge: 0.9, yield: 14.2, size: 15, accuracy: 60 },
];

export const mockCorrelationData: { nodes: NetworkNode[], links: NetworkLink[] } = {
  nodes: [
    { id: "Bitcoin", group: 1, val: 20, label: "BTC > 100k" },
    { id: "Ethereum", group: 1, val: 15, label: "ETH > 5k" },
    { id: "Solana", group: 1, val: 12, label: "SOL > 200" },
    { id: "FedRates", group: 2, val: 18, label: "Fed Cuts" },
    { id: "Inflation", group: 2, val: 16, label: "CPI > 3%" },
    { id: "StockMarket", group: 2, val: 15, label: "S&P ATH" },
    { id: "USElection", group: 3, val: 25, label: "Trump Win" },
    { id: "Regulations", group: 3, val: 10, label: "Crypto Regs" },
  ],
  links: [
    { source: "Bitcoin", target: "Ethereum", value: 0.85 },
    { source: "Bitcoin", target: "Solana", value: 0.72 },
    { source: "FedRates", target: "Inflation", value: -0.65 },
    { source: "FedRates", target: "StockMarket", value: 0.78 },
    { source: "FedRates", target: "Bitcoin", value: 0.45 },
    { source: "USElection", target: "Regulations", value: 0.60 },
    { source: "USElection", target: "StockMarket", value: 0.35 },
    { source: "Bitcoin", target: "Regulations", value: -0.40 },
  ]
};

export const mockLiquidityDepth: LiquidityLevel[] = [
  { price: 0.1, volume: 50000, type: 'bid', slippageRisk: 'low' },
  { price: 0.2, volume: 120000, type: 'bid', slippageRisk: 'low' },
  { price: 0.3, volume: 80000, type: 'bid', slippageRisk: 'medium' },
  { price: 0.4, volume: 45000, type: 'bid', slippageRisk: 'high' },
  { price: 0.5, volume: 20000, type: 'ask', slippageRisk: 'high' },
  { price: 0.6, volume: 60000, type: 'ask', slippageRisk: 'medium' },
  { price: 0.7, volume: 150000, type: 'ask', slippageRisk: 'low' },
  { price: 0.8, volume: 80000, type: 'ask', slippageRisk: 'low' },
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
// --- Top Traders / Whales Data ---
export type TopTrader = {
  rank: number;
  name: string;
  pnl: number;
  volume: number;
  winRate: number;
  avatar?: string;
}

export const mockTopTraders: TopTrader[] = [
  { rank: 1, name: "whale_0x", pnl: 452000, volume: 12500000, winRate: 68 },
  { rank: 2, name: "alpha_seeker", pnl: 320000, volume: 8500000, winRate: 62 },
  { rank: 3, name: "fomoboy", pnl: 150000, volume: 4200000, winRate: 55 },
  { rank: 4, name: "smart_money", pnl: 120000, volume: 3100000, winRate: 71 },
  { rank: 5, name: "degen_king", pnl: 98000, volume: 2800000, winRate: 48 },
];
