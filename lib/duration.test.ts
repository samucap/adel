import { describe, expect, it } from "vitest"
import { formatDuration, formatEndDate, formatEndLabel } from "./duration"

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY
const YEAR = 12 * MONTH

describe("formatDuration", () => {
  it("marks past, zero, and non-finite spans as ended", () => {
    expect(formatDuration(0)).toBe("ended")
    expect(formatDuration(-1)).toBe("ended")
    expect(formatDuration(Number.NaN)).toBe("ended")
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe("ended")
  })

  it("uses minutes below one hour, and at least 1m under a minute", () => {
    expect(formatDuration(1)).toBe("1m")
    expect(formatDuration(MINUTE - 1)).toBe("1m")
    expect(formatDuration(MINUTE)).toBe("1m")
    expect(formatDuration(45 * MINUTE)).toBe("45m")
    expect(formatDuration(HOUR - 1)).toBe("59m")
  })

  it("switches to hours at 60 minutes", () => {
    expect(formatDuration(HOUR)).toBe("1h")
    expect(formatDuration(5 * HOUR)).toBe("5h")
    expect(formatDuration(DAY - 1)).toBe("23h")
  })

  it("switches to days at 24 hours", () => {
    expect(formatDuration(DAY)).toBe("1d")
    expect(formatDuration(3 * DAY)).toBe("3d")
    expect(formatDuration(MONTH - 1)).toBe("29d")
  })

  it("switches to months at 30 days", () => {
    expect(formatDuration(MONTH)).toBe("1mo")
    expect(formatDuration(2 * MONTH)).toBe("2mo")
    expect(formatDuration(YEAR - 1)).toBe("11mo")
  })

  it("switches to years at 12 months", () => {
    expect(formatDuration(YEAR)).toBe("1y")
    expect(formatDuration(2 * YEAR + 10 * DAY)).toBe("2y")
  })
})

describe("formatEndDate", () => {
  const now = Date.parse("2026-10-16T12:00:00Z")

  it("formats the distance to a future end", () => {
    expect(formatEndDate("2026-10-16T17:00:00Z", now)).toBe("5h")
    expect(formatEndDate("2026-10-19T12:00:00Z", now)).toBe("3d")
  })

  it("marks past and invalid ends as ended", () => {
    expect(formatEndDate("2026-10-16T12:00:00Z", now)).toBe("ended")
    expect(formatEndDate("2026-10-15T12:00:00Z", now)).toBe("ended")
    expect(formatEndDate("not-a-date", now)).toBe("ended")
  })
})

describe("formatEndLabel", () => {
  const now = Date.parse("2026-10-16T12:00:00Z")

  it("prefixes a future end and stays plain once ended", () => {
    expect(formatEndLabel("2026-10-19T12:00:00Z", now)).toBe("Ends in 3d")
    expect(formatEndLabel("2026-10-16T11:00:00Z", now)).toBe("ended")
  })
})
