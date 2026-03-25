/**
 * Client-side JWT storage key (must stay in sync with auth store).
 */
export const AUTH_TOKEN_STORAGE_KEY = "auth-token"

/**
 * Headers for authenticated calls to NEXT_PUBLIC_API_URL routes.
 * Safe on server: returns empty object (no localStorage).
 */
export function getClientAuthHeaders(): Record<string, string> {
    if (typeof window === "undefined") {
        return {}
    }
    const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
    if (!token) {
        return {}
    }
    return { Authorization: `Bearer ${token}` }
}
