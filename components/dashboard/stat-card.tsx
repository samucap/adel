import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
    title: string
    value: string
    trend?: string | null
    detail?: string
    icon: LucideIcon
}

export function StatsCard({ title, value, trend, detail, icon: Icon }: StatsCardProps) {
    const direction = trend?.startsWith("+") ? "text-positive" : trend?.startsWith("-") ? "text-negative" : "text-muted-foreground"
    return (
        <Card className="h-full justify-center gap-1 p-3">
            <div className="flex items-center justify-between">
                <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
                <Icon className="size-3.5 text-muted-foreground" />
            </div>
            <div className="font-mono text-lg font-bold tracking-tight">{value}</div>
            <div className="flex items-center gap-1 text-2xs text-muted-foreground">
                {trend ? <span className={cn("font-mono font-medium", direction)}>{trend}</span> : null}
                {detail ? <span>{detail}</span> : null}
            </div>
        </Card>
    )
}
