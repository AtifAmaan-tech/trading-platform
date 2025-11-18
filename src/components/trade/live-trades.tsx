
import { useState, useEffect } from 'react';

interface Trade {
  id: number;
  type: 'BUY' | 'SELL';
  time: Date;
  price: number;
  quantity: number;
  tradeId: number;
}

interface BinanceTrade {
  id: number;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

interface RecentTradesProps {
  selectedCrypto?: string;
}

export default function RecentTrades({ selectedCrypto }: RecentTradesProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTrades = async () => {
    try {
      const symbol = `${selectedCrypto}USDT`;
      const response = await fetch(
        `https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=9`
      );
      const data: BinanceTrade[] = await response.json();
      
      const formattedTrades: Trade[] = data.map(trade => ({
        id: trade.id,
        type: trade.isBuyerMaker ? 'SELL' : 'BUY',
        time: new Date(trade.time),
        price: parseFloat(trade.price),
        quantity: parseFloat(trade.qty),
        tradeId: trade.id
      }));

      setTrades(formattedTrades);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trades:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
    const interval = setInterval(fetchTrades, 1000);
    return () => clearInterval(interval);
  }, [selectedCrypto]);

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} sec ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hr ago`;
  };

  const formatUsername = (id: number): string => {
    return `user_${id.toString().slice(-4)}`;
  };

  return (
    <>
      <div className="bg-background text-foreground rounded-3xl p-5 border border-primary/30 ">
        {/* Header */}
        <div className="flex justify-between items-center mb-9 mt-2">
          <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold">Live Trades</h2>
        </div>

        {/* Trades list */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-slate-400 py-8">
              <div className="animate-pulse">Loading trades...</div>
            </div>
          ) : trades.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              No trades found
            </div>
          ) : (
            trades.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`${
                      trade.type === 'BUY'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                    } text-white text-xs font-bold px-3 py-1 rounded-full`}
                  >
                    {trade.type}
                  </span>
                  <div>
                    <div className="text-slate-400 text-sm">
                      {getTimeAgo(trade.time)}
                    </div>
                    <div className="text-slate-300 text-sm mt-3.5">
                      {formatUsername(trade.tradeId)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-lg">
                    ${trade.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {trade.quantity.toFixed(4)} {selectedCrypto}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </>
    );
  }