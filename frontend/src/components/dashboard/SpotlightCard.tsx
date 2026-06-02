'use client';

import { useRef, MouseEvent } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export const SpotlightCard = ({ children, className = '' }: SpotlightCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty('--x', `${x}px`);
    cardRef.current.style.setProperty('--y', `${y}px`);
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-2xl ${className}`}
    >
      <GlassCard className="h-full w-full">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block"
          style={{
            background: `radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.07), transparent 50%)`,
          }}
        />
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      </GlassCard>
    </div>
  );
};
