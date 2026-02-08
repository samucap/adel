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
import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"

export function NavLayout({ children }: { children: React.ReactNode }) {
    const { topNav, topNavLoading, loadCats, loadEvents } = useAppStore()
    const [selectedCategory, setSelectedCategory] = useState<string>("")

    // Load categories on mount
    useEffect(() => {
        loadCats()
    }, [loadCats])

    // Set initial category when topNav loads
    useEffect(() => {
        if (topNav.length > 0 && !selectedCategory) {
            setSelectedCategory(topNav[0].slug)
        }
    }, [topNav, selectedCategory])

    // Load events when category changes
    useEffect(() => {
        if (selectedCategory) {
            loadEvents(selectedCategory)
        }
    }, [selectedCategory, loadEvents])

    const handleCategoryChange = (value: string) => {
        if (value) {
            setSelectedCategory(value)
        }
    }

    const selectedCat = topNav.find((cat) => cat.slug === selectedCategory)
    const subcats = selectedCat?.related

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex flex-col shrink-0 gap-2 border-b border-border/40 bg-background pt-2 pb-2">
                    <div className="flex items-center gap-2 px-4">
                        {topNavLoading ? (
                            <div className="text-sm text-muted-foreground">Loading categories...</div>
                        ) : (
                            <ToggleGroup
                                type="single"
                                value={selectedCategory}
                                onValueChange={handleCategoryChange}
                                className="justify-start w-full overflow-x-auto no-scrollbar"
                            >
                                {topNav.map((category) => (
                                    <ToggleGroupItem
                                        key={category.slug}
                                        value={category.slug}
                                        className="rounded-full data-[state=on]:bg-muted data-[state=on]:text-foreground text-muted-foreground whitespace-nowrap px-4 h-8 text-sm font-medium transition-colors hover:text-foreground"
                                    >
                                        {category.label}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        )}
                    </div>
                    {selectedCat?.related ? (
                        <ToggleGroup
                            type="single"
                            value={selectedCategory}
                            onValueChange={handleCategoryChange}
                            className="justify-start w-full overflow-x-auto no-scrollbar px-4"
                        >
                            {subcats?.filter((subcat) => subcat.slug)?.map((subcat, index) => (
                                <ToggleGroupItem
                                    key={`${subcat.slug}-sub-${index}`}
                                    value={subcat.slug}
                                    className="rounded-full data-[state=on]:bg-muted data-[state=on]:text-foreground text-muted-foreground whitespace-nowrap px-4 h-8 text-sm font-medium transition-colors hover:text-foreground"
                                >
                                    {subcat.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    ) : null}
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}