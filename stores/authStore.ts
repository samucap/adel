"use client"

import { create } from "zustand"
import {
    authApi,
    userFromToken,
    type AuthUser,
    type AuthTokenResponse,
    AuthApiError,
    formatAuthError,
} from "@/lib/auth-service"

const REFRESH_SKEW_MS = 60_000

interface AuthState {
    user: AuthUser | null
    token: string | null
    expiresAt: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null

    login: (email: string, password: string) => Promise<void>
    signup: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    initSession: () => Promise<void>
    refreshSession: () => Promise<AuthTokenResponse>
    clearError: () => void
}

let refreshTimer: ReturnType<typeof setTimeout> | null = null

function clearRefreshTimer() {
    if (refreshTimer !== null) {
        clearTimeout(refreshTimer)
        refreshTimer = null
    }
}

function scheduleRefresh(expiresAt: string, doRefresh: () => Promise<unknown>) {
    clearRefreshTimer()
    const ms = new Date(expiresAt).getTime() - Date.now() - REFRESH_SKEW_MS
    if (ms <= 0) {
        doRefresh()
        return
    }
    refreshTimer = setTimeout(() => {
        doRefresh()
    }, ms)
}

function applyTokenResponse(
    resp: AuthTokenResponse,
    set: (partial: Partial<AuthState>) => void,
    doRefresh: () => Promise<unknown>,
) {
    const user = userFromToken(resp.token)
    set({
        token: resp.token,
        expiresAt: resp.expires_at,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
    })
    scheduleRefresh(resp.expires_at, doRefresh)
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    expiresAt: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (email, password) => {
        set({ error: null })
        try {
            const resp = await authApi.login(email, password)
            applyTokenResponse(resp, set, () => get().refreshSession())
        } catch (err) {
            set({ error: formatAuthError(err), isLoading: false })
            throw err
        }
    },

    signup: async (email, password) => {
        set({ error: null })
        try {
            const resp = await authApi.signup(email, password)
            applyTokenResponse(resp, set, () => get().refreshSession())
        } catch (err) {
            set({ error: formatAuthError(err), isLoading: false })
            throw err
        }
    },

    logout: async () => {
        clearRefreshTimer()
        try {
            await authApi.logout()
        } catch {
            // Always clear local state even if the server call fails
        }
        set({
            user: null,
            token: null,
            expiresAt: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        })
    },

    initSession: async () => {
        try {
            const resp = await authApi.refreshToken()
            applyTokenResponse(resp, set, () => get().refreshSession())
        } catch (err) {
            clearRefreshTimer()
            const isAuthFailure =
                err instanceof AuthApiError && err.status === 401
            set({
                token: null,
                expiresAt: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: isAuthFailure ? null : formatAuthError(err),
            })
        }
    },

    refreshSession: async () => {
        const resp = await authApi.refreshToken()
        applyTokenResponse(resp, set, () => get().refreshSession())
        return resp
    },

    clearError: () => set({ error: null }),
}))

/**
 * Read the current access token from the store (in-memory only).
 * Used by the API client to attach Authorization headers.
 */
export function getAccessToken(): string | null {
    return useAuthStore.getState().token
}
