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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Clock, Wallet2 } from "lucide-react";
import BinanceCandlestick from "./candle-stick-graph";
import RecentTrades from "./live-trades";
import axios from "axios";
import { toast } from "sonner";
import TradeHistoryCard from "./trade-history";
import AssetsTab from "./my-assets";

interface PortfolioProps {
  balance: number;
  refresh: number;
  onTradeComplete: () => void;
  assets: any;
}

export default function TradePage({
  balance,
  refresh,
  onTradeComplete,
  assets,
}: PortfolioProps) {
  const { prices } = useCryptoPrice();
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState([0]);
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [balError, setbalerror] = useState("");
  const [inputAmount, setInputAmount] = useState<string>("");
  const BASEURL = import.meta.env.VITE_PUBLIC_BACKEND_URL;



  const amount = parseFloat(inputAmount) || 0;

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

  const percentageButtons = [25, 50, 75, 100];

  interface OrderData {
    crypto: string;
    orderType: "market" | "limit";
    tradeType: "buy" | "sell";
    price: number;
    amount: number;
    total: number;
  }


  const getTokenBalance = (tokenSymbol: string): number => {
    const token = assets.find((asset: any) => asset.token_symbol === tokenSymbol);
    return parseFloat(token?.quantity || "0");
  };

  const handleSubmit = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {

    e.preventDefault();

    const total = (parseFloat(inputAmount) || 0) * prices[selectedCrypto];
    

    // Validation for amount input
    if (total === 0) {
      setbalerror("Please enter amount!");
      setTimeout(() => setbalerror(""), 2000);
      return;
    }

    // Validation for buy orders
    if (tradeType === "buy" && total > balance) {
      setbalerror("Not enough funds!");
      setTimeout(() => setbalerror(""), 2000);
      return;
    }

    // Validation for sell orders - check if user has enough tokens
    if (tradeType === "sell") {
      const availableBalance = getTokenBalance(selectedCrypto);

      if (amount > availableBalance) {
        setbalerror(
          `Not enough ${selectedCrypto}! Available: ${availableBalance}`
        );
        setTimeout(() => setbalerror(""), 2000);
        return;
      }
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
        `${BASEURL}/create-transaction`,
        {
          data: orderData,
        },
        {
          withCredentials: true,
        }
      );
      if (tradeType === "buy") {
        toast.success("Purchase Successful");
        setInputAmount('')
      } else {
        toast.success("Sell Successful");
        setInputAmount('')
      }
      onTradeComplete();
    } catch (error: any) {
      if (tradeType === "buy") {

        toast.error("Purchase Failed");
      } else {
        toast.error("Sell Failed");
      }
    }

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
      // For selling, use actual token balance from assets
      const availableCryptoBalance = getTokenBalance(selectedCrypto);
      const cryptoAmount = availableCryptoBalance * percentage;
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
                          const value = e.target.value;

                          // Allow only digits and one decimal point
                          if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
                            setInputAmount(value);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (["-", "+", "e", "E"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onWheel={(e) => e.currentTarget.blur()}

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
                              // For selling, use actual token balance from assets
                              const availableCryptoBalance =
                                getTokenBalance(selectedCrypto);
                              const cryptoAmount =
                                availableCryptoBalance * percentage;
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
                <TradeHistoryCard refresh={refresh} />

                {/* My Assets */}
                <AssetsTab assets={assets} />
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
