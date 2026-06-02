"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { TOP_GAINERS, TOP_LOSERS } from "@/lib/constants/discover-data";
import { formatStockPrice } from "@/lib/utils/indian-market";
import { Sparkline } from "./sparkline";

function StockRow({ stock, type }: { stock: typeof TOP_GAINERS[0]; type: "gainer" | "loser" }) {
  const isPositive = type === "gainer";
  
  return (
    <div className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-white/5">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          isPositive ? "bg-emerald-500/10" : "bg-rose-500/10"
        }`}>
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          ) : (
            <TrendingDown className="h-5 w-5 text-rose-400" />
          )}
        </div>
        <div>
          <p className="font-semibold text-white">{stock.symbol}</p>
          <p className="text-xs text-slate-400">{stock.name}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Sparkline data={stock.sparklineData} positive={isPositive} />
        <div className="text-right">
          <p className="font-semibold text-white">{formatStockPrice(stock.price)}</p>
          <p className={`text-xs font-medium ${
            isPositive ? "text-emerald-400" : "text-rose-400"
          }`}>
            {stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent > 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%)
          </p>
        </div>
      </div>
    </div>
  );
}

export function MarketMovers() {
  return (
    <div className="space-y-4">
      {/* Top Gainers */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <h3 className="font-semibold text-emerald-400">Top Gainers</h3>
        </div>
        <div className="space-y-1">
          {TOP_GAINERS.map((stock) => (
            <StockRow key={stock.symbol} stock={stock} type="gainer" />
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-rose-400" />
          <h3 className="font-semibold text-rose-400">Top Losers</h3>
        </div>
        <div className="space-y-1">
          {TOP_LOSERS.map((stock) => (
            <StockRow key={stock.symbol} stock={stock} type="loser" />
          ))}
        </div>
      </div>
    </div>
  );
}
