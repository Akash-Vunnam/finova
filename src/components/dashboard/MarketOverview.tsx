'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AnimatedSparkline } from './AnimatedSparkline';
import { formatINR } from '@/lib/formatters';

const INDICES = [
  { id: 'nifty', symbol: 'NIFTY 50', price: 23450.85, change: 0.85, trend: 'up' as const },
  { id: 'sensex', symbol: 'SENSEX', price: 77342.30, change: 0.72, trend: 'up' as const },
  { id: 'banknifty', symbol: 'BANK NIFTY', price: 48920.15, change: -0.35, trend: 'down' as const },
];

const generateSparkline = (base: number, trend: 'up' | 'down') => {
  let val = base;
  return Array.from({ length: 15 }, () => {
    val += (Math.random() - (trend === 'up' ? 0.3 : 0.7)) * 10;
    return { value: val };
  });
};

export const MarketOverview = () => {
  const [sparklines, setSparklines] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const initialSparks: Record<string, any[]> = {};
    INDICES.forEach(item => {
      initialSparks[item.id] = generateSparkline(item.price, item.trend);
    });
    setSparklines(initialSparks);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">Market Overview</h3>
      <div className="flex flex-col gap-3">
        {INDICES.map((item) => {
          const isUp = item.trend === 'up';
          const accentColor = isUp ? '#10b981' : '#f43f5e';

          return (
            <div 
              key={item.id}
              className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all duration-300 hover:bg-white/[0.06]"
            >
              {/* Left Colored Accent Border */}
              <div 
                className="absolute bottom-0 left-0 top-0 w-[3px] transition-all duration-300 group-hover:w-[4px]"
                style={{ 
                  backgroundColor: accentColor,
                  boxShadow: `0 0 10px ${accentColor}cc` 
                }}
              />

              {/* Index Info */}
              <div className="relative z-10 w-1/3 pl-2">
                <div className="text-sm font-bold tracking-tight text-white transition-colors group-hover:text-finova-purple">
                  {item.symbol}
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs font-medium text-white/70">
                    {formatINR(item.price)}
                  </div>
                </div>
              </div>
              
              {/* Sparkline */}
              <div className="relative z-10 mx-2 h-8 w-1/3 transition-all duration-300 group-hover:brightness-125">
                {sparklines[item.id] && (
                  <AnimatedSparkline 
                    data={sparklines[item.id]} 
                    isUp={isUp} 
                    width={80} 
                    height={32} 
                  />
                )}
              </div>

              {/* Performance */}
              <div className="relative z-10 flex w-1/4 items-center justify-end">
                <div 
                  className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: isUp ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                    color: accentColor
                  }}
                >
                  {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  <span className="font-mono tabular-nums">{Math.abs(item.change).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
