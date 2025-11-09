"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Zap } from "lucide-react"

const transactions = [
  {
    type: "sent",
    icon: ArrowUpRight,
    title: "Sent ETH",
    description: "To: 0x742d35Cc6634C0532925...",
    amount: "-2.5 ETH",
    value: "-$4,312.50",
    timestamp: "2 hours ago",
  },
  {
    type: "received",
    icon: ArrowDownLeft,
    title: "Received USDT",
    description: "From: Trading Bot",
    amount: "+500 USDT",
    value: "+$500.00",
    timestamp: "4 hours ago",
  },
  {
    type: "staking",
    icon: Zap,
    title: "Staking Reward",
    description: "ETH 2.0 Staking",
    amount: "+0.15 ETH",
    value: "+$259.50",
    timestamp: "1 day ago",
  },
  {
    type: "sent",
    icon: ArrowUpRight,
    title: "Sent BTC",
    description: "To: External Wallet",
    amount: "-0.05 BTC",
    value: "-$4,379.40",
    timestamp: "2 days ago",
  },
  {
    type: "received",
    icon: ArrowDownLeft,
    title: "Received BTC",
    description: "From: Exchange",
    amount: "+0.1 BTC",
    value: "+$8,758.80",
    timestamp: "3 days ago",
  },
  {
    type: "staking",
    icon: Zap,
    title: "Staking Reward",
    description: "SOL Staking",
    amount: "+5.2 SOL",
    value: "+$487.40",
    timestamp: "5 days ago",
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "sent":
      return "text-crypto-red"
    case "received":
      return "text-crypto-green"
    case "staking":
      return "text-crypto-purple"
    default:
      return "text-foreground"
  }
}

const getTypeColorBg = (type: string) => {
  switch (type) {
    case "sent":
      return "bg-crypto-red/10"
    case "received":
      return "bg-crypto-green/10"
    case "staking":
      return "bg-crypto-purple/10"
    default:
      return "bg-muted"
  }
}

export function RecentTransactionsSection() {
  return (
    <Card className="glass-effect border-primary/30 p-6 glow-purple-box">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>

      <div className="space-y-3">
        {transactions.map((tx, idx) => {
          const Icon = tx.icon
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-crypto-border border-primary/15 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg ${getTypeColorBg(tx.type)}`}>
                  <Icon size={20} className={getTypeColor(tx.type)} />
                </div>
                <div>
                  <p className="font-medium text-sm">{tx.title}</p>
                  <p className="text-xs text-muted-foreground">{tx.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold text-sm ${getTypeColor(tx.type)}`}>{tx.amount}</p>
                <p className="text-xs text-muted-foreground">{tx.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{tx.timestamp}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
