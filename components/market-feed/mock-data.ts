import { CleanEvent } from "@/types";

const BASE_CLEAN_EVENTS: CleanEvent[] = [
    {
        id: "evt_poll_1",
        title: "2024 Republican Nominee",
        ticker: "GOP-2024",
        layout: 'POLL',
        isLive: true,
        image: "https://images.unsplash.com/photo-1540910419868-47ed94a0b462?auto=format&fit=crop&q=80&w=200&h=200",
        stats: {
            volumeUSD: "$8.1m",
            spreadBP: 10
        },
        volume24hrClob: 8100000,
        liquidityClob: 1500000,
        oneHourPriceChange: 0.05,
        oneDayPriceChange: -0.02,
        lastTradePrice: 0.72,
        displayData: {
            outcomes: [
                { id: "o1", label: "Donald Trump", price: 0.72, image: "https://images.unsplash.com/photo-1540910419868-47ed94a0b462?auto=format&fit=crop&q=80&w=200&h=200", change24h: 0.05 },
                { id: "o2", label: "Nikki Haley", price: 0.15, image: "https://images.unsplash.com/photo-1580128660010-fd027e1e587a?auto=format&fit=crop&q=80&w=200&h=200", change24h: -0.02 },
                { id: "o3", label: "Ron DeSantis", price: 0.05, change24h: 0.0 },
                { id: "o4", label: "Vivek Ramaswamy", price: 0.04, change24h: 0.0 }
            ]
        }
    },
    {
        id: "evt_sports_1",
        title: "Chiefs vs 49ers",
        ticker: "SB-LVIII",
        layout: 'SPORTS',
        isLive: true,
        image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=200&h=200",
        stats: {
            volumeUSD: "$5.4m",
            spreadBP: 20
        },
        volume24hrClob: 5400000,
        liquidityClob: 800000,
        oneHourPriceChange: 0.01,
        oneDayPriceChange: 0.03,
        lastTradePrice: 0.52,
        displayData: {
            outcomes: [
                { id: "o_kc", label: "Chiefs", price: 0.52, sportsMarketType: "winner" },
                { id: "o_sf", label: "49ers", price: 0.48, sportsMarketType: "winner" }
            ],
            participants: [
                { name: "Chiefs", imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/e1/Kansas_City_Chiefs_logo.svg", role: "home" },
                { name: "49ers", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3a/San_Francisco_49ers_logo.svg", role: "away" }
            ]
        }
    },
    {
        id: "evt_sports_soccer",
        title: "Arsenal vs Chelsea",
        ticker: "EPL-ARS-CHE",
        layout: 'SPORTS',
        isLive: true,
        image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200&h=200",
        stats: {
            volumeUSD: "$3.2m",
            spreadBP: 15
        },
        volume24hrClob: 3200000,
        liquidityClob: 500000,
        oneHourPriceChange: -0.01,
        oneDayPriceChange: -0.05,
        lastTradePrice: 0.45,
        displayData: {
            outcomes: [
                { id: "o_ars", label: "Arsenal", price: 0.45, sportsMarketType: "winner" },
                { id: "o_che", label: "Chelsea", price: 0.25, sportsMarketType: "winner" },
                { id: "o_draw", label: "Draw", price: 0.30, sportsMarketType: "draw" }
            ],
            participants: [
                { name: "Arsenal", imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg", role: "home" },
                { name: "Chelsea", imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg", role: "away" }
            ]
        }
    },
    {
        id: "evt_binary_1",
        title: "Will Bitcoin hit $100k in 2024?",
        ticker: "BTC-100K",
        layout: 'BINARY',
        isLive: true,
        image: "https://images.unsplash.com/photo-1621509208237-f94680214f4e?auto=format&fit=crop&q=80&w=200&h=200",
        stats: {
            volumeUSD: "$2.5m",
            spreadBP: 120
        },
        volume24hrClob: 2500000,
        liquidityClob: 300000,
        oneHourPriceChange: 0.02,
        oneDayPriceChange: 0.10,
        lastTradePrice: 0.45,
        displayData: {
            outcomes: [
                { id: "o_yes", label: "Yes", price: 0.45, change24h: 0.12 }
            ]
        }
    }
];

// Generate more events for the grid
export const MOCK_CLEAN_EVENTS: CleanEvent[] = [
    ...BASE_CLEAN_EVENTS,
    // Duplicate for grid fill
    ...BASE_CLEAN_EVENTS.map(e => ({ ...e, id: e.id + '_2', title: e.title + ' (Copy)', isLive: false })),
    ...BASE_CLEAN_EVENTS.map(e => ({ ...e, id: e.id + '_3', title: e.title + ' (Copy 2)', stats: { ...e.stats, spreadBP: 10 } })),
    ...BASE_CLEAN_EVENTS.map(e => ({ ...e, id: e.id + '_4', title: e.title + ' (Copy 3)' })),
    ...BASE_CLEAN_EVENTS.map(e => ({ ...e, id: e.id + '_5', title: e.title + ' (Copy 4)' })),
];

