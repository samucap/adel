import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api-client"

export interface DashboardStats {
    marketsAsOf: string
    tradesAsOf: string
    tvl: number
    volume24h: number
    openInterest: number
    openInterestChange: number | null
    activeTraders: number
    activeTradersChange: number | null
    fees24h: number | null
    activeMarkets: number
}

export interface TrendingMarket {
    id: string
    title: string
    category: string
    endDate: string
    probability: number
    drift: number
    volume24h: number
    sparkline: number[]
}

export interface DashboardActivity {
    id: string
    user: string
    action: "buy" | "sell"
    market: string
    outcome: string
    shares: number
    time: string
}

export interface TreemapLeaf {
    category: string
    name: string
    size: number
    drift: number
    liquidityRatio: number
}

export interface EdgePoint {
    name: string
    category: string
    edgeBps: number
    spread: number
    volume24h: number
}

export interface WhaleRow {
    rank: number
    account: string
    netFlow: number
}

export interface DepthLevel {
    type: "bid" | "ask"
    price: number
    size: number
}

export interface CorrelationResponse {
    links: { source: string; target: string; value: number }[]
}

export function useDashboard<T>(path: string) {
    return useQuery({
        queryKey: ["dashboard", path],
        queryFn: () => apiFetch<T>(path),
    })
}

export function formatUsd(value: number) {
    const abs = Math.abs(value)
    const sign = value < 0 ? "-" : ""
    if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}k`
    return `${sign}$${abs.toFixed(0)}`
}

export function formatAsOf(iso: string) {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return ""
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export function formatPercentChange(ratio: number | null) {
    if (ratio == null || Number.isNaN(ratio)) return null
    const pct = ratio * 100
    const sign = pct > 0 ? "+" : ""
    return `${sign}${pct.toFixed(1)}%`
}
