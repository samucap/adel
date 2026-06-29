import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { FilterOptions } from "@/lib/store";

export interface UIStoreState {
  // Sorting
  sortBy: string;
  sortOrder: "asc" | "desc";
  setSortBy: (value: string) => void;
  setSortOrder: (value: "asc" | "desc") => void;

  // Filters
  filterBy: string;
  filters: FilterOptions;
  setFilterBy: (value: string) => void;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // View mode
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
}

/** UI state store (sorting, filtering, view mode) */
export const useUIStore = create<UIStoreState>()(
  subscribeWithSelector((set, get) => ({
    // Sorting
    sortBy: "volume24hr",
    sortOrder: "desc",
    setSortBy: (value) => set({ sortBy: value }),
    setSortOrder: (value) => set({ sortOrder: value }),

    // Filters
    filterBy: "all",
    filters: {} as FilterOptions,
    setFilterBy: (value) => set({ filterBy: value }),
    setFilters: (filters) => set({ filters }),
    clearFilters: () => set({ filters: {} as FilterOptions }),
    searchQuery: "",
    setSearchQuery: (query) => set({ searchQuery: query }),

    // View mode
    viewMode: "grid",
    setViewMode: (mode) => set({ viewMode: mode }),
  }))
);
