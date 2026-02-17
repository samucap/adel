"use client"

import { useState, useCallback, useMemo } from "react"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useAppStore, FilterOptions } from "@/lib/store"
import { Clock, Calendar, DollarSign, TrendingUp, Droplets, Gift, Percent, BarChart3 } from "lucide-react"

// ─── Chip Group ────────────────────────────────────────────
interface ChipOption {
    label: string
    value: string
}

function ChipGroup({
    options,
    selected,
    onSelect,
}: {
    options: ChipOption[]
    selected: string
    onSelect: (value: string) => void
}) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onSelect(opt.value)}
                    className={`
                        px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150
                        ${selected === opt.value
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                        }
                    `}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    )
}

// ─── Filter Section ────────────────────────────────────────
function FilterSection({
    icon: Icon,
    label,
    children,
}: {
    icon: React.ElementType
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="rounded-lg border border-border/50 bg-card/50 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                {label}
            </div>
            {children}
        </div>
    )
}

// ─── Filter Configs ────────────────────────────────────────
const TIME_REMAINING: ChipOption[] = [
    { label: "All", value: "all" },
    { label: "< 1 day", value: "1d" },
    { label: "< 7 days", value: "7d" },
    { label: "< 30 days", value: "30d" },
]

const CREATED_DATE: ChipOption[] = [
    { label: "All", value: "all" },
    { label: "< 1 day", value: "1d" },
    { label: "< 7 days", value: "7d" },
    { label: "< 30 days", value: "30d" },
]

const OUTCOME_PRICES: ChipOption[] = [
    { label: "All", value: "all" },
    { label: "1-99%", value: "1-99" },
    { label: "40-60%", value: "40-60" },
    { label: ">80%", value: "80" },
    { label: ">95%", value: "95" },
    { label: ">99%", value: "99" },
]

const MIN_SPREAD: ChipOption[] = [
    { label: "All", value: "all" },
    { label: "1¢", value: "1" },
    { label: "3¢", value: "3" },
    { label: "7¢", value: "7" },
    { label: "10¢", value: "10" },
]

const MIN_APY: ChipOption[] = [
    { label: "All", value: "all" },
    { label: ">5%", value: "5" },
    { label: ">10%", value: "10" },
    { label: ">25%", value: "25" },
    { label: ">50%", value: "50" },
    { label: ">100%", value: "100" },
    { label: ">500%", value: "500" },
]

const MIN_VOLUME: ChipOption[] = [
    { label: "All", value: "all" },
    { label: ">$1K", value: "1000" },
    { label: ">$10K", value: "10000" },
    { label: ">$100K", value: "100000" },
    { label: ">$1M", value: "1000000" },
]

const MIN_LIQUIDITY: ChipOption[] = [
    { label: "All", value: "all" },
    { label: ">$1K", value: "1000" },
    { label: ">$10K", value: "10000" },
    { label: ">$100K", value: "100000" },
    { label: ">$1M", value: "1000000" },
]

const MIN_DAILY_REWARD: ChipOption[] = [
    { label: "All", value: "all" },
    { label: "0", value: "0" },
    { label: "≥10", value: "10" },
    { label: "≥50", value: "50" },
    { label: "≥100", value: "100" },
]

const REWARD_EARNING: ChipOption[] = [
    { label: "All", value: "all" },
    { label: "0", value: "0" },
    { label: "≥10%", value: "10" },
    { label: "≥30%", value: "30" },
    { label: "≥50%", value: "50" },
]

// ─── Helpers to map draft state → FilterOptions ────────────
function daysFromNow(days: number): string {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString()
}

function daysAgo(days: number): string {
    const d = new Date()
    d.setDate(d.getDate() - days)
    return d.toISOString()
}

interface DraftFilters {
    timeRemaining: string
    createdDate: string
    outcomePrice: string
    minSpread: string
    minApy: string
    minVolume: string
    minLiquidity: string
    minDailyReward: string
    rewardEarning: string
}

const DEFAULT_DRAFT: DraftFilters = {
    timeRemaining: "all",
    createdDate: "all",
    outcomePrice: "all",
    minSpread: "all",
    minApy: "all",
    minVolume: "all",
    minLiquidity: "all",
    minDailyReward: "all",
    rewardEarning: "all",
}

function buildFilters(draft: DraftFilters): FilterOptions {
    const f: FilterOptions = {}

    // Time remaining → end_date_max
    if (draft.timeRemaining !== "all") {
        const days = parseInt(draft.timeRemaining)
        f.end_date_max = daysFromNow(days)
    }

    // Created date → start_date_min
    if (draft.createdDate !== "all") {
        const days = parseInt(draft.createdDate)
        f.start_date_min = daysAgo(days)
    }

    // Min spread → spread_max (cents → basis points)
    if (draft.minSpread !== "all") {
        f.spread_max = parseInt(draft.minSpread) * 100
    }

    // Min volume
    if (draft.minVolume !== "all") {
        f.volumeMin = parseInt(draft.minVolume)
    }

    // Min liquidity
    if (draft.minLiquidity !== "all") {
        f.liquidityMin = parseInt(draft.minLiquidity)
    }

    // Min daily reward
    if (draft.minDailyReward !== "all") {
        f.rewardMin = parseInt(draft.minDailyReward)
    }

    return f
}

// ─── Count active filters ──────────────────────────────────
export function countActiveFilters(draft: DraftFilters): number {
    return Object.values(draft).filter((v) => v !== "all").length
}

// ─── Main Component ────────────────────────────────────────
interface FilterDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FilterDrawer({ open, onOpenChange }: FilterDrawerProps) {
    const { filters, setFilters, loadEvents } = useAppStore()
    const [draft, setDraft] = useState<DraftFilters>(DEFAULT_DRAFT)

    const activeCount = useMemo(() => countActiveFilters(draft), [draft])

    const update = useCallback(
        (key: keyof DraftFilters) => (value: string) => {
            setDraft((prev) => ({ ...prev, [key]: value }))
        },
        []
    )

    const handleApply = useCallback(() => {
        const newFilters = buildFilters(draft)
        setFilters(newFilters)
        loadEvents()
        onOpenChange(false)
    }, [draft, setFilters, loadEvents, onOpenChange])

    const handleClear = useCallback(() => {
        setDraft(DEFAULT_DRAFT)
        setFilters({})
        loadEvents()
    }, [setFilters, loadEvents])

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
            <DrawerContent className="max-h-[85vh] rounded-t-xl">
                <DrawerHeader className="border-b border-border/50 pb-3">
                    <div className="flex items-center justify-between">
                        <DrawerTitle className="text-base font-semibold">Filters</DrawerTitle>
                        {activeCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClear}
                                className="text-xs text-muted-foreground hover:text-foreground h-7"
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                </DrawerHeader>

                <div className="overflow-y-auto flex-1 p-4 space-y-3">
                    {/* Row 1: Time Remaining + Created Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FilterSection icon={Clock} label="Time remaining:">
                            <ChipGroup
                                options={TIME_REMAINING}
                                selected={draft.timeRemaining}
                                onSelect={update("timeRemaining")}
                            />
                        </FilterSection>

                        <FilterSection icon={Calendar} label="Created date:">
                            <ChipGroup
                                options={CREATED_DATE}
                                selected={draft.createdDate}
                                onSelect={update("createdDate")}
                            />
                        </FilterSection>
                    </div>

                    {/* Row 2: Outcome Prices + Min Spread */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FilterSection icon={DollarSign} label="Outcome prices:">
                            <ChipGroup
                                options={OUTCOME_PRICES}
                                selected={draft.outcomePrice}
                                onSelect={update("outcomePrice")}
                            />
                        </FilterSection>

                        <FilterSection icon={TrendingUp} label="Min Spread:">
                            <ChipGroup
                                options={MIN_SPREAD}
                                selected={draft.minSpread}
                                onSelect={update("minSpread")}
                            />
                        </FilterSection>
                    </div>

                    {/* Row 3: Min APY + Min Volume */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FilterSection icon={Percent} label="Min APY:">
                            <ChipGroup
                                options={MIN_APY}
                                selected={draft.minApy}
                                onSelect={update("minApy")}
                            />
                        </FilterSection>

                        <FilterSection icon={BarChart3} label="Min Volume:">
                            <ChipGroup
                                options={MIN_VOLUME}
                                selected={draft.minVolume}
                                onSelect={update("minVolume")}
                            />
                        </FilterSection>
                    </div>

                    {/* Row 4: Min Liquidity + Min Daily Reward */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FilterSection icon={Droplets} label="Min Liquidity:">
                            <ChipGroup
                                options={MIN_LIQUIDITY}
                                selected={draft.minLiquidity}
                                onSelect={update("minLiquidity")}
                            />
                        </FilterSection>

                        <FilterSection icon={Gift} label="Min Daily Reward:">
                            <ChipGroup
                                options={MIN_DAILY_REWARD}
                                selected={draft.minDailyReward}
                                onSelect={update("minDailyReward")}
                            />
                        </FilterSection>
                    </div>

                    {/* Row 5: R% Reward Earning */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FilterSection icon={Percent} label="R% (Reward Earning):">
                            <ChipGroup
                                options={REWARD_EARNING}
                                selected={draft.rewardEarning}
                                onSelect={update("rewardEarning")}
                            />
                        </FilterSection>
                    </div>
                </div>

                <DrawerFooter className="border-t border-border/50 pt-3">
                    <Button
                        onClick={handleApply}
                        className="w-full h-11 text-sm font-semibold"
                        size="lg"
                    >
                        Show Results
                        {activeCount > 0 && (
                            <span className="ml-1.5 bg-primary-foreground/20 text-primary-foreground px-1.5 py-0.5 rounded text-[10px] font-bold">
                                {activeCount} filter{activeCount !== 1 ? "s" : ""}
                            </span>
                        )}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
