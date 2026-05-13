import { Category, Market } from "@/types/dashboard"
import { CleanEvent, Outcome, LayoutType } from "@/types"
import type { FilterOptions } from "./store"
import { apiFetch } from "./api-client"

/**
 * Fetch top navigation categories
 */
export async function fetchCats(): Promise<Category[]> {
    return apiFetch<Category[]>("/top-nav")
}

// Market details are now available from events-v2 response, no need for separate API calls

/**
 * API response shape from /events-v2 (matches orion2.0 V2Event)
 */
interface EventResponse {
    endDate: string;
    startTime: string;
    liquidityClob: number;
    liquidity: number;
    id: string;
    title: string;
    subtitle?: string;
    image?: string;
    originalImage?: string;
    totalVolume: number;
    displayType: 'binary' | 'group' | 'sports' | 'sports_group';
    isLive: boolean;
    statusBadge: string;
    negRisk?: boolean;
    stats: {
        volumeUSD: string;
        spreadBP: number;
        isWhaleAction: boolean;
    };
    outcomes: Array<{
        marketId: string;
        label: string;
        probability: number;
        price?: number;
        bestBid?: number;
        bestAsk?: number;
        liquidity?: number;
        volume24hr?: number;
        status: string;
        color: string;
        image: string;
        sportsMarketType?: string;
        clobTokenIds: string;
    }>;
    displayData?: {
        type: string;
        participants: Array<{
            name: string;
            imageUrl: string;
            color?: string;
            role: 'home' | 'away' | 'player_1' | 'player_2';
        }>;
        compositeImage?: string;
    };
}

/**
 * Fetch events from the API (localhost:8080/events)
 * Maps the response to CleanEvent[] using server-provided data
 */
export async function fetchEvents(category?: string, filters?: FilterOptions, order?: string, ascending?: boolean): Promise<CleanEvent[]> {
    const params = new URLSearchParams()
    if (category) params.set("cat", category)

    // Sort params
    if (order) params.set("order", order)
    if (ascending !== undefined) params.set("ascending", String(ascending))

    // Append filter query params
    if (filters) {
        if (filters.tag_id) params.set("tag_id", filters.tag_id)
        if (filters.end_date_max) params.set("end_date_max", filters.end_date_max)
        if (filters.start_date_min) params.set("start_date_min", filters.start_date_min)
        if (filters.liquidityMin !== undefined) params.set("liquidityMin", String(filters.liquidityMin))
        if (filters.volumeMin !== undefined) params.set("volumeMin", String(filters.volumeMin))
        if (filters.spread_max !== undefined) params.set("spread_max", String(filters.spread_max))
        if (filters.rewardMin !== undefined) params.set("rewardMin", String(filters.rewardMin))
        if (filters.active !== undefined) params.set("active", String(filters.active))
        if (filters.closed !== undefined) params.set("closed", String(filters.closed))
    }

    const qs = params.toString()
    const data: EventResponse[] = await apiFetch<EventResponse[]>(`/events-v2${qs ? `?${qs}` : ''}`)

    // Map API response to CleanEvent with simplified mapping
    return data.map((event): CleanEvent => {
        // Determine layout based on displayType
        let layout: LayoutType;
        if (event.displayType === 'sports') {
            layout = 'SPORTS';
        } else if (event.displayType === 'sports_group') {
            layout = 'SPORTS_GROUP';
        } else if (event.displayType === 'binary') {
            layout = 'BINARY';
        } else {
            layout = 'POLL'; // 'group' maps to POLL
        }

        // Map outcomes for ALL types (backend now provides outcomes for sports too)
        const outcomes: Outcome[] | undefined = event.outcomes?.length
            ? event.outcomes.map((o) => ({
                id: o.marketId,
                label: o.label,
                price: o.probability,
                image: o.image || undefined,
                color: o.color || undefined,
                sportsMarketType: o.sportsMarketType,
                isWinner: undefined,
                clobTokenIds: o.clobTokenIds,
            }))
            : undefined;

        // Map participants for sports events (enrichment data)
        const participants = event.displayData?.participants?.map(p => ({
            name: p.name,
            imageUrl: p.imageUrl,
            color: p.color,
            role: p.role,
        }));

        // Use server-provided data directly (simplified!)
        // TODO: need to return event object per types definition
        return {
            id: event.id,
            title: event.title,
            ticker: `EVT-${event.id}`,
            layout,
            isLive: event.isLive,                    // Direct from API
            image: event.image,
            description: event.subtitle,             // Event description from subtitle field
            statusBadge: event.statusBadge,          // Direct from API
            stats: {
                volumeUSD: event.stats?.volumeUSD || "0",    // Direct from API
                spreadBP: event.stats?.spreadBP,       // Direct from API
                isWhaleAction: event.stats?.isWhaleAction, // Direct from API
            },
            volume24hrClob: event.totalVolume || 0,
            liquidityClob: event.liquidityClob || 0,
            liquidity: event.liquidity || 0,
            negRisk: event.negRisk,
            displayData: {
                outcomes,                           // ALL types now
                participants,                       // Sports enrichment
            },
            endDate: event.endDate,
            startTime: event.startTime,
            startDate: event.startTime,
        };
    });
}
