"use client"

import { NavLayout } from "@/components/nav-layout"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    // Disable scroll on markets page to allow internal scrolling of lists
    const isMarketsPage = pathname === '/markets' || pathname?.startsWith('/markets/')

    return (
        <AuthGuard>
            <NavLayout>
                <DashboardContainer
                    disableScroll={false} // Allow main page to scroll naturally
                    showFilters={false}
                    showSort={false}
                    showSearch={false}
                >
                    {children}
                </DashboardContainer>
            </NavLayout>
        </AuthGuard>
    )
}

