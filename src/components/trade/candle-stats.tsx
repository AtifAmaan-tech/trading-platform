"use client";

import type { Candle } from "./candle-stick-graph";

export default function CandleStats({
  selectedCandle,
}: {
  selectedCandle: Candle;

}) {
  return  (
    <div className="z-10 mb-2">
      <div className="flex justify-content left mb-3 ml-2 text-xs text-white">
        Time: {new Date(selectedCandle.time).toLocaleString("en-IN", {
  hour12: true,
})}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div>
          <div className="text-gray-400 text-xs">Open</div>
          <div className="text-white text-sm font-semibold">
            ${selectedCandle.open.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-xs ">High</div>
          <div className="text-green-400 text-sm font-semibold">
            ${selectedCandle.high.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-xs ">Low</div>
          <div className="text-red-400 font-semibold">
            ${selectedCandle.low.toLocaleString()}
          </div>
        </div>

        <div>
          <div className="text-gray-400 text-xs ">Close</div>
          <div className="text-white text-sm font-semibold">
            ${selectedCandle.close.toLocaleString()}
          </div>
        </div>

        <div>
          <div className="text-gray-400 text-xs">Trades</div>
          <div className="text-white text-sm font-semibold">
            {selectedCandle.trade.toLocaleString()}
          </div>
        </div>

        <div className="border">
          <div className="text-gray-400 text-xs">Volume</div>
          <div className="text-white text-sm font-semibold">
            {selectedCandle.volume.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
