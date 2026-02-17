"use client"

import * as React from "react"
import { Check, ChevronsUpDown, ArrowUp, ArrowDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useAppStore } from "@/lib/store"

const sortOptions = [
    { value: "volume24hr", label: "24h Volume" },
    { value: "volume", label: "Total Volume" },
    { value: "liquidity", label: "Liquidity" },
    { value: "newest", label: "Newest" },
    { value: "ending-soon", label: "Ending Soon" },
    { value: "comp", label: "Competitive" },
]

export function SortControls() {
    const [open, setOpen] = React.useState(false)
    const { sortBy, setSortBy, sortOrder, setSortOrder, loadEvents } = useAppStore()

    const handleSortSelect = React.useCallback((value: string) => {
        if (value === sortBy) {
            // Same option → toggle direction
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            // New option → set it, default to descending
            setSortBy(value)
            setSortOrder("desc")
        }
        setOpen(false)
        setTimeout(() => loadEvents(), 0)
    }, [sortBy, sortOrder, setSortBy, setSortOrder, loadEvents])

    const currentLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? "Sort by..."
    const OrderIcon = sortOrder === "asc" ? ArrowUp : ArrowDown

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[180px] justify-between bg-black/40 border-white/10 text-muted-foreground hover:text-foreground text-xs h-8"
                >
                    <span className="flex items-center gap-1.5 truncate">
                        {sortBy && <OrderIcon className="h-3 w-3 shrink-0 text-primary" />}
                        {currentLabel}
                    </span>
                    <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-0 bg-black/90 border-white/10 backdrop-blur-xl">
                <Command className="bg-transparent">
                    <CommandInput placeholder="Search..." className="h-9 text-xs" />
                    <CommandList>
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                            {sortOptions.map((option) => {
                                const isActive = sortBy === option.value
                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={handleSortSelect}
                                        className="aria-selected:bg-white/10 aria-selected:text-white text-xs"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className="flex items-center gap-1.5">
                                                <Check
                                                    className={cn(
                                                        "h-3.5 w-3.5",
                                                        isActive ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {option.label}
                                            </span>
                                            {isActive && (
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                                    {sortOrder === "asc" ? "↑ asc" : "↓ desc"}
                                                </span>
                                            )}
                                        </div>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
