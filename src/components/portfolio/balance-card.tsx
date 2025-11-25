"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const chartData = [
  { time: "00:00", value: 14200 },
  { time: "04:00", value: 14850 },
  { time: "08:00", value: 14500 },
  { time: "12:00", value: 15100 },
  { time: "16:00", value: 15750 },
  { time: "20:00", value: 15327 },
  { time: "24:00", value: 15327 },
];

const timeFilters = ["1W", "1M", "3M", "1Y", "5Y", "ALL"];

interface BalanceCardProp{
  totalBalance?: number;
}


export function BalanceCard({totalBalance}: BalanceCardProp) {
  const [selectedFilter, setSelectedFilter] = useState("1W");


  return (
    <Card className="border-primary/30 p-6">
      <div className="mb-10">
        <p className="text-muted-foreground text-sm mb-2">Total Balance</p>
        <h2 className="text-5xl font-bold mb-4 glow-purple">${totalBalance}</h2>
        {/* <p className="text-crypto-green text-sm font-medium">+12.5% from last week</p> */}
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="rgb(166, 2, 203)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="rgba(165, 130, 255, 0.1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(165, 130, 255, 0.1)"
            />
            <XAxis
              dataKey="time"
              stroke="rgba(255, 255, 255, 0.3)"
              fontSize={12}
            />
            <YAxis stroke="rgba(255, 255, 255, 0.3)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(18, 18, 35, 0.9)",
                border: "1px solid rgba(165, 130, 255, 0.3)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "rgba(255, 255, 255, 0.8)" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="rgb(166, 2, 203)"
              strokeWidth={3}
              dot={false}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Time Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {timeFilters.map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(filter)}
            className={
              selectedFilter === filter
                ? "bg-crypto-purple hover:bg-crypto-purple-glow"
                : "border-crypto-border hover:bg-crypto-card"
            }
          >
            {filter}
          </Button>
        ))}
      </div>
    </Card>
  );
}
