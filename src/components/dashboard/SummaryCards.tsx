'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { Odometer } from './Odometer';
import { RippleEffect } from './RippleEffect';

// Premium high-performance card wrapper with custom 3D hover tilt & dynamic holographic sheen
function PremiumCard({ 
  children, 
  className = '', 
  glowColor = '#10B981',
  glowOnBottom = false
}: { 
  children: React.ReactNode; 
  className?: string; 
  glowColor?: string;
  glowOnBottom?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [2, -2]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-2, 2]), springConfig);
  
  // High-end moving holographic sheen
  const sheenX = useSpring(useTransform(x, [0, 1], [0, 100]), springConfig);
  const sheenY = useSpring(useTransform(y, [0, 1], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

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
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      animate={{
        scale: hovered ? 1.01 : 1.0,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`relative overflow-hidden bg-white/[0.03] backdrop-blur-[20px] saturate-[150%] border border-white/[0.06] rounded-2xl shadow-xl transition-all duration-300 ${
        hovered ? 'shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : ''
      } ${className}`}
    >
      {/* Inner Highlight Top Edge */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/[0.04] pointer-events-none" />

      {/* Holographic Sheen Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 0.08 : 0,
          background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 60%)`,
        }}
      />

      {/* Pulsing bottom glow bar if requested */}
      {glowOnBottom && (
        <motion.div 
          className="absolute bottom-0 inset-x-0 h-[2px]"
          style={{ backgroundColor: glowColor }}
          animate={{
            boxShadow: [
              `0 0 0px ${glowColor}00`,
              `0 -2px 10px ${glowColor}cc`,
              `0 0 0px ${glowColor}00`
            ]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}

      {children}
    </motion.div>
  );
}

function AIMarketMoodCard() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Simulated countdown timer for demo
    const calculateTime = () => {
      const now = new Date();
      const closeTime = new Date();
      closeTime.setHours(15, 30, 0, 0); // 3:30 PM close (IST)
      
      let diff = closeTime.getTime() - now.getTime();
      if (diff < 0) {
        diff = diff + (24 * 60 * 60 * 1000); // add 24 hours if past close
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.3 }}
      className="flex flex-col"
    >
      <RippleEffect className="w-full h-full rounded-2xl group transition-all duration-300 relative flex flex-col">
        <div className="absolute inset-0 bg-[#6366f1] rounded-2xl blur-xl opacity-0 group-hover:animate-[pulse-glow_4s_infinite] transition-opacity duration-500 -z-10" />
        
        <PremiumCard glowOnBottom={true} glowColor="#6366F1" className="w-full h-full min-h-[140px] md:min-h-[160px] flex flex-col">
          <div className="p-5 h-full flex flex-col justify-between w-full">
            
            {/* TOP: Status */}
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-2.5 h-2.5 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-finova-green animate-ping opacity-75" />
                <span className="relative w-2 h-2 rounded-full bg-finova-green shadow-[0_0_8px_#10b981]" />
              </div>
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">NSE & BSE Open (IST)</span>
            </div>

            {/* CENTER: Countdown */}
            <div className="flex flex-col mb-2">
              <span className="text-white/50 text-[10px] font-medium uppercase tracking-widest mb-0.5">Market Closes In</span>
              <div className="text-2xl font-mono font-bold tracking-tight text-white/90">
                {timeLeft || "00:00:00"}
              </div>
            </div>

            {/* BOTTOM: AI Market Mood */}
            <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-1">
              <div>
                <h3 className="text-white/60 text-[10px] uppercase tracking-wider font-medium mb-0.5">AI Market Mood</h3>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                  <div className="text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-finova-green to-[#34D399]">
                    Bullish
                  </div>
                  <span className="text-[10px] text-white/50 font-medium">Nifty 50: +0.85% | Sensex: +0.72%</span>
                </div>
              </div>
              <motion.div 
                className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden bg-white/[0.05] border border-white/10 flex-shrink-0"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.2),_transparent_70%)]" />
                <span className="text-xl relative z-10 cursor-default">🚀</span>
              </motion.div>
            </div>

          </div>
        </PremiumCard>
      </RippleEffect>
    </motion.div>
  );
}

export const SummaryCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-stretch">
      {/* Total Balance Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="flex flex-col"
      >
        <RippleEffect className="w-full h-full rounded-2xl group transition-all duration-300 relative flex flex-col">
          <div className="absolute inset-0 bg-[#10b981] rounded-2xl blur-xl opacity-0 group-hover:animate-[pulse-glow_4s_infinite] transition-opacity duration-500 -z-10" />
          <PremiumCard glowOnBottom={true} glowColor="#10B981" className="w-full h-full min-h-[140px] md:min-h-[160px] flex flex-col">
            <div className="p-6 h-full flex flex-col justify-between w-full">
              <div>
                <h3 className="text-white/60 text-sm font-medium mb-1">Total Balance</h3>
                <div 
                  className="text-4xl font-black text-white mb-2 tracking-tight"
                  style={{ textShadow: '0 0 15px rgba(255,255,255,0.15)' }}
                >
                  ₹<Odometer value={452340.00} decimals={2} />
                </div>
              </div>
              <div className="flex items-center gap-1 text-finova-green text-sm font-medium mt-2">
                <ArrowUpRight size={16} />
                <span>+₹8,650 (1.95%)</span>
                <span className="text-white/40 ml-2">Today</span>
              </div>
            </div>
          </PremiumCard>
        </RippleEffect>
      </motion.div>

      {/* Top Performer Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="flex flex-col"
      >
        <RippleEffect className="w-full h-full rounded-2xl group transition-all duration-300 relative flex flex-col">
          <div className="absolute inset-0 bg-[#8b5cf6] rounded-2xl blur-xl opacity-0 group-hover:animate-[pulse-glow_4s_infinite] transition-opacity duration-500 -z-10" />
          <PremiumCard glowOnBottom={true} glowColor="#8B5CF6" className="w-full h-full min-h-[140px] md:min-h-[160px] flex flex-col">
            <div className="p-6 h-full flex flex-col justify-between w-full relative">
              <div>
                <h3 className="text-white/60 text-sm font-medium mb-1">Top Performer</h3>
                <div className="text-2xl font-black text-white mb-2 tracking-tight">TCS</div>
              </div>
              
              <div className="flex items-center justify-between mt-2 w-full">
                <div className="flex items-center gap-1 text-finova-green text-sm font-semibold">
                  <motion.div
                    animate={{ y: [-1, 1, -1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowUpRight size={16} />
                  </motion.div>
                  <span>+₹3,240 (+<Odometer value={4.2} decimals={1} />%)</span>
                  <span className="text-white/40 ml-2">This Week</span>
                </div>
                
                {/* Micro trend sparkline SVG */}
                <div className="absolute right-6 bottom-6 flex items-center">
                  <svg width="40" height="20" viewBox="0 0 40 20" className="opacity-80">
                    <path 
                      d="M 2 18 L 10 14 L 18 15 L 26 8 L 38 2" 
                      fill="none" 
                      stroke="#10B981" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          </PremiumCard>
        </RippleEffect>
      </motion.div>

      {/* AI Market Mood Card (Integrated with Market Status) */}
      <AIMarketMoodCard />
    </div>
  );
};
