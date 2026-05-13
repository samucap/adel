/**
 * Centralized API client for protected routes.
 *
 * - Attaches `Authorization: Bearer <token>` from in-memory auth store.
 * - Sends `credentials: "include"` so HttpOnly cookies travel with every request.
 * - On 401, silently refreshes via the cookie-based refresh endpoint and retries once.
 * - Concurrent 401s share a single in-flight refresh (concurrency guard).
 */

import { getAccessToken, useAuthStore } from "@/stores/authStore"
import { AuthApiError } from "@/lib/auth-service"

const REQUEST_TIMEOUT_MS = 10_000
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

let refreshPromise: Promise<void> | null = null

async function doRefresh(): Promise<void> {
    try {
        await useAuthStore.getState().refreshSession()
    } catch (err) {
        if (err instanceof AuthApiError && err.status === 401) {
            await useAuthStore.getState().logout()
            if (typeof window !== "undefined") {
                window.location.replace("/login")
            }
        }
        throw err
    }
}

async function singleFlightRefresh(): Promise<void> {
    if (!refreshPromise) {
        refreshPromise = doRefresh().finally(() => {
            refreshPromise = null
        })
    }
    return refreshPromise
}

async function rawFetch(url: string, init?: RequestInit): Promise<Response> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const token = getAccessToken()
    const authHeaders: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {}

    try {
        return await fetch(url, {
            ...init,
            credentials: "include",
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...authHeaders,
                ...init?.headers,
            },
        })
    } finally {
        clearTimeout(timeout)
    }
}

/**
 * Fetch JSON from a protected API endpoint. Handles 401 → refresh → retry.
 */
export async function apiFetch<T>(
    path: string,
    init?: RequestInit,
): Promise<T> {
    const url = `${API_BASE}${path}`
    let res = await rawFetch(url, init)

    if (res.status === 401) {
        try {
            await singleFlightRefresh()
        } catch {
            throw new Error(`API 401: Unauthorized`)
        }

        res = await rawFetch(url, init)

        if (!res.ok) {
            throw new Error(`API ${res.status}: ${res.statusText}`)
        }
    } else if (!res.ok) {
        throw new Error(`API ${res.status}: ${res.statusText}`)
    }

    return res.json() as Promise<T>
}
