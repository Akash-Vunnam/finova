"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { TiltCard } from "./TiltCard";

const topGainers = [
  { symbol: "TCS", name: "Tata Consultancy Services", price: "+₹62.40", percent: "(+1.65%)" },
  { symbol: "INFY", name: "Infosys Ltd", price: "+₹28.50", percent: "(+1.56%)" },
  { symbol: "TATAMOTORS", name: "Tata Motors", price: "+₹18.75", percent: "(+2.01%)" },
];

const topLosers = [
  { symbol: "HDFCBANK", name: "HDFC Bank", price: "-₹18.50", percent: "(-1.12%)" },
  { symbol: "WIPRO", name: "Wipro Ltd", price: "-₹12.40", percent: "(-2.32%)" },
  { symbol: "ITC", name: "ITC Ltd", price: "-₹8.30", percent: "(-1.35%)" },
];

export function TopMovers() {
  return (
    <TiltCard id="top-movers" className="hover:border-emerald-500/30 transition-colors duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <TrendingUp className="text-emerald-400" size={20} />
        </div>
        <h2 className="text-2xl font-semibold text-white">Top Movers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
        
        {/* Gainers Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Top Gainers</h3>
          {topGainers.map((stock, i) => (
            <motion.div 
              key={stock.symbol}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center justify-between hover:bg-white/5 rounded-lg px-3 py-2 transition-colors cursor-default group"
            >
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  {stock.symbol}
                  <ArrowUp className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs text-slate-400">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-semibold">{stock.price}</div>
                <div className="text-emerald-500/70 text-xs">{stock.percent}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Losers Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Top Losers</h3>
          {topLosers.map((stock, i) => (
            <motion.div 
              key={stock.symbol}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center justify-between hover:bg-white/5 rounded-lg px-3 py-2 transition-colors cursor-default group"
            >
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  {stock.symbol}
                  <ArrowDown className="w-3 h-3 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs text-slate-400">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="text-rose-400 font-semibold">{stock.price}</div>
                <div className="text-rose-500/70 text-xs">{stock.percent}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </TiltCard>
  );
}
