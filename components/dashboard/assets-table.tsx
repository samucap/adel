"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Columns3,
  Filter,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Asset = {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  issuer: string;
  referenceAsset: string;
  marketSector: string;
  chains: string[];
  marketCap: number;
  marketCapChange30d: number;
  marketCapChange90d: number;
  marketCapChange180d: number;
  sparkline: number[];
};

const assets: Asset[] = [
  {
    id: "1",
    name: "Tether USD",
    symbol: "USDT",
    logo: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    issuer: "Tether",
    referenceAsset: "USD",
    marketSector: "Stablecoin",
    chains: ["Ethereum", "Tron", "BSC"],
    marketCap: 119_800_000_000,
    marketCapChange30d: 2.4,
    marketCapChange90d: 8.1,
    marketCapChange180d: 15.3,
    sparkline: [40, 42, 45, 43, 48, 52, 50, 55, 58, 60],
  },
  {
    id: "2",
    name: "USD Coin",
    symbol: "USDC",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    issuer: "Circle",
    referenceAsset: "USD",
    marketSector: "Stablecoin",
    chains: ["Ethereum", "Solana", "Polygon"],
    marketCap: 43_200_000_000,
    marketCapChange30d: -1.2,
    marketCapChange90d: 3.5,
    marketCapChange180d: 12.8,
    sparkline: [50, 48, 45, 47, 44, 42, 45, 43, 46, 48],
  },
  {
    id: "3",
    name: "Dai",
    symbol: "DAI",
    logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
    issuer: "MakerDAO",
    referenceAsset: "USD",
    marketSector: "Stablecoin",
    chains: ["Ethereum", "Polygon", "Arbitrum"],
    marketCap: 5_340_000_000,
    marketCapChange30d: 0.8,
    marketCapChange90d: -2.1,
    marketCapChange180d: 5.4,
    sparkline: [30, 32, 35, 33, 31, 34, 36, 35, 37, 38],
  },
  {
    id: "4",
    name: "First Digital USD",
    symbol: "FDUSD",
    logo: "https://cryptologos.cc/logos/first-digital-usd-fdusd-logo.png",
    issuer: "First Digital",
    referenceAsset: "USD",
    marketSector: "Stablecoin",
    chains: ["Ethereum", "BSC"],
    marketCap: 2_890_000_000,
    marketCapChange30d: 15.6,
    marketCapChange90d: 42.3,
    marketCapChange180d: 156.2,
    sparkline: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
  },
  {
    id: "5",
    name: "PayPal USD",
    symbol: "PYUSD",
    logo: "https://cryptologos.cc/logos/paypal-usd-pyusd-logo.png",
    issuer: "PayPal",
    referenceAsset: "USD",
    marketSector: "Stablecoin",
    chains: ["Ethereum", "Solana"],
    marketCap: 824_000_000,
    marketCapChange30d: 8.2,
    marketCapChange90d: 28.5,
    marketCapChange180d: 89.3,
    sparkline: [15, 18, 22, 25, 28, 32, 35, 38, 42, 45],
  },
  {
    id: "6",
    name: "BlackRock USD Fund",
    symbol: "BUIDL",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    issuer: "BlackRock",
    referenceAsset: "Treasury Fund",
    marketSector: "Tokenized Fund",
    chains: ["Ethereum"],
    marketCap: 562_000_000,
    marketCapChange30d: 24.8,
    marketCapChange90d: 156.2,
    marketCapChange180d: 312.5,
    sparkline: [10, 15, 20, 28, 35, 42, 48, 55, 62, 70],
  },
  {
    id: "7",
    name: "Pax Gold",
    symbol: "PAXG",
    logo: "https://cryptologos.cc/logos/pax-gold-paxg-logo.png",
    issuer: "Paxos",
    referenceAsset: "Gold",
    marketSector: "Tokenized Commodity",
    chains: ["Ethereum"],
    marketCap: 498_000_000,
    marketCapChange30d: 5.2,
    marketCapChange90d: 12.8,
    marketCapChange180d: 28.4,
    sparkline: [35, 38, 40, 42, 45, 44, 48, 50, 52, 55],
  },
  {
    id: "8",
    name: "Tether Gold",
    symbol: "XAUT",
    logo: "https://cryptologos.cc/logos/tether-gold-xaut-logo.png",
    issuer: "Tether",
    referenceAsset: "Gold",
    marketSector: "Tokenized Commodity",
    chains: ["Ethereum"],
    marketCap: 456_000_000,
    marketCapChange30d: 4.8,
    marketCapChange90d: 11.2,
    marketCapChange180d: 25.6,
    sparkline: [32, 35, 38, 40, 42, 41, 44, 46, 48, 50],
  },
];

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  return `$${value.toLocaleString()}`;
}

function ChangeCell({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <div
      className={cn(
        "flex items-center gap-1 text-sm",
        isPositive ? "text-positive" : "text-negative"
      )}
    >
      {isPositive ? (
        <ArrowUp className="h-3 w-3" />
      ) : (
        <ArrowDown className="h-3 w-3" />
      )}
      {Math.abs(value).toFixed(1)}%
    </div>
  );
}

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 24;
  const width = 60;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const isPositive = data[data.length - 1] >= data[0];

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={isPositive ? "var(--positive)" : "var(--negative)"}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
}

export function AssetsTable() {
  const [sortColumn, setSortColumn] = useState<string>("marketCap");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue="asset">
            <SelectTrigger className="h-8 w-auto gap-2 bg-input text-sm">
              <span className="text-muted-foreground">Group by</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asset">Asset</SelectItem>
              <SelectItem value="issuer">Issuer</SelectItem>
              <SelectItem value="sector">Market Sector</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
            <Filter className="h-3 w-3" />
            Add filter
          </Button>

          <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 py-1.5">
            <Checkbox id="bridged" />
            <label
              htmlFor="bridged"
              className="text-sm text-muted-foreground"
            >
              Include bridged
            </label>
          </div>
        </div>

        <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
          <Columns3 className="h-3 w-3" />
          Edit columns
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[250px]">
                <button
                  className="flex items-center text-xs font-medium"
                  onClick={() => handleSort("name")}
                >
                  Asset
                  <SortIcon column="name" />
                </button>
              </TableHead>
              <TableHead className="w-[120px]">
                <button
                  className="flex items-center text-xs font-medium"
                  onClick={() => handleSort("issuer")}
                >
                  Issuer
                  <SortIcon column="issuer" />
                </button>
              </TableHead>
              <TableHead className="w-[120px]">
                <span className="text-xs font-medium">Reference Asset</span>
              </TableHead>
              <TableHead className="w-[130px]">
                <span className="text-xs font-medium">Market Sector</span>
              </TableHead>
              <TableHead className="w-[150px]">
                <span className="text-xs font-medium">Chains</span>
              </TableHead>
              <TableHead className="w-[120px] text-right">
                <button
                  className="ml-auto flex items-center text-xs font-medium"
                  onClick={() => handleSort("marketCap")}
                >
                  Market Cap
                  <SortIcon column="marketCap" />
                </button>
              </TableHead>
              <TableHead className="w-[80px]">
                <span className="text-xs font-medium">30d</span>
              </TableHead>
              <TableHead className="w-[80px]">
                <button
                  className="flex items-center text-xs font-medium"
                  onClick={() => handleSort("marketCapChange30d")}
                >
                  Change 30d
                  <SortIcon column="marketCapChange30d" />
                </button>
              </TableHead>
              <TableHead className="w-[80px]">
                <span className="text-xs font-medium">Change 90d</span>
              </TableHead>
              <TableHead className="w-[80px]">
                <span className="text-xs font-medium">Change 180d</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow
                key={asset.id}
                className="cursor-pointer transition-colors hover:bg-accent/50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={asset.logo || "/placeholder.svg"}
                        alt={asset.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {asset.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {asset.symbol}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {asset.issuer}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {asset.referenceAsset}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="font-normal text-muted-foreground"
                  >
                    {asset.marketSector}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {asset.chains.slice(0, 2).map((chain) => (
                      <Badge
                        key={chain}
                        variant="outline"
                        className="text-xs font-normal"
                      >
                        {chain}
                      </Badge>
                    ))}
                    {asset.chains.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-xs font-normal"
                      >
                        +{asset.chains.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(asset.marketCap)}
                </TableCell>
                <TableCell>
                  <MiniSparkline data={asset.sparkline} />
                </TableCell>
                <TableCell>
                  <ChangeCell value={asset.marketCapChange30d} />
                </TableCell>
                <TableCell>
                  <ChangeCell value={asset.marketCapChange90d} />
                </TableCell>
                <TableCell>
                  <ChangeCell value={asset.marketCapChange180d} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center py-4">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Sparkles className="mr-2 h-4 w-4" />
          Loading more assets...
        </Button>
      </div>
    </div>
  );
}
