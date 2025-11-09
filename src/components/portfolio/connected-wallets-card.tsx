"use client"

import { Card } from "@/components/ui/card"
import { Wallet, Copy } from "lucide-react"

const wallets = [
  {
    name: "Trust Wallet",
    icon: "🟦",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f....",
    balance: "$5,200.50",
  },
  {
    name: "Phantom",
    icon: "⭐",
    address: "EPjFWdd5Au...MdftVqZt8xb4...xq5wvBVAKfm....",
    balance: "$6,850.75",
  },
  {
    name: "Polygon",
    icon: "🟣",
    address: "0xA1b2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9",
    balance: "$3,276.20",
  },
]

export function ConnectedWalletsCard() {
  return (
    <Card className="glass-effect border-primary/30 p-6 glow-purple-box">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Wallet size={20} className="text-crypto-purple" />
        Connected Wallets
      </h3>

      <div className="space-y-4">
        {wallets.map((wallet, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-black/20 border border-primary/15 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{wallet.name}</p>
                  <p className="text-xs text-muted-foreground">{wallet.address}</p>
                </div>
              </div>
              <Copy size={16} className="text-muted-foreground cursor-pointer hover:text-crypto-purple" />
            </div>
            <p className="text-sm font-medium text-crypto-green">{wallet.balance}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
