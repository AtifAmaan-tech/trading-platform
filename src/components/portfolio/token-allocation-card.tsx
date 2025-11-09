"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

const tokenData = [
  { name: "USDT", value: 48, color: "rgb(34, 197, 94)" },
  { name: "ETH", value: 30, color: "rgb(165, 130, 255)" },
  { name: "BTC", value: 15, color: "rgb(251, 146, 60)" },
  { name: "Other", value: 7, color: "rgb(100, 116, 139)" },
]

const tokens = [
  { symbol: "USDT", balance: "$7,357.17", change: "+8.2%" },
  { symbol: "ETH", balance: "$4,598.24", change: "+15.3%" },
  { symbol: "BTC", balance: "$2,299.12", change: "+18.9%" },
  { symbol: "Other", balance: "$1,072.92", change: "+5.1%" },
]

export function TokenAllocationCard() {
  return (
    <Card className="glass-effect border-primary/30 p-6 glow-purple-box flex flex-col h-135">
      <h3 className="text-lg font-semibold mb-4">Token Allocation</h3>

      {/* Pie Chart */}
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={tokenData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {tokenData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Token List */}
      <div className="space-y-2">
        {tokens.map((token) => (
          <div key={token.symbol} className="flex justify-between items-center text-sm mt-3">
            <div>
              <p className="font-medium">{token.symbol}</p>
              <p className="text-muted-foreground text-xs">{token.balance}</p>
            </div>
            <p className="text-crypto-green font-medium">{token.change}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
