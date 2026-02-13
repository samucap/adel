import { Event } from "@/types";

export const MOCK_EVENTS: Event[] = [
    {
        id: "1",
        type: "binary", // Assuming type based on other events
        title: "Will Bitcoin hit $100k in 2024?",
        slug: "btc-100k-2024",
        startDate: "2024-01-01T00:00:00Z",
        image: "https://images.unsplash.com/photo-1621509208237-f94680214f4e?auto=format&fit=crop&q=80&w=200&h=200", // Added a placeholder image
        featured: true,
        chartData: [40, 42, 45, 48, 47, 50, 52, 55, 58, 60, 59, 62, 65, 68, 70],
        primaryMarket: {
            id: "mkt_btc_1",
            question: "Bitcoin $100k",
            outcomes: [
                { label: "Yes", price: 0.45 },
                { label: "No", price: 0.55 }
            ]
        },
        markets: [],
        stats: {
            volumeUSD: "$2.5m", // Using volume from the snippet
            liquidityRating: "high",
            spreadBp: 18,
            change24h: 5.1,
            isHot: true
        }
    },
    {
        id: "evt_bi_1",
        type: "binary",
        title: "Will the Fed cut rates in March?",
        slug: "fed-rates-march-2024",
        startDate: "2024-03-20T18:00:00Z",
        image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=200&h=200",
        primaryMarket: {
            id: "mkt_1",
            question: "Fed Rate Cut",
            outcomes: [
                { label: "Yes", price: 0.65 },
                { label: "No", price: 0.35 }
            ]
        },
        markets: [],
        stats: {
            volumeUSD: "$1.2m",
            liquidityRating: "high",
            spreadBp: 15,
            change24h: 3.2,
            isHot: true
        }
    },
    {
        id: "evt_sp_1",
        type: "sports",
        title: "Chiefs vs 49ers",
        slug: "chiefs-vs-49ers-superbowl",
        startDate: "2024-02-11T23:30:00Z",
        image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=200&h=200",
        teams: [
            { name: "Chiefs", code: "KC", image: "https://upload.wikimedia.org/wikipedia/en/e/e1/Kansas_City_Chiefs_logo.svg" },
            { name: "49ers", code: "SF", image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/San_Francisco_49ers_logo.svg" }
        ],
        primaryMarket: {
            id: "mkt_sp_ml",
            question: "Moneyline",
            outcomes: [
                { label: "Chiefs", price: 0.52 },
                { label: "49ers", price: 0.48 }
            ]
        },
        markets: [
            {
                id: "mkt_sp_spr",
                question: "Spread -3.5",
                marketType: "spread",
                outcomes: [{ label: "Chiefs -3.5", price: 0.5 }, { label: "49ers +3.5", price: 0.5 }]
            }
        ],
        stats: {
            volumeUSD: "$5.4m",
            liquidityRating: "high",
            spreadBp: 20,
            change24h: 0.5,
            isHot: true
        }
    },
    {
        id: "evt_el_1",
        type: "election",
        title: "2024 Republican Nominee",
        slug: "gop-nominee-2024",
        startDate: "2024-07-15T00:00:00Z",
        image: "https://images.unsplash.com/photo-1540910419868-47ed94a0b462?auto=format&fit=crop&q=80&w=200&h=200",
        primaryMarket: {
            id: "mkt_el_dt",
            groupItemTitle: "Donald Trump",
            question: "Donald Trump Nominee",
            outcomes: [{ label: "Yes", price: 0.72 }, { label: "No", price: 0.28 }]
        },
        markets: [
            {
                id: "mkt_el_nh",
                groupItemTitle: "Nikki Haley",
                question: "Nikki Haley Nominee",
                outcomes: [{ label: "Yes", price: 0.15 }, { label: "No", price: 0.85 }]
            },
            {
                id: "mkt_el_rds",
                groupItemTitle: "Ron DeSantis",
                question: "Ron DeSantis Nominee",
                outcomes: [{ label: "Yes", price: 0.05 }, { label: "No", price: 0.95 }]
            }
        ],
        stats: {
            volumeUSD: "$8.1m",
            liquidityRating: "high",
            spreadBp: 10,
            change24h: 12.5,
            isHot: true
        }
    }
];
