'use client';

import { motion } from 'framer-motion';

import { formatINR } from '@/lib/formatters';

const tickers = [
  { symbol: "RELIANCE", price: 2950.25, change: 1.2 },
  { symbol: "TCS", price: 3950.02, change: 0.8 },
  { symbol: "TATAMOTORS", price: 1015.12, change: 2.5 },
  { symbol: "INFY", price: 1650.50, change: -1.5 },
  { symbol: "HDFCBANK", price: 1450.20, change: 0.4 },
  { symbol: "BHARTIARTL", price: 1180.90, change: 1.1 },
  { symbol: "SBIN", price: 760.40, change: -0.2 },
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

const TickerPill = ({ ticker }: { ticker: any }) => (
  <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-default">
    <span className="font-bold text-white/90">{ticker.symbol}</span>
    <span className="text-white font-medium">{formatINR(ticker.price)}</span>
    <span className={`text-sm font-semibold ${ticker.change >= 0 ? "text-finova-green" : "text-finova-red"}`}>
      {ticker.change > 0 ? "+" : ""}{ticker.change}%
    </span>
    <Sparkline positive={ticker.change >= 0} />
  </div>
);

export default function TickerMarquee() {
  const row1 = [...tickers, ...tickers, ...tickers, ...tickers];
  const row2 = [...tickers.slice().reverse(), ...tickers.slice().reverse(), ...tickers.slice().reverse(), ...tickers.slice().reverse()];

  return (
    <div className="w-full overflow-hidden py-6 flex flex-col gap-4 relative z-20">
      <div className="flex group w-full">
        <div className="flex whitespace-nowrap gap-4 px-2 animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused] will-change-transform">
          {row1.map((ticker, i) => (
            <TickerPill key={i} ticker={ticker} />
          ))}
        </div>
      </div>
      <div className="flex group w-full">
        <div className="flex whitespace-nowrap gap-4 px-2 animate-[marquee-reverse_30s_linear_infinite] group-hover:[animation-play-state:paused] will-change-transform">
          {row2.map((ticker, i) => (
            <TickerPill key={i} ticker={ticker} />
          ))}
        </div>
      </div>
    </div>
  );
}
