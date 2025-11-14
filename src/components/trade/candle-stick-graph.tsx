import React, { useState, useEffect } from "react";
import CandleStats from "./candle-stats";

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trade: number;
}

interface Props {
  selectedCrypto: string;
  prices: Record<string, number>;
}

const BinanceCandlestickChart: React.FC<Props> = ({
  selectedCrypto,
  prices,
}) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [timeframe, setTimeframe] = useState<"1h" | "4h" | "1d" | "1w">("1h");
  const [loading, setLoading] = useState(true);
  const [selectedCandle, setSelectedCandle] = useState<Candle | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  const timeframeMap = {
    "1h": "1h",
    "4h": "4h",
    "1d": "1d",
    "1w": "1w",
  };

  const fetchCandles = async () => {
    try {
      const symbol = `${selectedCrypto}USDT`;
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframeMap[timeframe]}&limit=50`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log(data)
      const formattedCandles: Candle[] = data.map((candle: any[]) => ({
        time: candle[0],
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
        trade: parseFloat(candle[8])
      }));

      setCandles(formattedCandles);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching candles:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandles();
    const timerId = setInterval(fetchCandles, 10000);
    return () => clearInterval(timerId);
  }, [selectedCrypto, timeframe]);

  useEffect(() => {
   setHoveredCandle(candles[0])
  }, [candles]);

  const renderCandlestick = (
    candle: Candle,
    index: number,
    maxPrice: number,
    minPrice: number
  ) => {
    const priceRange = maxPrice - minPrice;
    const chartHeight = 600;
    const candleWidth = 8;
    const spacing = 12;
    const x = index * spacing + 40;

    const isGreen = candle.close >= candle.open;
    // const isSelected = selectedCandle?.time === candle.time;
    const color = isGreen ? "#10b981" : "#ef4444";

    const highY = ((maxPrice - candle.high) / priceRange) * chartHeight + 20;
    const lowY = ((maxPrice - candle.low) / priceRange) * chartHeight + 20;
    const openY = ((maxPrice - candle.open) / priceRange) * chartHeight + 20;
    const closeY = ((maxPrice - candle.close) / priceRange) * chartHeight + 20;

    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.max(Math.abs(closeY - openY), 2);

    return (
      <g
        key={index}
        onClick={() => setSelectedCandle(candle)}
        style={{ cursor: "pointer" }}
      >
        {/* {isSelected && (
          <rect
            x={x - 4}
            y={highY - 4}
            width={candleWidth + 8}
            height={lowY - highY + 8}
            fill="rgba(147, 51, 234, 0.2)"
            stroke="#9333ea"
            strokeWidth={2}
            rx={2}
          />
        )} */}
        
        <line
          x1={x + candleWidth / 2}
          y1={highY}
          x2={x + candleWidth / 2}
          y2={lowY}
          stroke={color}
          strokeWidth={1.5}
        />

        <rect
          x={x}
          y={bodyTop}
          width={candleWidth}
          height={bodyHeight}
          fill={color}
          rx={1}
          style={{ pointerEvents: "all" }} // Add this
        />
      </g>
    );
  };

  if (loading) {
    return (
      <div className=" rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Price Chart</h2>
        </div>
        <div className="flex items-center justify-center h-[600px] text-gray-400">
          Loading chart data...
        </div>
      </div>
    );
  }

  const maxPrice = Math.max(...candles.map((c) => c.high));
  const minPrice = Math.min(...candles.map((c) => c.low));
  const currentPrice =
    prices[selectedCrypto] || candles[candles.length - 1]?.close || 0;

  return (
    <div className="bg-[#0a0b0f] rounded-2xl p-6 border border-primary/30">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white text-xl font-bold pb-2">Price Chart</h2>
        <div className="flex gap-2">
          {(["1h", "4h", "1d", "1w"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeframe === tf
                  ? "bg-purple-600 text-white"
                  : "bg-transparent text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600"
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="relative left-0 z-50">
        {hoveredCandle && <CandleStats selectedCandle={hoveredCandle} />}
      </div>

      <div className="relative bg-[#13141a] rounded-xl overflow-hidden">
        <svg width={candles.length * 16 + 80} height="561">
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1b24" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3449c1ff" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <rect width="900" height="640" fill="url(#bgGradient)" />

          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1="0"
              y1={20 + i * 120}
              x2="900"
              y2={20 + i * 120}
              stroke="#1f2937"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {candles.map((candle, index) => (
            <g
              key={index}
              onMouseEnter={() => setHoveredCandle(candle)}
              onMouseLeave={() => setHoveredCandle(candles[0])}
            >
              {renderCandlestick(candle, index, maxPrice, minPrice)}
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-gray-400">
          Current Price:{" "}
          <span className="text-white font-semibold">
            ${currentPrice.toLocaleString()}
          </span>
        </div>
        <div className="text-gray-400">Updates every 10 seconds</div>
      </div>
    </div>
  );
};

export default BinanceCandlestickChart;
