"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const btcData = [
  { time: "1h ago", price: 85200 },
  { time: "45m ago", price: 85800 },
  { time: "30m ago", price: 86500 },
  { time: "15m ago", price: 87100 },
  { time: "Now", price: 87588 },
]

export function MarketOverviewCard() {
  return (
    <Card className="glass-effect border-crypto-border p-6 glow-purple-box">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-muted-foreground text-sm mb-1">BTC-USDT Price</p>
              <h2 className="text-4xl font-bold glow-purple">$87,588.45</h2>
            </div>
            <div className="text-crypto-green text-2xl">
              <TrendingUp size={32} />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h High</span>
              <span className="font-medium">$88,200.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Low</span>
              <span className="font-medium">$84,500.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Change</span>
              <span className="font-medium text-crypto-green">+4.2% (+$3,588.45)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Volume</span>
              <span className="font-medium">$2.4B</span>
            </div>
          </div>
        </div>

        {/* Right Section - Chart */}
        <div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={btcData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="btcGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(251, 146, 60, 0.6)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="rgba(251, 146, 60, 0.1)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(165, 130, 255, 0.1)" />
              <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.3)" fontSize={11} />
              <YAxis stroke="rgba(255, 255, 255, 0.3)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(18, 18, 35, 0.9)",
                  border: "1px solid rgba(165, 130, 255, 0.3)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "rgba(255, 255, 255, 0.8)" }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="rgb(251, 146, 60)"
                strokeWidth={2}
                dot={false}
                fillOpacity={1}
                fill="url(#btcGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
