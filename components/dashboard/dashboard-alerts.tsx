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
            // Auto-dismiss after 10 seconds? Optional.
            // const timer = setTimeout(() => setVisible(false), 10000)
            // return () => clearTimeout(timer)
        } else {
            setVisible(false)
        }
    }, [error])

    if (!visible || !error) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-md animate-in slide-in-from-bottom-5 fade-in">
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground backdrop-blur-md shadow-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Issue</AlertTitle>
                <AlertDescription className="flex justify-between items-center gap-2">
                    <span>{error}</span>
                    <button
                        onClick={() => setVisible(false)}
                        className="text-xs font-bold uppercase hover:underline opacity-80"
                    >
                        Dismiss
                    </button>
                </AlertDescription>
            </Alert>
        </div>
    )
}
