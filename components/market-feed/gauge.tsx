"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GaugeProps {
    value: number; // 0-100
    size?: number; // width/height in px
    color?: string; // hex color or CSS variable
    className?: string;
    showLabel?: boolean;
}

export function Gauge({
    value,
    size = 60,
    color = "var(--primary)",
    className,
    showLabel = true
}: GaugeProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const radius = size / 2 - 4; // stroke width 4
    const circumference = 2 * Math.PI * radius;

    // Animation duration in ms
    const DURATION = 1000;

    useEffect(() => {
        let startTimestamp: number | null = null;
        const startValue = 0; // Always animate from 0 on mount/change for this effect

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / DURATION, 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const current = Math.floor(startValue + (value - startValue) * easeProgress);
            setDisplayValue(current);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [value]);

    const offset = circumference - (displayValue / 100) * circumference;

    return (
        <div
            className={cn("flex flex-col items-center justify-center relative", className)}
            style={{ width: size, height: size }}
        >
            {/* SVG Container */}
            <svg
                width={size}
                height={size}
                className="transform -rotate-90 pointer-events-none"
            >
                {/* Defs for Glow Filter */}
                <defs>
                    <filter id={`glow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4"
                    fill="none"
                />

                {/* Progress circle with Glow */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    filter={`url(#glow-${size})`}
                    className="transition-all duration-75"
                    style={{
                        filter: `drop-shadow(0 0 2px ${color})`
                    }}
                />
            </svg>

            {/* Centered Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span
                    className="font-bold leading-none text-foreground tracking-tight"
                    style={{ fontSize: size * 0.28 }}
                >
                    {displayValue}%
                </span>
                {showLabel && (
                    <span
                        className="text-muted-foreground font-medium uppercase mt-0.5"
                        style={{ fontSize: size * 0.15 }}
                    >
                        Chance
                    </span>
                )}
            </div>
        </div>
    );
}
