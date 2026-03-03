"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/authStore"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { verifyToken, isLoading } = useAuthStore()

    useEffect(() => {
        verifyToken()
    }, [verifyToken])

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="auth-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background"
                >
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="auth-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
