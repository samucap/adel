"use client"

import { useAuthStore } from "@/stores/authStore"

export function useAuth() {
    const store = useAuthStore()

    return {
        user: store.user,
        expiresAt: store.expiresAt,
        isAuthenticated: store.isAuthenticated,
        isLoading: store.isLoading,
        error: store.error,
        login: store.login,
        signup: store.signup,
        logout: store.logout,
        clearError: store.clearError,
    }
}
