"use client"

import { create } from "zustand"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { authApi, type AuthUser } from "@/lib/auth-service"

const COOKIE_NAME = "auth-token"
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
    secure: true,
    sameSite: "strict",
    expires: 1, // 1 day
}

interface AuthState {
    user: AuthUser | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null

    login: (email: string, password: string) => Promise<void>
    signup: (email: string, password: string) => Promise<void>
    logout: () => void
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
        set({ isLoading: true, error: null })
        try {
            const { token, user } = await authApi.login(email, password)
            Cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS)
            set({ token, user, isAuthenticated: true, isLoading: false })
        } catch (err) {
            const message = err instanceof Error ? err.message : "Login failed"
            set({ error: message, isLoading: false })
            throw err
        }
    },

    signup: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
            const { token, user } = await authApi.register(email, password)
            Cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS)
            set({ token, user, isAuthenticated: true, isLoading: false })
        } catch (err) {
            const message = err instanceof Error ? err.message : "Registration failed"
            set({ error: message, isLoading: false })
            throw err
        }
    },

    logout: () => {
        Cookies.remove(COOKIE_NAME)
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        })
    },

    verifyToken: async () => {
        const token = Cookies.get(COOKIE_NAME)

        if (!token) {
            set({ isLoading: false, isAuthenticated: false })
            return
        }

        // Quick client-side expiration check
        try {
            const decoded = jwtDecode<{ exp: number }>(token)
            if (decoded.exp < Date.now() / 1000) {
                // Try refresh
                try {
                    const newToken = await authApi.refresh(token)
                    Cookies.set(COOKIE_NAME, newToken, COOKIE_OPTIONS)
                    const user = await authApi.verify(newToken)
                    set({ token: newToken, user, isAuthenticated: true, isLoading: false })
                    return
                } catch {
                    Cookies.remove(COOKIE_NAME)
                    set({ isLoading: false, isAuthenticated: false })
                    return
                }
            }
        } catch {
            Cookies.remove(COOKIE_NAME)
            set({ isLoading: false, isAuthenticated: false })
            return
        }

        // Verify with "server"
        try {
            const user = await authApi.verify(token)
            set({ token, user, isAuthenticated: true, isLoading: false })
        } catch {
            Cookies.remove(COOKIE_NAME)
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
