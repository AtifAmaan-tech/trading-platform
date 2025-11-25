"use client";

import { BalanceCard } from "./balance-card";
import { TokenAllocationCard } from "./token-allocation-card";
import Navbar from "@/components/dashboard/navbar";
// import { MarketOverviewCard } from "./market-overview-card"
import { ConnectedWalletsCard } from "./connected-wallets-card";
import { NFTsSection } from "./nfts-section";
import { RecentTransactionsSection } from "./recent-transactions.section";

interface props{
  totalBalance?: number
  assets: any;
}


export default function Portfolio({totalBalance, assets}: props) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mt-12 relative z-10 mx-auto px-4 py-8">
        {/* Top Section - Balance and Token Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <BalanceCard totalBalance={totalBalance} />
          </div>
          <div>
            <TokenAllocationCard assets= {assets} />
          </div>
        </div>

        {/* Lower Section - Wallets, NFTs, Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ConnectedWalletsCard />
          <NFTsSection />
        </div>

        {/* Recent Transactions */}
        <div>
          <RecentTransactionsSection />
        </div>
      </main>
    </div>
  );
}
