"use client"

import { create } from "zustand"
import { jwtDecode } from "jwt-decode"
import { authApi, type AuthUser, formatAuthError } from "@/lib/auth-service"
import { AUTH_TOKEN_STORAGE_KEY } from "@/lib/auth-token"

const TOKEN_STORAGE_KEY = AUTH_TOKEN_STORAGE_KEY
const REFRESH_SKEW_SECONDS = 60

interface JwtClaims {
    exp?: number
}

function getStoredToken(): string | null {
    if (typeof window === "undefined") {
        return null
    }
    return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

function setStoredToken(token: string): void {
    if (typeof window === "undefined") {
        return
    }
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

function clearStoredToken(): void {
    if (typeof window === "undefined") {
        return
    }
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

function clearLegacyAuthCookie(): void {
    if (typeof document === "undefined") {
        return
    }
    document.cookie = "auth-token=; Max-Age=0; Path=/; SameSite=Strict"
}

interface AuthState {
    user: AuthUser | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null

    login: (email: string, password: string) => Promise<void>
    signup: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    verifyToken: () => Promise<void>
    clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // Start true to prevent flash of login page
    error: null,

    login: async (email: string, password: string) => {
        // Do not set isLoading: true here — AuthProvider uses isLoading for initial
        // verifyToken only; toggling it would unmount the whole app during login.
        set({ error: null })
        try {
            const { token, user } = await authApi.login(email, password)
            clearLegacyAuthCookie()
            setStoredToken(token)
            set({ token, user, isAuthenticated: true, isLoading: false })
        } catch (err) {
            set({ error: formatAuthError(err), isLoading: false })
            throw err
        }
    },

    signup: async (email: string, password: string) => {
        set({ error: null })
        try {
            const { token, user } = await authApi.register(email, password)
            clearLegacyAuthCookie()
            setStoredToken(token)
            set({ token, user, isAuthenticated: true, isLoading: false })
        } catch (err) {
            set({ error: formatAuthError(err), isLoading: false })
            throw err
        }
    },

    logout: async () => {
        const token = get().token ?? getStoredToken()

        try {
            if (token) {
                try {
                    await authApi.logout(token)
                } catch {
                    // Clear local session even if the API is down or token is invalid
                }
            }
        } finally {
            clearStoredToken()
            clearLegacyAuthCookie()
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            })
        }
    },

    verifyToken: async () => {
        clearLegacyAuthCookie()
        const token = getStoredToken()

        if (!token) {
            set({
                token: null,
                user: null,
                isLoading: false,
                isAuthenticated: false,
            })
            return
        }

        // Quick client-side expiration check
        try {
            const decoded = jwtDecode<JwtClaims>(token)
            const nowInSeconds = Date.now() / 1000
            const exp = decoded.exp ?? 0
            if (exp <= nowInSeconds + REFRESH_SKEW_SECONDS) {
                // Try refresh
                try {
                    const newToken = await authApi.refresh(token)
                    setStoredToken(newToken)
                    const user = await authApi.verify(newToken)
                    set({ token: newToken, user, isAuthenticated: true, isLoading: false })
                    return
                } catch {
                    clearStoredToken()
                    set({ isLoading: false, isAuthenticated: false })
                    return
                }
            }
        } catch {
            clearStoredToken()
            set({ isLoading: false, isAuthenticated: false })
            return
        }

        // Verify with "server"
        try {
            const user = await authApi.verify(token)
            set({ token, user, isAuthenticated: true, isLoading: false })
        } catch {
            clearStoredToken()
            set({
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            })
        }
    },

    clearError: () => set({ error: null }),
}))
