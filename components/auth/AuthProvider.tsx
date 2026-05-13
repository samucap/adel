"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/authStore"
import { Loader2 } from "lucide-react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const initSession = useAuthStore((s) => s.initSession)
    const isLoading = useAuthStore((s) => s.isLoading)

    useEffect(() => {
        initSession()
    }, [initSession])

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
