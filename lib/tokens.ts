// Runtime access to the CSS tokens in app/tokens.css, for canvas code
// (lightweight-charts, particles) that cannot use var(--…) directly.

export const SERIES_VARS = ["--series-1", "--series-2", "--series-3", "--series-4", "--series-5"] as const

/** `var(--series-n)` strings for DOM/SVG consumers, cycling through the palette. */
export function seriesVar(index: number): string {
  return `var(${SERIES_VARS[index % SERIES_VARS.length]})`
}

/** Computed value of a token such as `--accent`. Empty string during SSR. */
export function readToken(name: string): string {
  if (typeof window === "undefined") return ""
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/** Resolves `var(--x)` to its computed value; other colors pass through. */
export function resolveColor(color: string): string {
  const m = /^var\((--[\w-]+)\)$/.exec(color.trim())
  return m ? readToken(m[1]) || color : color
}
