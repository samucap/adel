"use client"

import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"

export function CategoryNav() {
    const { topNav, topNavLoading, loadCats, loadEvents } = useAppStore()
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
            {/* Primary Category Row */}
            <div className="flex items-center gap-2">
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

            {/* Subcategory Row */}
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
                            className="rounded-full data-[state=on]:bg-muted data-[state=on]:text-foreground text-muted-foreground whitespace-nowrap px-4 h-8 text-sm font-medium transition-colors hover:text-foreground"
                        >
                            {subcat.label}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            )}
        </div>
    )
}
