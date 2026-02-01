"use client"

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";

interface MarketOption {
    name: string;
    odds: number;
    change: number;
}

interface MarketCardProps {
    id: string;
    title: string;
    category: string;
    image: string;
    volume: string;
    liquidity: string;
    endDate: string;
    options: MarketOption[];
    trending?: boolean;
    onClick?: () => void;
}

export function MarketCard({
    title,
    category,
    image,
    volume,
    endDate,
    options,
    trending,
    onClick,
}: MarketCardProps) {
    return (
        <Card
            className="overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg group"
            onClick={onClick}
        >
            <div className="relative h-40 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-sm shadow-sm">
                    {category}
                </Badge>
                {trending && (
                    <Badge className="absolute top-3 right-3 bg-orange-500 text-white border-none shadow-sm animate-pulse">
                        🔥 Trending
                    </Badge>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-semibold mb-3 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                    {title}
                </h3>

                <div className="space-y-2 mb-4">
                    {options.map((option, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-sm text-muted-foreground truncate">{option.name}</span>
                                {option.change > 0 ? (
                                    <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
                                ) : (
                                    <TrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-primary">
                                    {option.odds}%
                                </span>
                                <span className={`text-xs ${option.change > 0 ? "text-green-500" : "text-red-500"}`}>
                                    {option.change > 0 ? "+" : ""}{option.change}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{volume} Vol</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{endDate}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
