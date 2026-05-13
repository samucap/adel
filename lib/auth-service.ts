/**
 * Auth API Service
 *
 * Talks to the Go backend auth endpoints. Refresh and logout use HttpOnly
 * cookie-based refresh tokens (credentials: "include"); the access JWT is
 * returned in the response body and stored in-memory only.
 */

export interface AuthUser {
    id: string
    name: string
    email: string
    avatar: string
}

export interface AuthTokenResponse {
    token: string
    expires_at: string
}

interface JwtPayload {
    sub?: string
    name?: string
    email?: string
    picture?: string
}

const REQUEST_TIMEOUT_MS = 10_000
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

function authUrl(path: string): string {
    return `${API_BASE}/auth${path}`
}

// ---------------------------------------------------------------------------
// JWT helpers
// ---------------------------------------------------------------------------

function parseJwtPayload(token: string): JwtPayload {
    const parts = token.split(".")
    if (parts.length < 2) throw new Error("Invalid token")

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
    return JSON.parse(atob(padded)) as JwtPayload
}

export function userFromToken(token: string): AuthUser {
    const p = parseJwtPayload(token)
    return {
        id: p.sub ?? p.email ?? "unknown",
        name: p.name ?? p.email ?? "User",
        email: p.email ?? "",
        avatar: p.picture ?? "/avatar.png",
    }
}

// ---------------------------------------------------------------------------
// Network / error helpers
// ---------------------------------------------------------------------------

export class AuthApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
    ) {
        super(message)
        this.name = "AuthApiError"
    }
}

function mapNetworkError(err: unknown): Error {
    if (err instanceof AuthApiError) return err
    if (err instanceof Error) {
        const msg = err.message
        if (err.name === "AbortError" || /aborted/i.test(msg)) {
            return new Error("Request timed out. Try again.")
        }
        if (
            /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|ECONNRESET|ECONNABORTED/i.test(msg) ||
            msg === "Failed to fetch" ||
            /network|fetch failed/i.test(msg)
        ) {
            return new Error(
                "Cannot reach the server. Check your connection or ensure the backend is running."
            )
        }
        return err
    }
    return new Error("Network request failed")
}

export function formatAuthError(err: unknown): string {
    return mapNetworkError(err).message
}

// ---------------------------------------------------------------------------
// Low-level fetch (used only by auth endpoints, NOT for protected routes)
// ---------------------------------------------------------------------------

async function authFetch<T>(url: string, init?: RequestInit): Promise<T> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
        const res = await fetch(url, {
            ...init,
            credentials: "include",
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...init?.headers,
            },
        })

        if (!res.ok) {
            let message = `Request failed (${res.status})`
            try {
                const data = (await res.json()) as { error?: string; message?: string }
                message = data.error || data.message || message
            } catch {
                // non-json body
            }

            if (res.status === 429) {
                throw new AuthApiError("Too many attempts, please wait.", 429)
            }
            if (res.status === 409) {
                throw new AuthApiError("Email already registered.", 409)
            }
            if (res.status === 401) {
                throw new AuthApiError(message, 401)
            }
            throw new AuthApiError(message, res.status)
        }

        if (res.status === 204) {
            return undefined as T
        }

        return (await res.json()) as T
    } catch (err) {
        throw mapNetworkError(err)
    } finally {
        clearTimeout(timeout)
    }
}

// ---------------------------------------------------------------------------
// Response parsing
// ---------------------------------------------------------------------------

function parseTokenResponse(data: unknown): AuthTokenResponse {
    if (typeof data !== "object" || data === null) {
        throw new Error("Invalid authentication response")
    }

    const obj = data as Record<string, unknown>
    if (typeof obj.token !== "string" || !obj.token) {
        throw new Error("Authentication token missing from response")
    }
    if (typeof obj.expires_at !== "string" || !obj.expires_at) {
        throw new Error("Token expiry missing from response")
    }

    return { token: obj.token, expires_at: obj.expires_at }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const authApi = {
    async login(email: string, password: string): Promise<AuthTokenResponse> {
        const data = await authFetch<unknown>(authUrl(""), {
            method: "POST",
            body: JSON.stringify({ email, password }),
        })
        return parseTokenResponse(data)
    },

    async signup(email: string, password: string): Promise<AuthTokenResponse> {
        const data = await authFetch<unknown>(authUrl("/signup"), {
            method: "POST",
            body: JSON.stringify({ email, password }),
        })
        return parseTokenResponse(data)
    },

    async refreshToken(): Promise<AuthTokenResponse> {
        const data = await authFetch<unknown>(authUrl("/refresh-token"), {
            method: "POST",
        })
        return parseTokenResponse(data)
    },

    async logout(): Promise<void> {
        await authFetch<void>(authUrl("/logout-token"), {
            method: "POST",
        })
    },
}
