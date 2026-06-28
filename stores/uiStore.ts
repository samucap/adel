import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { FilterOptions } from "@/lib/store"; // reuse type if needed

/** UI state store (sorting, filtering, view mode) */
export const useUIStore = create(
  subscribeWithSelector((set, get) => ({
    // Sorting
    sortBy: "volume24hr" as string,
    sortOrder: "desc" as "asc" | "desc",
    setSortBy: (value: string) => set({ sortBy: value }),
    setSortOrder: (value: "asc" | "desc") => set({ sortOrder: value }),

    // Filters
    filterBy: "all" as string,
    filters: {} as FilterOptions,
    setFilterBy: (value: string) => set({ filterBy: value }),
    setFilters: (filters: FilterOptions) => set({ filters }),
    clearFilters: () => set({ filters: {} as FilterOptions }),
    searchQuery: "" as string,
    setSearchQuery: (query: string) => set({ searchQuery: query }),

    // View mode
    viewMode: "grid" as "grid" | "table",
    setViewMode: (mode: "grid" | "table") => set({ viewMode: mode }),
  }))
);
