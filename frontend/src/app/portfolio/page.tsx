'use client';

import { motion, Reorder, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import Donut3D from '@/components/3d/Donut3D';
import StockChart from '@/components/ui/StockChart';
import { ArrowUpRight, ArrowDownRight, Plus, GripVertical, TrendingUp, X, Search, Hash, DollarSign } from 'lucide-react';
import { useState, useRef, useMemo, useEffect } from 'react';
import { formatINR } from '@/lib/formatters';
import { formatIndianCurrency } from '@/lib/utils/indian-formatting';
import { DEMO_PORTFOLIO } from '@/lib/constants/demo-data';

// Premium high-performance Holdings Card with custom 3D hover tilt & dynamic holographic sheen
function HoldingsCard({ stock, isItemPositive, itemValue, itemGainPercent, index }: {
  stock: typeof initialStocks[0];
  isItemPositive: boolean;
  itemValue: number;
  itemGainPercent: number;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const accentColor = isItemPositive ? '#10B981' : '#EF4444';

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-3, 3]), springConfig);
  const sheenX = useSpring(useTransform(x, [0, 1], [0, 100]), springConfig);
  const sheenY = useSpring(useTransform(y, [0, 1], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  // Mock deterministic sparkline data for this stock to avoid hydration mismatch
  const sparkline = useMemo(() => {
    // Generate a simple deterministic pseudo-random seed from stock.symbol
    const seed = stock.symbol.charCodeAt(0) + (stock.symbol.charCodeAt(1) || 0);
    return Array.from({ length: 12 }, (_, i) => {
      // Deterministic factor between 0.1 and 0.9 using sine wave of seed + index
      const factor = 0.1 + Math.abs(Math.sin(seed + i * 0.95)) * 0.8;
      return {
        val: stock.currentPrice - (isItemPositive ? 11 - i : i - 11) * factor * 3.5
      };
    });
  }, [stock.currentPrice, isItemPositive, stock.symbol]);

  const { linePath, areaPath } = useMemo(() => {
    const minVal = Math.min(...sparkline.map(s => s.val));
    const maxVal = Math.max(...sparkline.map(s => s.val));
    const range = maxVal - minVal || 1;
    
    const points = sparkline.map((s, idx) => {
      const px = idx * (100 / 11);
      const py = 30 - ((s.val - minVal) / range) * 22 - 4; // leave padding top/bottom
      return { x: px, y: py };
    });

    const lPath = `M ${points[0].x},${points[0].y} ` + points.map(p => `L ${p.x},${p.y}`).join(' ');
    const aPath = `${lPath} L 100,30 L 0,30 Z`;
    return { linePath: lPath, areaPath: aPath };
  }, [sparkline]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        x.set(0.5);
        y.set(0.5);
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 100, damping: 15 }}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      animate={{
        scale: hovered ? 1.02 : 1.0,
      }}
      className={`relative overflow-hidden bg-white/[0.03] backdrop-blur-[20px] saturate-[180%] border border-white/[0.08] rounded-2xl h-full flex flex-col justify-between p-4 shadow-xl transition-all duration-300 ${
        hovered ? 'shadow-[0_12px_40px_rgba(0,0,0,0.5)] border-white/15' : ''
      }`}
    >
      {/* Subtle Inner Top Shadow Highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/[0.04] pointer-events-none" />

      {/* Holographic Sheen Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 transition-opacity duration-500"
        style={{
          opacity: hovered ? 0.06 : 0,
          background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 65%)`,
        }}
      />

      {/* Left Colored Accent Border Bar */}
      <motion.div 
        className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300"
        style={{ backgroundColor: accentColor }}
        animate={{
          width: hovered ? 4 : 3,
          boxShadow: hovered ? `0 0 10px ${accentColor}` : `0 0 0px ${accentColor}00`
        }}
      />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3">
          {/* Grid Icon (9 dots) rotating 90deg on card hover */}
          <motion.div 
            animate={{ rotate: hovered ? 90 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-wrap w-4 h-4 gap-[2px] cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-1 rounded-full" 
                style={{ backgroundColor: accentColor, opacity: 0.4 }}
              />
            ))}
          </motion.div>

          <div>
            <div className="font-black text-white text-base tracking-wide uppercase">{stock.symbol}</div>
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{stock.shares} shares</div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-black text-white tracking-tight tabular-nums text-base">
            {formatINR(itemValue)}
          </div>
          
          {/* Pill Percentage Badge */}
          <div className="flex justify-end mt-1">
            <motion.div 
              animate={hovered ? { scale: [1, 1.05, 1] } : {}}
              className="flex items-center gap-0.5 px-2 py-0.5 rounded-full font-black text-[10px]"
              style={{
                backgroundColor: isItemPositive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                color: accentColor
              }}
            >
              {isItemPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              <span className="tabular-nums font-mono">
                {Math.abs(itemGainPercent).toFixed(2)}%
              </span>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Mini Sparkline Chart */}
      <div className="h-12 w-full mt-2 relative z-10 transition-all duration-300 group-hover:brightness-125">
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`gradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Gradient fill */}
          <motion.path
            d={areaPath}
            fill={`url(#gradient-${stock.symbol})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          
          {/* Main stroke line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{
              filter: hovered ? `drop-shadow(0 0 6px ${accentColor})` : `drop-shadow(0 0 2px ${accentColor}66)`
            }}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

const initialStocks = DEMO_PORTFOLIO.holdings.map((h, i) => ({
  id: (i + 1).toString(),
  symbol: h.symbol,
  shares: h.shares,
  avgPrice: h.avgBuy,
  currentPrice: h.currentPrice,
}));

// mockTimelineData generation will be moved inside the component to respond to state changes
// Premium real-time AI Portfolio Insight component with Visibility API tracking, text stream, blinking cursor, and pre-load indicators
function AIPortfolioInsight() {
  const fullText = useRef("Your IT-heavy allocation (TCS, INFY) has driven strong returns recently. Consider diversifying into FMCG or banking sectors to hedge against upcoming Nifty volatility.");
  const [displayText, setDisplayText] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);

  const startTyping = () => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(fullText.current);
      setIsComplete(true);
      setIsGenerating(false);
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    indexRef.current = 0;
    setDisplayText('');
    setIsComplete(false);
    setIsGenerating(true);

    // AI generating indicator flashes for 600ms before typing begins
    timerRef.current = setTimeout(() => {
      setIsGenerating(false);
      tick();
    }, 600);
  };

  const tick = () => {
    if (indexRef.current < fullText.current.length) {
      indexRef.current += 1;
      setDisplayText(fullText.current.slice(0, indexRef.current));
      timerRef.current = setTimeout(tick, 25);
    } else {
      setIsComplete(true);
    }
  };

  useEffect(() => {
    startTyping();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startTyping();
      }
    };

    const handleWindowFocus = () => {
      startTyping();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        backgroundPosition: ['0% center', '200% center'] 
      }}
      transition={{ 
        opacity: { delay: 0.1 }, 
        backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' } 
      }}
      className="mb-8 p-[1px] rounded-2xl bg-gradient-to-r from-finova-purple via-finova-green to-finova-purple bg-[length:200%_auto] shadow-[0_0_20px_rgba(139,92,246,0.3)] overflow-hidden"
    >
      <div className="bg-finova-navy/90 backdrop-blur-xl rounded-xl p-4 flex items-center gap-4 min-h-[72px]">
        <div className="w-10 h-10 rounded-full bg-finova-purple/20 flex items-center justify-center animate-pulse flex-shrink-0">
          <span className="text-xl">✨</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white mb-1">AI Portfolio Insight</h3>
          
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 h-5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8B5CF6]/90 animate-pulse">
                  AI is analyzing portfolio...
                </span>
              </motion.div>
            ) : (
              <motion.p
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-white/70 leading-relaxed font-medium"
              >
                <span>{displayText}</span>
                
                {/* Custom blinking block cursor */}
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: isComplete ? 0 : [1, 0, 1]
                  }}
                  transition={{
                    opacity: isComplete 
                      ? { duration: 0.3 } 
                      : { repeat: Infinity, duration: 1.06, ease: "linear" }
                  }}
                  className="inline-block align-middle ml-1 bg-[#8B5CF6]"
                  style={{
                    width: '2px',
                    height: '1.2em',
                    verticalAlign: 'middle',
                    display: isComplete ? 'none' : 'inline-block'
                  }}
                />
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [stocks, setStocks] = useState(initialStocks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [price, setPrice] = useState('');
  const [focusedField, setFocusedField] = useState<'ticker' | 'shares' | 'price' | null>(null);
  const [shakeError, setShakeError] = useState(false);
  const [successAdded, setSuccessAdded] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [performanceTimeframe, setPerformanceTimeframe] = useState('1M');

  const chartData = useMemo(() => {
    let days = 30;
    if (performanceTimeframe === '1D') days = 1;
    if (performanceTimeframe === '1W') days = 7;
    if (performanceTimeframe === '1M') days = 30;
    if (performanceTimeframe === '3M') days = 90;
    if (performanceTimeframe === '1Y') days = 365;

    return Array.from({ length: Math.max(7, days) }).map((_, i, arr) => {
      const date = new Date();
      date.setDate(date.getDate() - (arr.length - 1 - i));
      const basePrice = 15000 + (Math.sin(i * 0.4) * 2000 + i * 200);
      return {
        time: date.toISOString().slice(0, 10),
        open: basePrice - Math.random() * 500,
        high: basePrice + Math.random() * 1000,
        low: basePrice - Math.random() * 1000,
        close: basePrice + (Math.random() > 0.5 ? Math.random() * 500 : -Math.random() * 500),
      };
    });
  }, [performanceTimeframe]);

  const handleAddRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples((prev) => [...prev, { x, y, id: Date.now() }]);
  };

  const totalValue = stocks.reduce((acc, stock) => acc + (stock.shares * stock.currentPrice), 0);
  const totalCost = stocks.reduce((acc, stock) => acc + (stock.shares * stock.avgPrice), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = (totalGain / totalCost) * 100;
  const isPositive = totalGain >= 0;

  return (
    <div className="min-h-screen bg-transparent pb-24 relative overflow-hidden">
      
      {/* Header */}
      <div className="pt-8 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end mb-12"
        >
          <div>
            <h1 className="text-white/60 font-medium mb-2 uppercase tracking-wider text-sm">Total Portfolio Value</h1>
            <div className="text-5xl md:text-7xl font-bold text-white mb-4">
              <AnimatedNumber value={totalValue} format={(val) => formatIndianCurrency(val)} />
            </div>
            <div className={`flex items-center gap-2 text-xl font-medium ${isPositive ? 'text-finova-green' : 'text-finova-red'}`}>
              {isPositive ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
              <span>{formatINR(Math.abs(totalGain))} ({totalGainPercent.toFixed(2)}%)</span>
              <span className="text-white/40 text-base font-normal ml-2">All Time</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-finova-purple text-white font-semibold hover:bg-finova-purple/80 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:scale-105"
          >
            <Plus size={20} />
            Add Asset
          </button>
        </motion.div>

        {/* AI Insight Banner */}
        <AIPortfolioInsight />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 3D Allocation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <GlassCard className="p-6 h-full flex flex-col relative overflow-hidden min-h-[300px]">
              <h3 className="text-lg font-semibold text-white mb-4 relative z-10">Asset Allocation</h3>
              <div className="absolute inset-0 top-16">
                 <Donut3D data={stocks.map((s, i) => ({
                   name: s.symbol,
                   value: s.shares * s.currentPrice,
                   color: ['#8b5cf6', '#34d399', '#f87171', '#60a5fa', '#f59e0b'][i % 5]
                 }))} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Grid Holdings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Holdings</h3>
              <span className="text-sm text-white/50 flex items-center gap-1"><GripVertical size={14}/> Drag to reorder</span>
            </div>
            
            <Reorder.Group axis="y" values={stocks} onReorder={setStocks} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stocks.map((stock, idx) => {
                const itemValue = stock.shares * stock.currentPrice;
                const itemGain = itemValue - (stock.shares * stock.avgPrice);
                const itemGainPercent = (itemGain / (stock.shares * stock.avgPrice)) * 100;
                const isItemPositive = itemGain >= 0;
                
                return (
                  <Reorder.Item key={stock.id} value={stock} className="cursor-grab active:cursor-grabbing list-none">
                    <HoldingsCard
                      stock={stock}
                      isItemPositive={isItemPositive}
                      itemValue={itemValue}
                      itemGainPercent={itemGainPercent}
                      index={idx}
                    />
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </motion.div>
        </div>

        {/* P&L Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <GlassCard className="p-6 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-finova-purple" size={20} />
                <h3 className="text-lg font-semibold text-white">Performance History</h3>
              </div>
              <div className="flex gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                {['1D', '1W', '1M', '3M', '1Y'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setPerformanceTimeframe(t)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${t === performanceTimeframe ? 'bg-finova-purple text-white shadow-md' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full min-h-0">
              <StockChart data={chartData} color="#8b5cf6" />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Mobile Add FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 rounded-full bg-finova-purple text-white flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.6)] active:scale-95 transition-transform z-40"
      >
        <Plus size={24} />
      </button>

      {/* Add Stock Modal */}
      {/* Premium Add Stock Modal with AnimatePresence */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Embedded styles for premium animations */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes modal-gradient-border {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              @keyframes btn-gradient-slow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              @keyframes btn-gradient-fast {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              @keyframes modal-shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-6px); }
                40%, 80% { transform: translateX(6px); }
              }
              @keyframes particle-float-1 {
                0%, 100% { transform: translate(0, 0); }
                50% { transform: translate(15px, -15px); }
              }
              @keyframes particle-float-2 {
                0%, 100% { transform: translate(0, 0); }
                50% { transform: translate(-20px, 15px); }
              }
              @keyframes button-ripple {
                0% { transform: scale(0); opacity: 0.5; }
                100% { transform: scale(4); opacity: 0; }
              }
            `}} />

            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 bg-black/70 backdrop-blur-[12px]"
              onClick={() => {
                if (!successAdded) setIsModalOpen(false);
              }}
            />

            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: 0 
              }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ 
                type: "spring", 
                stiffness: 280, 
                damping: 22,
                mass: 1
              }}
              style={{
                animation: shakeError ? 'modal-shake 0.4s ease-in-out' : 'none'
              }}
              className="relative w-full max-w-[420px] z-10 p-[1px] rounded-[24px] overflow-hidden"
            >
              {/* Shifting Gradient 1px border */}
              <div 
                className="absolute inset-0 -z-10"
                style={{
                  background: 'linear-gradient(to right, #8B5CF6, #3B82F6, #10B981, #8B5CF6)',
                  backgroundSize: '300% 300%',
                  animation: 'modal-gradient-border 6s ease infinite',
                }}
              />

              {/* Glassmorphism main container body */}
              <div className="relative overflow-hidden bg-[#0f0f1e]/88 backdrop-blur-[32px] saturate-[200%] p-8 rounded-[23px] shadow-[0_32px_100px_rgba(0,0,0,0.7)]">
                
                {/* Inner White Top edge highlights */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10 pointer-events-none" />

                {/* Floating particle background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 opacity-15">
                  <div className="absolute top-1/4 left-1/6 w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" style={{ animation: 'particle-float-1 8s ease-in-out infinite' }} />
                  <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-[#10B981]" style={{ animation: 'particle-float-2 10s ease-in-out infinite' }} />
                  <div className="absolute top-1/2 right-1/8 w-1 h-1 rounded-full bg-[#3B82F6]" style={{ animation: 'particle-float-1 6s ease-in-out infinite' }} />
                  <div className="absolute bottom-1/8 left-1/3 w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" style={{ animation: 'particle-float-2 7s ease-in-out infinite' }} />
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.12)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-[40px] right-[40px] w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 z-30"
                >
                  <X size={16} className="transition-transform duration-300 hover:rotate-90" />
                </motion.button>

                {/* Title */}
                <h2 
                  className="text-2xl font-bold mb-7 tracking-tight bg-gradient-to-r from-white to-[#a5b4fc] bg-clip-text text-transparent"
                  style={{ textShadow: '0 2px 20px rgba(139,92,246,0.3)' }}
                >
                  Add Asset
                </h2>
                
                <div className="space-y-5">
                  {/* Ticker Input Field */}
                  <div className="relative">
                    <label 
                      className="block text-[11px] font-semibold mb-2 uppercase tracking-[0.12em] transition-colors duration-200"
                      style={{ 
                        color: focusedField === 'ticker' ? '#8B5CF6' : 'rgba(255,255,255,0.5)',
                        textShadow: focusedField === 'ticker' ? '0 0 10px rgba(139,92,246,0.4)' : 'none'
                      }}
                    >
                      Ticker Symbol
                    </label>
                    <div className="relative flex items-center">
                      <Search 
                        size={16} 
                        className="absolute left-4 transition-colors duration-250 pointer-events-none"
                        style={{ color: focusedField === 'ticker' ? '#8B5CF6' : 'rgba(255,255,255,0.3)' }}
                      />
                      <input 
                        type="text" 
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                        onFocus={() => setFocusedField('ticker')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="e.g. RELIANCE" 
                        className={`w-full py-3.5 pl-11 pr-4 rounded-[14px] bg-white/[0.04] border text-white placeholder-white/25 focus:outline-none transition-all duration-250 text-[15px] font-medium hover:border-white/15 ${
                          shakeError && !ticker.trim()
                            ? 'border-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                            : successAdded
                            ? 'border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : focusedField === 'ticker'
                            ? 'border-[#8B5CF6] bg-white/[0.06] shadow-[0_0_0_4px_rgba(139,92,246,0.12),_inset_0_1px_0_rgba(255,255,255,0.05)]'
                            : 'border-white/10'
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Shares Input Field */}
                  <div className="relative">
                    <label 
                      className="block text-[11px] font-semibold mb-2 uppercase tracking-[0.12em] transition-colors duration-200"
                      style={{ 
                        color: focusedField === 'shares' ? '#8B5CF6' : 'rgba(255,255,255,0.5)',
                        textShadow: focusedField === 'shares' ? '0 0 10px rgba(139,92,246,0.4)' : 'none'
                      }}
                    >
                      Shares
                    </label>
                    <div className="relative flex items-center">
                      <Hash 
                        size={16} 
                        className="absolute left-4 transition-colors duration-250 pointer-events-none"
                        style={{ color: focusedField === 'shares' ? '#8B5CF6' : 'rgba(255,255,255,0.3)' }}
                      />
                      <input 
                        type="number" 
                        step="any"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                        onFocus={() => setFocusedField('shares')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="0.00" 
                        className={`w-full py-3.5 pl-11 pr-4 rounded-[14px] bg-white/[0.04] border text-white placeholder-white/25 focus:outline-none transition-all duration-250 text-[15px] font-medium hover:border-white/15 ${
                          shakeError && !shares.trim()
                            ? 'border-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                            : successAdded
                            ? 'border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : focusedField === 'shares'
                            ? 'border-[#8B5CF6] bg-white/[0.06] shadow-[0_0_0_4px_rgba(139,92,246,0.12),_inset_0_1px_0_rgba(255,255,255,0.05)]'
                            : 'border-white/10'
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Price Input Field */}
                  <div className="relative">
                    <label 
                      className="block text-[11px] font-semibold mb-2 uppercase tracking-[0.12em] transition-colors duration-200"
                      style={{ 
                        color: focusedField === 'price' ? '#8B5CF6' : 'rgba(255,255,255,0.5)',
                        textShadow: focusedField === 'price' ? '0 0 10px rgba(139,92,246,0.4)' : 'none'
                      }}
                    >
                      Average Price
                    </label>
                    <div className="relative flex items-center">
                      <DollarSign 
                        size={16} 
                        className="absolute left-4 transition-colors duration-250 pointer-events-none"
                        style={{ color: focusedField === 'price' ? '#8B5CF6' : 'rgba(255,255,255,0.3)' }}
                      />
                      <input 
                        type="number" 
                        step="any"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        onFocus={() => setFocusedField('price')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="₹0.00" 
                        className={`w-full py-3.5 pl-11 pr-4 rounded-[14px] bg-white/[0.04] border text-white placeholder-white/25 focus:outline-none transition-all duration-250 text-[15px] font-medium hover:border-white/15 ${
                          shakeError && !price.trim()
                            ? 'border-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                            : successAdded
                            ? 'border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : focusedField === 'price'
                            ? 'border-[#8B5CF6] bg-white/[0.06] shadow-[0_0_0_4px_rgba(139,92,246,0.12),_inset_0_1px_0_rgba(255,255,255,0.05)]'
                            : 'border-white/10'
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Horizontal premium divider */}
                  <div 
                    className="w-full h-[1px] my-5 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)'
                    }}
                  />
                  
                  {/* Confirm Button */}
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                      handleAddRipple(e);
                      
                      // Trigger validation
                      if (!ticker.trim() || !shares.trim() || !price.trim()) {
                        setShakeError(true);
                        setTimeout(() => setShakeError(false), 400);
                        return;
                      }

                      setSuccessAdded(true);
                      setTimeout(() => {
                        // Dynamically append new stock to current dashboard stocks array!
                        const newStockObj = {
                          id: (stocks.length + 1).toString(),
                          symbol: ticker.toUpperCase(),
                          name: ticker.toUpperCase() + ' Corp',
                          shares: parseFloat(shares),
                          avgPrice: parseFloat(price),
                          currentPrice: parseFloat(price) * (1 + (Math.sin(Date.now()) * 0.05)) // deterministic starting mock price
                        };
                        setStocks(prev => [...prev, newStockObj]);

                        setIsModalOpen(false);
                        setSuccessAdded(false);
                        setTicker('');
                        setShares('');
                        setPrice('');
                      }, 1000);
                    }}
                    className="relative overflow-hidden w-full h-[52px] rounded-2xl font-bold text-white text-[15px] tracking-[0.03em] flex items-center justify-center transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #10B981 100%)',
                      backgroundSize: '200% 200%',
                      animation: successAdded 
                        ? 'none' 
                        : hoveredIndex === 999 
                        ? 'btn-gradient-fast 1.5s ease infinite' 
                        : 'btn-gradient-slow 3s ease infinite',
                      boxShadow: successAdded
                        ? '0 0 30px rgba(16,185,129,0.6)'
                        : '0 4px 20px rgba(139,92,246,0.3)',
                      backgroundColor: successAdded ? '#10B981' : 'transparent'
                    }}
                    onMouseEnter={() => setHoveredIndex(999)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Render active click ripple effects */}
                    {ripples.map((ripple) => (
                      <span
                        key={ripple.id}
                        className="absolute rounded-full bg-white/25 pointer-events-none"
                        style={{
                          left: ripple.x,
                          top: ripple.y,
                          width: '40px',
                          height: '40px',
                          transform: 'translate(-50%, -50%)',
                          animation: 'button-ripple 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
                        }}
                      />
                    ))}

                    {/* Button text / indicator */}
                    <AnimatePresence mode="wait">
                      {successAdded ? (
                        <motion.div 
                          key="success"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Successfully Added!</span>
                        </motion.div>
                      ) : (
                        <motion.span key="normal">
                          Confirm Addition
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
