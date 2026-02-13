
/** 
 * Event types supported by the API
 * - binary: Single Yes/No question
 * - sports: Match with moneyline, spreads, maps
 * - election: Mutually exclusive candidates (negRisk) - only ONE wins
 * - multi: Group of independent questions - ANY can be Yes
 */
export type EventType = 'binary' | 'sports' | 'election' | 'multi';

/** Sports market subtypes */
export type SportsMarketType = 'moneyline' | 'spread' | 'total' | 'map_handicap' | 'map';

export interface MarketStats {
    volumeUSD: string;
    liquidityRating: 'low' | 'med' | 'high';
    spreadBp?: number | null;
    change24h: number;
    isHot: boolean;
}

/**
 * A single outcome within a market
 */
export interface MarketOutcome {
    /** Display label for this outcome */
    label: string;
    /** Probability as decimal (0.0 to 1.0) */
    price: number;
    /** Optional image for the outcome (Frontend extension) */
    image?: string;
}

/**
 * A market within an event
 */
export interface Market {
    /** Unique market identifier */
    id: string;
    /** Market question */
    question: string;
    /** For elections: candidate name. For sports: market label */
    groupItemTitle?: string;
    /** For sports: type of market */
    marketType?: SportsMarketType;
    /** Possible outcomes */
    outcomes: MarketOutcome[];
    /** Market liquidity */
    liquidity?: number;
}

/**
 * An event from the /events endpoint (Orion API)
 */
export interface Event {
    /** Unique event identifier */
    id: string;
    /** Classification for UI rendering logic */
    type: EventType;
    /** Event title */
    title: string;
    /** URL-safe identifier */
    slug: string;
    /** ISO 8601 date string */
    startDate: string;
    /** Event image URL */
    image?: string;

    /** Primary market for this event */
    primaryMarket: Market;

    /** Secondary markets */
    markets: Market[];

    // --- Frontend Extensions (Computed by Adapter) ---
    stats: MarketStats;
    teams?: { name: string; code: string; image: string }[];
    chartData?: number[];
    featured?: boolean;
    liquidityClob?: number;
    rewards?: {
        minSize: number;
        maxSpread: number;
        amount: number;
    };
    negRisk?: boolean;
}
