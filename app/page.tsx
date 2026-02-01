"use client"

import { NavLayout } from "@/components/nav-layout"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { MarketTreemap } from "@/components/dashboard/market-treemap"
import { HotMarketsList } from "@/components/dashboard/hot-markets-list"
import { MarketChart } from "@/components/dashboard/market-chart"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Flame } from "lucide-react"

export default function Home() {
  return (
    <NavLayout>
      <div className="flex flex-1 flex-col h-[calc(100vh-5rem)]">
        <ResizablePanelGroup direction="vertical" className="h-full rounded-lg border bg-background shadow-sm">
          {/* Top Panel: Market Globals / Stats */}
          <ResizablePanel defaultSize={15} minSize={10} maxSize={20} className="bg-muted/10">
            <div className="h-full flex items-center">
              <DashboardStats />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Bottom Panel: Interactive Content */}
          <ResizablePanel defaultSize={85}>
            <ResizablePanelGroup direction="horizontal">
              {/* Left: Treemap (Activity Map) & Charts */}
              <ResizablePanel defaultSize={70} minSize={30}>
                <div className="h-full p-4 flex flex-col">
                  <Tabs defaultValue="map" className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <TabsList>
                        <TabsTrigger value="map">Liquidity Map</TabsTrigger>
                        <TabsTrigger value="chart">Market Overview</TabsTrigger>
                      </TabsList>
                      <span className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live Updates
                      </span>
                    </div>

                    <div className="flex-1 bg-card border rounded-lg overflow-hidden relative">
                      <TabsContent value="map" className="h-full mt-0">
                        <div className="absolute inset-0 p-4">
                          <MarketTreemap />
                        </div>
                      </TabsContent>
                      <TabsContent value="chart" className="h-full mt-0">
                        <div className="absolute inset-0 p-4">
                          <MarketChart data={overviewChartData} type="area" />
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </ResizablePanel>

              <ResizableHandle />

              {/* Right: Hot Lists & Feed */}
              <ResizablePanel defaultSize={30} minSize={20} className="bg-muted/5">
                <div className="h-full flex flex-col">
                  <div className="p-4 flex-none">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" /> Trending
                    </h3>
                    <HotMarketsList />
                  </div>
                  <Separator />
                  <div className="flex-1 overflow-hidden p-4">
                    <ActivityFeed activities={activities} />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </NavLayout>
  )
}

const overviewChartData = [
  { date: "Jan", yes: 62, no: 38 },
  { date: "Feb", yes: 64, no: 36 },
  { date: "Mar", yes: 63, no: 37 },
  { date: "Apr", yes: 66, no: 34 },
  { date: "May", yes: 68, no: 32 },
  { date: "Jun", yes: 70, no: 30 },
];

const activities = [
  {
    id: "1",
    user: "trader_0x42a",
    action: "buy" as const,
    market: "Bitcoin $100K",
    outcome: "Yes",
    amount: "$2,450",
    odds: 74.5,
    time: "2m ago",
  },
  {
    id: "2",
    user: "whale_alpha",
    action: "sell" as const,
    market: "Democrats Midterms",
    outcome: "No",
    amount: "$8,200",
    odds: 47.7,
    time: "5m ago",
  },
  {
    id: "3",
    user: "crypto_degen",
    action: "buy" as const,
    market: "ETH Flip BTC",
    outcome: "Yes",
    amount: "$1,230",
    odds: 28.4,
    time: "12m ago",
  },
  {
    id: "4",
    user: "sports_better",
    action: "buy" as const,
    market: "Man City Premier League",
    outcome: "Yes",
    amount: "$550",
    odds: 62.8,
    time: "18m ago",
  },
  {
    id: "5",
    user: "trader_xyz",
    action: "sell" as const,
    market: "Apple AR Glasses",
    outcome: "Yes",
    amount: "$3,100",
    odds: 45.2,
    time: "25m ago",
  },
];
