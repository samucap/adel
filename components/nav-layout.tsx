"use client"

import { AppSidebar } from "@/components/app-sidebar"

export function NavLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />
            {/* Main content with left margin to account for icon rail (48px = 3rem = w-12) */}
            <div className="ml-12 flex-1 flex flex-col overflow-hidden">
                <main className="flex flex-1 flex-col gap-4 p-4 pt-4 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}