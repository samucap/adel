"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Folder, List, Grid } from 'lucide-react';
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MarketsFilterBar() {
    const {
        sortBy,
        setSortBy,
        filterBy,
        setFilterBy,
        searchQuery,
        setSearchQuery
    } = useAppStore();

    const [volumeFilterOpen, setVolumeFilterOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    const sortOptions = [
        { id: 'volume', label: 'Total Volume' },
        { id: 'trending', label: 'Trending' },
        { id: 'newest', label: 'Newest' },
        { id: 'ending', label: 'Ending Soon' },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setVolumeFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sortRef]);

    const activeSortLabel = sortOptions.find(opt => opt.id === sortBy)?.label || 'Sort By';

    return (
        <div className="flex flex-col gap-4 mb-6">
            {/* Search and Main Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Search */}
                <div className="relative w-full md:w-auto md:flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search markets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#2C2D31] border-none rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative group" ref={sortRef}>
                    <button
                        onClick={() => setVolumeFilterOpen(!volumeFilterOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#2C2D31] rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                        {activeSortLabel}
                        <ChevronDown size={14} className={cn("transition-transform", volumeFilterOpen && "rotate-180")} />
                    </button>

                    {volumeFilterOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-[#2C2D31] border border-[#383A40] rounded-lg shadow-xl py-1 z-30">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        setSortBy(option.id);
                                        setVolumeFilterOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-gray-300 hover:bg-[#383A40] hover:text-white"
                                >
                                    {option.label}
                                    {sortBy === option.id && <Check size={14} className="text-blue-500" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Status Toggle (Active / All) */}
                <button
                    onClick={() => setFilterBy(filterBy === 'active' ? 'all' : 'active')}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                        filterBy === 'active'
                            ? "bg-[#2C2D31] text-white"
                            : "bg-[#2C2D31]/50 text-gray-400 hover:text-white"
                    )}
                >
                    {filterBy === 'active' ? 'Active Only' : 'All Statuses'}
                </button>

                {/* Layout Toggles (Visual only for now) */}
                <div className="hidden md:flex items-center gap-1 ml-auto border-l border-[#2C2D31] pl-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                        <Grid size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                        <List size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
