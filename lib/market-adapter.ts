import { Event as DashboardEvent, Market } from "@/types/dashboard";
import { Event as FeedEvent, Market as OrionMarket, MarketOutcome, EventType, MarketStats, SportsMarketType } from "@/types/index";

export function adaptDashboardEvents(events: DashboardEvent[]): FeedEvent[] {
    if (!events) return [];
    return events.map(adaptEvent);
}

function adaptEvent(entry: DashboardEvent): FeedEvent {
    const rawMarkets = entry.markets || [];

    // 1. Determine Event Type & Grouping
    let type: EventType = 'binary';
    let isSports = entry.slug?.includes('vs') || entry.title?.includes('vs');

    if (entry.negRisk) {
        type = 'election';
    } else if (isSports) {
        type = 'sports';
    } else if (rawMarkets.length > 1) {
        type = 'multi';
    }

    const safeParse = (data: any) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to parse data:", data, e);
            return [];
        }
    };

    // 2. Process Markets (Adapt raw markets to Orion Market interface)
    const adaptedMarkets: OrionMarket[] = rawMarkets.map((m, idx) => {
        const outcomesRaw = safeParse(m.outcomes);
        const pricesRaw = safeParse(m.outcomePrices);

        const outcomes: MarketOutcome[] = outcomesRaw.map((label: any, i: number) => {
            const labelStr = String(label);
            const price = parseFloat(String(pricesRaw[i] || "0"));
            return {
                label: labelStr,
                price: isNaN(price) ? 0 : price,
                // Image handling if needed
            };
        });

        // Determine Market Type for Sports
        let marketType: SportsMarketType | undefined = undefined;
        if (isSports) {
            const q = (m.question || "").toLowerCase();
            if (q.includes("spread")) marketType = 'spread';
            else if (q.includes("total") || q.includes("over/under")) marketType = 'total';
            else marketType = 'moneyline';
        }

        return {
            id: m.id,
            question: m.question,
            groupItemTitle: m.groupItemTitle,
            marketType,
            outcomes,
            liquidity: m.liquidity
        };
    });

    // 3. Assign Primary Market & Secondary Markets
    let primaryMarket: OrionMarket;
    let secondaryMarkets: OrionMarket[] = [];

    if (type === 'election' || type === 'multi') {
        const getYesPrice = (m: OrionMarket) => {
            const yes = m.outcomes.find(o => o.label.toLowerCase() === 'yes');
            return yes ? yes.price : 0;
        };

        // Use original order from API response without sorting
        primaryMarket = adaptedMarkets[0];
        secondaryMarkets = adaptedMarkets.slice(1);

    } else if (type === 'sports') {
        primaryMarket = adaptedMarkets.find(m => m.marketType === 'moneyline') || adaptedMarkets[0];
        secondaryMarkets = adaptedMarkets.filter(m => m.id !== primaryMarket?.id);
    } else {
        // Binary
        primaryMarket = adaptedMarkets[0] || { id: "mock", question: "Mock", outcomes: [] };
        secondaryMarkets = [];
    }

    // Safety checks
    if (!primaryMarket) {
        primaryMarket = { id: "error", question: "Error", outcomes: [] };
    }

    // 4. Stats
    const volumeFormatted = formatVolume(entry.volume);
    const liquidityRating = getLiquidityRating(entry.liquidity);

    const primaryRaw = rawMarkets.find(m => m.id === primaryMarket.id);
    const spreadBp = primaryRaw?.spread ? Math.round(primaryRaw.spread * 10000) : null;

    const stats: MarketStats = {
        volumeUSD: volumeFormatted,
        liquidityRating,
        spreadBp,
        change24h: calculateChange(entry),
        isHot: entry.volume24hr > 100000 || entry.featured,
    };

    return {
        id: entry.id,
        type,
        title: entry.title,
        slug: entry.slug,
        startDate: entry.startDate,
        image: entry.image,
        primaryMarket,
        markets: secondaryMarkets,
        stats,
        teams: entry.teams,
        featured: entry.featured,
        liquidityClob: entry.liquidityClob,
        // events from dashboard might not have rewards typed yet, but pass if exists
        rewards: (entry as any).rewards,
        negRisk: entry.negRisk,
    };
}

// Helpers

function formatVolume(vol: number): string {
    if (typeof vol !== 'number' || isNaN(vol)) return '$0';
    if (vol >= 1000000) {
        return `$${(vol / 1000000).toFixed(1)}m`;
    }
    if (vol >= 1000) {
        return `$${(vol / 1000).toFixed(1)}k`;
    }
    return `$${vol}`;
}

function getLiquidityRating(liq: number): 'low' | 'med' | 'high' {
    if (liq > 100000) return 'high';
    if (liq > 10000) return 'med';
    return 'low';
}

function calculateChange(event: DashboardEvent): number {
    return 5.4;
}
