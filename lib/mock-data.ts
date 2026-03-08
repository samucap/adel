// --- Mock Data Generators (Deterministic) ---
// Simple seeded random to ensure charts look stable for the same market
const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

const getStepFromInterval = (interval: string) => {
    switch (interval) {
        case '5m': return 300;
        case '15m': return 900;
        case '1H': case '1h': return 3600;
        case '4H': case '4h': return 14400;
        case '1D': case '1d': return 86400;
        default: return 900;
    }
};

export const generateMockCandles = (marketId: string, count = 100, outcomeIndex = 0, currentPrice?: number, interval: string = '15m') => {
    // Generate a numeric seed from marketId string + outcomeIndex
    const seed = marketId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + (outcomeIndex * 999);
    const step = getStepFromInterval(interval);

    // Initial generation (normalized around 0.5 or arbitrary base)
    let price = 0.50 + (seededRandom(seed) * 0.40);
    if (outcomeIndex > 0) price = price * 0.5;

    const candles = [];
    const now = Math.floor(Date.now() / 1000);
    const alignedNow = now - (now % step);

    for (let i = 0; i < count; i++) {
        const time = alignedNow - (count - i) * step;
        const candleSeed = seed + time; // Deterministic per time slice
        const change = (seededRandom(candleSeed) - 0.5) * 0.05;

        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + (seededRandom(candleSeed + 1) * 0.02);
        const low = Math.min(open, close) - (seededRandom(candleSeed + 2) * 0.02);

        candles.push({
            time, // raw values first
            open, high, low, close
        });
        price = close;
    }

    // Alignment Logic
    if (currentPrice !== undefined && candles.length > 0) {
        const lastClose = candles[candles.length - 1].close;
        const offset = currentPrice - lastClose;

        return candles.map(c => ({
            ...c,
            open: Math.max(0.01, c.open + offset),
            high: Math.max(0.01, c.high + offset),
            low: Math.max(0.01, c.low + offset),
            close: Math.max(0.01, c.close + offset)
        }));
    }

    return candles.map(c => ({
        ...c,
        open: Math.max(0.01, c.open),
        high: Math.max(0.01, c.high),
        low: Math.max(0.01, c.low),
        close: Math.max(0.01, c.close)
    }));
};

export const generateMockOrderBook = (marketId: string, currentPrice?: number) => {
    const seed = marketId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const basePrice = currentPrice || (0.50 + (seededRandom(seed) * 0.40));

    return {
        bids: Array.from({ length: 15 }).map((_, i) => ({
            price: Math.max(0.01, basePrice - 0.01 - (i * 0.01)),
            size: 1000 + seededRandom(seed + i) * 5000
        })),
        asks: Array.from({ length: 15 }).map((_, i) => ({
            price: Math.min(0.99, basePrice + 0.01 + (i * 0.01)),
            size: 1000 + seededRandom(seed + i + 100) * 5000
        }))
    };
};

export const generateMockTrades = (marketId: string, count = 20, currentPrice?: number) => {
    const seed = marketId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const trades = [];
    const now = Date.now();
    const basePrice = currentPrice || 0.50;

    for (let i = 0; i < count; i++) {
        const time = now - i * (1000 * 60 * 5 + seededRandom(seed + i) * 1000 * 60);
        const side = seededRandom(seed + i + 1) > 0.5 ? 'YES' : 'NO';
        const type = seededRandom(seed + i + 2) > 0.5 ? 'BUY' : 'SELL';
        // Random walks around basePrice
        const variation = (seededRandom(seed + i + 3) - 0.5) * 0.10;
        const price = Math.max(0.01, basePrice + variation);
        const size = 100 + seededRandom(seed + i + 4) * 5000;
        trades.push({ time, side, type, price, size, id: `trade-${i}` });
    }
    return trades;
};

// Mock dashboard stats
export const mockDashboardStats = {
    tvl: 450000000, // $450M
    volume24h: 125000000, // $125M
    openInterest: 89000000, // $89M
    activeTraders: 15420,
    fees24h: 125000, // $125k
    activeMarkets: 2340
};

// Mock activities for dashboard
export const mockActivities = [
    {
        id: "1",
        user: "0x742d...3f9a",
        action: "buy" as const,
        market: "US Election 2024",
        outcome: "Trump",
        amount: "$12,500",
        odds: 2.45,
        time: "2 minutes ago"
    },
    {
        id: "2",
        user: "0x8b2c...1d4e",
        action: "sell" as const,
        market: "Bitcoin $100k",
        outcome: "Yes",
        amount: "$8,200",
        odds: 1.85,
        time: "5 minutes ago"
    },
    {
        id: "3",
        user: "0xa3f1...9b7c",
        action: "buy" as const,
        market: "Chiefs vs 49ers",
        outcome: "Chiefs",
        amount: "$5,600",
        odds: 1.92,
        time: "8 minutes ago"
    },
    {
        id: "4",
        user: "0x4e5f...2a8b",
        action: "buy" as const,
        market: "Fed Rate Cut",
        outcome: "No",
        amount: "$15,000",
        odds: 2.15,
        time: "12 minutes ago"
    },
    {
        id: "5",
        user: "0x1c2d...7e6f",
        action: "sell" as const,
        market: "Euro 2024",
        outcome: "Draw",
        amount: "$3,400",
        odds: 3.20,
        time: "15 minutes ago"
    }
];

// Mock arbitrage data for dashboard
export const mockArbitrageData = [
    {
        id: "arb-1",
        event: "US Presidential Election 2024",
        isArb: true,
        zScore: 2.3,
        platforms: {
            polymarket: 0.48,
            kalshi: 0.52,
            betfair: 0.46
        },
        liquidity: 0.85
    },
    {
        id: "arb-2",
        event: "Bitcoin $100k by EOY",
        isArb: false,
        zScore: 0.8,
        platforms: {
            polymarket: 0.35,
            kalshi: 0.37,
            betfair: 0.34
        },
        liquidity: 0.72
    },
    {
        id: "arb-3",
        event: "Chiefs vs 49ers Super Bowl",
        isArb: true,
        zScore: 1.9,
        platforms: {
            polymarket: 0.58,
            kalshi: 0.54,
            betfair: 0.61
        },
        liquidity: 0.91
    },
    {
        id: "arb-4",
        event: "Fed Rate Cut Q1 2024",
        isArb: false,
        zScore: 1.1,
        platforms: {
            polymarket: 0.42,
            kalshi: 0.45,
            betfair: 0.41
        },
        liquidity: 0.68
    },
    {
        id: "arb-5",
        event: "Euro 2024 Winner",
        isArb: true,
        zScore: 2.7,
        platforms: {
            polymarket: 0.15,
            kalshi: 0.18,
            betfair: 0.12
        },
        liquidity: 0.76
    }
];

// Mock correlation data for dashboard
export const mockCorrelationData = {
    links: [
        { source: "Bitcoin", target: "Ethereum", value: 0.85 },
        { source: "Bitcoin", target: "Solana", value: 0.72 },
        { source: "Ethereum", target: "Solana", value: 0.68 },
        { source: "Bitcoin", target: "StockMarket", value: 0.45 },
        { source: "StockMarket", target: "FedRates", value: -0.35 },
        { source: "FedRates", target: "Inflation", value: 0.62 },
        { source: "Inflation", target: "Bitcoin", value: -0.28 },
        { source: "USElection", target: "StockMarket", value: 0.52 },
        { source: "USElection", target: "FedRates", value: 0.41 },
        { source: "Regulations", target: "Bitcoin", value: -0.38 },
        { source: "Regulations", target: "Ethereum", value: -0.32 },
        { source: "Solana", target: "Regulations", value: -0.25 }
    ]
};

// Mock liquidity depth for dashboard
export const mockLiquidityDepth = [
    { type: 'bid', price: 0.45, volume: 25000, slippageRisk: 'low' },
    { type: 'bid', price: 0.44, volume: 18000, slippageRisk: 'low' },
    { type: 'bid', price: 0.43, volume: 32000, slippageRisk: 'medium' },
    { type: 'bid', price: 0.42, volume: 15000, slippageRisk: 'high' },
    { type: 'bid', price: 0.41, volume: 28000, slippageRisk: 'high' },
    { type: 'ask', price: 0.46, volume: 22000, slippageRisk: 'low' },
    { type: 'ask', price: 0.47, volume: 19000, slippageRisk: 'medium' },
    { type: 'ask', price: 0.48, volume: 35000, slippageRisk: 'high' },
    { type: 'ask', price: 0.49, volume: 12000, slippageRisk: 'high' },
    { type: 'ask', price: 0.50, volume: 41000, slippageRisk: 'high' }
];

// Mock scatter data for dashboard
export const mockScatterData = [
    { x: 0.45, y: 0.12, category: 'Crypto', name: 'BTC Price' },
    { x: 0.62, y: 0.08, category: 'Crypto', name: 'ETH Price' },
    { x: 0.38, y: 0.15, category: 'Politics', name: 'Election Odds' },
    { x: 0.71, y: 0.06, category: 'Sports', name: 'Super Bowl' },
    { x: 0.29, y: 0.18, category: 'Economics', name: 'Fed Rates' },
    { x: 0.55, y: 0.09, category: 'Crypto', name: 'SOL Price' },
    { x: 0.33, y: 0.14, category: 'Politics', name: 'Midterms' },
    { x: 0.68, y: 0.07, category: 'Sports', name: 'World Cup' },
    { x: 0.42, y: 0.11, category: 'Economics', name: 'Inflation' },
    { x: 0.79, y: 0.04, category: 'Crypto', name: 'ADA Price' }
];

// Type definition for treemap data
export interface TreemapNode {
    name: string;
    color: string;
    children?: Array<{
        name: string;
        size: number;
        drift: number;
        liquidityRatio: number;
        volatilityEdge: number;
        image?: string;
    }>;
}

// Mock treemap data for dashboard
export const mockTreemapData: TreemapNode[] = [
    {
        name: "Crypto",
        color: "#10b981",
        children: [
            { name: "Bitcoin", size: 45000, drift: 0.05, liquidityRatio: 0.85, volatilityEdge: 0.12, image: "₿" },
            { name: "Ethereum", size: 28000, drift: 0.08, liquidityRatio: 0.72, volatilityEdge: 0.15, image: "Ξ" },
            { name: "Solana", size: 12000, drift: -0.03, liquidityRatio: 0.68, volatilityEdge: 0.18, image: "◎" }
        ]
    },
    {
        name: "Politics",
        color: "#ef4444",
        children: [
            { name: "US Election", size: 32000, drift: 0.12, liquidityRatio: 0.91, volatilityEdge: 0.08, image: "🇺🇸" },
            { name: "Midterms", size: 18000, drift: 0.06, liquidityRatio: 0.75, volatilityEdge: 0.11, image: "🏛️" }
        ]
    },
    {
        name: "Sports",
        color: "#3b82f6",
        children: [
            { name: "Super Bowl", size: 25000, drift: 0.09, liquidityRatio: 0.88, volatilityEdge: 0.07, image: "🏈" },
            { name: "World Cup", size: 22000, drift: 0.04, liquidityRatio: 0.82, volatilityEdge: 0.09, image: "⚽" }
        ]
    }
];

// Mock trending markets for dashboard
export const mockTrendingMarkets = [
    {
        id: "market-1",
        title: "Bitcoin $100k by EOY",
        category: "Crypto",
        resolutionDate: "Dec 31, 2024",
        probability: 0.45,
        probabilityDrift: 2.3,
        volumeGrowth24h: 145.6,
        currentVolume: "$2.5M",
        sparklineData: [0.42, 0.44, 0.43, 0.46, 0.45, 0.47, 0.45]
    },
    {
        id: "market-2",
        title: "Trump wins 2024 Election",
        category: "Politics",
        resolutionDate: "Nov 5, 2024",
        probability: 0.52,
        probabilityDrift: -1.8,
        volumeGrowth24h: 89.2,
        currentVolume: "$8.1M",
        sparklineData: [0.54, 0.53, 0.52, 0.51, 0.52, 0.53, 0.52]
    },
    {
        id: "market-3",
        title: "Chiefs win Super Bowl",
        category: "Sports",
        resolutionDate: "Feb 9, 2025",
        probability: 0.58,
        probabilityDrift: 3.1,
        volumeGrowth24h: 67.8,
        currentVolume: "$3.2M",
        sparklineData: [0.55, 0.57, 0.56, 0.58, 0.57, 0.59, 0.58]
    },
    {
        id: "market-4",
        title: "Fed cuts rates in Q1",
        category: "Economics",
        resolutionDate: "Mar 31, 2024",
        probability: 0.38,
        probabilityDrift: -0.9,
        volumeGrowth24h: 54.3,
        currentVolume: "$1.8M",
        sparklineData: [0.41, 0.39, 0.40, 0.38, 0.39, 0.37, 0.38]
    },
    {
        id: "market-5",
        title: "Ethereum $5k by June",
        category: "Crypto",
        resolutionDate: "Jun 30, 2024",
        probability: 0.62,
        probabilityDrift: 4.2,
        volumeGrowth24h: 123.7,
        currentVolume: "$4.1M",
        sparklineData: [0.58, 0.60, 0.59, 0.61, 0.62, 0.63, 0.62]
    }
];

// Mock markets for store
export const mockMarkets = [
    {
        id: "market-1",
        question: "Will Bitcoin reach $100k by EOY 2024?",
        conditionId: "0x123456789",
        slug: "bitcoin-100k-2024",
        endDate: "2024-12-31T23:59:59Z",
        startDate: "2024-01-01T00:00:00Z",
        image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400",
        icon: "₿",
        description: "Bitcoin price prediction market",
        outcomes: "[\"Yes\", \"No\"]",
        outcomePrices: "[\"0.45\", \"0.55\"]",
        volume: "$2.5M",
        volumeNum: 2500000,
        liquidity: 500000,
        active: true,
        closed: false,
        rewardsMinSize: 10,
        rewardsMaxSpread: 5,
        spread: 2.1,
        bestAsk: 0.47,
        lastTradePrice: 0.46
    },
    {
        id: "market-2",
        question: "Who will win the 2024 US Presidential Election?",
        conditionId: "0x987654321",
        slug: "us-presidential-2024",
        endDate: "2024-11-05T23:59:59Z",
        startDate: "2024-01-01T00:00:00Z",
        image: "https://images.unsplash.com/photo-1540910419868-47ed94a0b462?w=400",
        icon: "🇺🇸",
        description: "US Presidential Election winner prediction",
        outcomes: "[\"Trump\", \"Biden\", \"Other\"]",
        outcomePrices: "[\"0.55\", \"0.35\", \"0.10\"]",
        volume: "$8.1M",
        volumeNum: 8100000,
        liquidity: 1500000,
        active: true,
        closed: false,
        rewardsMinSize: 5,
        rewardsMaxSpread: 3,
        spread: 1.8,
        bestAsk: 0.57,
        lastTradePrice: 0.56
    }
];

// Mock events for store
export const mockEvents = [
    {
        id: "event-1",
        ticker: "BTC-100K",
        slug: "bitcoin-100k-prediction",
        title: "Bitcoin $100k Prediction",
        description: "Will Bitcoin reach $100,000 by end of 2024?",
        image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400",
        icon: "₿",
        category: "Crypto",
        subcategory: "Price Prediction",
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-12-31T23:59:59Z",
        volume: "$2.5M",
        volumeNum: 2500000,
        active: true,
        closed: false,
        featured: true,
        promoted: false,
        markets: [mockMarkets[0]]
    },
    {
        id: "event-2",
        ticker: "US-2024",
        slug: "us-presidential-election-2024",
        title: "2024 US Presidential Election",
        description: "Who will win the 2024 US Presidential Election?",
        image: "https://images.unsplash.com/photo-1540910419868-47ed94a0b462?w=400",
        icon: "🇺🇸",
        category: "Politics",
        subcategory: "Election",
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-11-05T23:59:59Z",
        volume: "$8.1M",
        volumeNum: 8100000,
        active: true,
        closed: false,
        featured: true,
        promoted: true,
        markets: [mockMarkets[1]]
    }
];

// Mock user profile values
export const userProfileValues = {
    username: "trader123",
    email: "trader@example.com",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    totalVolume: 125000,
    totalPnL: 8750,
    winRate: 0.67,
    favoriteCategories: ["Crypto", "Politics", "Sports"],
    riskTolerance: "medium",
    autoTradeEnabled: false,
    rank: 47,
    balance: 45230,
    pnlDay: 1250,
    pnlTotal: 8750,
    positions: 12
};

// Mock chart data for dashboard
export const mockChartData = [
    { date: '00:00', yes: 45, no: 55 },
    { date: '04:00', yes: 47, no: 53 },
    { date: '08:00', yes: 44, no: 56 },
    { date: '12:00', yes: 48, no: 52 },
    { date: '16:00', yes: 46, no: 54 },
    { date: '20:00', yes: 49, no: 51 },
    { date: '24:00', yes: 47, no: 53 }
];

// Mock top traders for dashboard
export const mockTopTraders = [
    { rank: 1, name: "CryptoWhale", pnl: 45230 },
    { rank: 2, name: "PoliticsPro", pnl: 38750 },
    { rank: 3, name: "SportsGuru", pnl: 32180 },
    { rank: 4, name: "MarketMaster", pnl: 28950 },
    { rank: 5, name: "RiskTaker", pnl: 25640 },
    { rank: 6, name: "TrendHunter", pnl: 22480 },
    { rank: 7, name: "OddsOracle", pnl: 19870 },
    { rank: 8, name: "BetKing", pnl: 17650 },
    { rank: 9, name: "ProphetAI", pnl: 15230 },
    { rank: 10, name: "LuckyBet", pnl: 12890 }
];