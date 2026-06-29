

// --- Polymarket API Types ---

export interface PricePoint {
    t: number; // timestamp
    p: number; // price
}

export interface MultiPriceResponse {
    history: {
        [clobTokenId: string]: PricePoint[];
    }
}

export interface OrderbookLevel {
    price: string;
    size: string;
}

export interface Orderbook {
    bids: OrderbookLevel[];
    asks: OrderbookLevel[];
    market?: string;           // Market condition ID
    asset_id?: string;         // Token ID (asset ID)
    timestamp?: string;        // Timestamp of the order book snapshot
    hash?: string;             // Hash of the order book summary
    min_order_size?: string;   // Minimum order size
    tick_size?: string;        // Minimum price increment (tick size)
    neg_risk?: boolean;        // Whether negative risk is enabled for this market
    last_trade_price?: string; // Last trade price
}

// --- Clean Event Data Contract ---

export type LayoutType = 'POLL' | 'SPORTS' | 'SPORTS_GROUP' | 'BINARY';

export interface Outcome {
    id?: string;         // Optional - generated during mapping if not provided by API
    label: string;       // e.g. "Trump" or "Yes"
    price: number;       // 0.55 (0.00 - 1.00)
    image?: string;      // URL for candidate/team logo
    color?: string;      // Hex color from API for visual differentiation
    change24h?: number;  // 0.05 (+5%)
    isWinner?: boolean;  // If true, highlight this row (Backend calculated)
    sportsMarketType?: string; // For sports events: "winner", "over/under", etc.
    clobTokenIds: string; // "[\"115556263888245616435851357148058235707004733438163639091106356867234218207169\", \"77121637225348873006259930776623502125079210522997384841464684944292365296940\"]"
}

/** Stats for the CleanEvent contract */
export interface MarketStats {
    volumeUSD: string;       // "$1.2m" (Pre-formatted string)
    spreadBP?: number;       // Basis Points (e.g., 15)
    isWhaleAction?: boolean; // True = Whale activity indicator from API
}

/** Participant for enriched display data */
export interface Participant {
    name: string;
    imageUrl: string;
    color?: string;
    role: 'home' | 'away' | 'player_1' | 'player_2';
    probability?: number;    // Optional - planned API addition, handle gracefully
}

export interface CleanEvent {
    id: string;
    title: string;
    ticker: string;          // "TRUMP-2024"
    layout: LayoutType;
    isLive: boolean;         // True = Green Dot, False = Gray
    endDate: string;         // ISO date string
    startTime: string;         // ISO date string
    image?: string;          // Event thumbnail image
    description?: string;    // Event description from subtitle field
    stats: MarketStats;
    statusBadge?: string;    // e.g. "HOT" - optional badge from API
    volume24hrClob: number;
    liquidityClob: number;
    liquidity: number;
    startDate: string;
    negRisk?: boolean;       // Whether this is a negative risk market
    conditionId?: string;    // Market condition ID for API calls

    // The backend puts the correct data here based on layout.
    // You just render what exists.
    displayData: {
        outcomes?: Outcome[];          // ALL types (now including SPORTS)
        participants?: Participant[];   // SPORTS and SPORTS_GROUP (enrichment)
    };
}

// --- Holders API Types ---

export interface Holder {
    proxyWallet: string;           // Address (0x-prefixed, 40 hex chars)
    bio?: string;                  // User bio
    asset: string;                 // Asset identifier
    pseudonym?: string;            // Pseudonym/username
    amount: number;                // Amount held
    displayUsernamePublic: boolean;// Whether to display username publicly
    outcomeIndex: number;          // Outcome index (0 for YES, 1 for NO)
    name?: string;                 // Display name
    profileImage?: string;         // Profile image URL
    profileImageOptimized?: string;// Optimized profile image URL
}

export interface MetaHolder {
    token: string;                 // Token identifier
    holders: Holder[];             // List of holders for this token
}

export interface TopHoldersResponse {
    holders: MetaHolder[];         // Array of holder data per token
}

