"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Volume2,
  Star,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useCryptoPrice from "../hooks/useCryptoPrice";

interface Coin {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  high24h: number;
  low24h: number;
}

interface CoinConfig {
  symbol: string;
  name: string;
  apiSymbol: string;
}

const COIN_CONFIGS: CoinConfig[] = [
  { symbol: "BTC", name: "Bitcoin", apiSymbol: "BTCUSDT" },
  { symbol: "ETH", name: "Ethereum", apiSymbol: "ETHUSDT" },
  { symbol: "SOL", name: "Solana", apiSymbol: "SOLUSDT" },
  { symbol: "XRP", name: "Ripple", apiSymbol: "XRPUSDT" },
  { symbol: "ADA", name: "Cardano", apiSymbol: "ADAUSDT" },
  { symbol: "DOGE", name: "Dogecoin", apiSymbol: "DOGEUSDT" },
  { symbol: "BNB", name: "BNB", apiSymbol: "BNBUSDT" },
  { symbol: "TRX", name: "TRX", apiSymbol: "TRXUSDT" },
  { symbol: "SUI", name: "SUI", apiSymbol: "SUIUSDT" },
  { symbol: "MATIC", name: "MATIC", apiSymbol: "POLUSDT" },
];

interface MarketOverviewProps {
  onAddToWatchlist?: (symbol: string) => void;
}

type FilterType = "gainers" | "losers" | "volume" | "all";

export default function MarketOverview({
  onAddToWatchlist,
}: MarketOverviewProps) {
  const [filter, setFilter] = useState<FilterType>("gainers");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [displayData, setDisplayData] = useState<Coin[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Use the custom hook for live prices
  const { prices, loading, error } = useCryptoPrice();

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading favorites:", e);
      }
    }
  }, []);

  // Fetch 24h data (volume, change, high, low) from Binance
  const fetch24hData = async () => {
    try {
      const responses = await Promise.all(
        COIN_CONFIGS.map((config) =>
          fetch(
            `https://api.binance.com/api/v3/ticker/24hr?symbol=${config.apiSymbol}`
          )
            .then((res) => res.json())
            .catch(() => null)
        )
      );

      const newCoins: Coin[] = responses
        .map((data, index) => {
          if (!data || !data.lastPrice) return null;

          const config = COIN_CONFIGS[index];
          // Use price from the hook if available, otherwise use API price
          const currentPrice =
            prices[config.symbol] || parseFloat(data.lastPrice);

          return {
            symbol: config.symbol,
            name: config.name,
            price: currentPrice,
            change24h: parseFloat(data.priceChangePercent),
            volume: parseFloat(data.quoteVolume),
            marketCap: 0,
            high24h: parseFloat(data.highPrice),
            low24h: parseFloat(data.lowPrice),
          };
        })
        .filter((coin): coin is Coin => coin !== null);

      setCoins(newCoins);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error fetching market data:", err);
    }
  };

  // Fetch 24h data on mount and every 30 seconds (since prices update every 10s via hook)
  useEffect(() => {
    fetch24hData();
    const interval = setInterval(fetch24hData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update coin prices when the hook updates prices
  useEffect(() => {
    if (Object.keys(prices).length > 0 && coins.length > 0) {
      setCoins((prevCoins) =>
        prevCoins.map((coin) => ({
          ...coin,
          price: prices[coin.symbol] || coin.price,
        }))
      );
    }
  }, [prices]);

  useEffect(() => {
    if (coins.length === 0) return;

    let filtered: Coin[] = [];

    switch (filter) {
      case "gainers":
        filtered = [...coins]
          .sort((a, b) => b.change24h - a.change24h)
          .slice(0, 6);
        break;
      case "losers":
        filtered = [...coins]
          .sort((a, b) => a.change24h - b.change24h)
          .slice(0, 6);
        break;
      case "volume":
        filtered = [...coins].sort((a, b) => b.volume - a.volume).slice(0, 6);
        break;
      default:
        filtered = coins;
    }

    setDisplayData(filtered);
  }, [filter, coins]);

  const toggleFavorite = (symbol: string) => {
    const updated = favorites.includes(symbol)
      ? favorites.filter((s) => s !== symbol)
      : [...favorites, symbol];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const CoinCard = ({ coin }: { coin: Coin }) => (
    <div className="bg-card border border-border rounded-lg p-2 sm:p-4 border-primary/25 transition-all shadow-md hover:shadow-lg group">
      <div className="flex items-start justify-between mb-2 sm:mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-bold text-base sm:text-lg">{coin.symbol}</div>
            <button
              onClick={() => toggleFavorite(coin.symbol)}
              className={`transition-colors ${
                favorites.includes(coin.symbol)
                  ? "text-yellow-500"
                  : "text-muted-foreground hover:text-yellow-500"
              }`}
            >
              <Star
                className="w-4 h-4"
                fill={favorites.includes(coin.symbol) ? "currentColor" : "none"}
              />
            </button>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">{coin.name}</div>
        </div>
        {onAddToWatchlist && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddToWatchlist(coin.symbol)}
            className="text-xs bg-zinc-800 px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Add to watchlist</span>
            <span className="sm:hidden">+ Watch</span>
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Price</span>
          <span className="font-semibold">
            ${coin.price > 1000 ? coin.price.toFixed(2) : coin.price.toFixed(4)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">24h Change</span>
          <span
            className={`font-semibold flex items-center gap-1 ${
              coin.change24h >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {coin.change24h >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {coin.change24h >= 0 ? "+" : ""}
            {coin.change24h.toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">24h Volume</span>
          <span className="font-semibold text-sm">
            $
            {coin.volume >= 1000000000
              ? `${(coin.volume / 1000000000).toFixed(2)}B`
              : `${(coin.volume / 1000000).toFixed(2)}M`}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-border">
          <span className="text-muted-foreground text-sm">24h Range</span>
          <span className="font-semibold text-sm">
            ${coin.low24h.toFixed(2)} - ${coin.high24h.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header with Last Update */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">Market Overview</h2>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs text-muted-foreground">
            Updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={fetch24hData}
            disabled={loading}
            className="gap-1 sm:gap-2 px-2 sm:px-3"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm">
          Error fetching prices: {error}
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
        {[
          { key: "gainers", label: "Top Gainers", mobileLabel: "Gainers", icon: TrendingUp },
          { key: "losers", label: "Top Losers", mobileLabel: "Losers", icon: TrendingDown },
          { key: "volume", label: "High Volume", mobileLabel: "Volume", icon: Volume2 },
          { key: "all", label: "All Coins", mobileLabel: "All" },
        ].map(({ key, label, mobileLabel, icon: Icon }) => (
          <Button
            key={key}
            size="sm"
            onClick={() => setFilter(key as any)}
            variant={filter === key ? "default" : "outline"}
            className={
              `text-xs sm:text-sm px-2 sm:px-3 ${
              filter === key
                ? "bg-gradient-to-r from-purple-800 to-purple-700 text-white border-purple-700 hover:from-purple-800 hover:to-purple-700 hover:text-white"
                : "border-border"
              }`
            }
          >
            <div className="flex items-center gap-1 sm:gap-2">
              {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{mobileLabel}</span>
            </div>
          </Button>
        ))}
      </div>

      {/* Loading State */}
      {loading && coins.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-4 animate-pulse"
            >
              <div className="h-6 bg-muted rounded w-20 mb-2"></div>
              <div className="h-4 bg-muted rounded w-32 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Coins Grid */
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {displayData.map((coin) => (
            <CoinCard key={coin.symbol} coin={coin} />
          ))}
        </div>
      )}
    </div>
  );
}
