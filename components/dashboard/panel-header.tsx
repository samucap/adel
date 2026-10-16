import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface PanelHeaderProps {
    icon?: LucideIcon
    title: string
    description?: string
    actions?: ReactNode
}

/** Standard dashboard panel header: px-4 py-3, bottom border, title left, actions right. */
export function PanelHeader({ icon: Icon, title, description, actions }: PanelHeaderProps) {
    return (
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3">
            <div className="min-w-0">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                    {Icon && <Icon className="size-4 text-primary" />}
                    {title}
                </h3>
                {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
    )
}
