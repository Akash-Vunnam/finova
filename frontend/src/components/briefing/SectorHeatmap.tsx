"use client";

import { motion } from "framer-motion";
import { Grid3x3 } from "lucide-react";
import { TiltCard } from "./TiltCard";

const sectors = [
  { name: "IT", change: "+2.4%", isPositive: true },
  { name: "Banking", change: "+1.8%", isPositive: true },
  { name: "Auto", change: "+1.2%", isPositive: true },
  { name: "Pharma", change: "-0.3%", isPositive: false },
  { name: "FMCG", change: "-0.7%", isPositive: false },
  { name: "Energy", change: "+0.5%", isPositive: true },
  { name: "Infra", change: "+1.5%", isPositive: true },
  { name: "Metals", change: "-0.2%", isPositive: false },
];

export function SectorHeatmap() {
  return (
    <TiltCard id="sector-heatmap" className="hover:border-indigo-500/30 transition-colors duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
          <Grid3x3 className="text-indigo-400" size={20} />
        </div>
        <h2 className="text-2xl font-semibold text-white">Sector Performance</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sectors.map((sector, idx) => (
          <motion.div
            key={sector.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="bg-slate-800/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-1 hover:bg-slate-800/60 hover:border-white/10 transition-all hover:scale-105 group"
          >
            <span className="text-slate-300 text-sm font-medium">{sector.name}</span>
            <span className={`text-lg font-bold ${sector.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {sector.change}
            </span>
            <svg width="40" height="16" viewBox="0 0 40 16" className="mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
              <path 
                d={sector.isPositive ? "M0 12 L10 8 L20 10 L30 4 L40 0" : "M0 4 L10 8 L20 6 L30 12 L40 16"} 
                stroke={sector.isPositive ? "#34d399" : "#f43f5e"} 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </motion.div>
        ))}
      </div>
    </TiltCard>
  );
}
