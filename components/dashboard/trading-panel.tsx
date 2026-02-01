"use client"

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, Wallet } from "lucide-react";

interface TradingPanelProps {
    marketTitle: string;
    options: Array<{ name: string; odds: number }>;
}

export function TradingPanel({ marketTitle, options }: TradingPanelProps) {
    const [selectedOutcome, setSelectedOutcome] = useState(0);
    const [amount, setAmount] = useState("100");
    const [activeTab, setActiveTab] = useState("buy");

    const currentOdds = options[selectedOutcome]?.odds || 50;
    // Calculate shares based on price (odds / 100)
    // If odds are 50%, price is $0.50. $100 buys 200 shares.
    const price = currentOdds / 100;
    const shares = amount ? parseFloat(amount) / price : 0;
    // Payout is $1 per share if successful
    const potentialPayout = shares * 1;
    const potentialProfit = potentialPayout - parseFloat(amount || "0");
    const roi = amount && parseFloat(amount) > 0 ? (potentialProfit / parseFloat(amount)) * 100 : 0;

    return (
        <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Place Order</h3>
                <div className="text-xs text-muted-foreground flex items-center">
                    <Wallet className="w-3 h-3 mr-1" /> Balance: $0.00
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                        value="buy"
                        className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400"
                    >
                        Buy
                    </TabsTrigger>
                    <TabsTrigger
                        value="sell"
                        className="data-[state=active]:bg-red-500/10 data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400"
                    >
                        Sell
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="space-y-6 flex-1">
                <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Outcome</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedOutcome(idx)}
                                className={`p-3 rounded-xl border-2 transition-all relative overflow-hidden text-left ${selectedOutcome === idx
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-muted bg-muted/20 hover:border-primary/30"
                                    }`}
                            >
                                <div className="flex flex-col gap-1 z-10 relative">
                                    <span className="text-sm font-semibold">{option.name}</span>
                                    <span className="text-lg font-mono tracking-tight text-primary">{option.odds}%</span>
                                </div>
                                {selectedOutcome === idx && (
                                    <div className="absolute top-0 right-0 p-1">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <Label htmlFor="amount" className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Amount (USDC)</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-10 h-12 text-lg font-mono"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="flex gap-2 mt-2">
                        {["10", "50", "100", "Max"].map(val => (
                            <button
                                key={val}
                                onClick={() => val !== "Max" && setAmount(val)}
                                className="text-xs bg-muted/50 hover:bg-muted px-2 py-1 rounded transition-colors"
                            >
                                {val === "Max" ? "Max" : `$${val}`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg space-y-3 text-sm border border-border/50">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Price per Share</span>
                        <span className="font-mono font-medium">${price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Est. Shares</span>
                        <span className="font-mono font-medium">{shares.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-border/50 my-2" />
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Potential Return</span>
                        <span className={`font-mono font-bold ${potentialProfit > 0 ? "text-green-500" : "text-muted-foreground"}`}>
                            ${potentialPayout.toFixed(2)} <span className="text-xs font-normal opacity-80">(+{roi.toFixed(0)}%)</span>
                        </span>
                    </div>
                </div>

                <Button
                    className={`w-full h-12 text-base font-semibold shadow-lg ${activeTab === "buy"
                            ? "bg-green-600 hover:bg-green-700 text-white shadow-green-500/20"
                            : "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
                        }`}
                    size="lg"
                >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    {activeTab === "buy" ? `Buy ${options[selectedOutcome]?.name}` : `Sell ${options[selectedOutcome]?.name}`}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                    By trading you agree to the <span className="underline cursor-pointer hover:text-foreground">Terms of Service</span>
                </p>
            </div>
        </Card>
    );
}
