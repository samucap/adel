import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoGridProps {
    children: ReactNode;
    className?: string;
    /** Number of columns. Defaults to 4 on md+ */
    cols?: 3 | 4 | 6;
}

type BentoSize =
    | "sm"      // 1x1 - small stats/badges
    | "base"    // 1x1 - standard panel  
    | "md"      // 2x1 - medium horizontal
    | "lg"      // 2x2 - large square
    | "xl"      // 3x2 - extra large
    | "wide"    // 2x1 - wide horizontal
    | "tall";   // 1x2 - tall vertical

interface BentoCardProps {
    children: ReactNode;
    className?: string;
    /** Size preset determining col/row spans */
    size?: BentoSize;
}

const sizeClasses: Record<BentoSize, string> = {
    sm: "col-span-1 row-span-1 min-h-[100px]",
    base: "col-span-1 row-span-1 min-h-[180px]",
    md: "col-span-1 md:col-span-2 row-span-1 min-h-[200px]",
    lg: "col-span-1 md:col-span-2 row-span-1 md:row-span-2 min-h-[280px]",
    xl: "col-span-1 md:col-span-3 row-span-1 md:row-span-2 min-h-[350px]",
    wide: "col-span-1 md:col-span-2 row-span-1 min-h-[180px]",
    tall: "col-span-1 row-span-1 md:row-span-2 min-h-[350px]",
};

export function BentoGrid({ children, className, cols = 4 }: BentoGridProps) {
    const colClasses = {
        3: "md:grid-cols-3",
        4: "md:grid-cols-4",
        6: "md:grid-cols-6",
    };

    return (
        <div
            className={cn(
                "grid grid-cols-1 auto-rows-[minmax(120px,auto)] gap-3",
                colClasses[cols],
                className
            )}
        >
            {children}
        </div>
    );
}

export function BentoCard({ children, className, size = "base" }: BentoCardProps) {
    return (
        <div
            className={cn(
                "border rounded-xl group/bento shadow-input dark:shadow-none bg-background/50 border-border/50 flex flex-col overflow-hidden transition-all hover:border-border/80 hover:shadow-lg",
                sizeClasses[size],
                className
            )}
        >
            <div className="h-full w-full flex flex-col">
                {children}
            </div>
        </div>
    );
}
