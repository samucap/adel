const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY
const YEAR = 12 * MONTH

/** Largest unit that fits: 45m, 5h, 3d, 2mo, 1y. Past or zero is "ended". */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "ended"
  if (ms < HOUR) return `${Math.max(1, Math.floor(ms / MINUTE))}m`
  if (ms < DAY) return `${Math.floor(ms / HOUR)}h`
  if (ms < MONTH) return `${Math.floor(ms / DAY)}d`
  if (ms < YEAR) return `${Math.floor(ms / MONTH)}mo`
  return `${Math.floor(ms / YEAR)}y`
}

/** Duration from now until an ISO timestamp. Invalid or past dates are "ended". */
export function formatEndDate(iso: string, now = Date.now()): string {
  const time = new Date(iso).getTime()
  if (Number.isNaN(time)) return "ended"
  return formatDuration(time - now)
}

/** "Ends in 3d", or "ended" once the timestamp is past. */
export function formatEndLabel(iso: string, now = Date.now()): string {
  const label = formatEndDate(iso, now)
  return label === "ended" ? "ended" : `Ends in ${label}`
}
