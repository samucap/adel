// Chart theme utilities - uses CSS variables from globals.css
// These are resolved at runtime from the CSS custom properties

// Get the computed value of a CSS variable
export function getCssVar(name: string): string {
    if (typeof window === 'undefined') {
        // Return fallback for SSR
        return getFallbackColor(name)
    }
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

// Fallback colors for SSR (dark theme defaults)
function getFallbackColor(name: string): string {
    const fallbacks: Record<string, string> = {
        '--chart-1': '#DCF763',
        '--chart-2': '#70D6FF',
        '--chart-3': '#ED254E',
        '--chart-4': '#A0ACAD',
        '--chart-5': '#4AE0A5',
        '--tooltip-bg': '#132925',
        '--tooltip-border': '#243F39',
        '--tooltip-text': '#E8EDEB',
        '--chart-grid': '#243F39',
        '--chart-axis': '#7A9A91',
        '--chart-cursor': '#1E3B35',
    }
    return fallbacks[name] || '#000000'
}

// Chart color palette (order matters for consistent coloring)
export const CHART_COLORS = [
    'var(--chart-1)',  // Lime/Yellow
    'var(--chart-2)',  // Cyan
    'var(--chart-3)',  // Red/Pink
    'var(--chart-4)',  // Gray
    'var(--chart-5)',  // Teal
] as const

// Raw hex colors for libraries that don't support CSS variables
export const CHART_COLORS_HEX = [
    '#DCF763',  // Lime/Yellow
    '#70D6FF',  // Cyan
    '#ED254E',  // Red/Pink
    '#A0ACAD',  // Gray
    '#4AE0A5',  // Teal
] as const

// Tooltip style object for Recharts
export const chartTooltipStyle = {
    backgroundColor: 'var(--tooltip-bg)',
    border: '1px solid var(--tooltip-border)',
    borderRadius: '0.5rem',
    color: 'var(--tooltip-text)',
} as const

// Tooltip style with hex fallbacks for Recharts (which needs actual values)
export const chartTooltipStyleHex = {
    backgroundColor: '#132925',
    border: '1px solid #243F39',
    borderRadius: '0.5rem',
    color: '#E8EDEB',
} as const

// Chart grid/axis colors
export const chartTheme = {
    grid: '#243F39',
    axis: '#7A9A91',
    cursor: '#1E3B35',
    cursorFill: '#1E3B3580',
} as const
