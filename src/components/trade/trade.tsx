"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCryptoPrice from "../hooks/useCryptoPrice";
import Navbar from "@/components/dashboard/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, Wallet2, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BinanceCandlestick from "./candle-stick-graph";
import RecentTrades from "./live-trades";
import axios from "axios";

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
  const { prices } = useCryptoPrice();
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  // const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState([0]);
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [balError, setbalerror] = useState("");
  const [inputAmount, setInputAmount] = useState<string>("");

  const amount = parseFloat(inputAmount) || 0;
  const stats: TradeStats = {
    price: prices.BTC,
    change24h: 2.45,
    high24h: 46800,
    low24h: 43200,
    volume: 28500000000,
    liquidity: 2100000000,
  };

  const cryptos = [
    { symbol: "BTC", name: "Bitcoin", icon: "" },
    { symbol: "ETH", name: "Ethereum", icon: "" },
    { symbol: "TRX", name: "Tron", icon: "" },
    { symbol: "BNB", name: "Binance Coin", icon: "" },
    { symbol: "SOL", name: "Solana", icon: "" },
    { symbol: "DOGE", name: "Doge", icon: "" },
    { symbol: "XRP", name: "Ripple", icon: "" },
    { symbol: "POL", name: "Matic", icon: "" },
    { symbol: "SUI", name: "Sui", icon: "" },
    { symbol: "ADA", name: "Cardano", icon: "" },
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

  const handleSubmit = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    e.preventDefault();

    const total = (parseFloat(inputAmount) || 0) * prices[selectedCrypto];
    console.log(total);

    if (total > balance) {
      setbalerror("Not enough funds!");
      setTimeout(() => setbalerror(""), 2000);
      return; // stop execution
    }

    if (tradeType === "sell" && amount > 100) {
      setbalerror(`Not enough ${selectedCrypto}!`);
      setTimeout(() => setbalerror(""), 2000);
      return;
    }
    const orderData: OrderData = {
      crypto: selectedCrypto,
      orderType: orderType,
      tradeType: tradeType,
      price: prices[selectedCrypto],
      amount: amount,
      total: total,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/create-transaction",
        {
          data: orderData,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error: any) {}

    setbalerror("");
  };

  const handleSliderChange = (value: number[]): void => {
    setSliderValue(value);

    const percentage = value[0] / 100;

    if (tradeType === "buy") {
      // Calculate how much crypto you can buy with USD
      const usdToSpend = balance * percentage;
      const cryptoAmount = usdToSpend / prices[selectedCrypto];
      setInputAmount(String(cryptoAmount));
    } else {
      // For selling, use a fixed available balance (placeholder)
      const fixedCryptoBalance = 1.0; // Replace with actual balance when API is available
      const cryptoAmount = fixedCryptoBalance * percentage;
      setInputAmount(String(cryptoAmount));
    }
  };

  useEffect(() => {
    setSliderValue([0]);
    setInputAmount("");
  }, [selectedCrypto]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-5">
        <div className="w-full mx-auto px-6 py-8">
          {/* Main Trading Area */}
          <div
            className="rounded-lg grid grid-cols-1 lg:grid-cols-4 gap-6
            animate-slideUp"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Left Panel - Trading Controls */}
            <form>
              <div className="relative lg:col-span-1 h-[650px] overflow-hidden">
                <div className="absolute inset-0 origin-top scale-y-[0.91]">
                  <Card className="p-6 border border-primary/30">
                    <h2 className="text-xl font-bold">Place Order</h2>

                    {/* Choose crypto token */}
                    <div className="mb-2 ">
                      <Select
                        value={selectedCrypto}
                        onValueChange={setSelectedCrypto}
                      >
                        <SelectTrigger className="w-full ">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cryptos.map((crypto) => (
                            <SelectItem
                              key={crypto.symbol}
                              value={crypto.symbol}
                            >
                              <div className="flex items-center gap-2 ">
                                <span>{crypto.icon}</span>
                                <span className="font-medium">
                                  {crypto.symbol}
                                </span>
                                <span className="text-muted-foreground text-sm pr-9 ">
                                  {crypto.name}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mb-0 pb-0 flex items-center">
                      {selectedCrypto}/USDT
                      <span className="ml-2 w-24 text-right font-mono">
                        ${prices[selectedCrypto]}
                      </span>
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
                        onClick={() => console.log("Feature is locked")}
                        // onClick={() => setOrderType("limit")}
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
                            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg"
                            : "flex-1 rounded-lg hover:bg-transparent bg:transparent"
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
                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg"
                            : "flex-1 rounded-lg bg:transparent hover:bg-transparent"
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
                          onChange={(e) => {
                            // Only convert if not empty
                            if (e.target.value !== "") {
                              setPrice(parseFloat(e.target.value) || 0);
                            } else {
                              setPrice(0);
                            }
                          }}
                          className="bg-input border-border/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </div>
                    )}

                    {/* Amount Input */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Amount {selectedCrypto}
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={inputAmount}
                        onChange={(e) => {
                          // Only convert if not empty

                          setInputAmount(e.target.value);
                        }}
                        className="bg-input border-border/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                      {!balance || !prices[selectedCrypto] ? (
                        <div className="text-sm text-gray-500">
                          Loading balance...
                        </div>
                      ) : (
                        <Slider
                          value={sliderValue}
                          onValueChange={handleSliderChange}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      )}
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

                            const percentage = percent / 100;

                            if (tradeType === "buy") {
                              // Calculate how much crypto you can buy with USD
                              const usdToSpend = balance * percentage;
                              const cryptoAmount =
                                usdToSpend / prices[selectedCrypto];
                              setInputAmount(String(cryptoAmount));
                            } else {
                              // For selling, use a fixed available balance (placeholder)
                              const fixedCryptoBalance = 1.0; // Replace with actual balance when API is available
                              const cryptoAmount =
                                fixedCryptoBalance * percentage;
                              setInputAmount(String(cryptoAmount));
                            }
                          }}
                          className="text-xs bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg h-11"
                        >
                          {percent}%
                        </Button>
                      ))}
                    </div>

                    {/* Total */}
                    <Card className="p-4 py-0 my-0 bg-card/30 border-border/50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Total:
                        </span>
                        <span className="text-lg font-bold text-primary">
                          $
                          {(amount * prices[selectedCrypto]).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    </Card>
                    {balError && (
                      <Alert
                        variant="destructive"
                        className="flex items-center"
                      >
                        {balError}
                      </Alert>
                    )}
                    {/* Trade Button */}
                    <Button
                      onClick={handleSubmit}
                      size="lg"
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg h-11"
                      variant={tradeType === "buy" ? "default" : "destructive"}
                    >
                      {tradeType === "buy"
                        ? `Buy ${selectedCrypto}`
                        : `Sell ${selectedCrypto}`}
                    </Button>
                  </Card>
                </div>
              </div>
            </form>

            {/* Center - Chart Area */}
            <div className="relative lg:col-span-2 h-[650px] overflow-hidden">
              <div className="absolute inset-0 origin-top scale-y-[0.82]">
                <BinanceCandlestick
                  selectedCrypto={selectedCrypto}
                  prices={prices}
                />
              </div>
            </div>

            {/* Right Panel - Recent Trades */}
            <div className="relative lg:col-span-1 h-[650px] overflow-hidden">
              <div className="absolute inset-0 origin-top scale-y-[0.80]">
                <RecentTrades selectedCrypto={selectedCrypto} />
              </div>
            </div>
          </div>

          {/* Bottom Tabs */}
    <div
      className="rounded-lg border border-primary/30 animate-slideUp"
      style={{ animationDelay: "0.2s" }}
    >
      <Card className="border-border/50 backdrop-blur-sm">
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border/30 px-6 py-0 h-auto bg-transparent">
            <TabsTrigger
              value="history"
              className="rounded-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-gradient-to-r 
   data-[state=active]:from-purple-800 
   data-[state=active]:to-purple-700 
   data-[state=active]:text-white"
            >
              <Clock className="w-4 h-4 mr-2" />
              Trade History
            </TabsTrigger>

            <TabsTrigger
              value="assets"
              className="rounded-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-gradient-to-r 
   data-[state=active]:from-purple-800 
   data-[state=active]:to-purple-700 
   data-[state=active]:text-white"
            >
              <Wallet2 className="w-4 h-4 mr-2" />
              My Assets
            </TabsTrigger>


          </TabsList>

          {/* Trade History */}
          <TabsContent value="history" className="p-6">
            <div className="space-y-4">
              {recentTrades.map((trade, index) => (
                <div key={trade.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {trade.type === 'buy' ? (
                          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                            BUY
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
                            SELL
                          </Badge>
                        )}
                        <span className="text-sm font-medium">{trade.amount} BTC</span>
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
                      <p className={`text-sm ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                        {trade.type === 'buy' ? '+' : '-'}{trade.amount} BTC
                      </p>
                    </div>
                  </div>
                  {index < recentTrades.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* My Assets */}
          <TabsContent value="assets" className="p-6">
            <div className="space-y-4">
              {/* Bitcoin */}
              <Card className="p-4 bg-card/50 border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">₿</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Bitcoin</h3>
                      <p className="text-sm text-muted-foreground">2.5 BTC</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">$113,075.00</p>
                    <div className="flex items-center justify-end gap-1 text-green-500">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+2.45%</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Ethereum */}
              <Card className="p-4 bg-card/50 border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Ξ</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Ethereum</h3>
                      <p className="text-sm text-muted-foreground">10.2 ETH</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">$32,640.00</p>
                    <div className="flex items-center justify-end gap-1 text-green-500">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+1.23%</span>
                    </div>
                  </div>
                </div>
              </Card>
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
