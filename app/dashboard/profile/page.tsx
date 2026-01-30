"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile } from "@/types/dashboard"

// Mock Profile Data
const mockProfile: UserProfile = {
    username: "crypto_whale_99",
    address: "0x123...abc",
    avatar: "https://github.com/shadcn.png",
    totalVolume: 1250000,
    totalPnl: 45000,
    positions: [
        {
            asset: "Will Bitcoin hit $100k in 2024?",
            side: "YES",
            size: 5000,
            avgPrice: 0.45,
            currentPrice: 0.60,
            pnl: 750
        },
        {
            asset: "Super Bowl 2025 Winner",
            side: "NO",
            size: 2000,
            avgPrice: 0.20,
            currentPrice: 0.10,
            pnl: 200
        }
    ],
    activity: [
        {
            id: "1",
            type: "BUY",
            asset: "Will Bitcoin hit $100k?",
            side: "YES",
            amount: 1000,
            price: 0.55,
            timestamp: "2024-02-15T10:00:00Z"
        },
        {
            id: "2",
            type: "SELL",
            asset: "Fed Interest Rate Cut",
            side: "NO",
            amount: 5000,
            price: 0.85,
            timestamp: "2024-02-14T14:30:00Z"
        }
    ]
}

export default function ProfilePage() {
    return (
        <div className="flex flex-col gap-6 ">
            {/* Profile Header */}
            <div className="flex items-center gap-6 p-6 bg-card border rounded-xl">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={mockProfile.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold">{mockProfile.username}</h1>
                    <p className="text-muted-foreground font-mono text-sm">{mockProfile.address}</p>
                    <div className="flex gap-4 mt-2">
                        <Badge variant="outline" className="text-base px-3 py-1">
                            Vol: ${mockProfile.totalVolume.toLocaleString()}
                        </Badge>
                        <Badge variant="outline" className="text-base px-3 py-1 bg-green-500/10 text-green-600 border-green-200">
                            P/L: +${mockProfile.totalPnl.toLocaleString()}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="positions" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                    <TabsTrigger value="positions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
                        Positions
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
                        Activity
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="positions" className="mt-6">
                    <div className="grid gap-4">
                        {mockProfile.positions.map((pos, idx) => (
                            <Card key={idx} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-1 h-12 rounded-full ${pos.side === "YES" ? "bg-green-500" : "bg-red-500"}`} />
                                            <div>
                                                <p className="font-semibold">{pos.asset}</p>
                                                <div className="flex gap-2 text-sm text-muted-foreground">
                                                    <span className={pos.side === "YES" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                                        {pos.side}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{pos.size} Shares</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-medium">${pos.pnl.toLocaleString()}</p>
                                            <p className="text-xs text-green-600">+{((pos.pnl / (pos.size * pos.avgPrice)) * 100).toFixed(2)}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="activity">
                    <div className="space-y-4">
                        {mockProfile.activity.map((act) => (
                            <div key={act.id} className="flex justify-between items-center p-4 border rounded-lg bg-card">
                                <div className="space-y-1">
                                    <p className="font-medium">
                                        {act.type === "BUY" ? "Bought" : "Sold"} <span className={act.side === "YES" ? "text-green-600" : "text-red-600"}>{act.side}</span> {act.asset}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{new Date(act.timestamp).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono">{act.amount} shares @ {act.price}¢</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
