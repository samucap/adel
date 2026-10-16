"use client"

import { NavLayout } from "@/components/nav-layout"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import { AuthGuard } from "@/components/auth/AuthGuard"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthGuard>
            <NavLayout>
                <DashboardContainer>{children}</DashboardContainer>
            </NavLayout>
        </AuthGuard>
    )
}
