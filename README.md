# Notable Dough

A real-time prediction market analytics dashboard built on [Polymarket](https://polymarket.com) data. Notable Dough aggregates live market feeds, price charts, orderbook data, and whale activity into a single terminal-inspired interface designed for serious market participants.

## What It Does

Notable Dough is a Next.js frontend that connects to Polymarket's CLOB (Central Limit Order Book) APIs and WebSocket feeds to provide:

- **Live market browsing** — filterable, sortable event feeds across categories (politics, crypto, sports, etc.) with real-time price updates
- **Interactive price charting** — multi-outcome candlestick/line charts powered by Lightweight Charts (TradingView) with configurable timeframes and outcome toggling
- **Orderbook and liquidity data** — batch orderbook fetches with top holder analysis per market
- **Analytics dashboard** — a bento-grid overview featuring treemaps, scatter plots, arbitrage scanning, correlation networks, and whale trackers
- **AI-powered market analysis** — scenario simulation, sentiment analysis, and rule simplification (placeholder UI for future integration)

The app proxies API calls through Next.js rewrites to a Go backend (configurable via `NEXT_BACKEND_URL`), which handles authentication, event aggregation, and data enrichment.

## Key Features

### Real-Time Market Data

- **WebSocket price streaming** via Polymarket's CLOB WebSocket (`wss://ws-subscriptions-clob.polymarket.com/ws/market`) with automatic reconnection, heartbeat ping, and dynamic subscription management
- **Live orderbook snapshots** and trade execution feeds with typed event handlers for `book`, `price_change`, `last_trade_price`, `best_bid_ask`, and `market_resolved` events
- **Background data sync** using TanStack Query with 5-minute stale times, 10-second orderbook polling, and parallel multi-outcome price history fetching

### Interactive Charting

- **TradingView-grade charts** built with [`lightweight-charts`](https://github.com/nicholastan9797/lightweight-charts) — multi-series line charts with real-time WebSocket-driven point updates
- **Multi-outcome overlays** — toggle individual outcomes on/off with color-coded series, auto-fit content scaling, and crosshair tooltips
- **Configurable timeframes** — 1h, 6h, 1d, 1w, and max intervals with mapped fidelity for optimal data density
- **Fullscreen mode** with responsive chart container using `autoSize`

### Analytics Dashboard

The home dashboard uses a responsive **bento grid layout** with the following panels:

| Panel                     | Description                                                       |
|:--------------------------|:------------------------------------------------------------------|
| **Stats Cards**           | TVL, 24h volume, open interest, active traders, fees, and markets |
| **Trending Markets**      | Top movers by volume with live price badges                       |
| **Whale Tracker**         | Large position activity feed                                      |
| **Market Momentum Map**   | Recharts treemap colored by bullish/bearish drift                 |
| **Arbitrage Scanner**     | Cross-platform price discrepancies (Polymarket, Kalshi, Betfair)  |
| **Edge vs. Risk Frontier**| Scatter plot of volatility-adjusted edge vs. yield                |
| **Correlation Network**   | Inter-market correlation visualization                            |
| **Liquidity Ladder**      | Depth-of-market liquidity visualization                           |
| **Activity Feed**         | Recent market activity stream                                     |

### Market Explorer

- **Category navigation** — dynamic categories fetched from the backend with nested subcategories
- **Advanced filtering** — drawer-based filter UI for time remaining, outcome prices, spread, volume, liquidity, daily rewards, and APY
- **Sort controls** — sortable by volume, liquidity, date, and more with ascending/descending toggle
- **Dual view modes** — grid cards and table list with search

### Event Detail View

- **Market outcome table** — all outcomes with probability, YES/NO prices, and 24h change
- **Chart visibility toggles** — show/hide individual outcome series on the chart
- **Top holders tab** — on-chain holder data fetched from Polymarket's Data API
- **AI Analysis tab** — market intelligence generation, scenario simulation, and rule simplification (placeholder for future LLM integration)
- **Event info tab** — resolution rules, volume stats, and market metadata

### Authentication

- **JWT-based auth** with HttpOnly cookie refresh tokens and in-memory access tokens
- **Automatic token refresh** — scheduled refresh 60s before expiry with single-flight concurrency guard
- **Protected API client** — 401 → silent refresh → retry pattern with automatic logout on refresh failure
- **Form validation** — Zod schemas with React Hook Form (12+ char passwords, uppercase, lowercase, digit, special char)

## Tech Stack

| Layer            | Technology                                                                                   |
|:-----------------|:---------------------------------------------------------------------------------------------|
| **Framework**    | [Next.js 16](https://nextjs.org/) (App Router, React 19)                                    |
| **Language**     | [TypeScript 6](https://www.typescriptlang.org/)                                             |
| **Styling**      | [Tailwind CSS 4](https://tailwindcss.com/) + CSS variables (OKLCH / hex dark theme)          |
| **UI Components**| [shadcn/ui](https://ui.shadcn.com/) (New York style) + [Radix UI](https://www.radix-ui.com/) primitives |
| **Charts**       | [Lightweight Charts 5](https://tradingview.github.io/lightweight-charts/) (TradingView) + [Recharts 3](https://recharts.org/) |
| **State**        | [Zustand 5](https://zustand-demo.pmnd.rs/) (global stores) + [TanStack Query 5](https://tanstack.com/query) (server state) |
| **Animations**   | [Framer Motion 12](https://www.framer.com/motion/)                                           |
| **Forms**        | [React Hook Form 7](https://react-hook-form.com/) + [Zod 4](https://zod.dev/)               |
| **Icons**        | [Lucide React](https://lucide.dev/) + [Hugeicons](https://hugeicons.com/)                   |
| **Package Mgr**  | [pnpm](https://pnpm.io/)                                                                    |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 9 — install via `npm i -g pnpm` if needed
- A running backend instance (Go) or configure `NEXT_BACKEND_URL`

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd adel

# Install dependencies
pnpm install
```

### Environment Setup

Copy the example env file and configure:

```bash
cp .env.example .env.local
```

| Variable                          | Default                                                            | Description                        |
|:----------------------------------|:-------------------------------------------------------------------|:-----------------------------------|
| `NEXT_PUBLIC_POLYMARKET_WS_URL`   | `wss://ws-subscriptions-clob.polymarket.com/ws/market`             | Polymarket CLOB WebSocket endpoint |
| `NEXT_PUBLIC_API_URL`             | `/api`                                                             | Client-side API base (proxied)     |
| `NEXT_BACKEND_URL`                | `http://localhost:8080`                                            | Backend origin for Next.js rewrites|

### Development

```bash
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000). API calls to `/api/*` are proxied to the backend via Next.js rewrites.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
adel/
├── app/
│   ├── (dashboard)/           # Auth-guarded dashboard layout
│   │   ├── page.tsx           # Home dashboard (bento grid)
│   │   ├── markets/
│   │   │   ├── page.tsx       # Market explorer feed
│   │   │   └── [id]/page.tsx  # Event detail (chart + panels)
│   │   ├── profile/           # User profile
│   │   └── rewards/           # Rewards page
│   ├── api/                   # API route handlers
│   │   ├── gamma/             # Gamma API proxy
│   │   └── proxy/             # General proxy routes
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   ├── globals.css            # Theme tokens + utility classes
│   └── layout.tsx             # Root layout (fonts, providers)
├── components/
│   ├── auth/                  # AuthGuard, AuthProvider
│   ├── charting/              # TradingView chart (Lightweight Charts)
│   ├── dashboard/             # Bento grid panels (14 components)
│   ├── market/                # Event detail panels + sidebar
│   ├── market-feed/           # Event cards, sort controls, views
│   └── ui/                    # 47 shadcn/ui primitives
├── hooks/                     # useAuth, useMobile, useStore
├── lib/
│   ├── api-client.ts          # Protected API client (401 → refresh)
│   ├── auth-service.ts        # JWT auth + error handling
│   ├── polymarket-api.ts      # Polymarket CLOB/Data API calls
│   ├── polymarket-hooks.ts    # TanStack Query hooks
│   ├── services.ts            # Backend API services
│   ├── store.ts               # Zustand app store
│   └── websocket-service.ts   # WebSocket client + React hook
├── stores/
│   ├── authStore.ts           # Auth state + token refresh
│   └── eventStore.ts          # Active event/market state
├── types/
│   ├── index.ts               # Core types (CleanEvent, Outcome, etc.)
│   └── dashboard.ts           # Market, Event, Category types
└── public/                    # Static assets
```

notes:
- issue with next.js dev server potentially resolved by modifying setting NODE_OPTIONS like so:  
    * `NODE_OPTIONS='--max_old_space_size=8192' pnpm dev`
