"use client"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Search, Flame, Trophy, Coins, Vote, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"

export function MarketFilters() {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-2 overflow-x-auto">
            <ToggleGroup type="multiple" defaultValue={["sports", "crypto"]} className="justify-start">
                <ToggleGroupItem value="sports" aria-label="Toggle sports" className="gap-2 data-[state=on]:bg-amber-100 data-[state=on]:text-amber-900 border border-transparent data-[state=on]:border-amber-200 hover:bg-muted/50">
                    <Trophy className="h-4 w-4" />
                    Sports
                </ToggleGroupItem>
                <ToggleGroupItem value="crypto" aria-label="Toggle crypto" className="gap-2 data-[state=on]:bg-amber-100 data-[state=on]:text-amber-900 border border-transparent data-[state=on]:border-amber-200 hover:bg-muted/50">
                    <Coins className="h-4 w-4" />
                    Crypto
                </ToggleGroupItem>
                <ToggleGroupItem value="politics" aria-label="Toggle politics" className="gap-2 data-[state=on]:bg-amber-100 data-[state=on]:text-amber-900 border border-transparent data-[state=on]:border-amber-200 hover:bg-muted/50">
                    <Vote className="h-4 w-4" />
                    Politics
                </ToggleGroupItem>
                <ToggleGroupItem value="economics" aria-label="Toggle economics" className="gap-2 data-[state=on]:bg-amber-100 data-[state=on]:text-amber-900 border border-transparent data-[state=on]:border-amber-200 hover:bg-muted/50">
                    <Globe className="h-4 w-4" />
                    Economics
                </ToggleGroupItem>
                <ToggleGroupItem value="others" aria-label="Toggle others" className="gap-2 data-[state=on]:bg-amber-100 data-[state=on]:text-amber-900 border border-transparent data-[state=on]:border-amber-200 hover:bg-muted/50">
                    ...
                </ToggleGroupItem>
            </ToggleGroup>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search markets..."
                        className="pl-8 h-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-amber-500"
                    />
                </div>
            </div>
        </div>
    )
}
