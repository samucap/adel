export interface Market {
    id: string;
    question: string;
    conditionId: string;
    slug: string;
    endDate: string;
    startDate: string;
    image: string;
    icon: string;
    description: string;
    outcomes: string; // JSON string array "[\"Yes\", \"No\"]"
    outcomePrices: string; // JSON string array "[\"0.5\", \"0.5\"]"
    volume: string;
    volumeNum: number;
    liquidity?: number;
    active: boolean;
    closed: boolean;
    rewardsMinSize: number;
    rewardsMaxSpread: number;
    spread: number;
    bestAsk: number;
    lastTradePrice: number;
    createdAt?: string;
}

export interface Event {
    id: string;
    ticker: string;
    slug: string;
    title: string;
    description: string;
    startDate: string;
    creationDate: string;
    endDate: string;
    image: string;
    icon: string;
    active: boolean;
    closed: boolean;
    archived: boolean;
    new: boolean;
    featured: boolean;
    restricted: boolean;
    liquidity: number;
    volume: number;
    openInterest: number;
    sortBy: string;
    createdAt: string;
    updatedAt: string;
    competitive: number;
    volume24hr: number;
    volume1wk: number;
    volume1mo: number;
    volume1yr: number;
    enableOrderBook: boolean;
    liquidityClob: number;
    negRisk: boolean;
    negRiskMarketID: string;
    commentCount: number;
    markets: Market[];
}

export interface UserPosition {
    asset: string;
    side: "YES" | "NO";
    size: number;
    avgPrice: number;
    currentPrice: number;
    pnl: number;
}

export interface UserActivity {
    id: string;
    type: "BUY" | "SELL";
    asset: string;
    side: "YES" | "NO";
    amount: number;
    price: number;
    timestamp: string;
}

export interface UserProfile {
    username: string;
    address: string;
    avatar: string;
    totalVolume: number;
    totalPnl: number;
    positions: UserPosition[];
    activity: UserActivity[];
}

export interface Category {
    id: string
    slug: string
    label: string
    related: Category[]
}

