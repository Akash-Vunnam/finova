'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Activity, GripVertical } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { RippleEffect } from './RippleEffect';
import { AnimatedSparkline } from './AnimatedSparkline';
import { MagneticButton } from '@/components/ui/MagneticButton';

import { formatINR } from '@/lib/formatters';

const initialWatchlist = [
  { id: '1', symbol: 'ZOMATO', price: 124.50, change: 5.2, trend: 'up' as const },
  { id: '2', symbol: 'WIPRO', price: 510.20, change: -1.4, trend: 'down' as const },
  { id: '3', symbol: 'HDFCBANK', price: 1295.40, change: 2.1, trend: 'up' as const },
];

const generateSparkline = (base: number, trend: 'up' | 'down') => {
  let val = base;
  return Array.from({ length: 15 }, () => {
    val += (Math.random() - (trend === 'up' ? 0.3 : 0.7)) * 2;
    return { value: val };
  });
};

export const LiveWatchlist = () => {
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [sparklines, setSparklines] = useState<Record<string, any[]>>({});
  const [flashes, setFlashes] = useState<Record<string, 'up' | 'down' | null>>({});

  useEffect(() => {
    // Check localStorage for order
    const savedOrder = localStorage.getItem('finova_watchlist_order');
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder);
        const orderedList = orderIds.map((id: string) => initialWatchlist.find(item => item.id === id)).filter(Boolean);
        if (orderedList.length === initialWatchlist.length) {
          setWatchlist(orderedList);
        }
      } catch (e) {}
    }

    // Init sparklines
    const initialSparks: Record<string, any[]> = {};
    initialWatchlist.forEach(item => {
      initialSparks[item.symbol] = generateSparkline(item.price, item.trend);
    });
    setSparklines(initialSparks);
  }, []);

  // Simulate live price pulses
  useEffect(() => {
    const intervals = watchlist.map((item) => {
      const intervalTime = Math.random() * 5000 + 3000; // 3 to 8 seconds
      return setInterval(() => {
        setWatchlist(prev => prev.map(p => {
          if (p.symbol !== item.symbol) return p;
          
          const changePercent = (Math.random() * 0.4) - 0.2; // -0.2% to +0.2%
          const newPrice = p.price * (1 + (changePercent / 100));
          const isUp = changePercent >= 0;
          
          // Flash effect
          setFlashes(f => ({ ...f, [p.symbol]: isUp ? 'up' : 'down' }));
          setTimeout(() => {
            setFlashes(f => ({ ...f, [p.symbol]: null }));
          }, 700);

          // Update sparkline
          setSparklines(s => {
            const currentLine = s[p.symbol] || [];
            const newLine = [...currentLine.slice(1), { value: newPrice }];
            return { ...s, [p.symbol]: newLine };
          });

          return {
            ...p,
            price: newPrice,
            change: p.change + changePercent,
            trend: p.change + changePercent >= 0 ? 'up' : 'down'
          };
        }));
      }, intervalTime);
    });

    return () => intervals.forEach(clearInterval);
  }, [watchlist.length]);

  // Basic Drag and Drop implementation
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => (e.target as HTMLElement).classList.add('opacity-50'), 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIdx = watchlist.findIndex(w => w.id === draggedId);
    const targetIdx = watchlist.findIndex(w => w.id === targetId);
    
    const newList = [...watchlist];
    const [draggedItem] = newList.splice(draggedIdx, 1);
    newList.splice(targetIdx, 0, draggedItem);
    
    setWatchlist(newList);
    localStorage.setItem('finova_watchlist_order', JSON.stringify(newList.map(n => n.id)));
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('opacity-50');
    setDraggedId(null);
  };

  return (
    <div className="relative overflow-hidden bg-white/[0.02] backdrop-blur-[16px] border border-white/[0.06] rounded-2xl p-6 h-auto flex flex-col shadow-xl">
      {/* Subtle Inner Top Shadow Highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/[0.04] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-black text-white tracking-tight">Live Watchlist</h3>
          
          {/* Pulse LIVE badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Live
          </div>
        </div>

        {/* Magnetic Refresh Icon */}
        <MagneticButton strength={10} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors">
          <Activity size={15} />
        </MagneticButton>
      </div>
      
      {/* Scrollable stock list */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-2">
        {watchlist.map((item) => {
          const flash = flashes[item.symbol];
          const isUp = item.trend === 'up';
          const isDragged = draggedId === item.id;
          const accentColor = isUp ? '#10B981' : '#EF4444';

          return (
            <RippleEffect key={item.id}>
              <div 
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 border border-white/5 group relative overflow-hidden cursor-grab active:cursor-grabbing ${isDragged ? 'scale-[1.02] shadow-[0_10px_30px_rgba(139,92,246,0.15)] z-10' : ''}`}
              >
                {/* Left Colored Accent Border */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 group-hover:w-[4px]"
                  style={{ 
                    backgroundColor: accentColor,
                    boxShadow: `0 0 10px ${accentColor}cc` 
                  }}
                />

                {/* Flash Background Layer */}
                <div 
                  className={`absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none ${
                    flash === 'up' ? 'bg-[radial-gradient(circle_at_70%_50%,_rgba(16,185,129,0.2),_transparent_60%)] opacity-100' :
                    flash === 'down' ? 'bg-[radial-gradient(circle_at_70%_50%,_rgba(244,63,94,0.2),_transparent_60%)] opacity-100' : 
                    'opacity-0'
                  }`}
                />

                {/* Stock Info */}
                <div className="flex items-center gap-3 relative z-10 w-1/3">
                  <GripVertical size={16} className="text-white/20 group-hover:text-white/50 hidden md:block" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className="font-black text-white group-hover:text-finova-purple transition-colors text-sm tracking-tight">
                        {item.symbol}
                      </div>
                      
                      {/* Pulse Live Indicator */}
                      <motion.div
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: accentColor }}
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </div>
                    <div className="text-xs text-white/50 font-medium tabular-nums font-mono">
                      {formatINR(item.price)}
                    </div>
                  </div>
                </div>
                
                {/* Sparkline with opacity glow on hover */}
                <div className="h-10 w-1/3 mx-2 relative z-10 transition-all duration-300 group-hover:brightness-125">
                  {sparklines[item.symbol] && (
                    <AnimatedSparkline 
                      data={sparklines[item.symbol]} 
                      isUp={isUp} 
                      width={100} 
                      height={40} 
                    />
                  )}
                </div>

                {/* Performance Pill */}
                <div className="flex items-center justify-end w-1/4 relative z-10">
                  <div 
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-xs"
                    style={{
                      backgroundColor: isUp ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: accentColor
                    }}
                  >
                    <motion.div
                      animate={flash ? { y: [-3, 0] } : { y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                    >
                      {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    </motion.div>
                    <span className="tabular-nums font-mono">
                      {Math.abs(item.change).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </RippleEffect>
          );
        })}
      </div>
    </div>
  );
};
