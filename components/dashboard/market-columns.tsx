"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Market } from "@/lib/mock-data"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

export const columns: ColumnDef<Market>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Market" />
        ),
        cell: ({ row }) => {
            const isSports = row.original.category === "Sports"
            return (
                <div className="flex flex-col max-w-[300px] md:max-w-[400px]">
                    <Link
                        href={`/markets/${row.original.id}`}
                        className="font-medium hover:text-amber-600 transition-colors truncate"
                    >
                        {row.getValue("title")}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] h-4 px-1 border-muted-foreground/30 text-muted-foreground">
                            {row.original.category.toUpperCase()}
                        </Badge>
                        {row.original.group && (
                            <span className="text-xs text-muted-foreground">{row.original.group}</span>
                        )}
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            return (
                <div className="font-mono font-medium">
                    {price.toFixed(2)}¢
                </div>
            )
        },
    },
    {
        accessorKey: "volume",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Volume (24h)" />
        ),
        cell: ({ row }) => {
            const volume = parseFloat(row.getValue("volume"))
            return (
                <div className="font-mono text-muted-foreground">
                    ${(volume / 1000).toFixed(1)}k
                </div>
            )
        },
    },
    {
        accessorKey: "liquidity",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Liquidity" />
        ),
        cell: ({ row }) => {
            const liquidity = row.original.liquidity || 0
            return (
                <div className="font-mono text-muted-foreground">
                    ${(liquidity / 1000).toFixed(1)}k
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <div className="flex justify-end">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                        <Link href={`/markets/${row.original.id}`}>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground hover:text-amber-500" />
                            <span className="sr-only">View</span>
                        </Link>
                    </Button>
                </div>
            )
        },
    },
]
