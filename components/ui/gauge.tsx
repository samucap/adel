"use client"

import React from 'react';

interface GaugeProps {
    value: number; // 0-100
    label?: string; // e.g. "Chance" or "Up"
    subLabel?: string;
    size?: number;
    color?: string;
}

export function Gauge({ value, label, subLabel, size = 60, color = "#27F293" }: GaugeProps) {
    const radius = size / 2 - 4; // stroke width 4
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#2C2D31"
                    strokeWidth="4"
                    fill="none"
                />
                {/* Progress circle */}
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
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white font-bold leading-none" style={{ fontSize: size * 0.28 }}>
                    {Math.round(value)}%
                </span>
                {label && (
                    <span className="text-muted-foreground font-medium uppercase mt-0.5" style={{ fontSize: size * 0.15 }}>
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
}
