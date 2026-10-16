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
                    className="h-8 w-32 justify-between sm:w-44 text-xs text-muted-foreground hover:text-foreground"
                >
                    <span className="flex items-center gap-1.5 truncate">
                        {sortBy && <OrderIcon className="size-3 shrink-0 text-primary" />}
                        {currentLabel}
                    </span>
                    <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-0">
                <Command>
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
                                        className="text-xs"
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <Check
                                                    className={cn(
                                                        "size-3.5",
                                                        isActive ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {option.label}
                                            </span>
                                            {isActive && (
                                                <span className="text-2xs tracking-wider text-muted-foreground uppercase">
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
