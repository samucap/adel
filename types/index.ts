

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
    stats: MarketStats;
    statusBadge?: string;    // e.g. "HOT" - optional badge from API
    volume24hrClob: number;
    liquidityClob: number;
    liquidity: number;

    // The backend puts the correct data here based on layout.
    // You just render what exists.
    displayData: {
        outcomes?: Outcome[];          // ALL types (now including SPORTS)
        participants?: Participant[];   // SPORTS and SPORTS_GROUP (enrichment)
    };
}

