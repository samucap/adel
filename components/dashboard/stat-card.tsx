"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
    title: string;
    value: string;
    trend: string;
    icon: any;
    accentColor: string;
}

export function StatsCard({ title, value, trend, icon: Icon, accentColor }: StatsCardProps) {
    return (
        <Card className="h-full flex flex-col justify-center border-border/60 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-200 hover:border-primary/30 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
                <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
                <div
                    className="p-1 rounded-md transition-colors"
                    style={{ backgroundColor: `${accentColor}15` }}
                >
                    <Icon className="h-3 w-3" style={{ color: accentColor }} />
                </div>
            </CardHeader>
            <CardContent className="px-3 pb-3">
                <div className="text-lg font-bold font-mono tracking-tight">{value}</div>
                <div className="text-[9px] text-muted-foreground mt-0.5 flex items-center">
                    <span className="font-medium mr-1" style={{ color: trend.startsWith('+') || trend.startsWith('New') ? '#4AE0A5' : '#ED254E' }}>{trend}</span>
                    <span className="opacity-70">24h</span>
                </div>
            </CardContent>
        </Card>
    )
}
