"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace(`/login?from=${encodeURIComponent(pathname)}`)
        }
    }, [isAuthenticated, isLoading, router, pathname])

    // Don't render protected content until auth is confirmed
    if (isLoading || !isAuthenticated) {
        return null
    }

    return <>{children}</>
}
