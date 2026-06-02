'use client';

import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import StockChart from '@/components/ui/StockChart';
import Coin3D from '@/components/3d/Coin3D';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { Confetti } from '@/components/ui/Confetti';
import { ArrowUpRight, ArrowDownRight, Bot, Target, Newspaper, BarChart2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// A simple typing effect component for AI explanations
const TypingEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, 20); // typing speed
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return <span>{displayedText}<span className="animate-pulse">_</span></span>;
};

export default function StockDetail() {
  const params = useParams();
  const rawTicker = params.ticker as string;
  const ticker = rawTicker ? rawTicker.toUpperCase() : '';

  // 1. Fetch Stock Data
  const { data: stock, isLoading: isStockLoading, error: stockError } = useQuery({
    queryKey: ['stock', ticker],
    queryFn: async () => {
      const res = await fetch(`/api/stock/${ticker}`);
      if (!res.ok) throw new Error('Failed to fetch stock data');
      return res.json();
    },
    enabled: !!ticker,
    retry: false,
  });

  // 2. Fetch AI Explain
  const { data: aiExplain, isLoading: isExplainLoading } = useQuery({
    queryKey: ['ai-explain', ticker],
    queryFn: async () => {
      const res = await fetch(`/api/ai/explain/${ticker}`);
      if (!res.ok) throw new Error('Failed to fetch explanation');
      return res.json();
    },
    enabled: !!ticker,
    staleTime: Infinity,
  });

  // 3. Fetch AI Verdict
  const { data: aiVerdict, isLoading: isVerdictLoading } = useQuery({
    queryKey: ['ai-verdict', ticker],
    queryFn: async () => {
      const res = await fetch(`/api/ai/verdict/${ticker}`);
      if (!res.ok) throw new Error('Failed to fetch verdict');
      return res.json();
    },
    enabled: !!ticker,
    staleTime: Infinity,
  });

  if (isStockLoading) {
    return (
      <div className="min-h-screen bg-finova-navy flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-finova-purple border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-white/60 animate-pulse">Analyzing {ticker}...</p>
        </div>
      </div>
    );
  }

  if (stockError || !stock) {
    return (
      <div className="min-h-screen bg-finova-navy flex items-center justify-center p-4">
        <GlassCard className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-finova-red mb-4">Stock Not Found</h2>
          <p className="text-white/60 mb-6">We couldn't retrieve data for {ticker}. Please check the symbol and try again.</p>
          <button className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            Go Back
          </button>
        </GlassCard>
      </div>
    );
  }

  const isPositive = stock.change >= 0;
  const color = isPositive ? '#34d399' : '#f87171'; // green or red

  return (
    <div className="min-h-[100dvh] bg-finova-navy p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header / Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center gap-8 justify-between"
        >
          <div className="flex-1">
            <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium mb-4">
              {stock.name}
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter">
              {ticker}
            </h1>
            <div className="flex items-end gap-4">
              <span className="text-5xl md:text-6xl font-bold text-white">
                ₹<CountUpNumber value={stock.price} decimals={2} />
              </span>
              <div className={`flex items-center text-xl md:text-2xl font-medium mb-1 ${isPositive ? 'text-finova-green' : 'text-finova-red'}`}>
                {isPositive ? <ArrowUpRight size={28} /> : <ArrowDownRight size={28} />}
                <span>{Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.change_percent).toFixed(2)}%)</span>
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-[300px] h-[300px]">
            <Coin3D symbol={ticker} color={color} />
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-6">
          
          {/* Chart Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <GlassCard className="p-6 h-[500px]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Price Action</h3>
              </div>
              <StockChart data={stock.history} color={color} />
            </GlassCard>
          </motion.div>

          {/* AI Insights Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Verdict Badge */}
            <GlassCard className="p-6 relative overflow-hidden group flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-finova-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 text-white/60 font-medium mb-4">
                <Target size={18} className="text-finova-purple" />
                <span>AI Verdict</span>
              </div>
              
              {isVerdictLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-32 h-10 bg-white/5 rounded-full animate-pulse mb-4" />
                  <div className="w-full max-w-[200px] h-4 bg-white/5 rounded animate-pulse" />
                </div>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center py-4 relative"
                  >
                    <Confetti active={!isVerdictLoading && !!aiVerdict && aiVerdict.verdict === 'BUY'} />
                    <div className={`px-6 py-2 rounded-full text-2xl font-black mb-4 relative z-10 ${
                      aiVerdict?.verdict === 'BUY' ? 'bg-finova-green/20 text-finova-green border border-finova-green/30 shadow-[0_0_20px_rgba(52,211,153,0.3)]' :
                      aiVerdict?.verdict === 'SELL' ? 'bg-finova-red/20 text-finova-red border border-finova-red/30 shadow-[0_0_20px_rgba(248,113,113,0.3)]' :
                      'bg-white/10 text-white border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                    }`}>
                      {aiVerdict?.verdict || 'HOLD'}
                    </div>
                    <p className="text-sm text-center text-white/80 leading-relaxed max-w-sm">
                      {aiVerdict?.reason}
                    </p>
                  </motion.div>
                </AnimatePresence>
              )}
            </GlassCard>

            {/* AI Explain */}
            <GlassCard className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-2 text-white/60 font-medium mb-4">
                <Bot size={18} className="text-finova-green" />
                <span>AI Explain</span>
              </div>
              
              {isExplainLoading ? (
                <div className="flex-1 space-y-3 pt-2">
                  <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                  <div className="w-5/6 h-4 bg-white/5 rounded animate-pulse" />
                  <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                  <div className="w-4/6 h-4 bg-white/5 rounded animate-pulse" />
                </div>
              ) : (
                <div className="flex-1 text-white leading-relaxed text-sm overflow-y-auto pr-2 custom-scrollbar">
                  {aiExplain?.explanation ? (
                    <TypingEffect text={aiExplain.explanation} />
                  ) : (
                    "Could not generate explanation."
                  )}
                </div>
              )}
            </GlassCard>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <button className="w-full py-4 rounded-xl font-bold text-finova-navy bg-white hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Trade {ticker}
            </button>
          </motion.div>
        </div>

        {/* Stats & News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {/* Company Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 space-y-4"
          >
            <div className="flex items-center gap-2 text-white/80 font-medium mb-4">
              <BarChart2 size={20} className="text-finova-purple" />
              <h3 className="text-lg">Key Statistics</h3>
            </div>
            
            <GlassCard hoverEffect className="p-5 flex justify-between items-center">
              <span className="text-white/60">Market Cap</span>
              <span className="font-bold text-white text-lg">
                ₹<CountUpNumber value={stock.price * 1000000} decimals={0} suffix="B" />
              </span>
            </GlassCard>
            
            <GlassCard hoverEffect className="p-5 flex justify-between items-center">
              <span className="text-white/60">P/E Ratio</span>
              <span className="font-bold text-white text-lg">
                <CountUpNumber value={24.5} decimals={2} />
              </span>
            </GlassCard>
            
            <GlassCard hoverEffect className="p-5 flex flex-col justify-center">
              <span className="text-white/60 text-sm mb-2">52W High / Low</span>
              <div className="flex justify-between items-center w-full">
                <span className="font-bold text-finova-green">
                  ₹<CountUpNumber value={stock.price * 1.2} decimals={2} />
                </span>
                <div className="h-[2px] flex-1 mx-4 bg-gradient-to-r from-finova-red via-white/20 to-finova-green rounded-full" />
                <span className="font-bold text-finova-red">
                  ₹<CountUpNumber value={stock.price * 0.7} decimals={2} />
                </span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Related News */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-2 text-white/80 font-medium mb-4">
              <Newspaper size={20} className="text-finova-green" />
              <h3 className="text-lg">Related News</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <GlassCard key={i} className="overflow-hidden group flex flex-col h-full p-0">
                  <div className="h-32 bg-finova-navy-light relative overflow-hidden">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-finova-purple/20 to-finova-green/20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-xs text-white">
                      {i}h ago
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h4 className="text-white font-medium line-clamp-2 mb-2 group-hover:text-finova-purple transition-colors">
                      {ticker} surges as new AI investments show promising returns for Q4.
                    </h4>
                    <span className="text-xs text-white/40">Financial Times</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
