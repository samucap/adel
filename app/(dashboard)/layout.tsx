"use client"

import { NavLayout } from "@/components/nav-layout"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import { useAppStore } from "@/lib/store"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { setSortBy } = useAppStore()

    return (
        <NavLayout>
            <DashboardContainer
                onSortChange={setSortBy}
                showFilters={true}
                showSort={true}
                showSearch={true}
            >
                {children}
            </DashboardContainer>
        </NavLayout>
    )
}

