'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

import { SkeletonDashboard } from '@/components/dashboard/SkeletonDashboard';
import { MiniTickerEnhanced } from '@/components/dashboard/MiniTickerEnhanced';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { AssetAllocationChart } from '@/components/dashboard/AssetAllocationChart';
import { LiveWatchlist } from '@/components/dashboard/LiveWatchlist';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { CommandPalette } from '@/components/dashboard/CommandPalette';
import { ToastContainer } from '@/components/dashboard/ToastContainer';
import { GlassCard } from '@/components/ui/GlassCard';
import { AmbientBackground } from '@/components/dashboard/AmbientBackground';
import { DashboardProvider } from '@/components/dashboard/DashboardContext';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY, scrollYProgress } = useScroll();

  // Parallax transforms
  const yContentLeft = useTransform(scrollY, [0, 500], [0, -50]);
  const yContentRight = useTransform(scrollY, [0, 500], [0, -20]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-transparent relative overflow-hidden">
      <AmbientBackground />
      
      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-finova-green to-finova-purple z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <AnimatePresence mode="wait">
        {isLoading && <SkeletonDashboard key="skeleton" />}
      </AnimatePresence>

      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <MiniTickerEnhanced />
        
        {/* Static Header */}
        <div 
          style={{ transform: 'translateZ(0)' } as React.CSSProperties}
          className="relative z-10 py-8 bg-transparent"
        >
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col"
            >
              <h1 className="font-bold text-white text-3xl mb-2">
                Dashboard
              </h1>
              <p className="text-white/60 text-base mt-1">
                Welcome back! Market is bullish today. Nifty up 0.8%
              </p>
            </motion.div>
            
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 pb-24 pt-4 relative z-10">
          {/* Subtle purple/teal ambient glow bleeding into the background */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-[radial-gradient(circle,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none -z-10 blur-[80px]" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[radial-gradient(circle,rgba(20,184,166,0.12),transparent_70%)] pointer-events-none -z-10 blur-[80px]" />
          
          <SummaryCards />
          <AIInsightCard />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column (Parallax slight lift) */}
            <motion.div 
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              <GlassCard className="p-6 h-[450px] flex flex-col relative overflow-hidden group">
                <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Asset Allocation</h3>
                <div className="absolute inset-0 top-16">
                  <AssetAllocationChart />
                </div>
              </GlassCard>

              <ActivityTimeline />
            </motion.div>

            {/* Right Column (Slower parallax) */}
            <motion.div 
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 flex flex-col"
            >
              <LiveWatchlist />
              <QuickActions />
              <MarketOverview />
            </motion.div>
          </div>
        </div>
      </div>

      <CommandPalette />
      <ToastContainer />
      </div>
    </DashboardProvider>
  );
}
