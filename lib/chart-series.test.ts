import { describe, expect, it } from "vitest"
import { TickMarkType, type UTCTimestamp } from "lightweight-charts"
import { formatChartTime, formatProbability, formatTickMark, toLinePoints, zoomLogicalRange } from "./chart-series"

describe("toLinePoints", () => {
  it("sorts, converts milliseconds, drops bad points, and keeps the last duplicate", () => {
    const points = toLinePoints([
      { t: 1_700_000_100, p: 0.4 },
      { t: 1_700_000_000_000, p: 0.2 },
      { t: 1_700_000_000, p: 0.1 },
      { t: Number.NaN, p: 0.5 },
      { t: 1_700_000_100, p: 0.55 },
    ])
    expect(points).toEqual([
      { time: 1_700_000_000, value: 10 },
      { time: 1_700_000_100, value: 55 },
    ])
  })
})

describe("formatters", () => {
  const stamp = (Date.UTC(2026, 0, 5, 14, 7, 9) / 1000) as UTCTimestamp

  it("formats probability to one decimal", () => {
    expect(formatProbability(55)).toBe("55.0%")
    expect(formatProbability(Number.NaN)).toBe("")
  })

  it("uses a short tick for each mark type", () => {
    expect(formatTickMark(stamp, TickMarkType.Year)).toBe("2026")
    expect(formatTickMark(stamp, TickMarkType.Month)).toBe("Jan")
    expect(formatTickMark(stamp, TickMarkType.DayOfMonth)).toBe("Jan 5")
    expect(formatTickMark(stamp, TickMarkType.Time)).toBe("14:07")
    expect(formatTickMark(stamp, TickMarkType.TimeWithSeconds)).toBe("14:07:09")
  })

  it("formats the crosshair time with the date and clock", () => {
    expect(formatChartTime(stamp)).toBe("Jan 5, 2026 14:07")
  })
})

describe("zoomLogicalRange", () => {
  it("widens and narrows around the center", () => {
    expect(zoomLogicalRange({ from: 0, to: 20 }, 2)).toEqual({ from: -10, to: 30 })
    expect(zoomLogicalRange({ from: 0, to: 20 }, 0.5)).toEqual({ from: 5, to: 15 })
  })

  it("keeps a minimum span and ignores an empty range", () => {
    expect(zoomLogicalRange({ from: 10, to: 12 }, 0.1)).toEqual({ from: 8.5, to: 13.5 })
    expect(zoomLogicalRange(null, 2)).toBeNull()
  })
})
