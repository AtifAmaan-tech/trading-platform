import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import axios from "axios";
import { useAuth } from "../auth/authcontext";


interface TradeResponse {
  order_type: string;
  price: number;
  time: string;
  token_amount: number;
  token_name: string;
  total_amount: string;
  trade_type: "buy" | "sell";
  txn_id: number;
  user_id: number;
}

interface Trade {
  id: number;
  type: "buy" | "sell";
  amount: number;
  price: number;
  timestamp: string;
  tokenName: string;
}
interface Props {
    refresh: number;
}

export default function TradeHistoryCard({ refresh }: Props) {
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth()
  const BASEURL = import.meta.env.VITE_PUBLIC_BACKEND_URL;



  const fetchTrades = async () => {
    if (!user) return;
    try {
      setLoading(true);

      const res = await axios.get(`${BASEURL}/get_trades`, {
        withCredentials: true,
      });

      const tradesArray = Array.isArray(res.data?.trades)
        ? res.data.trades
        : [];

      const formatted: Trade[] = tradesArray.map((t: TradeResponse) => ({
        id: t.txn_id,
        type: t.trade_type,
        amount: t.token_amount,
        price: t.price,
        timestamp: t.time,
        tokenName: t.token_name,
      })).reverse();

      setRecentTrades(formatted);
    } catch (error) {
      console.error("Error fetching trades:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [refresh]);

  return (
    <TabsContent value="history" className="p-6">
      <div className="space-y-4">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

        {!loading &&
          recentTrades.map((trade, index) => (
            <div key={trade.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {trade.type === "buy" ? (
                      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                        BUY
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
                        SELL
                      </Badge>
                    )}

                    <span className="text-sm font-medium">
                      {trade.amount} {trade.tokenName}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {trade.timestamp}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold mb-1">
                    ${trade.price.toLocaleString()}
                  </p>

                  <p
                    className={`text-sm ${
                      trade.type === "buy" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {trade.type === "buy" ? "+" : "-"}
                    {trade.amount} {trade.tokenName}
                  </p>
                </div>
              </div>

              {index < recentTrades.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
      </div>
    </TabsContent>
  );
}
