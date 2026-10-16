import { TickMarkType, type Time, type UTCTimestamp } from "lightweight-charts"

/** Polymarket prices are 0–1. Chart values are percents. */
export function priceToPercent(price: number): number {
  return Math.round(price * 100000) / 1000
}

/** Probability axis label. Series values are already in percent. */
export function formatProbability(value: number): string {
  if (!Number.isFinite(value)) return ""
  return `${value.toFixed(1)}%`
}

export const probabilityPriceFormat = {
  type: "custom" as const,
  minMove: 0.1,
  formatter: formatProbability,
}

function utcParts(seconds: number): { year: number; month: string; day: number; time: string; timeWithSeconds: string } | null {
  const date = new Date(seconds * 1000)
  if (Number.isNaN(date.getTime())) return null
  const month = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short" }).format(date)
  const day = date.getUTCDate()
  const hh = String(date.getUTCHours()).padStart(2, "0")
  const mm = String(date.getUTCMinutes()).padStart(2, "0")
  const ss = String(date.getUTCSeconds()).padStart(2, "0")
  return {
    year: date.getUTCFullYear(),
    month,
    day,
    time: `${hh}:${mm}`,
    timeWithSeconds: `${hh}:${mm}:${ss}`,
  }
}

export function timeToSeconds(time: Time): number | null {
  if (typeof time === "number") return Number.isFinite(time) ? time : null
  if (typeof time === "string") {
    const ms = Date.parse(time)
    return Number.isNaN(ms) ? null : Math.floor(ms / 1000)
  }
  if (time && typeof time === "object" && "year" in time) {
    return Math.floor(Date.UTC(time.year, time.month - 1, time.day) / 1000)
  }
  return null
}

/** Short tick so year, month, day, and time labels do not share one long format. */
export function formatTickMark(time: Time, tickMarkType: TickMarkType): string {
  const seconds = timeToSeconds(time)
  if (seconds === null) return ""
  const parts = utcParts(seconds)
  if (!parts) return ""
  switch (tickMarkType) {
    case TickMarkType.Year:
      return String(parts.year)
    case TickMarkType.Month:
      return parts.month
    case TickMarkType.DayOfMonth:
      return `${parts.month} ${parts.day}`
    case TickMarkType.TimeWithSeconds:
      return parts.timeWithSeconds
    default:
      return parts.time
  }
}

export function formatChartTime(time: Time): string {
  const seconds = timeToSeconds(time)
  if (seconds === null) return ""
  const parts = utcParts(seconds)
  if (!parts) return ""
  return `${parts.month} ${parts.day}, ${parts.year} ${parts.time}`
}

export interface LinePoint {
  time: UTCTimestamp
  value: number
}

/** Seconds, strictly ascending, last point wins on a duplicate time. Prices become percents. */
export function toLinePoints(points: { t: number; p: number }[]): LinePoint[] {
  const parsed: LinePoint[] = []
  for (const point of points) {
    if (!Number.isFinite(point.t) || !Number.isFinite(point.p)) continue
    const seconds = point.t > 1e12 ? Math.floor(point.t / 1000) : Math.floor(point.t)
    if (seconds <= 0) continue
    parsed.push({ time: seconds as UTCTimestamp, value: priceToPercent(point.p) })
  }
  parsed.sort((a, b) => a.time - b.time)
  const unique: LinePoint[] = []
  for (const point of parsed) {
    const last = unique[unique.length - 1]
    if (last && last.time === point.time) unique[unique.length - 1] = point
    else unique.push(point)
  }
  return unique
}

export function zoomLogicalRange(
  range: { from: number; to: number } | null,
  factor: number,
): { from: number; to: number } | null {
  if (!range || !(factor > 0)) return null
  if (!Number.isFinite(range.from) || !Number.isFinite(range.to)) return null
  const span = range.to - range.from
  if (!(span > 0)) return null
  const mid = (range.from + range.to) / 2
  const next = Math.max(span * factor, 5)
  return { from: mid - next / 2, to: mid + next / 2 }
}
