"use client"

import { useState } from "react"
import Navbar from "@/components/dashboard/navbar"
import SearchBar from "@/components/dashboard/search-bar"
import LiveTicker from "@/components/dashboard/live-ticker"
import Watchlist from "@/components/dashboard/watchlist"
import MarketOverview from "@/components/dashboard/market-overview"

export default function Dashboard() {
  const [watchlist, setWatchlist] = useState<string[]>(["BTC", "ETH", "SOL"])
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol])
    }
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((s) => s !== symbol))
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        <div className="w-full mx-auto px-6 py-8 animate-fadeIn">
          <div className="animate-slideDown">
            <SearchBar onSelectCoin={setSelectedCoin} />
          </div>
          <div className="animate-slideDown" style={{ animationDelay: "0.1s" }}>
            <div className="mt-6">
              <LiveTicker />
            </div>
          </div>
          <div
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8 animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          >
                      <div className="lg:col-span-4">
              <Watchlist coins={watchlist} onRemove={removeFromWatchlist} onAdd={addToWatchlist} />
            <div className="pt-5 lg:col-span-4">
              <MarketOverview onAddToWatchlist={addToWatchlist} />
            </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
