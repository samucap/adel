"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CleanEvent } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SafeImage } from "./safe-image"
import Link from "next/link"

export const columns: ColumnDef<CleanEvent>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Market
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const event = row.original
            return (
                <Link href={`/markets/${event.id}`} className="flex items-center gap-3 hover:underline">
                    <div className="h-10 w-10 rounded overflow-hidden bg-muted shrink-0">
                        <SafeImage src={event.image} alt={event.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col max-w-[300px]">
                        <span className="font-medium truncate">{event.title}</span>
                        <span className="text-xs text-muted-foreground truncate">{event.ticker}</span>
                    </div>
                </Link>
            )
        },
    },
    {
        accessorKey: "stats.volumeUSD",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Volume
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return <div className="font-mono">{row.original.stats.volumeUSD}</div>
        }
    },
    {
        accessorKey: "stats.spreadBP",
        header: "Spread",
        cell: ({ row }) => {
            const spread = row.original.stats.spreadBP || 0;
            return <div className="font-mono">{spread}bp</div>
        }
    },
    {
        id: "endDate",
        header: "End Date",
        cell: ({ row }) => {
            // CleanEvent doesn't have startDate currently, show placeholder
            return <div className="text-muted-foreground">TBD</div>
        }
    },
    {
        id: "change",
        header: "24h",
        cell: ({ row }) => {
            // CleanEvent doesn't have change24h, use outcomes change if available
            const change = row.original.displayData.outcomes?.[0]?.change24h || 0;
            return (
                <div className={change >= 0 ? "text-green-500" : "text-red-500"}>
                    {change > 0 && "+"}{(change * 100).toFixed(1)}%
                </div>
            )
        }
    },
    {
        id: "probability",
        header: "Prob",
        cell: ({ row }) => {
            const outcome = row.original.displayData.outcomes?.[0];
            return (
                <div className="font-bold text-primary">
                    {outcome ? Math.round(outcome.price * 100) : 0}%
                </div>
            )
        }
    },
]
