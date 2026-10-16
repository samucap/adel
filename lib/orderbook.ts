export interface BookLevel {
  price: number
  size: number
}

export interface Book {
  bids: BookLevel[]
  asks: BookLevel[]
}

export type BookSide = "bid" | "ask"

export interface BookDelta {
  price: number
  size: number
  side: BookSide
}

type RawLevel = { price: string | number; size: string | number }

function collect(levels: RawLevel[]): BookLevel[] {
  const byPrice = new Map<number, BookLevel>()
  for (const raw of levels) {
    const price = typeof raw.price === "number" ? raw.price : Number(raw.price)
    const size = typeof raw.size === "number" ? raw.size : Number(raw.size)
    if (!Number.isFinite(price) || !Number.isFinite(size)) continue
    if (size <= 0) byPrice.delete(price)
    else byPrice.set(price, { price, size })
  }
  return [...byPrice.values()]
}

function sortSide(levels: BookLevel[], side: BookSide): BookLevel[] {
  const next = levels.slice()
  next.sort((a, b) => (side === "ask" ? a.price - b.price : b.price - a.price))
  return next
}

/** Asks ascending (best first), bids descending (best first). Size 0 is dropped. */
export function applySnapshot(raw: {
  bids?: RawLevel[] | null
  asks?: RawLevel[] | null
}): Book {
  return {
    bids: sortSide(collect(raw.bids ?? []), "bid"),
    asks: sortSide(collect(raw.asks ?? []), "ask"),
  }
}

function withLevel(levels: BookLevel[], price: number, size: number, side: BookSide): BookLevel[] {
  const index = levels.findIndex((level) => level.price === price)
  if (size <= 0) {
    if (index === -1) return levels
    return levels.filter((_, i) => i !== index)
  }
  if (index !== -1 && levels[index].size === size) return levels
  const next = levels.slice()
  const level = { price, size }
  if (index === -1) {
    const insertAt = next.findIndex((existing) =>
      side === "ask" ? existing.price > price : existing.price < price
    )
    next.splice(insertAt === -1 ? next.length : insertAt, 0, level)
    return next
  }
  next[index] = level
  return next
}

/** Update one price level. Size 0 removes it. Untouched levels keep their identity. */
export function applyDelta(book: Book, delta: BookDelta): Book {
  if (delta.side !== "bid" && delta.side !== "ask") return book
  if (!Number.isFinite(delta.price) || !Number.isFinite(delta.size)) return book
  if (delta.side === "bid") {
    const bids = withLevel(book.bids, delta.price, delta.size, "bid")
    if (bids === book.bids) return book
    return { bids, asks: book.asks }
  }
  const asks = withLevel(book.asks, delta.price, delta.size, "ask")
  if (asks === book.asks) return book
  return { bids: book.bids, asks }
}

export function parseBookSide(side: string): BookSide | null {
  const value = side.toLowerCase()
  if (value === "buy" || value === "bid") return "bid"
  if (value === "sell" || value === "ask") return "ask"
  return null
}
