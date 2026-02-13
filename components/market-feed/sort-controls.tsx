"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

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
    {
        value: "volume24hr",
        label: "24h Volume",
    },
    {
        value: "volume",
        label: "Total Volume",
    },
    {
        value: "liquidity",
        label: "Liquidity",
    },
    {
        value: "newest",
        label: "Newest",
    },
    {
        value: "ending-soon",
        label: "Ending Soon",
    },
    {
        value: "comp",
        label: "Competitive",
    }
]

export function SortControls() {
    const [open, setOpen] = React.useState(false)
    const { sortBy, setSortBy } = useAppStore()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between bg-black/40 border-white/10 text-muted-foreground hover:text-foreground"
                >
                    {sortBy
                        ? sortOptions.find((framework) => framework.value === sortBy)?.label
                        : "Sort by..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-black/90 border-white/10 backdrop-blur-xl">
                <Command className="bg-transparent">
                    <CommandInput placeholder="Search sort option..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                            {sortOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        setSortBy(currentValue === sortBy ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                    className="aria-selected:bg-white/10 aria-selected:text-white"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            sortBy === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
