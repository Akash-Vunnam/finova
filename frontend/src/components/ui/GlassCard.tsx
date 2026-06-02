'use client';

import { HTMLMotionProps, motion } from 'framer-motion';
import clsx from 'clsx';
import { forwardRef } from 'react';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
  children?: React.ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverEffect = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={clsx(
          "bg-white/5 border border-white/10 rounded-2xl shadow-xl relative overflow-hidden",
          "backdrop-blur-[16px] saturate-[180%]",
          hoverEffect && "transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-white/10",
          className
        )}
        {...props}
      >
        {/* Subtle inner border and bottom highlight */}
        <div className="absolute inset-0 rounded-2xl border-[1px] border-white/[0.08] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.05] shadow-[0_-1px_0_0_rgba(255,255,255,0.05)] pointer-events-none" />
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
