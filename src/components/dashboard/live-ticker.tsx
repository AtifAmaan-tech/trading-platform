"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"

interface TickerItem {
  symbol: string
  price: number
  change24h: number
  previousPrice: number
  isMoving: boolean
}

interface TickerConfig {
  displaySymbol: string
  apiSymbol: string
}

const TICKER_CONFIGS: TickerConfig[] = [
  { displaySymbol: "BTC/USDT", apiSymbol: "BTCUSDT" },
  { displaySymbol: "ETH/USDT", apiSymbol: "ETHUSDT" },
  { displaySymbol: "SOL/USDT", apiSymbol: "SOLUSDT" },
  { displaySymbol: "XRP/USDT", apiSymbol: "XRPUSDT" },
  { displaySymbol: "TRX/USDT", apiSymbol: "TRXUSDT" },
  { displaySymbol: "DOGE/USDT", apiSymbol: "DOGEUSDT" },
  { displaySymbol: "USDC/USDT", apiSymbol: "USDCUSDT" },
  { displaySymbol: "ADA/USDT", apiSymbol: "ADAUSDT" },
]

const INITIAL_TICKERS: TickerItem[] = TICKER_CONFIGS.map(config => ({
  symbol: config.displaySymbol,
  price: 0,
  change24h: 0,
  previousPrice: 0,
  isMoving: false,
}))

export default function LiveTicker() {
  const [tickers, setTickers] = useState<TickerItem[]>(INITIAL_TICKERS)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<number | null>(null)

  const fetchPrices = async () => {
    try {
      const responses = await Promise.all(
        TICKER_CONFIGS.map(config =>
          fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${config.apiSymbol}`)
            .then(res => res.json())
            .catch(() => null)
        )
      )

      setTickers(prev => {
        return prev.map((ticker, index) => {
          const data = responses[index]
          if (!data || !data.price) return ticker

          const newPrice = parseFloat(data.price)
          const priceChanged = ticker.price !== 0 && newPrice !== ticker.price

          return {
            ...ticker,
            previousPrice: ticker.price || newPrice,
            price: newPrice,
            isMoving: priceChanged,
          }
        })
      })

      setIsConnected(true)
      setError(null)
    } catch (err) {
      setIsConnected(false)
      setError("Failed to fetch prices")
      console.error("Error fetching prices:", err)
    }
  }

  const fetch24hChange = async () => {
    try {
      const responses = await Promise.all(
        TICKER_CONFIGS.map(config =>
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${config.apiSymbol}`)
            .then(res => res.json())
            .catch(() => null)
        )
      )

      setTickers(prev => {
        return prev.map((ticker, index) => {
          const data = responses[index]
          if (!data || !data.priceChangePercent) return ticker

          return {
            ...ticker,
            change24h: parseFloat(data.priceChangePercent),
          }
        })
      })
    } catch (err) {
      console.error("Error fetching 24h change:", err)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchPrices()
    fetch24hChange()

    // Update prices every 2 seconds
    intervalRef.current = setInterval(fetchPrices, 2000)

    // Update 24h change every 30 seconds (less frequent as it changes slowly)
    const change24hInterval = setInterval(fetch24hChange, 30000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      clearInterval(change24hInterval)
    }
  }, [])

  const getPriceChangeColor = (current: number, previous: number) => {
    if (current > previous) return "text-green-500"
    if (current < previous) return "text-red-500"
    return "text-muted-foreground"
  }

  const getPriceChangeIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUp className="w-3 h-3" />
    if (current < previous) return <ArrowDown className="w-3 h-3" />
    return null
  }

return (
  <div className="bg-card border border-primary/25 rounded-none sm:rounded-lg p-1.5 sm:p-4 shadow-sm">
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <h3 className="font-semibold text-base sm:text-lg">Live Market Ticker</h3>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
        <span className="text-xs text-zinc-400">{isConnected ? "Live" : "Disconnected"}</span>
      </div>
    </div>

    {error && (
      <div className="text-xs text-red-500 mb-2">{error}</div>
    )}

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {tickers.map((ticker) => {
        const priceColor = getPriceChangeColor(ticker.price, ticker.previousPrice)
        const priceIcon = getPriceChangeIcon(ticker.price, ticker.previousPrice)

        return (
          <div
            key={ticker.symbol}
            className="flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col gap-0.5 sm:gap-1">
              <div className="font-semibold text-xs sm:text-sm">{ticker.symbol}</div>
              <div className={`text-xs font-medium ${ticker.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                {ticker.change24h >= 0 ? "+" : ""}
                {ticker.change24h.toFixed(2)}%
              </div>
            </div>

            <div className="border-l border-border pl-2 sm:pl-4 flex flex-col gap-0.5 sm:gap-1">
              <div className={`text-sm sm:text-lg font-bold flex items-center gap-1 ${priceColor}`}>
                ${ticker.price > 1000 ? ticker.price.toFixed(0) : ticker.price.toFixed(4)}
                {priceIcon && <span className={`${priceColor}`}>{priceIcon}</span>}
              </div>
              <div className="text-xs text-muted-foreground">
                {ticker.price === 0 ? (
                  <span className="animate-pulse"></span>
                ) : ticker.isMoving ? (
                  <span className="animate-pulse"></span>
                ) : (
                  <span></span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)
}
