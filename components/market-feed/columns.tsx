"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Event } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SafeImage } from "./safe-image"
import Link from "next/link"

export const columns: ColumnDef<Event>[] = [
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
                        {event.primaryMarket?.question && (
                            <span className="text-xs text-muted-foreground truncate">{event.primaryMarket.question}</span>
                        )}
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
        accessorKey: "liquidity",
        header: "Liquidity",
        cell: ({ row }) => {
            // Placeholder logic or use real data if mapped
            const liq = row.original.liquidityClob || 0;
            return <div className="font-mono">${liq.toLocaleString()}</div>
        }
    },
    {
        accessorKey: "startDate", // Using startDate as End Date for now or logic
        header: "End Date",
        cell: ({ row }) => {
            return <div className="text-muted-foreground">{row.original.startDate}</div>
        }
    },
    {
        accessorKey: "stats.change24h",
        header: "24h",
        cell: ({ row }) => {
            const change = row.original.stats.change24h;
            return (
                <div className={change >= 0 ? "text-green-500" : "text-red-500"}>
                    {change > 0 && "+"}{change}%
                </div>
            )
        }
    },
    {
        id: "probability",
        header: "Prob",
        cell: ({ row }) => {
            const outcome = row.original.primaryMarket?.outcomes?.[0]; // Simplification
            return (
                <div className="font-bold text-primary">
                    {outcome ? Math.round(outcome.price * 100) : 0}%
                </div>
            )
        }
    },
]
