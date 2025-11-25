"use client"

import { Card } from "@/components/ui/card"
import { ImageIcon } from "lucide-react"

const nfts = [
  {
    name: "CryptoPixel",
    image: "/nft-ape.jpg",
    floorPrice: "2.5 ETH",
    value: "$4,287.50",
    rarity: "Rare",
  },
  {
    name: "Digital Ape",
    image: "/nft-pixel-art.jpg",
    floorPrice: "1.8 ETH",
    value: "$3,104.40",
    rarity: "Common",
  },
]

export function NFTsSection() {
  return (
    <Card className="glass-effect border-primary/30 p-6 glow-purple-box">
      <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
        <ImageIcon size={20} className="text-crypto-purple" />
        My NFTs
      </h3>

      <div className="grid grid-cols-2 gap-4 ">
        {nfts.map((nft, idx) => (
          <div
            key={idx}
            className="rounded-lg overflow-hidden border border-primary/30 transition-all "
          >
            <img src={nft.image} alt={nft.name} className="w-full h-70 object-cover" />
            <div className="p-3 bg-black/30">
              <p className="font-semibold text-sm">{nft.name}</p>
              <p className="text-xs text-muted-foreground mb-2">{nft.rarity}</p>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Floor: {nft.floorPrice}</p>
                <p className="text-sm font-medium text-crypto-green">{nft.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
