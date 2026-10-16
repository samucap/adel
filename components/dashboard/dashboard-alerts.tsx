"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAppStore } from "@/lib/store"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function DashboardAlerts() {
    const { topNavError, eventsError } = useAppStore()
    const [visible, setVisible] = useState(false)

    const error = topNavError || eventsError

    useEffect(() => {
        if (error) {
            setVisible(true)
        } else {
            setVisible(false)
        }
    }, [error])

    if (!visible || !error) return null

    return (
        <div className="fixed right-4 bottom-4 z-50 w-full max-w-md animate-in fade-in slide-in-from-bottom-5">
            <Alert variant="destructive" className="border-negative/40 shadow-lg">
                <AlertCircle className="size-4" />
                <AlertTitle>Connection Issue</AlertTitle>
                <AlertDescription className="flex items-center justify-between gap-2">
                    <span>{error}</span>
                    <button
                        onClick={() => setVisible(false)}
                        className="focus-ring rounded-sm text-xs font-semibold uppercase hover:underline"
                    >
                        Dismiss
                    </button>
                </AlertDescription>
            </Alert>
        </div>
    )
}
