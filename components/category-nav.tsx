"use client"

import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { SortControls } from "./market-feed/sort-controls"
import { LayoutGrid, List } from "lucide-react"

interface CategoryNavProps {
    hideControls?: boolean
}

export function CategoryNav({ hideControls }: CategoryNavProps) {
    const pathname = usePathname()
    const {
        topNav,
        topNavLoading,
        loadCats,
        loadEvents,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        filterBy,
        setFilterBy,
        viewMode,
        setViewMode
    } = useAppStore()
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null)

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

    // Load events when category or subcategory changes
    useEffect(() => {
        const selectedCatObj = topNav.find((cat) => cat.slug === selectedCategory)
        if (!selectedCatObj) return

        // If subcategory is selected, use its ID; otherwise use the category ID
        if (selectedSubcat) {
            const subcatObj = selectedCatObj.related?.find((sub) => sub.slug === selectedSubcat)
            if (subcatObj) {
                loadEvents(subcatObj.id)
            }
        } else {
            loadEvents(selectedCatObj.id)
        }
    }, [selectedCategory, selectedSubcat, topNav, loadEvents])

    const handleCategoryChange = (value: string) => {
        if (value) {
            setSelectedCategory(value)
            setSelectedSubcat(null) // Clear subcategory when top-level category changes
        }
    }

    const handleSubcatChange = (value: string) => {
        if (value) {
            setSelectedSubcat(value)
        }
    }

    const selectedCat = topNav.find((cat) => cat.slug === selectedCategory)
    const subcats = selectedCat?.related

    return (
        <div className="flex flex-col gap-2 mb-4">
            {/* Row 1: Categories + Search */}
            <div className="flex items-center gap-4 justify-between">
                {/* Categories - Scrollable */}
                <div className="flex-1 min-w-0 overflow-hidden">
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
                                    className="rounded-full data-[state=on]:bg-muted data-[state=on]:text-foreground text-muted-foreground whitespace-nowrap px-4 h-8 text-sm font-medium transition-colors hover:text-foreground flex-shrink-0"
                                >
                                    {category.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    )}
                </div>

                {/* Search - Fixed Width (only on /markets and if not hidden) */}
                {pathname === "/markets" && !hideControls && (
                    <div className="flex-shrink-0 w-64 md:w-72">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-8 pl-8 text-sm bg-muted/50 border-border/50 transition-colors focus:bg-background"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Row 2: Subcategories + Controls */}
            {(selectedCat?.related && selectedCat.related.length > 0) || (pathname === "/markets" && !hideControls) ? (
                <div className="flex items-center gap-4 justify-between min-h-[36px]">
                    {/* Subcategories - Scrollable */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                        {selectedCat?.related && selectedCat.related.length > 0 && (
                            <ToggleGroup
                                type="single"
                                value={selectedSubcat || ""}
                                onValueChange={handleSubcatChange}
                                className="justify-start w-full overflow-x-auto no-scrollbar"
                            >
                                {subcats?.filter((subcat) => subcat.slug)?.map((subcat, index) => (
                                    <ToggleGroupItem
                                        key={`${subcat.slug}-sub-${index}`}
                                        value={subcat.slug}
                                        className="rounded-full data-[state=on]:bg-muted data-[state=on]:text-foreground text-muted-foreground whitespace-nowrap px-4 h-8 text-sm font-medium transition-colors hover:text-foreground flex-shrink-0"
                                    >
                                        {subcat.label}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        )}
                    </div>

                    {/* Controls - Fixed (only on /markets and if not hidden) */}
                    {pathname === "/markets" && !hideControls && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                                variant={filterBy && filterBy !== 'all' ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setFilterBy(filterBy === 'all' ? 'active' : 'all')}
                                className="h-8 px-2 text-xs"
                            >
                                <Filter className="h-3.5 w-3.5 mr-1" />
                                Filters
                            </Button>

                            <SortControls />

                            <div className="flex bg-muted p-1 rounded-lg ml-2">
                                <Button
                                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <LayoutGrid className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => setViewMode('table')}
                                >
                                    <List className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    )
}
