"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockMarkets } from "@/lib/mock-data"
import { Flame, Bot } from "lucide-react"
import Link from "next/link"

export function HotMarketsList() {
    const hotMarkets = mockMarkets.filter(m => m.isHot || m.isWhaleActive).slice(0, 5);

    return (
        <div className="space-y-8">
            {hotMarkets.map((market) => (
                <div key={market.id} className="flex items-center group cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                    <Avatar className="h-9 w-9">
                        {/* Placeholder for market icon */}
                        <AvatarFallback className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                            {market.category.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none group-hover:text-amber-500 transition-colors">
                            <Link href="/market-viewer">{market.title}</Link>
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className={market.change24h > 0 ? "text-green-500" : "text-red-500"}>
                                {market.change24h > 0 ? "+" : ""}{market.change24h}%
                            </span>
                            <span>•</span>
                            <span>${(market.volume / 1000).toFixed(0)}k Vol</span>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        {market.isHot && (
                            <div className="flex items-center text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full text-xs font-medium">
                                <Flame className="h-3 w-3 mr-1" /> Hot
                            </div>
                        )}
                        {market.isWhaleActive && (
                            <div className="flex items-center text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full text-xs font-medium">
                                <Bot className="h-3 w-3 mr-1" /> Whale
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
