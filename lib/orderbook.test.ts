import { describe, expect, it } from "vitest"
import { applyDelta, applySnapshot, parseBookSide } from "./orderbook"

describe("applySnapshot", () => {
  it("sorts asks ascending and bids descending, and drops empty levels", () => {
    const book = applySnapshot({
      asks: [
        { price: "0.55", size: "10" },
        { price: "0.51", size: "4" },
        { price: "0.53", size: "0" },
        { price: "0.51", size: "8" },
      ],
      bids: [
        { price: "0.40", size: "3" },
        { price: "0.49", size: "12" },
        { price: "0.47", size: "1" },
        { price: "0.40", size: "0" },
      ],
    })

    expect(book.asks.map((level) => level.price)).toEqual([0.51, 0.55])
    expect(book.asks[0].size).toBe(8)
    expect(book.bids.map((level) => [level.price, level.size])).toEqual([
      [0.49, 12],
      [0.47, 1],
    ])
  })
})

describe("applyDelta", () => {
  const snapshot = () =>
    applySnapshot({
      asks: [
        { price: 0.52, size: 5 },
        { price: 0.55, size: 9 },
      ],
      bids: [
        { price: 0.48, size: 7 },
        { price: 0.44, size: 2 },
      ],
    })

  it("updates, inserts, and removes levels while keeping the book sorted", () => {
    let book = snapshot()
    const untouchedAsk = book.asks[1]
    const untouchedBid = book.bids[0]

    book = applyDelta(book, { side: "ask", price: 0.52, size: 11 })
    book = applyDelta(book, { side: "ask", price: 0.53, size: 4 })
    book = applyDelta(book, { side: "bid", price: 0.46, size: 6 })
    book = applyDelta(book, { side: "bid", price: 0.44, size: 0 })
    book = applyDelta(book, { side: "ask", price: 0.55, size: 0 })

    expect(book.asks).toEqual([
      { price: 0.52, size: 11 },
      { price: 0.53, size: 4 },
    ])
    expect(book.bids).toEqual([
      { price: 0.48, size: 7 },
      { price: 0.46, size: 6 },
    ])
    expect(book.bids[0]).toBe(untouchedBid)
    expect(untouchedAsk.price).toBe(0.55)
  })

  it("returns the same book when a delta changes nothing", () => {
    const book = snapshot()
    expect(applyDelta(book, { side: "ask", price: 0.52, size: 5 })).toBe(book)
    expect(applyDelta(book, { side: "bid", price: 0.4, size: 0 })).toBe(book)
    expect(applyDelta(book, { side: "ask", price: Number.NaN, size: 1 })).toBe(book)
  })

  it("does not mutate the previous book", () => {
    const book = snapshot()
    const before = structuredClone(book)
    applyDelta(book, { side: "bid", price: 0.48, size: 1 })
    expect(book).toEqual(before)
  })
})

describe("parseBookSide", () => {
  it("maps polymarket sides onto bid and ask", () => {
    expect(parseBookSide("BUY")).toBe("bid")
    expect(parseBookSide("sell")).toBe("ask")
    expect(parseBookSide("other")).toBeNull()
  })
})
