"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Clock, TrendingUp } from "lucide-react"

const POPULAR_COINS = [
  { symbol: "BTC", name: "Bitcoin", category: "Layer 1" },
  { symbol: "ETH", name: "Ethereum", category: "Layer 1" },
  { symbol: "SOL", name: "Solana", category: "Layer 1" },
  { symbol: "XRP", name: "Ripple", category: "Payment" },
  { symbol: "ADA", name: "Cardano", category: "Layer 1" },
  { symbol: "DOGE", name: "Dogecoin", category: "Meme" },
  { symbol: "MATIC", name: "Polygon", category: "Layer 2" },
  { symbol: "AVAX", name: "Avalanche", category: "Layer 1" },
  { symbol: "LINK", name: "Chainlink", category: "Oracle" },
  { symbol: "UNI", name: "Uniswap", category: "DEX" },
]

interface SearchBarProps {
  onSelectCoin: (symbol: string) => void
}

export default function SearchBar({ onSelectCoin }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<typeof POPULAR_COINS>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches")
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (query.trim()) {
      const filtered = POPULAR_COINS.filter(
        (coin) =>
          coin.symbol.toLowerCase().includes(query.toLowerCase()) ||
          coin.name.toLowerCase().includes(query.toLowerCase()),
      )
      setSuggestions(filtered)
      setIsOpen(true)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
  }, [query])

  const handleSelect = (symbol: string) => {
    onSelectCoin(symbol)

    const updated = [symbol, ...recentSearches.filter((s) => s !== symbol)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))

    setQuery("")
    setIsOpen(false)
  }

  const handleFocus = () => {
    if (!query.trim()) {
      setIsOpen(true)
    }
  }

  return (
    <div className="relative max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search coins by name or symbol..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10 bg-card border-border focus:border-primary"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
          {/* Recent Searches Section */}
          {!query.trim() && recentSearches.length > 0 && (
            <>
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                  <Clock className="w-3 h-3" />
                  Recent Searches
                </div>
              </div>
              <div className="px-2 py-2">
                {recentSearches.map((symbol) => {
                  const coin = POPULAR_COINS.find((c) => c.symbol === symbol)
                  return (
                    <button
                      key={symbol}
                      onClick={() => handleSelect(symbol)}
                      className="w-full px-3 py-2 text-left hover:bg-muted transition-colors rounded-md text-sm"
                    >
                      <div className="font-semibold">{symbol}</div>
                      <div className="text-xs text-muted-foreground">{coin?.name}</div>
                    </button>
                  )
                })}
              </div>
              <div className="border-b border-border" />
            </>
          )}

          {/* Suggestions Section */}
          {suggestions.length > 0 ? (
            <>
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                  <TrendingUp className="w-3 h-3" />
                  Results
                </div>
              </div>
              <div className="px-2 py-2">
                {suggestions.map((coin) => (
                  <button
                    key={coin.symbol}
                    onClick={() => handleSelect(coin.symbol)}
                    className="w-full px-3 py-2 text-left hover:bg-muted transition-colors rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{coin.symbol}</div>
                        <div className="text-sm text-muted-foreground">{coin.name}</div>
                      </div>
                      <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{coin.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : query.trim() ? (
            <div className="px-4 py-6 text-center text-muted-foreground text-sm">No coins found matching "{query}"</div>
          ) : null}

          {/* Popular Coins Section */}
          {!query.trim() && recentSearches.length === 0 && (
            <>
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                  <TrendingUp className="w-3 h-3" />
                  Popular
                </div>
              </div>
              <div className="px-2 py-2">
                {POPULAR_COINS.slice(0, 5).map((coin) => (
                  <button
                    key={coin.symbol}
                    onClick={() => handleSelect(coin.symbol)}
                    className="w-full px-3 py-2 text-left hover:bg-muted transition-colors rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{coin.symbol}</div>
                        <div className="text-sm text-muted-foreground">{coin.name}</div>
                      </div>
                      <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{coin.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
