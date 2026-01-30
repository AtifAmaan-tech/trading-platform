"use client";

import { useState, useEffect,useRef } from "react";
import Navbar from "@/components/dashboard/navbar";
import SearchBar from "@/components/dashboard/search-bar";
import LiveTicker from "@/components/dashboard/live-ticker";
import Watchlist from "@/components/dashboard/watchlist";
import MarketOverview from "@/components/dashboard/market-overview";

export default function Dashboard() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

const isInitialLoad = useRef(true);

  // Load on mount, then save on every change after that
  useEffect(() => {
    if (isInitialLoad.current) {
      // First render: load from localStorage
      const stored = localStorage.getItem("watchlist");
      if (stored) {
        try {
          setWatchlist(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse watchlist:", e);
        }
      }
      isInitialLoad.current = false;
    } else {
      // Subsequent renders: save to localStorage
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist]);

  const addToWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.includes(symbol) ? prev : [...prev, symbol])
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol))
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-14 sm:pt-12">
        <div className="w-full px-1 sm:px-6 py-2 sm:py-8 animate-fadeIn">
          <div className="animate-slideDown">
            <SearchBar onSelectCoin={setSelectedCoin} />
          </div>
          <div className="animate-slideDown" style={{ animationDelay: "0.1s" }}>
            <div className="mt-3 sm:mt-6">
              <LiveTicker />
            </div>
          </div>
          <div
            className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-6 mt-4 sm:mt-8 animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="lg:col-span-4">
              <Watchlist
                coins={watchlist}
                onRemove={removeFromWatchlist}
              />
              <div className="pt-3 sm:pt-5 lg:col-span-4">
                <MarketOverview onAddToWatchlist={addToWatchlist} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
