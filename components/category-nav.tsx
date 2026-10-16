"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useMarketStore } from "@/stores/marketStore";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterDrawer } from "./filter-drawer";

import { SortControls } from "./market-feed/sort-controls";
import { LayoutGrid, List } from "lucide-react";

const pillClass =
  "rounded-full px-3 text-sm text-muted-foreground hover:bg-hover hover:text-foreground data-[state=on]:bg-selected data-[state=on]:text-primary";

interface CategoryNavProps {
  hideControls?: boolean;
}

export function CategoryNav({ hideControls }: CategoryNavProps) {
  const pathname = usePathname();
  const {
    topNav,
    topNavLoading,
    loadCats,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    viewMode,
    setViewMode,
  } = useAppStore();
  const { loadEvents } = useMarketStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null);
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Load categories on mount
  useEffect(() => {
    loadCats();
  }, []);

  // Set initial category when topNav loads (visual only, don't trigger loadEvents)
  useEffect(() => {
    if (topNav.length > 0 && !selectedCategory) {
      setSelectedCategory(topNav[0].slug);
    }
  }, [topNav, selectedCategory]);

  // Load events whenever the selected category or subcategory changes
  useEffect(() => {
    if (!selectedCategory) return;
    const selectedCatObj = topNav.find((cat) => cat.slug === selectedCategory);
    if (!selectedCatObj) return;
    if (selectedSubcat) {
      const subcatObj = selectedCatObj.related?.find(
        (sub) => sub.slug === selectedSubcat,
      );
      // TODO: Need to handle returning to previous category when subcat selected
      if (subcatObj) {
        loadEvents(subcatObj.id);
      }
    } else {
      loadEvents(selectedCatObj.id);
    }
  }, [selectedCategory, selectedSubcat]);

  const handleCategoryChange = (value: string) => {
    if (value) {
      setSelectedCategory(value);
      setSelectedSubcat(null); // Clear subcategory when top-level category changes
      setHasUserSelected(true);
    }
  };

  const handleSubcatChange = (value: string) => {
    // if selectedSubcat and same as value, return to initial category state
    if (value) {
      setSelectedSubcat(value);
      setHasUserSelected(true);
    }
  };

  const selectedCat = topNav.find((cat) => cat.slug === selectedCategory);
  const subcats = selectedCat?.related;

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* Row 1: Categories + Search */}
        <div className="flex items-center justify-between gap-3">
          {/* Categories - Scrollable */}
          <div className="min-w-0 flex-1 overflow-hidden">
            {topNavLoading ? (
              <div className="text-sm text-muted-foreground">
                Loading categories...
              </div>
            ) : (
              <ToggleGroup
                type="single"
                spacing={1}
                value={selectedCategory}
                onValueChange={handleCategoryChange}
                className="scrollbar-hide w-full justify-start overflow-x-auto"
              >
                {topNav.map((category) => (
                  <ToggleGroupItem
                    key={category.slug}
                    value={category.slug}
                    className={pillClass}
                  >
                    {category.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          </div>

          {/* Search - Fixed Width (only on /markets and if not hidden) */}
          {pathname === "/markets" && !hideControls && (
            <div className="w-40 shrink-0 sm:w-64 md:w-72">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Row 2: Subcategories + Controls */}
        {(selectedCat?.related && selectedCat.related.length > 0) ||
        (pathname === "/markets" && !hideControls) ? (
          <div className="flex min-h-9 items-center justify-between gap-3">
            {/* Subcategories - Scrollable */}
            <div className="min-w-0 flex-1 overflow-hidden">
              {selectedCat?.related && selectedCat.related.length > 0 && (
                <ToggleGroup
                  type="single"
                  spacing={1}
                  value={selectedSubcat || ""}
                  onValueChange={handleSubcatChange}
                  className="scrollbar-hide w-full justify-start overflow-x-auto"
                >
                  {subcats
                    ?.filter((subcat) => subcat.slug)
                    ?.map((subcat, index) => (
                      <ToggleGroupItem
                        key={`${subcat.slug}-sub-${index}`}
                        value={subcat.slug}
                        className={pillClass}
                      >
                        {subcat.label}
                      </ToggleGroupItem>
                    ))}
                </ToggleGroup>
              )}
            </div>

            {/* Controls - Fixed (only on /markets and if not hidden) */}
            {pathname === "/markets" && !hideControls && (
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant={filterDrawerOpen ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilterDrawerOpen(true)}
                  className="h-8 px-2 text-xs"
                  aria-label="Filters"
                >
                  <Filter className="size-3.5" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>

                <SortControls />

                <div className="flex gap-1 rounded-md bg-muted p-0.5">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    className="size-7 p-0"
                    aria-label="Grid view"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="size-3.5" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "secondary" : "ghost"}
                    size="sm"
                    className="size-7 p-0"
                    aria-label="Table view"
                    onClick={() => setViewMode("table")}
                  >
                    <List className="size-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
      />
    </>
  );
}
