"use client"

import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, ArrowUpDown, Search } from "lucide-react"
import { useState } from "react"

interface DashboardContainerProps {
    title?: string
    children: React.ReactNode
    showFilters?: boolean
    showSort?: boolean
    showSearch?: boolean
    sortOptions?: { value: string; label: string }[]
    onSortChange?: (value: string) => void
    onFilterClick?: () => void
    onSearch?: (query: string) => void
    className?: string
}

export function DashboardContainer({
    title,
    children,
    showFilters = true,
    showSort = true,
    showSearch = true,
    sortOptions = [
        { value: "volume", label: "Volume" },
        { value: "trending", label: "Trending" },
        { value: "newest", label: "Newest" },
        { value: "ending", label: "Ending Soon" },
    ],
    onSortChange,
    onFilterClick,
    onSearch,
    className,
}: DashboardContainerProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)
        onSearch?.(query)
    }

    return (
        <div className={cn("flex flex-col h-full max-h-[calc(100vh-4rem)]", className)}>
            {/* Fixed Header */}
            <header className="flex-shrink-0 flex items-center justify-between gap-4 px-4 py-3 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
                {/* Left: Title */}
                {title && (
                    <h1 className="text-lg font-semibold tracking-tight flex-shrink-0">{title}</h1>
                )}

                {/* Center: Search */}
                {showSearch && (
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search markets, events..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="h-8 pl-8 text-sm bg-muted/50 border-border/50"
                            />
                        </div>
                    </div>
                )}

                {/* Right: Controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {showFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onFilterClick}
                            className="h-8 px-3 text-xs"
                        >
                            <Filter className="h-3.5 w-3.5 mr-1.5" />
                            Filters
                        </Button>
                    )}

                    {showSort && (
                        <Select onValueChange={onSortChange} defaultValue="volume">
                            <SelectTrigger className="h-8 w-[130px] text-xs">
                                <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-xs">
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </header>

            {/* Scrollable Viewport */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="min-h-0">
                    {children}
                </div>
            </div>

            {/* Optional Footer */}
            <footer className="flex-shrink-0 px-4 py-2 border-t border-border/50 bg-muted/30 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                    <span>Last updated: Just now</span>
                    <span>Powered by Polymarket</span>
                </div>
            </footer>
        </div>
    )
}

