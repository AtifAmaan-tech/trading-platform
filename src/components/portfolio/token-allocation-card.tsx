"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { Card } from "@/components/ui/card";
import useCryptoPrice from "../hooks/useCryptoPrice";

interface TokenResponse {
  quantity: string;
  token_symbol: string;
}

interface TokenAllocationCardProps {
  assets: TokenResponse[];
}

// Define colors for different tokens
const TOKEN_COLORS: { [key: string]: string } = {
  USDT: "rgb(34, 197, 94)",
  ETH: "rgb(165, 130, 255)",
  BTC: "rgb(251, 146, 60)",
  POL: "rgb(130, 120, 229)",
  TRX: "rgb(255, 69, 96)",
  XRP: "rgb(35, 137, 218)",
  SOL: "rgb(220, 31, 255)",
  DOGE: "rgb(186, 151, 79)",
  // Add more colors as needed
};

const DEFAULT_COLOR = "rgb(100, 116, 139)";

// Active shape component for hover effect
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy - 10}
        dy={8}
        textAnchor="middle"
        fill={fill}
        className="font-bold text-lg"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 10}
        dy={8}
        textAnchor="middle"
        fill="#888"
        className="text-sm"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
      <text
        x={cx}
        y={cy + 30}
        dy={8}
        textAnchor="middle"
        fill="#888"
        className="text-xs"
      >
        ${payload.balance.toFixed(2)}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="none"
      />
    </g>
  );
};

export function TokenAllocationCard({ assets }: TokenAllocationCardProps) {
  const { prices } = useCryptoPrice(); // Get prices from context
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Calculate total value in USD
  const calculateTokenValue = (quantity: string, symbol: string): number => {
    const qty = parseFloat(quantity);
    const price = prices[symbol] || 0;

    if (symbol === "USDT") {
      return qty * 1;
    }
    return qty * price;
  };

  // Filter out tokens with zero quantity
  const activeAssets = assets.filter((asset) => parseFloat(asset.quantity) > 0);

  // Calculate total portfolio value
  const totalValue = activeAssets.reduce((sum, asset) => {
    return sum + calculateTokenValue(asset.quantity, asset.token_symbol);
  }, 0);

  // Prepare data for pie chart
  const tokenData = activeAssets
    .map((asset) => {
      const value = calculateTokenValue(asset.quantity, asset.token_symbol);
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

      return {
        name: asset.token_symbol,
        value: percentage,
        color: TOKEN_COLORS[asset.token_symbol] || DEFAULT_COLOR,
        balance: value,
      };
    })
    .sort((a, b) => b.value - a.value); // Sort by percentage descending

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card className="border border-primary/30 p-6 flex flex-col h-135">
      <h3 className="text-lg font-semibold mb-4">Token Allocation</h3>

      {/* Pie Chart */}
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex !== null ? activeIndex : undefined}
              activeShape={renderActiveShape}
              data={tokenData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              startAngle={90}
              endAngle={450}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              isAnimationActive={false}
            >
              {tokenData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{ cursor: "pointer" }}
                  stroke="none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Token List */}

      <div
        className="space-y-2 overflow-y-auto pr-3 !custom-scroll"
        style={{ maxHeight: "200px" }}
      >
        {tokenData.map((token, index) => {
          // Find the original asset to get quantity
          const asset = activeAssets.find((a) => a.token_symbol === token.name);
          const quantity = asset ? parseFloat(asset.quantity).toFixed(8) : "0";

          return (
            <div
              key={`${token.name}-${index}`}
              className={`flex justify-between items-center text-sm mt-3 p-2 rounded-lg transition-colors cursor-pointer ${
                activeIndex === index ? "bg-primary/10" : "hover:bg-primary/5"
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: token.color }}
                />
                <div>
                  <p className="font-medium mr-20">{token.name}</p>
                  <p className="text-muted-foreground text-xs text-left">
                    {quantity} {token.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-crypto-green font-medium">
                  {token.value.toFixed(1)}%
                </p>
                <p className="text-muted-foreground text-xs">
                  ${token.balance.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
