import { cn } from "@/lib/utils"

interface DashboardContainerProps {
    children: React.ReactNode
    className?: string
}

/** Page frame: the app's single scroll area plus a pinned footer. */
export function DashboardContainer({ children, className }: DashboardContainerProps) {
    return (
        <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
                {children}
            </div>
            <footer className="flex shrink-0 items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
                <span>Last updated: Just now</span>
                <span>Powered by Polymarket</span>
            </footer>
        </div>
    )
}
