'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, DollarSign, Wallet, RefreshCw, ArrowRight } from 'lucide-react';
import { RippleEffect } from './RippleEffect';

const recentActivity = [
  { id: 1, type: 'buy', asset: 'TCS', amount: '₹3,200', shares: '4.5', time: '2 hours ago', icon: DollarSign, color: 'text-finova-green', bg: 'bg-[#10b981]/15', glow: '#10b981' },
  { id: 2, type: 'deposit', asset: 'USD', amount: '₹5,000', shares: '', time: 'Yesterday', icon: Wallet, color: 'text-finova-purple', bg: 'bg-[#8b5cf6]/15', glow: '#8b5cf6' },
  { id: 3, type: 'sell', asset: 'TATAMOTORS', amount: '₹1,500', shares: '7.2', time: '3 days ago', icon: RefreshCw, color: 'text-finova-red', bg: 'bg-[#ef4444]/15', glow: '#ef4444' },
  { id: 4, type: 'dividend', asset: 'RELIANCE', amount: '₹45.20', shares: '', time: '1 week ago', icon: DollarSign, color: 'text-finova-green', bg: 'bg-[#10b981]/15', glow: '#10b981' },
];

export const ActivityTimeline = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative overflow-hidden bg-white/[0.03] backdrop-blur-[20px] saturate-[180%] border border-white/[0.08] rounded-2xl p-6 shadow-2xl transition-all duration-300">
      {/* Dynamic CSS styles for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes timeline-flow {
          0% { background-position: 0% 0%; }
          50% { background-position: 0% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}} />

      {/* Subtle top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/[0.04] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          {/* Ticking clock icon (60s revolution) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="text-white/60"
          >
            <Clock size={18} />
          </motion.div>
          <h3 className="text-lg font-black text-white tracking-tight">Recent Activity</h3>
        </div>
        
        {/* View All button sliding arrow */}
        <RippleEffect className="flex items-center gap-1 text-xs font-bold text-finova-purple hover:text-[#a78bfa] transition-colors group/view">
          <span>View All</span>
          <ArrowRight size={14} className="transition-transform duration-300 group-hover/view:translate-x-1" />
        </RippleEffect>
      </div>
      
      <div className="relative pl-8 pb-2">
        {/* Animated vertical gradient glowing line with traveling light particle */}
        <div 
          className="absolute left-[11px] top-2 bottom-6 w-[2px] rounded-full overflow-hidden"
          style={{
            background: 'linear-gradient(to bottom, #10B981, #8B5CF6, #EF4444, #10B981)',
            backgroundSize: '100% 200%',
            animation: 'timeline-flow 8s linear infinite',
            boxShadow: '0 0 8px rgba(139, 92, 246, 0.3)',
          }}
        >
          {/* Traveling light particle */}
          <motion.div
            className="w-full h-16 bg-gradient-to-b from-transparent via-white/80 to-transparent"
            animate={{ y: ['-100%', '800%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        
        <div className="space-y-6">
          {recentActivity.map((activity, i) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: i * 0.12, duration: 0.6, type: 'spring', stiffness: 80, damping: 15 }}
              className="relative flex items-center justify-between group/row"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Timeline Orb Node with customized outer halos and ripple effects */}
              <div className="absolute left-[-32px] w-6 h-6 rounded-full bg-[#0c0f1d] flex items-center justify-center border border-white/10 z-20">
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full relative"
                  style={{ 
                    backgroundColor: activity.glow,
                    boxShadow: hoveredIndex === i 
                      ? `0 0 16px ${activity.glow}` 
                      : `0 0 10px ${activity.glow}80`
                  }}
                  animate={{
                    scale: hoveredIndex === i ? 1.3 : 1.0,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                  <AnimatePresence>
                    {hoveredIndex === i && (
                      <motion.div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{ border: `1.5px solid ${activity.glow}` }}
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Glass row element sliding right by 6px on hover */}
              <RippleEffect className="w-full">
                <motion.div 
                  animate={{ 
                    x: hoveredIndex === i ? 6 : 0,
                    backgroundColor: hoveredIndex === i ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
                  }}
                  transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                  className="w-full flex justify-between items-center px-5 py-4 rounded-xl backdrop-blur-md border border-white/[0.06] transition-colors relative overflow-hidden"
                >
                  {/* Left glowing border accent on hover */}
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl pointer-events-none"
                    style={{ 
                      backgroundColor: activity.glow,
                      boxShadow: `0 0 10px ${activity.glow}`
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ 
                      scaleY: hoveredIndex === i ? 1 : 0, 
                      opacity: hoveredIndex === i ? 1 : 0 
                    }}
                    transition={{ duration: 0.25 }}
                  />

                  <div className="flex items-center gap-4">
                    {/* Floating circular icon container */}
                    <motion.div 
                      className={`w-11 h-11 rounded-full flex items-center justify-center relative overflow-hidden ${activity.bg} border border-white/5`}
                      animate={{
                        scale: hoveredIndex === i ? 1.1 : 1.0,
                        y: hoveredIndex === i ? 0 : [-2, 2, -2]
                      }}
                      transition={hoveredIndex === i 
                        ? { type: 'spring', stiffness: 200, damping: 10 } 
                        : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                      }
                    >
                      <div className="absolute inset-0 bg-white/5" />
                      <activity.icon size={18} className={activity.color} />
                    </motion.div>
                    
                    <div className="flex flex-col">
                      <span className="font-bold text-white capitalize text-sm tracking-tight">
                        {activity.type} {activity.asset}
                      </span>
                      <span className="text-xs text-white/40 font-medium">{activity.time}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-white text-sm tracking-tight block tabular-nums">
                      {activity.amount}
                    </span>
                    {activity.shares ? (
                      <span className="text-[10px] text-white/40 font-semibold tracking-wider block">
                        {activity.shares} shares
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40 font-semibold tracking-wider block">
                        Completed
                      </span>
                    )}
                  </div>
                </motion.div>
              </RippleEffect>
              
              {/* Subtle row separator line fading in the center */}
              {i < recentActivity.length - 1 && (
                <div 
                  className="absolute bottom-[-12px] inset-x-0 h-[1px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(to right, rgba(255,255,255,0.03), transparent, rgba(255,255,255,0.03))'
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
