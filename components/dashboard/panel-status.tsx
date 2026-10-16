"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import type { ReactNode } from "react"

export function PanelStatus({
    query,
    empty,
    emptyText,
    children,
}: {
    query: Pick<UseQueryResult, "isPending" | "isError" | "refetch">
    empty?: boolean
    emptyText: string
    children: ReactNode
}) {
    if (query.isPending) {
        return <div className="min-h-32 flex-1 animate-pulse bg-muted/40" />
    }
    if (query.isError) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center">
                <p className="text-sm text-negative">Couldn&apos;t load this panel.</p>
                <button
                    type="button"
                    onClick={() => query.refetch()}
                    className="focus-ring rounded-sm text-xs font-semibold uppercase"
                >
                    Retry
                </button>
            </div>
        )
    }
    if (empty) {
        return (
            <div className="flex flex-1 items-center justify-center p-4 text-center text-sm text-muted-foreground">
                {emptyText}
            </div>
        )
    }
    return children
}
