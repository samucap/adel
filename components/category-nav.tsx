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

export function CategoryNav() {
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
        setFilterBy
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

                {/* Search - Fixed Width (only on /markets) */}
                {pathname === "/markets" && (
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
            {(selectedCat?.related && selectedCat.related.length > 0) || pathname === "/markets" ? (
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

                    {/* Controls - Fixed (only on /markets) */}
                    {pathname === "/markets" && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                                variant={filterBy && filterBy !== 'all' ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => setFilterBy(filterBy === 'all' ? 'active' : 'all')}
                                className="h-8 px-3 text-xs"
                            >
                                <Filter className="h-3.5 w-3.5 mr-1.5" />
                                Filters
                            </Button>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-8 w-[130px] text-xs">
                                    <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="volume" className="text-xs">Volume</SelectItem>
                                    <SelectItem value="trending" className="text-xs">Trending</SelectItem>
                                    <SelectItem value="newest" className="text-xs">Newest</SelectItem>
                                    <SelectItem value="ending" className="text-xs">Ending Soon</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    )
}
