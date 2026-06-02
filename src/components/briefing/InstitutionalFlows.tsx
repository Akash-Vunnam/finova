"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowLeftRight, TrendingUp, TrendingDown } from "lucide-react";
import { TiltCard } from "./TiltCard";

const formatValue = (val: number) => {
  return val > 0 ? `+₹${Math.round(val).toLocaleString('en-IN')} Cr` : `-₹${Math.abs(Math.round(val)).toLocaleString('en-IN')} Cr`;
};

export function InstitutionalFlows() {
  const fiiValue = useMotionValue(0);
  const diiValue = useMotionValue(0);

  const fiiDisplay = useTransform(fiiValue, formatValue);
  const diiDisplay = useTransform(diiValue, formatValue);

  useEffect(() => {
    // Start animation slightly after the component enters the viewport
    const timeout = setTimeout(() => {
      animate(fiiValue, 2340, { duration: 1.5, ease: "easeOut" });
      animate(diiValue, -890, { duration: 1.5, ease: "easeOut" });
    }, 500);
    return () => clearTimeout(timeout);
  }, [fiiValue, diiValue]);

  return (
    <TiltCard id="institutional-flows" className="hover:border-teal-500/30 transition-colors duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
          <ArrowLeftRight className="text-teal-400" size={20} />
        </div>
        <h2 className="text-2xl font-semibold text-white">Institutional Flows</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FII Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-800/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
        >
          {/* Mini Chart Background */}
          <svg className="absolute bottom-0 w-full h-16 opacity-10 group-hover:opacity-20 transition-opacity" preserveAspectRatio="none" viewBox="0 0 100 40">
            <path d="M0,40 L10,30 L30,35 L50,15 L70,25 L90,5 L100,0 L100,40 Z" fill="#34d399" />
          </svg>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <span className="font-semibold text-white">FII Net</span>
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <motion.div className="text-emerald-400 text-3xl font-bold font-mono">
              {fiiDisplay}
            </motion.div>
            <div className="text-slate-500 text-xs mt-2 text-center">Foreign Institutional Investors</div>
          </div>
        </motion.div>

        {/* DII Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-800/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 border border-white/5 relative overflow-hidden group hover:border-rose-500/30 transition-colors"
        >
          {/* Mini Chart Background */}
          <svg className="absolute bottom-0 w-full h-16 opacity-10 group-hover:opacity-20 transition-opacity" preserveAspectRatio="none" viewBox="0 0 100 40">
            <path d="M0,0 L10,15 L30,10 L50,30 L70,20 L90,35 L100,40 L0,40 Z" fill="#f43f5e" />
          </svg>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <span className="font-semibold text-white">DII Net</span>
              <TrendingDown size={16} className="text-rose-400" />
            </div>
            <motion.div className="text-rose-400 text-3xl font-bold font-mono">
              {diiDisplay}
            </motion.div>
            <div className="text-slate-500 text-xs mt-2 text-center">Domestic Institutional Investors</div>
          </div>
        </motion.div>
      </div>
    </TiltCard>
  );
}
