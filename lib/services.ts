import { Event, Market, Category } from "@/types/dashboard"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

/**
 * Fetch top navigation categories
 */
export async function fetchCats(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/top-nav`)

    if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }

    return await response.json()
}

/**
 * Fetch events with optional category filter and sorting
 */
export async function fetchEvents(category?: string, order?: string): Promise<Event[]> {
    const params = new URLSearchParams()
    if (category) params.set("cat", category)
    if (order) params.set("order", order)

    const url = `${API_BASE_URL}/events?${params.toString()}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`)
    }

    return await response.json()
}

/**
 * Fetch market details by ID
 */
export async function fetchMarketById(id: string): Promise<Market | null> {
    const response = await fetch(`${API_BASE_URL}/markets/${id}`)

    if (!response.ok) {
        throw new Error(`Failed to fetch market: ${response.statusText}`)
    }

    return await response.json()
}
