"use client";

import { motion } from "framer-motion";
import { Globe, TrendingUp, TrendingDown } from "lucide-react";
import { TiltCard } from "./TiltCard";

const indices = [
  { name: "S&P 500", value: "5,847.20", change: "+0.45%", isPositive: true },
  { name: "Nasdaq", value: "18,947.50", change: "+0.72%", isPositive: true },
  { name: "Dow Jones", value: "42,150.30", change: "+0.28%", isPositive: true },
  { name: "Nikkei 225", value: "38,450.10", change: "-0.15%", isPositive: false },
  { name: "FTSE 100", value: "8,240.50", change: "+0.33%", isPositive: true },
];

export function GlobalMarkets() {
  return (
    <TiltCard id="global-markets" className="hover:border-blue-500/30 transition-colors duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
          <Globe className="text-blue-400" size={20} />
        </div>
        <h2 className="text-2xl font-semibold text-white">Global Markets</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent snap-x">
        {indices.map((index, i) => (
          <motion.div
            key={index.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="bg-slate-800/30 border border-white/5 rounded-xl p-4 min-w-[160px] flex flex-col gap-2 hover:bg-slate-800/50 hover:border-white/10 transition-all hover:-translate-y-1 group snap-start shrink-0"
          >
            <h3 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{index.name}</h3>
            <div className="text-white text-lg font-bold font-mono">{index.value}</div>
            
            <div className={`flex items-center gap-1 text-sm font-medium ${index.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {index.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {index.change}
            </div>
          </motion.div>
        ))}
      </div>
    </TiltCard>
  );
}
