"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Coins,
  Compass,
  Layers,
  LayoutDashboard,
  LineChart,
  Search,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/" },
  { icon: Compass, label: "Discover", href: "/discover" },
  { icon: Layers, label: "Market Sectors", href: "/sectors" },
  { icon: BarChart3, label: "Projects", href: "/projects" },
  { icon: LineChart, label: "Metrics", href: "/metrics" },
  { icon: Coins, label: "Tokenized Assets", href: "/", active: true },
  { icon: Wallet, label: "Studio", href: "/studio" },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">T</span>
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-foreground">
              Terminal
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                item.active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {item.label === "Tokenized Assets" && !collapsed && (
                <span className="ml-auto rounded bg-positive/20 px-1.5 py-0.5 text-[10px] font-medium text-positive">
                  New
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}
