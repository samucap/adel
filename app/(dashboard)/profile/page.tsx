"use client"

import { useStore } from "@/hooks/use-store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, History, Wallet } from "lucide-react"

export default function ProfilePage() {
    const { user } = useStore()

    return (
        <div className="flex-1 space-y-6">
            {/* Header Profile Card */}
            <div className="flex items-center space-x-4 bg-card p-6 rounded-xl border shadow-sm">
                <Avatar className="h-20 w-20 border-2 border-amber-500">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-amber-100 text-amber-800 text-2xl">TR</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">Trader 0x</h2>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <span>@polymarket.whales</span>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                            <Trophy className="h-3 w-3 mr-1" /> Rank #{user.rank}
                        </Badge>
                    </div>
                </div>
                <div className="ml-auto text-right">
                    <div className="text-sm text-muted-foreground">Portfolio Value</div>
                    <div className="text-3xl font-mono font-bold">${user.balance.toLocaleString()}</div>
                    <div className="text-sm text-green-500 flex items-center justify-end">
                        <TrendingUp className="h-3 w-3 mr-1" /> +${user.pnlDay} (24h)
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total PnL</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">+${user.pnlTotal.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">All-time profit</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user.positions}</div>
                        <p className="text-xs text-muted-foreground">Active markets</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Volume Traded</CardTitle>
                        <History className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$1.2M</div>
                        <p className="text-xs text-muted-foreground">Lifetime volume</p>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Tabs */}
            <Tabs defaultValue="positions" className="w-full">
                <TabsList>
                    <TabsTrigger value="positions">Positions</TabsTrigger>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>
                <TabsContent value="positions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Positions</CardTitle>
                            <CardDescription>You are currently betting on {user.positions} outcomes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="space-y-1">
                                            <div className="font-medium">Trump vs Biden 2024</div>
                                            <div className="text-sm text-muted-foreground">Outcome: YES</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-green-500">+$124.00</div>
                                            <div className="text-xs text-muted-foreground">3,500 Shares</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="activity">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center p-8 text-muted-foreground border-dashed border-2 rounded-lg">
                                No recent transactions found.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function Activity(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
