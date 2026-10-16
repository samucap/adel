"use client"

import { AppSidebar } from "@/components/app-sidebar"

export function NavLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-dvh w-full bg-background">
            <AppSidebar />
            {/* ml-12 clears the fixed 48px icon rail */}
            <main className="ml-12 flex min-w-0 flex-1 flex-col overflow-hidden p-4">
                {children}
            </main>
        </div>
    )
}
