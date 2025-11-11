"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/dashboard/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock } from "lucide-react";

interface TradeStats {
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: number;
  liquidity: number;
}

interface RecentTrade {
  id: string;
  type: "buy" | "sell";
  price: number;
  amount: number;
  timestamp: string;
  trader: string;
}

interface PortfolioProps {
  balance: number;
}

export default function TradePage({ balance }: PortfolioProps) {
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState([25]);
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");

  const stats: TradeStats = {
    price: 45230.5,
    change24h: 2.45,
    high24h: 46800,
    low24h: 43200,
    volume: 28500000000,
    liquidity: 2100000000,
  };

  const cryptos = [
    { symbol: "BTC", name: "Bitcoin", icon: "" },
    { symbol: "ETH", name: "Ethereum", icon: "" },
    { symbol: "USDT", name: "Tether", icon: "" },
    { symbol: "BNB", name: "Binance Coin", icon: "" },
    { symbol: "SOL", name: "Solana", icon: "" },
    { symbol: "DOGE", name: "Doge", icon: "" },
    { symbol: "XRP", name: "Ripple", icon: "" },
    { symbol: "POL", name: "Matic", icon: "" },
    { symbol: "SUI", name: "Sui", icon: "" },
    { symbol: "ADA", name: "Cardano", icon: "" },
    // add more...
  ];

  const recentTrades: RecentTrade[] = [
    {
      id: "1",
      type: "buy",
      price: 45230,
      amount: 0.5,
      timestamp: "2 min ago",
      trader: "user_alpha",
    },
    {
      id: "2",
      type: "sell",
      price: 45180,
      amount: 1.2,
      timestamp: "5 min ago",
      trader: "trader_beta",
    },
    {
      id: "3",
      type: "buy",
      price: 45150,
      amount: 2.1,
      timestamp: "8 min ago",
      trader: "crypto_dev",
    },
    {
      id: "4",
      type: "sell",
      price: 45220,
      amount: 0.8,
      timestamp: "12 min ago",
      trader: "user_gamma",
    },
    {
      id: "5",
      type: "buy",
      price: 45100,
      amount: 3.5,
      timestamp: "15 min ago",
      trader: "trader_delta",
    },
  ];

  const percentageButtons = [25, 50, 75, 100];

  interface OrderData {
    crypto: string;
    orderType: "market" | "limit";
    tradeType: "buy" | "sell";
    price: number;
    amount: number;
    total: number;
  }

  const handleSubmit = (e: { preventDefault: () => void }): void => {
    e.preventDefault();
    const orderData: OrderData = {
      crypto: selectedCrypto,
      orderType: orderType,
      tradeType: tradeType,
      price: price,
      amount: amount,
      total: amount * price,
    };
    console.log("printing values");
    console.log(orderData);
  };

  const handleSliderChange = (value: number[]): void => {
    setSliderValue(value);

    const percentage = value[0] / 100;
    const availableBalance: number = tradeType === "buy" ? balance : balance; // btcBalance for selling
    const calculatedAmount: number =
      tradeType === "buy"
        ? (availableBalance * percentage) / stats.price // Convert USD to BTC
        : availableBalance * percentage; // Direct BTC amount

    setAmount(calculatedAmount);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-12">
        <div className="w-full mx-auto px-6 py-8">
          {/* Main Trading Area */}
          <div
            className="rounded-lg grid grid-cols-1 lg:grid-cols-4 gap-6
            animate-slideUp"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Left Panel - Trading Controls */}
            <form>
              <div className="border lg:col-span-1">
                <Card className="p-6 border border-primary/30 backdrop-blur-sm sticky top-24 space-y-4 ">
                  <h2 className="text-xl font-bold">Place Order</h2>

                  {/* Choose crypto token */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">
                      Select Cryptocurrency
                    </label>
                    <Select
                      value={selectedCrypto}
                      onValueChange={setSelectedCrypto}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptos.map((crypto) => (
                          <SelectItem key={crypto.symbol} value={crypto.symbol}>
                            <div className="flex items-center gap-2">
                              <span>{crypto.icon}</span>
                              <span className="font-medium">
                                {crypto.symbol}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                {crypto.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Order Type Toggle */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={orderType === "market" ? "default" : "outline"}
                      className={`flex-1 rounded-none h-11 ${
                        orderType === "market"
                          ? "bg-gradient-to-r from-purple-800 to-purple-700 hover:from-purple-600 hover:to-purple-700 text-white rounded-sm"
                          : "flex-1 rounded-sm hover:bg-transparent"
                      }`}
                      onClick={() => setOrderType("market")}
                    >
                      Market
                    </Button>
                    <Button
                      type="button"
                      variant={orderType === "limit" ? "default" : "outline"}
                      className={`flex-1 rounded-none h-11 ${
                        orderType === "limit"
                          ? "bg-gradient-to-r from-purple-800 to-purple-700 hover:from-purple-600 hover:to-purple-700 text-white rounded-sm"
                          : "flex-1 rounded-sm hover:bg-transparent"
                      }`}
                      onClick={() => setOrderType("limit")}
                    >
                      Limit
                    </Button>
                  </div>

                  {/* Trade Type Toggle */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={tradeType === "buy" ? "default" : "outline"}
                      className={`flex-1 rounded-none h-11 ${
                        tradeType === "buy"
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg"
                          : "flex-1 rounded-lg hover:bg-transparent"
                      }`}
                      onClick={() => setTradeType("buy")}
                    >
                      Buy
                    </Button>
                    <Button
                      type="button"
                      variant={tradeType === "sell" ? "default" : "outline"}
                      className={`flex-1 rounded-none h-11 ${
                        tradeType === "sell"
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg"
                          : "flex-1 rounded-lg hover:bg-transparent"
                      }`}
                      onClick={() => setTradeType("sell")}
                    >
                      Sell
                    </Button>
                  </div>

                  {/* Price Input */}
                  {orderType === "limit" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Limit Price
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        value={price || ""}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="bg-input border-border/50"
                      />
                    </div>
                  )}

                  {/* Amount Input */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Amount (BTC)
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount || ""}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="bg-input border-border/50"
                    />
                  </div>

                  {/* Amount Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">
                        Quick Amount
                      </label>
                      <span className="text-sm text-primary">
                        {sliderValue[0]}%
                      </span>
                    </div>
                    <Slider
                      value={sliderValue}
                      onValueChange={handleSliderChange}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Percentage Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {percentageButtons.map((percent) => (
                      <Button
                        key={percent}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSliderValue([percent]);
                          const calculatedAmount =
                            tradeType === "buy"
                              ? (balance * (percent / 100)) / stats.price
                              : balance * (percent / 100);
                          setAmount(calculatedAmount);
                        }}
                        className="text-xs bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg h-11"
                      >
                        {percent}%
                      </Button>
                    ))}
                  </div>

                  {/* Total */}
                  <Card className="p-4 bg-card/30 border-border/50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-primary">
                        $
                        {(amount * stats.price).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </Card>

                  {/* Trade Button */}
                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg h-11"
                    variant={tradeType === "buy" ? "default" : "destructive"}
                  >
                    {tradeType === "buy" ? "Buy BTC" : "Sell BTC"}
                  </Button>
                </Card>
              </div>
            </form>

            {/* Center - Chart Area */}
            <div className="border lg:col-span-2">
              <Card className=" p-6 border-primary/30 backdrop-blur-sm h-full min-h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 size={20} className="text-primary" />
                    Price Chart
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      1H
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/50 text-primary bg-transparent"
                    >
                      4H
                    </Button>
                    <Button variant="outline" size="sm">
                      1D
                    </Button>
                    <Button variant="outline" size="sm">
                      1W
                    </Button>
                  </div>
                </div>

                {/* Candlestick Chart Placeholder */}
                <div className="flex-1 bg-gradient-to-b from-card/50 to-card/30 rounded-lg border border-border/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-end justify-center gap-1 p-4">
                    {/* Simulated Candlesticks */}
                    {Array.from({ length: 20 }).map((_, i) => {
                      const height = Math.random() * 80 + 20;
                      const open = Math.random() > 0.5;
                      return (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-1 flex-1 h-full justify-end"
                        >
                          <div
                            className="w-full bg-border/30 rounded-sm"
                            style={{ height: `${height * 0.3}%` }}
                          />
                          <div
                            className={`w-3/4 rounded-sm transition-all ${
                              open ? "bg-green-500/60" : "bg-red-500/60"
                            }`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-muted-foreground text-sm relative z-10">
                    Chart visualization area
                  </p>
                </div>
              </Card>
            </div>

            {/* Right Panel - Recent Trades */}
            <div className="lg:col-span-1">
              <Card className="p-6 border-primary/30 backdrop-blur-sm h-full">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  Recent Trades
                </h2>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {recentTrades.map((trade) => (
                    <div
                      key={trade.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/30 hover:border-primary/30 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={
                              trade.type === "buy" ? "default" : "destructive"
                            }
                            className="text-xs"
                          >
                            {trade.type.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {trade.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {trade.trader}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          ${trade.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {trade.amount} BTC
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom Tabs */}
          <div
            className="rounded-lg border border-primary/30 mt-8 animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          >
            <Card className="border-border/50 backdrop-blur-sm">
              <Tabs defaultValue="history" className=" w-full">
                <TabsList className="w-full justify-start rounded-none border-b border-border/30 px-6 py-0 h-auto bg-transparent">
                  <TabsTrigger
                    value="history"
                    className="rounded-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-gradient-to-r 
         data-[state=active]:from-purple-800 
         data-[state=active]:to-purple-700 
         data-[state=active]:text-white"
                  >
                    Trade History
                  </TabsTrigger>
                  <TabsTrigger
                    value="orders"
                    className="rounded-sm border-b-2 border-transparent data-[state=active]:border-primary  data-[state=active]:bg-gradient-to-r 
         data-[state=active]:from-purple-800 
         data-[state=active]:to-purple-700 
         data-[state=active]:text-white"
                  >
                    Active Orders
                  </TabsTrigger>
                  <TabsTrigger
                    value="assets"
                    className="rounded-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-gradient-to-r 
         data-[state=active]:from-purple-800 
         data-[state=active]:to-purple-700 
         data-[state=active]:text-white"
                  >
                    My Assets
                  </TabsTrigger>
                  <TabsTrigger
                    value="favorites"
                    className="rounded-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-gradient-to-r 
         data-[state=active]:from-purple-800 
         data-[state=active]:to-purple-700 
         data-[state=active]:text-white"
                  >
                    Favorites
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="p-6">
                  <div className="space-y-3">
                    {recentTrades.map((trade) => (
                      <div
                        key={trade.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/30"
                      >
                        <div>
                          <p className="font-medium">
                            {trade.type.toUpperCase()} {trade.amount} BTC
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {trade.timestamp}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${trade.price.toLocaleString()}
                          </p>
                          <p
                            className={`text-sm ${
                              trade.type === "buy"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {trade.type === "buy" ? "+0.5 BTC" : "-0.5 BTC"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="p-6">
                  <div className="text-center text-muted-foreground py-8">
                    <p>No active orders at the moment</p>
                  </div>
                </TabsContent>

                <TabsContent value="assets" className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/30">
                      <div>
                        <p className="font-medium">Bitcoin (BTC)</p>
                        <p className="text-sm text-muted-foreground">2.5 BTC</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$113,075.00</p>
                        <p className="text-sm text-green-500">+2.45%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/30">
                      <div>
                        <p className="font-medium">Ethereum (ETH)</p>
                        <p className="text-sm text-muted-foreground">
                          10.2 ETH
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$32,640.00</p>
                        <p className="text-sm text-green-500">+1.23%</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="favorites" className="p-6">
                  <div className="space-y-3">
                    {["BTC/USD", "ETH/USD", "SOL/USD", "XRP/USD"].map(
                      (pair) => (
                        <div
                          key={pair}
                          className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/30 cursor-pointer hover:border-primary/30 transition-all"
                        >
                          <p className="font-medium">{pair}</p>
                          <Badge variant="outline">View Chart</Badge>
                        </div>
                      )
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
