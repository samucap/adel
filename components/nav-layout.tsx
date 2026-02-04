"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useState } from "react"
import { usePathname } from "next/navigation"

const CATEGORIES = [
    {
        value: "crypto",
        label: "Crypto",
        tags: ["Bitcoin", "Ethereum", "Solana", "DeFi", "NFTs", "L2s", "Memecoins"]
    },
    {
        value: "politics",
        label: "Politics",
        tags: ["US Election", "Global Politics", "Policy", "Regulations", "Polls"]
    },
    {
        value: "sports",
        label: "Sports",
        tags: ["Football", "Basketball", "Tennis", "MMA", "Cricket", "F1", "Golf"]
    },
    {
        value: "business",
        label: "Business",
        tags: ["Tech", "Finance", "Startups", "Economy", "Earnings", "Markets"]
    },
    {
        value: "pop-culture",
        label: "Pop Culture",
        tags: ["Celebrities", "Movies", "Music", "Awards", "Viral"]
    },
    {
        value: "science",
        label: "Science",
        tags: ["Space", "AI", "Climate", "Biotech", "Physics"]
    }
]

export function NavLayout({ children }: { children: React.ReactNode }) {
    const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].value)
    const [selectedTag, setSelectedTag] = useState<string>(CATEGORIES[0].tags[0])

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex flex-col shrink-0 gap-2 border-b border-border/40 bg-background pt-2 pb-2">
                    <div className="flex items-center gap-2 px-4">
                        <ToggleGroup type="single" value={selectedCategory} onValueChange={(value) => {
                            if (value) {
                                setSelectedCategory(value)
                                // Reset tag when category changes
                                const category = CATEGORIES.find(c => c.value === value)
                                if (category && category.tags.length > 0) {
                                    setSelectedTag(category.tags[0])
                                }
                            }
                        }} className="justify-start w-full overflow-x-auto no-scrollbar">
                            {CATEGORIES.map((category) => (
                                <ToggleGroupItem
                                    key={category.value}
                                    value={category.value}
                                    className="rounded-full data-[state=on]:bg-muted data-[state=on]:text-foreground text-muted-foreground whitespace-nowrap px-4 h-8 text-sm font-medium transition-colors hover:text-foreground"
                                >
                                    {category.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>
                    {/* Subnav for tags */}
                    <div className="flex items-center gap-2 px-4">
                        <ToggleGroup type="single" value={selectedTag} onValueChange={(value) => {
                            if (value) setSelectedTag(value)
                        }} className="justify-start w-full overflow-x-auto no-scrollbar">
                            {CATEGORIES.find(c => c.value === selectedCategory)?.tags.map((tag) => (
                                <ToggleGroupItem
                                    key={tag}
                                    value={tag}
                                    className="rounded-full border border-transparent data-[state=on]:bg-transparent data-[state=on]:border-border data-[state=on]:text-foreground text-muted-foreground whitespace-nowrap px-3 h-7 text-xs font-medium transition-all hover:text-foreground"
                                >
                                    {tag}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}