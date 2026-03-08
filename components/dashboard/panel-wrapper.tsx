"use client"

import { useEventStore } from "@/stores/eventStore";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardPanelWrapperProps {
    panelId: string;
    defaultComponent: ReactNode;
    className?: string;
}

export function DashboardPanelWrapper({
    panelId,
    defaultComponent,
    className,
}: DashboardPanelWrapperProps) {
    const { currMkt, currEv } = useEventStore();

    // Logic to switch components based on state could go here.
    // For now, we simply render the default component but wrapping it
    // ensures we have a slot to inject dynamic content later.

    // Example future logic:
    // if (panelId === 'details-panel' && currMkt) {
    //   return <MarketDetailView market={currMkt} />
    // }

    return (
        <div className={cn("h-full w-full", className)}>
            {defaultComponent}
        </div>
    );
}
