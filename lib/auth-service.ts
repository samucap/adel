/**
 * Auth API Service
 * Uses backend endpoints configured via NEXT_BASE_API_URL.
 */

export interface AuthUser {
    id: string
    name: string
    email: string
    avatar: string
}

export interface AuthResponse {
    token: string
    user: AuthUser
}

interface JwtPayload {
    sub?: string
    name?: string
    email?: string
    picture?: string
}

const REQUEST_TIMEOUT_MS = 10000

function getApiBaseUrl(): string {
    // Prefer NEXT_PUBLIC_* so the value is available in the browser bundle for client auth.
    // NEXT_BASE_API_URL may be set for server-only contexts.
    const base =
        process.env.NEXT_PUBLIC_BASE_API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_BASE_API_URL ||
        "/api"
    return base.replace(/\/+$/, "")
}

function buildAuthUrl(path: string): string {
    const base = getApiBaseUrl()
    if (base === "/api") {
        return `/api${path}`
    }

    if (base.endsWith("/api")) {
        return `${base}${path}`
    }

    return `${base}/api${path}`
}

function parseJwtPayload(token: string): JwtPayload {
    const parts = token.split(".")
    if (parts.length < 2) {
        throw new Error("Invalid token")
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
    return JSON.parse(atob(padded)) as JwtPayload
}

function userFromToken(token: string): AuthUser {
    const payload = parseJwtPayload(token)
    return {
        id: payload.sub ?? payload.email ?? "unknown",
        name: payload.name ?? payload.email ?? "User",
        email: payload.email ?? "",
        avatar: payload.picture ?? "/avatar.png",
    }
}

function parseAuthResponse(data: unknown): AuthResponse {
    if (typeof data !== "object" || data === null) {
        throw new Error("Invalid authentication response")
    }

    const token =
        "token" in data && typeof data.token === "string" ? data.token : null
    if (!token) {
        throw new Error("Authentication token missing from response")
    }

    const user =
        "user" in data && typeof data.user === "object" && data.user !== null
            ? (data.user as AuthUser)
            : userFromToken(token)

    return { token, user }
}

function parseRefreshResponse(data: unknown): string {
    if (typeof data === "string") {
        return data
    }
    if (typeof data === "object" && data !== null && "token" in data && typeof data.token === "string") {
        return data.token
    }
    throw new Error("Invalid refresh response")
}

function mapNetworkError(err: unknown): Error {
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
                "Cannot reach the API server. If you are developing locally, start the backend and verify NEXT_BASE_API_URL (e.g. http://localhost:8080)."
            )
        }
        return err
    }
    return new Error("Network request failed")
}

async function fetchJsonWithTimeout<T>(url: string, init?: RequestInit): Promise<T> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
        const res = await fetch(url, {
            ...init,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...init?.headers,
            },
        })

        if (!res.ok) {
            let message = `Request failed (${res.status})`
            try {
                const data = (await res.json()) as { message?: string; error?: string }
                message = data.message || data.error || message
            } catch {
                // ignore non-json error body
            }
            throw new Error(message)
        }

        const contentType = res.headers.get("content-type") || ""
        if (contentType.includes("application/json")) {
            return (await res.json()) as T
        }

        return (await res.text()) as T
    } catch (err) {
        throw mapNetworkError(err)
    } finally {
        clearTimeout(timeout)
    }
}

/** User-facing message for any thrown auth/network error */
export function formatAuthError(err: unknown): string {
    return mapNetworkError(err).message
}

export const authApi = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const data = await fetchJsonWithTimeout<unknown>(buildAuthUrl("/auth"), {
            method: "POST",
            body: JSON.stringify({ email, password }),
        })
        return parseAuthResponse(data)
    },

    async register(email: string, password: string): Promise<AuthResponse> {
        const data = await fetchJsonWithTimeout<unknown>(buildAuthUrl("/auth/signup"), {
            method: "POST",
            body: JSON.stringify({ email, password }),
        })
        return parseAuthResponse(data)
    },

    async verify(token: string): Promise<AuthUser> {
        if (!token) {
            throw new Error("No token provided")
        }
        return userFromToken(token)
    },

    async refresh(token: string): Promise<string> {
        if (!token) {
            throw new Error("No token to refresh")
        }

        const data = await fetchJsonWithTimeout<unknown>(buildAuthUrl("/auth/refresh"), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return parseRefreshResponse(data)
    },

    async logout(token: string): Promise<void> {
        if (!token) {
            return
        }

        await fetchJsonWithTimeout<unknown>(buildAuthUrl("/auth/logout"), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    },
}
