// Chart styling from the tokens in app/tokens.css. Recharts accepts var(--…) in SVG attributes.

export const chartTooltipStyle = {
    backgroundColor: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
} as const

export const chartTheme = {
    grid: 'var(--border)',
    axis: 'var(--muted)',
    cursor: 'var(--hover)',
} as const
