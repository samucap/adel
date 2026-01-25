"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 bg-input pl-9 text-sm"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5">
            <Command className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Docs
        </Button>
        <Button size="sm">Connect Wallet</Button>
      </div>
    </header>
  );
}
