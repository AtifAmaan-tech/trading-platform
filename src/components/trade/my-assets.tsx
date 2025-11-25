import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import useCryptoPrice from "../hooks/useCryptoPrice";

export default function AssetsTab({ assets }: { assets: any[] }) {
  const [loading, setLoading] = useState(false);
  const { prices } = useCryptoPrice();

  const sortedAssets = [...assets].sort((a, b) => {
    const qtyA = parseFloat(a.quantity);
    const qtyB = parseFloat(b.quantity);

    const priceA = a.token_symbol === "USDT" ? 1 : prices[a.token_symbol] || 0;
    const priceB = b.token_symbol === "USDT" ? 1 : prices[b.token_symbol] || 0;

    const valueA = qtyA * priceA;
    const valueB = qtyB * priceB;

    return valueB - valueA;
  });

  return (
    <TabsContent value="assets" className="p-6">
      <div className="space-y-4">
        {loading && (
          <p className="text-sm text-muted-foreground">Loading assets...</p>
        )}

        {!loading &&
          sortedAssets.map((asset) => {
            // UI Icons and Names Mapping
            const icons: Record<string, string> = {
              BTC: "₿",
              ETH: "Ξ",
              TRX: "⚡",
              USDT: "₮",
              BNB: "◊",
              SOL: "◎",
              DOGE: "Ð",
              XRP: "✕",
              POL: "●",
              SUI: "水",
              ADA: "◦",
            };

            const gradients: Record<string, string> = {
              BTC: "from-orange-400 to-yellow-600",
              ETH: "from-purple-400 to-blue-600",
              SOL: "from-cyan-400 to-blue-500",
              XRP: "from-slate-400 to-slate-600",
              DOGE: "from-yellow-400 to-orange-500",
              USDT: "from-green-400 to-emerald-600",
              POL: "from-indigo-400 to-indigo-600",
            };

            // Full token names
            const tokenNames: Record<string, string> = {
              BTC: "Bitcoin",
              ETH: "Ethereum",
              SOL: "Solana",
              XRP: "Ripple",
              DOGE: "Dogecoin",
              USDT: "Tether",
              POL: "Polygon",
            };

            const quantity = parseFloat(asset.quantity);
            const isUSDT = asset.token_symbol === "USDT";
            const price = isUSDT ? 1 : prices[asset.token_symbol] || 0;
            const totalValue = isUSDT ? quantity : price * quantity;
            const roundedValue = Number(totalValue.toFixed(2));

            return (
              <Card
                key={asset.token_symbol}
                className="p-4 bg-card/50 border-border/50"
              >
                <div className="flex items-center justify-between">
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-7 h-7 flex-shrink-0 rounded-full bg-gradient-to-br ${
                        gradients[asset.token_symbol] ||
                        "from-gray-400 to-gray-600"
                      } flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-lg font-mono">
                        {icons[asset.token_symbol] || "?"}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg mr-20">
                        {tokenNames[asset.token_symbol] || asset.token_symbol} (
                        {asset.token_symbol})
                      </h3>
                      <p className="text-sm text-muted-foreground text-left">
                        {quantity.toFixed(9)}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xl font-mono">${roundedValue}</p>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </TabsContent>
  );
}
