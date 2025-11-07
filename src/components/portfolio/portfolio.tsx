"use client"

// import { useState } from "react"
import Navbar from "@/components/dashboard/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Wallet, Gift, ArrowUpRight, ArrowDownLeft } from "lucide-react"

// Mock data for balance chart
const balanceData = [
  { date: "Mon", balance: 12000 },
  { date: "Tue", balance: 13200 },
  { date: "Wed", balance: 14500 },
  { date: "Thu", balance: 13800 },
  { date: "Fri", balance: 15100 },
  { date: "Sat", balance: 14800 },
  { date: "Sun", balance: 15327 },
]

// Mock data for token allocation
const tokenAllocation = [
  { name: "USDT", value: 48, color: "#26a17b" },
  { name: "ETH", value: 30, color: "#627eea" },
  { name: "BTC", value: 15, color: "#f7931a" },
  { name: "Other", value: 7, color: "#9333ea" },
]

// Mock data for token holdings
const tokenHoldings = [
  {
    symbol: "USDT",
    name: "Tether USD",
    amount: "7,360.50",
    value: "$7,360.50",
    change: "+2.4%",
    changeColor: "text-green-500",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: "4.25",
    value: "$4,596.72",
    change: "+8.2%",
    changeColor: "text-green-500",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    amount: "0.18",
    value: "$2,247.98",
    change: "-3.1%",
    changeColor: "text-red-500",
  },
]

// Mock data for connected wallets
const connectedWallets = [
  { name: "Trust Wallet", id: "0x742d...8A4c", chain: "Ethereum" },
  { name: "Phantom", id: "9BpU...T5x7", chain: "Solana" },
  { name: "Polygon", id: "0x1A5...6F3e", chain: "Polygon" },
]

// Mock data for NFTs
const nfts = [
  { name: "CryptoPixel #1523", image: "/nft-pixel-art.jpg", price: "$2,450", floorPrice: "$1,200" },
  { name: "Digital Ape #4721", image: "/nft-ape.jpg", price: "$8,900", floorPrice: "$7,500" },
]

// Mock data for recent transactions
const recentTransactions = [
  {
    type: "sent",
    asset: "ETH",
    amount: "-2.5",
    value: "-$2,849.50",
    recipient: "0x742d...8A4c",
    time: "2 hours ago",
    icon: ArrowUpRight,
    color: "text-red-500",
  },
  {
    type: "received",
    asset: "BTC",
    amount: "+0.05",
    value: "+$1,899.20",
    sender: "0x1A5...6F3e",
    time: "5 hours ago",
    icon: ArrowDownLeft,
    color: "text-green-500",
  },
  {
    type: "staking",
    asset: "ETH",
    amount: "+0.024",
    value: "+$27.36",
    sender: "Staking Reward",
    time: "1 day ago",
    icon: Gift,
    color: "text-purple-500",
  },
]

export default function Portfolio() {
//   const [selectedToken, setSelectedToken] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 animate-fadeIn">
          {/* Total Balance Card */}
          <div className="animate-slideDown">
            <Card className="border border-border bg-card/80 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Total Balance</CardTitle>
                <CardDescription>Your crypto portfolio value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-4xl font-bold text-foreground">$15,327.45</h2>
                    <p className="text-sm text-green-500 font-medium mt-2">+$1,245.32 (8.8%) today</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={balanceData}>
                      <defs>
                        <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--color-chart-1))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--color-chart-1))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--color-muted-foreground))" />
                      <YAxis stroke="hsl(var(--color-muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--color-card))",
                          border: "1px solid hsl(var(--color-border))",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="hsl(var(--color-chart-1))"
                        fill="url(#balanceGradient)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex gap-2">
                    {["1W", "1M", "3M", "1Y", "5Y", "ALL"].map((period) => (
                      <Button
                        key={period}
                        variant="ghost"
                        size="sm"
                        className="text-xs hover:bg-primary/10 hover:text-primary"
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Token Allocation & Market Overview */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-slideUp"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Token Allocation */}
            <Card className="border border-border bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Token Allocation</CardTitle>
                <CardDescription>Your portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={tokenAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {tokenAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {tokenAllocation.map((token) => (
                      <div key={token.name} className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium text-foreground">{token.name}</p>
                        <p className="text-lg font-bold" style={{ color: token.color }}>
                          {token.value}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Overview */}
            <Card className="border border-border bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
                <CardDescription>Top market performers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">BTC-USDT</p>
                  <p className="text-2xl font-bold">$87,588.45</p>
                  <p className="text-sm text-green-500 font-medium mt-1">+5.2% (24h)</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">24h High</span>
                    <span className="font-medium">$89,245.50</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">24h Low</span>
                    <span className="font-medium">$82,100.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Liquidity</span>
                    <span className="font-medium">$45.2B</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">24h Volume</span>
                    <span className="font-medium">$23.8B</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Holdings, Wallets & NFTs Grid */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Holdings */}
            <Card className="border border-border bg-card/80 backdrop-blur-sm lg:col-span-2">
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
                <CardDescription>Top assets in your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokenHoldings.map((token) => (
                    <div
                      key={token.symbol}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition"
                    >
                      <div>
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-sm text-muted-foreground">{token.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{token.amount}</p>
                        <p className={`text-sm font-medium ${token.changeColor}`}>{token.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Connected Wallets */}
            <Card className="border border-border bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Connected Wallets</CardTitle>
                <CardDescription>Your wallet addresses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {connectedWallets.map((wallet) => (
                  <div key={wallet.name} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-4 h-4 text-primary" />
                      <p className="font-medium text-sm">{wallet.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{wallet.id}</p>
                    <p className="text-xs text-primary mt-1">{wallet.chain}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* NFTs Section */}
          <Card
            className="border border-border bg-card/80 backdrop-blur-sm mb-8 animate-slideUp"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader>
              <CardTitle>My NFTs</CardTitle>
              <CardDescription>Your NFT collection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nfts.map((nft) => (
                  <div
                    key={nft.name}
                    className="rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition"
                  >
                    <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="w-full h-48 object-cover" />
                    <div className="p-4 bg-muted/30">
                      <p className="font-medium mb-2">{nft.name}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Your Price</p>
                          <p className="text-sm font-bold text-primary">{nft.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Floor Price</p>
                          <p className="text-sm font-medium text-green-500">{nft.floorPrice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card
            className="border border-border bg-card/80 backdrop-blur-sm animate-slideUp"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx, index) => {
                  const IconComponent = tx.icon
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition border border-border/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full bg-muted/50 ${tx.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium capitalize">{tx.type}</p>
                          <p className="text-sm text-muted-foreground">{tx.recipient || tx.sender}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {tx.amount} {tx.asset}
                        </p>
                        <p className={`text-sm font-medium ${tx.color}`}>{tx.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{tx.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
