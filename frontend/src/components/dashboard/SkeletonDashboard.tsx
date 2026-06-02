'use client';

import { motion } from 'framer-motion';

const ShimmerCard = ({ className = '' }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-white/5 rounded-2xl border border-white/5 ${className}`}>
    <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.05)_50%,transparent_60%)] bg-[length:200%_100%] animate-[shimmer_1.4s_infinite]" />
  </div>
);

export const SkeletonDashboard = () => {
  return (
    <motion.div 
      className="min-h-screen bg-transparent absolute inset-0 z-50 px-4 py-16"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <ShimmerCard className="w-48 h-8" />
            <ShimmerCard className="w-64 h-4" />
          </div>
          <ShimmerCard className="w-32 h-8 rounded-full hidden sm:block" />
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ShimmerCard className="h-32" />
          <ShimmerCard className="h-32" />
          <ShimmerCard className="h-32" />
        </div>

        {/* Middle Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative">
            <ShimmerCard className="h-[450px]" />
            {/* Pulsing wireframe for 3D chart placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border border-white/10 border-dashed animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute w-48 h-48 rounded-full border border-white/10 border-dashed animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            </div>
          </div>
          <ShimmerCard className="h-[450px]" />
        </div>

        {/* Bottom Section Skeleton */}
        <ShimmerCard className="h-[200px]" />
      </div>
    </motion.div>
  );
};
