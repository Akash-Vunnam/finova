'use client';

import { useState } from 'react';

const tickers = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2945.20, change: 1.2, high: 2980.10, low: 2910.50 },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3950.05, change: 0.8, high: 3985.50, low: 3910.00 },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1420.15, change: -0.5, high: 1435.00, low: 1405.50 },
  { symbol: "INFY", name: "Infosys Limited", price: 1485.60, change: 1.5, high: 1510.00, low: 1475.00 },
  { symbol: "TATAMOTORS", name: "Tata Motors", price: 955.40, change: -1.2, high: 970.00, low: 940.50 },
  { symbol: "ITC", name: "ITC Limited", price: 425.80, change: 0.4, high: 430.00, low: 420.50 },
  { symbol: "SBIN", name: "State Bank of India", price: 745.25, change: 2.1, high: 755.00, low: 730.00 },
];

const Sparkline = ({ positive }: { positive: boolean }) => (
  <svg width="40" height="15" viewBox="0 0 40 15" className="ml-2 opacity-70">
    <path
      d={positive ? "M0,12 L10,8 L20,10 L30,2 L40,0" : "M0,2 L10,6 L20,4 L30,12 L40,14"}
      fill="none"
      stroke={positive ? "#10b981" : "#ef4444"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

import { useEffect } from 'react';
import { motion } from 'framer-motion';

const TickerPill = ({ ticker: initialTicker }: { ticker: any }) => {
  const [ticker, setTicker] = useState(initialTicker);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const changePercent = (Math.random() * 0.2) - 0.1;
        setTicker((prev: any) => ({
          ...prev,
          price: prev.price * (1 + changePercent / 100),
          change: prev.change + changePercent
        }));
        setIsUpdating(true);
        setTimeout(() => setIsUpdating(false), 500);
      }
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      animate={isUpdating ? { scale: [1, 1.05, 1], filter: 'brightness(1.5)' } : { scale: 1, filter: 'brightness(1)' }}
      transition={{ duration: 0.5 }}
      className={`group/pill relative flex items-center gap-3 bg-white/[0.03] border px-4 py-2 rounded-full transition-all duration-300 hover:scale-108 hover:border-white/10 hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:z-10 blur-[0.5px] hover:blur-none ${isUpdating ? 'border-white/30' : 'border-white/5'}`}
    >
      <span className="font-bold text-white/90">{ticker.symbol}</span>
      <span className="text-white font-medium">₹{ticker.price.toFixed(2)}</span>
      <span className={`text-sm font-semibold ${ticker.change >= 0 ? "text-finova-green" : "text-finova-red"}`}>
        {ticker.change > 0 ? "+" : ""}{ticker.change.toFixed(2)}%
      </span>
      <Sparkline positive={ticker.change >= 0} />
      
      {/* Tooltip */}
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-finova-navy-light/95 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl opacity-0 group-hover/pill:opacity-100 transition-opacity duration-200 pointer-events-none z-50 min-w-[140px]">
        <div className="font-semibold text-white text-sm mb-1">{ticker.name}</div>
        <div className="flex justify-between text-xs text-white/60">
          <span>H: ₹{ticker.high.toFixed(2)}</span>
          <span>L: ₹{ticker.low.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export const MiniTickerEnhanced = () => {
  const row = [...tickers, ...tickers, ...tickers, ...tickers];

  return (
    <div className="w-full bg-white/5 border-b border-white/10 overflow-hidden py-3 flex relative z-40 group shadow-[0_5px_30px_rgba(139,92,246,0.05)]">
      {/* Background glow trail */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-finova-purple/5 to-transparent w-full h-full pointer-events-none" />
      
      <div className="flex whitespace-nowrap gap-4 px-2 animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused] will-change-transform">
        {row.map((ticker, i) => (
          <TickerPill key={i} ticker={ticker} />
        ))}
      </div>
    </div>
  );
};
