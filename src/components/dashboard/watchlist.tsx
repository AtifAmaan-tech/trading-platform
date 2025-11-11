"use client"

import { useState, useEffect, useRef } from "react"
import { X, TrendingUp, TrendingDown, RefreshCw, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WatchlistProps {
  coins: string[]
  onRemove: (symbol: string) => void
  onAdd?: (symbol: string) => void
}

interface CoinData {
  price: number
  change24h: number
  previousPrice: number
  high24h: number
  low24h: number
  volume: number
}

type SortBy = "name" | "price" | "change" | "volume"
type SortOrder = "asc" | "desc"

const SYMBOL_MAP: Record<string, string> = {
  BTC: "BTCUSDT",
  ETH: "ETHUSDT",
  SOL: "SOLUSDT",
  XRP: "XRPUSDT",
  ADA: "ADAUSDT",
  DOGE: "DOGEUSDT",
  BNB: "BNBUSDT",
  AVAX: "AVAXUSDT",
  LINK: "LINKUSDT",
  DOT: "DOTUSDT",
  MATIC: "MATICUSDT",
  UNI: "UNIUSDT",
}

export default function Watchlist({ coins = [], onRemove }: WatchlistProps) {
  const [coinData, setCoinData] = useState<Record<string, CoinData>>({})
  const [sortBy, setSortBy] = useState<SortBy>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const intervalRef = useRef<number  | null>(null)

  const fetchCoinData = async () => {
    if (coins.length === 0) {
      setIsLoading(false)
      return
    }

    try {
      const responses = await Promise.all(
        coins.map((symbol) => {
          const apiSymbol = SYMBOL_MAP[symbol]
          if (!apiSymbol) return Promise.resolve(null)

          return fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${apiSymbol}`)
            .then((res) => res.json())
            .catch(() => null)
        }),
      )

      const newData: Record<string, CoinData> = {}

      responses.forEach((data, index) => {
        if (!data || !data.lastPrice) return

        const symbol = coins[index]
        const newPrice = Number.parseFloat(data.lastPrice)
        const oldData = coinData[symbol]

        newData[symbol] = {
          previousPrice: oldData?.price || newPrice,
          price: newPrice,
          change24h: Number.parseFloat(data.priceChangePercent),
          high24h: Number.parseFloat(data.highPrice),
          low24h: Number.parseFloat(data.lowPrice),
          volume: Number.parseFloat(data.quoteVolume),
        }
      })

      setCoinData(newData)
      setIsLoading(false)
      setLastUpdate(new Date())
    } catch (err) {
      console.error("Error fetching watchlist data:", err)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCoinData()
    intervalRef.current = setInterval(fetchCoinData, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [coins])

  const getSortedCoins = () => {
    const sorted = [...coins]
    sorted.sort((a, b) => {
      let aValue: number | string = a
      let bValue: number | string = b

      switch (sortBy) {
        case "price":
          aValue = coinData[a]?.price || 0
          bValue = coinData[b]?.price || 0
          break
        case "change":
          aValue = coinData[a]?.change24h || 0
          bValue = coinData[b]?.change24h || 0
          break
        case "volume":
          aValue = coinData[a]?.volume || 0
          bValue = coinData[b]?.volume || 0
          break
        default:
          return 0
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    return sorted
  }

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const SortIcon = ({ column }: { column: SortBy }) => {
    if (sortBy !== column) return <div className="w-4 h-4" />
    return sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const sortedCoins = getSortedCoins()

  return (
    <div className="w-full bg-card border border-border border-primary/30 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="bg-card text-lg font-semibold pl-3 pt-2">Watchlist</h3>
        {coins.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={fetchCoinData}
            disabled={isLoading}
            className="gap-2 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        )}
      </div>

      {coins.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground text-sm">No coins in watchlist yet.</p>
        </div>
      ) : isLoading && Object.keys(coinData).length === 0 ? (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="space-y-2 p-4">
            {[...Array(coins.length)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className=" w-full text-sm">
              <thead>
                <tr className=" border-b border-border bg-muted/50">
                  <th className="px-4 py-3">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-2 font-semibold text-xs hover:text-foreground transition-colors"
                    >
                      Coin
                      <SortIcon column="name" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleSort("price")}
                      className="flex items-center justify-end gap-2 font-semibold text-xs hover:text-foreground transition-colors ml-auto"
                    >
                      Price
                      <SortIcon column="price" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleSort("change")}
                      className="flex items-center justify-end gap-2 font-semibold text-xs hover:text-foreground transition-colors ml-auto"
                    >
                      24h %
                      <SortIcon column="change" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleSort("volume")}
                      className="flex items-center justify-end gap-2 font-semibold text-xs hover:text-foreground transition-colors ml-auto"
                    >
                      Volume
                      <SortIcon column="volume" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCoins.map((symbol) => {
                  const data = coinData[symbol]
                  if (!data) return null

                  const changeIsPositive = data.change24h >= 0
                  const priceIsUp = data.price > data.previousPrice

                  return (
                    <tr
                      key={symbol}
                      className="border-b border-border hover:bg-muted/30 transition-colors last:border-b-0"
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold">{symbol}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div
                          className={`font-semibold flex items-center justify-end gap-1 ${priceIsUp ? "text-green-500" : "text-red-500"}`}
                        >
                          ${data.price > 1000 ? data.price.toFixed(2) : data.price.toFixed(4)}
                          {priceIsUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className={`font-semibold ${changeIsPositive ? "text-green-500" : "text-red-500"}`}>
                          {changeIsPositive ? "+" : ""}
                          {data.change24h.toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="text-xs text-muted-foreground">${(data.volume / 1000000).toFixed(1)}M</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onRemove(symbol)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label={`Remove ${symbol} from watchlist`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
