"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer } from "@/components/ui/Drawer";
import { useDashboardState, ActivityType } from "@/components/dashboard/DashboardContext";
import { DollarSign, Wallet, RefreshCw, Bell, ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface ViewAllActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ViewAllActivityDrawer({ isOpen, onClose }: ViewAllActivityDrawerProps) {
  const { recentActivity } = useDashboardState();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getActivityConfig = (type: ActivityType) => {
    switch (type) {
      case "BUY":
        return { icon: ArrowDownLeft, color: "text-finova-green", bg: "bg-[#10b981]/15", glow: "#10b981", label: "Buy" };
      case "SELL":
        return { icon: ArrowUpRight, color: "text-finova-red", bg: "bg-[#ef4444]/15", glow: "#ef4444", label: "Sell" };
      case "DEPOSIT":
        return { icon: Wallet, color: "text-finova-purple", bg: "bg-[#8b5cf6]/15", glow: "#8b5cf6", label: "Deposit" };
      case "DIVIDEND":
        return { icon: DollarSign, color: "text-finova-green", bg: "bg-[#10b981]/15", glow: "#10b981", label: "Dividend" };
      case "ALERT":
        return { icon: Bell, color: "text-amber-400", bg: "bg-amber-400/15", glow: "#fbbf24", label: "Alert" };
      default:
        return { icon: RefreshCw, color: "text-slate-400", bg: "bg-slate-400/15", glow: "#94a3b8", label: "Activity" };
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Activity History">
      <div className="relative pl-6 pb-2 mt-4 pr-2">
        {/* Animated vertical gradient glowing line */}
        <div 
          className="absolute left-[7px] top-2 bottom-6 w-[2px] rounded-full overflow-hidden"
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
          {recentActivity.length > 0 ? recentActivity.map((activity, i) => {
            const config = getActivityConfig(activity.type);
            const Icon = config.icon;

            return (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5, type: 'spring', stiffness: 80, damping: 15 }}
                className="relative flex items-center justify-between group/row"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Timeline Orb Node */}
                <div className="absolute left-[-28px] w-5 h-5 rounded-full bg-[#0c0f1d] flex items-center justify-center border border-white/10 z-20">
                  <motion.div 
                    className="w-2 h-2 rounded-full relative"
                    style={{ 
                      backgroundColor: config.glow,
                      boxShadow: hoveredIndex === i 
                        ? `0 0 12px ${config.glow}` 
                        : `0 0 8px ${config.glow}80`
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
                          style={{ border: `1.5px solid ${config.glow}` }}
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 2.2, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeOut' }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Glass row element */}
                <motion.div 
                  animate={{ 
                    x: hoveredIndex === i ? 6 : 0,
                    backgroundColor: hoveredIndex === i ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                  }}
                  transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                  className="w-full flex justify-between items-center px-4 py-3 rounded-xl backdrop-blur-md border border-white/[0.04] transition-colors relative overflow-hidden"
                >
                  {/* Left glowing border accent on hover */}
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl pointer-events-none"
                    style={{ 
                      backgroundColor: config.glow,
                      boxShadow: `0 0 10px ${config.glow}`
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ 
                      scaleY: hoveredIndex === i ? 1 : 0, 
                      opacity: hoveredIndex === i ? 1 : 0 
                    }}
                    transition={{ duration: 0.25 }}
                  />

                  <div className="flex items-center gap-4 w-full">
                    <motion.div 
                      className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center relative overflow-hidden ${config.bg} border border-white/5`}
                      animate={{
                        scale: hoveredIndex === i ? 1.1 : 1.0,
                      }}
                      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    >
                      <div className="absolute inset-0 bg-white/5" />
                      <Icon size={16} className={config.color} />
                    </motion.div>
                    
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-bold text-white text-sm tracking-tight truncate">
                        {activity.title}
                      </span>
                      <span className="text-xs text-white/50 font-medium truncate">{activity.description}</span>
                    </div>

                    <div className="text-right shrink-0">
                      {activity.amount && (
                        <span className="font-bold text-white text-sm tracking-tight block tabular-nums">
                          {activity.type === 'SELL' ? '+' : activity.type === 'BUY' ? '-' : '+'}₹{activity.amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </span>
                      )}
                      <span className="text-[10px] text-white/40 font-semibold tracking-wider block">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Subtle row separator line */}
                {i < recentActivity.length - 1 && (
                  <div 
                    className="absolute bottom-[-12px] inset-x-0 h-[1px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(to right, rgba(255,255,255,0.02), transparent, rgba(255,255,255,0.02))'
                    }}
                  />
                )}
              </motion.div>
            );
          }) : (
            <div className="text-slate-500 text-sm text-center py-8">No recent activity.</div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
