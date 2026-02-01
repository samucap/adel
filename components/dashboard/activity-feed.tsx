"use client"

import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Activity {
    id: string;
    user: string;
    action: "buy" | "sell";
    market: string;
    outcome: string;
    amount: string;
    odds: number;
    time: string;
}

interface ActivityFeedProps {
    activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
    return (
        <Card className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-2">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border/50"
                    >
                        <div
                            className={`p-2 rounded-lg ${activity.action === "buy"
                                    ? "bg-green-500/10"
                                    : "bg-red-500/10"
                                }`}
                        >
                            {activity.action === "buy" ? (
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4 text-red-500" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm leading-none mb-1">
                                        <span className="font-semibold text-foreground">{activity.user}</span>{" "}
                                        <span className="text-muted-foreground">
                                            {activity.action === "buy" ? "bought" : "sold"}
                                        </span>{" "}
                                        <span className={activity.action === "buy" ? "text-green-500" : "text-red-500"}>
                                            {activity.outcome}
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate" title={activity.market}>
                                        {activity.market}
                                    </p>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {activity.time}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs font-mono font-medium text-foreground">
                                    {activity.amount}
                                </span>
                                <span className="text-xs text-muted-foreground">@{activity.odds}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
