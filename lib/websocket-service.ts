import React from 'react'
import { useEventStore } from '@/stores/eventStore'

export interface OrderbookUpdate {
  marketId: string
  tokenId: string
  asks: Array<{ price: number; size: number }>
  bids: Array<{ price: number; size: number }>
  timestamp: number
}

export interface PriceUpdate {
  marketId: string
  tokenId: string
  price: number
  change24h: number
  volume24h: number
  timestamp: number
}

export interface TradeUpdate {
  marketId: string
  tokenId: string
  price: number
  size: number
  side: 'buy' | 'sell'
  timestamp: number
}

type WebSocketCallback<T> = (data: T) => void

class PolymarketWebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private reconnectDelay = 2000
  private pingInterval: NodeJS.Timeout | null = null
  private connectionTimeout: NodeJS.Timeout | null = null
  private isConnecting = false

  // Track subscribed asset IDs (token IDs)
  private subscribedAssetIds = new Set<string>()

  // Callbacks for different update types
  private orderbookCallbacks = new Set<WebSocketCallback<OrderbookUpdate>>()
  private priceCallbacks = new Set<WebSocketCallback<PriceUpdate>>()
  private tradeCallbacks = new Set<WebSocketCallback<TradeUpdate>>()

  // Polymarket WebSocket URL with /ws/market path
  private readonly WS_URL = process.env.NEXT_PUBLIC_POLYMARKET_WS_URL || 'wss://ws-subscriptions-clob.polymarket.com/ws/market'


  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return
    }

    // Check if we should use mock data instead
    if (this.useMockData) {
      console.log('🔧 Using mock data mode - WebSocket disabled')
      this.simulateMockUpdates()
      return
    }

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.warn('WebSocket not available in server environment')
      return
    }

    this.isConnecting = true

    try {
      console.log('🔌 Connecting to Polymarket WebSocket...')
      this.ws = new WebSocket(this.WS_URL)

      // Set connection timeout
      this.connectionTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
          console.warn('WebSocket connection timeout, closing...')
          this.ws.close()
          this.handleConnectionFailure('Connection timeout')
        }
      }, 10000)

      this.ws.onopen = () => {
        console.log('✅ Connected to Polymarket WebSocket')
        this.isConnecting = false
        this.reconnectAttempts = 0
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout)
          this.connectionTimeout = null
        }

        // Start PING heartbeat (every 10 seconds as per docs)
        this.startPingHeartbeat()

        // Send initial subscription for all tracked assets
        this.sendInitialSubscription()
      }

      this.ws.onmessage = (event) => {
        if (event.data === 'PONG') {
          // Heartbeat response - ignore
          return
        }

        try {
          const message = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`)
        this.isConnecting = false
        this.stopPingHeartbeat()
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout)
          this.connectionTimeout = null
        }

        // Only attempt reconnect if it wasn't a deliberate close
        if (event.code !== 1000) {
          this.attemptReconnect()
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.isConnecting = false
        this.stopPingHeartbeat()
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout)
          this.connectionTimeout = null
        }
        this.handleConnectionFailure('WebSocket error occurred')
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      this.isConnecting = false
      this.handleConnectionFailure('Failed to create WebSocket')
    }
  }

  private startPingHeartbeat(): void {
    this.stopPingHeartbeat() // Clear any existing interval
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send('PING')
      }
    }, 10000) // 10 seconds as per Polymarket docs
  }

  private stopPingHeartbeat(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  private sendInitialSubscription(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return

    if (this.subscribedAssetIds.size > 0) {
      const subscriptionMessage = {
        assets_ids: Array.from(this.subscribedAssetIds),
        type: 'market'
      }
      this.ws.send(JSON.stringify(subscriptionMessage))
      console.log('📡 Sent initial subscription:', subscriptionMessage)
    }
  }

  private handleConnectionFailure(reason: string): void {
    console.warn(`WebSocket connection failed: ${reason}`)
  }

  private simulateMockUpdates(): void {
    console.log('🎭 Starting mock data simulation for real-time updates')

    // Simulate periodic price updates
    const priceInterval = setInterval(() => {
      const mockPriceUpdate: PriceUpdate = {
        marketId: 'mock-market',
        tokenId: 'mock-token',
        price: 0.5 + (Math.random() - 0.5) * 0.1, // Random price around 0.5
        change24h: (Math.random() - 0.5) * 0.2,
        volume24h: Math.random() * 10000,
        timestamp: Date.now()
      }

      this.priceCallbacks.forEach(callback => callback(mockPriceUpdate))
    }, 3000) // Update every 3 seconds

    // Simulate occasional trade updates
    const tradeInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 2 seconds
        const mockTradeUpdate: TradeUpdate = {
          marketId: 'mock-market',
          tokenId: 'mock-token',
          price: 0.5 + (Math.random() - 0.5) * 0.1,
          size: Math.random() * 1000,
          side: Math.random() > 0.5 ? 'buy' : 'sell',
          timestamp: Date.now()
        }

        this.tradeCallbacks.forEach(callback => callback(mockTradeUpdate))
      }
    }, 2000)

    // Simulate orderbook updates
    const orderbookInterval = setInterval(() => {
      const mockOrderbookUpdate: OrderbookUpdate = {
        marketId: 'mock-market',
        tokenId: 'mock-token',
        asks: Array.from({ length: 5 }, (_, i) => ({
          price: 0.52 + i * 0.01 + Math.random() * 0.005,
          size: Math.random() * 1000
        })),
        bids: Array.from({ length: 5 }, (_, i) => ({
          price: 0.48 - i * 0.01 - Math.random() * 0.005,
          size: Math.random() * 1000
        })),
        timestamp: Date.now()
      }

      this.orderbookCallbacks.forEach(callback => callback(mockOrderbookUpdate))
    }, 5000) // Update every 5 seconds

    // Store intervals for cleanup (though in mock mode we don't really need to clean up)
    ;(this as any).mockIntervals = [priceInterval, tradeInterval, orderbookInterval]
  }

  disconnect(): void {
    this.isConnecting = false
    this.stopPingHeartbeat()
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout)
      this.connectionTimeout = null
    }
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect') // Clean close
      this.ws = null
    }


    this.subscribedAssetIds.clear()
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn(`Max reconnection attempts (${this.maxReconnectAttempts}) reached. WebSocket will remain disconnected.`)
      console.warn('Real-time updates will be unavailable. Consider checking network connectivity or WebSocket endpoint.')
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000) // Cap at 30 seconds

    console.log(`🔄 WebSocket reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`)

    setTimeout(() => {
      if (!this.isConnecting) { // Don't reconnect if already connecting
        this.connect()
      }
    }, delay)
  }

  private handleMessage(message: any): void {
    // Handle different message types from Polymarket WebSocket based on event_type
    switch (message.event_type) {
      case 'book':
        this.handleOrderbookSnapshot(message)
        break
      case 'price_change':
        this.handlePriceChange(message)
        break
      case 'last_trade_price':
        this.handleTradeExecution(message)
        break
      case 'best_bid_ask':
        this.handleBestBidAsk(message)
        break
      case 'tick_size_change':
        this.handleTickSizeChange(message)
        break
      case 'new_market':
        this.handleNewMarket(message)
        break
      case 'market_resolved':
        this.handleMarketResolved(message)
        break
      default:
        // Unknown event type, ignore
        console.log('Unknown WebSocket event:', message.event_type, message)
        break
    }
  }

  private handleOrderbookSnapshot(message: any): void {
    const { asset_id, market, bids, asks, timestamp } = message

    const orderbookUpdate: OrderbookUpdate = {
      marketId: market,
      tokenId: asset_id,
      asks: asks.map((ask: any) => ({
        price: parseFloat(ask.price),
        size: parseFloat(ask.size)
      })),
      bids: bids.map((bid: any) => ({
        price: parseFloat(bid.price),
        size: parseFloat(bid.size)
      })),
      timestamp: parseInt(timestamp)
    }

    this.orderbookCallbacks.forEach(callback => callback(orderbookUpdate))
  }

  private handlePriceChange(message: any): void {
    const { market, price_changes, timestamp } = message

    // Handle multiple price changes
    price_changes.forEach((change: any) => {
      const priceUpdate: PriceUpdate = {
        marketId: market,
        tokenId: change.asset_id,
        price: parseFloat(change.price),
        change24h: 0, // Not provided in price_change events
        volume24h: 0,  // Not provided in price_change events
        timestamp: parseInt(timestamp)
      }

      this.priceCallbacks.forEach(callback => callback(priceUpdate))
    })
  }

  private handleTradeExecution(message: any): void {
    const { asset_id, market, price, size, side, timestamp } = message

    const tradeUpdate: TradeUpdate = {
      marketId: market,
      tokenId: asset_id,
      price: parseFloat(price),
      size: parseFloat(size),
      side: side.toLowerCase(),
      timestamp: parseInt(timestamp)
    }

    this.tradeCallbacks.forEach(callback => callback(tradeUpdate))
  }

  private handleBestBidAsk(message: any): void {
    // For now, just log - could be used for more detailed orderbook display
    console.log('Best bid/ask update:', message)
  }

  private handleTickSizeChange(message: any): void {
    console.log('Tick size change:', message)
  }

  private handleNewMarket(message: any): void {
    console.log('New market:', message)
  }

  private handleMarketResolved(message: any): void {
    console.log('Market resolved:', message)
  }

  private handleOrderbookUpdate(data: OrderbookUpdate): void {
    this.orderbookCallbacks.forEach(callback => callback(data))
  }

  private handlePriceUpdate(data: PriceUpdate): void {
    this.priceCallbacks.forEach(callback => callback(data))
  }

  private handleTradeUpdate(data: TradeUpdate): void {
    this.tradeCallbacks.forEach(callback => callback(data))
  }

  subscribeToMarket(marketId: string, tokenId: string): void {
    this.subscribedAssetIds.add(tokenId)

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log(`📋 Queued subscription for asset ${tokenId}`)
      return
    }

    // Send dynamic subscription update
    const subscriptionMessage = {
      operation: 'subscribe',
      assets_ids: [tokenId]
    }

    this.ws.send(JSON.stringify(subscriptionMessage))
    console.log(`📡 Subscribed to asset ${tokenId}`)
  }

  unsubscribeFromMarket(marketId: string, tokenId: string): void {
    this.subscribedAssetIds.delete(tokenId)

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log(`📋 Queued unsubscription for asset ${tokenId}`)
      return
    }

    // Send dynamic unsubscription update
    const unsubscriptionMessage = {
      operation: 'unsubscribe',
      assets_ids: [tokenId]
    }

    this.ws.send(JSON.stringify(unsubscriptionMessage))
    console.log(`📤 Unsubscribed from asset ${tokenId}`)
  }

  private resubscribeToAll(): void {
    // The initial subscription will be sent in sendInitialSubscription()
    // which uses the tracked subscribedAssetIds set
    console.log(`🔄 Resubscribing to ${this.subscribedAssetIds.size} assets`)
  }

  // Callback registration methods
  onOrderbookUpdate(callback: WebSocketCallback<OrderbookUpdate>): () => void {
    this.orderbookCallbacks.add(callback)
    return () => this.orderbookCallbacks.delete(callback)
  }

  onPriceUpdate(callback: WebSocketCallback<PriceUpdate>): () => void {
    this.priceCallbacks.add(callback)
    return () => this.priceCallbacks.delete(callback)
  }

  onTradeUpdate(callback: WebSocketCallback<TradeUpdate>): () => void {
    this.tradeCallbacks.add(callback)
    return () => this.tradeCallbacks.delete(callback)
  }

  // Get connection status
  isConnected(): boolean {
    return this.useMockData || this.ws?.readyState === WebSocket.OPEN
  }

  // Get number of subscribed assets
  getSubscribedCount(): number {
    return this.subscribedAssetIds.size
  }
}

// Export singleton instance
export const polymarketWS = new PolymarketWebSocketService()

// React hook for using WebSocket in components
export function usePolymarketWebSocket() {
  const { currMkt, selectedOutcome, getCurrentMarketTokenId } = useEventStore()
  const [connectionStatus, setConnectionStatus] = React.useState<'connecting' | 'connected' | 'disconnected' | 'failed'>('disconnected')
  const [subscribedCount, setSubscribedCount] = React.useState(0)


  // Update connection status and subscription count
  React.useEffect(() => {
    const updateStatus = () => {
      if (polymarketWS.isConnected()) {
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('disconnected')
      }
      setSubscribedCount(polymarketWS.getSubscribedCount())
    }

    // Check status periodically
    const interval = setInterval(updateStatus, 1000)
    updateStatus() // Initial check

    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    // Only attempt connection if we have a market selected
    if (currMkt?.id) {
      polymarketWS.connect()
    }

    // Capture tokenId at effect setup time to avoid stale closure issues
    const tokenId = currMkt?.id ? getCurrentMarketTokenId() : null

    let unsubscribeOrderbook: (() => void) | null = null
    let unsubscribePrice: (() => void) | null = null
    let unsubscribeTrades: (() => void) | null = null

    if (tokenId) {
      // For Polymarket, we subscribe to the specific token ID
      // The marketId is not needed for subscription, just the tokenId
      polymarketWS.subscribeToMarket('', tokenId)

      // Set up callbacks for real-time updates
      // TODO: Implement real-time update handling
      unsubscribeOrderbook = polymarketWS.onOrderbookUpdate((data) => {
        // Handle orderbook update
      })

      unsubscribePrice = polymarketWS.onPriceUpdate((data) => {
        // Handle price update
      })

      unsubscribeTrades = polymarketWS.onTradeUpdate((data) => {
        // Handle trade update
      })
    }

    return () => {
      if (tokenId) {
        polymarketWS.unsubscribeFromMarket('', tokenId)
      }

      unsubscribeOrderbook?.()
      unsubscribePrice?.()
      unsubscribeTrades?.()
    }
  }, [currMkt?.id, selectedOutcome])

  return {
    isConnected: connectionStatus === 'connected',
    connectionStatus,
    subscribedCount,
    connect: () => {
      setConnectionStatus('connecting')
      polymarketWS.connect()
    },
    disconnect: () => {
      polymarketWS.disconnect()
      setConnectionStatus('disconnected')
    }
  }
}