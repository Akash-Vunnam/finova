'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface SparklineCanvasProps {
  symbol: string;
  positive: boolean;
}

export const SparklineCanvas = ({ symbol, positive }: SparklineCanvasProps) => {
  const [pathData, setPathData] = useState('');
  const [volume, setVolume] = useState('0.0M');
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate organic simulated stock path
    const points: { x: number; y: number }[] = [];
    const width = 45;
    const height = 15;
    const steps = 6;
    
    // Seeded random volume based on ticker symbols
    const charSum = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const volNum = ((charSum % 80) / 10 + 1).toFixed(1);
    setVolume(`${volNum}M`);

    // Create a path that trends upward for gainers and downward for losers
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      let y = height / 2;
      
      const noise = (Math.sin(i + charSum) * 3) + (Math.cos(i * 2) * 2);
      
      if (positive) {
        // Trend up
        y = height - (i * (height / steps)) * 0.8 - 2 + noise;
      } else {
        // Trend down
        y = (i * (height / steps)) * 0.8 + 2 + noise;
      }
      
      // Keep boundaries safe
      y = Math.max(1, Math.min(height - 1, y));
      points.push({ x, y });
    }

    // Build cubic bezier curve path string
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 2;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (next.x - curr.x) / 2;
      const cpY2 = next.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    setPathData(d);
  }, [symbol, positive]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 40,
    });
  };

  const gradientId = `sparkline-grad-${symbol}-${positive ? 'up' : 'down'}`;

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative flex items-center h-full px-2"
    >
      <motion.svg 
        width="45" 
        height="15" 
        viewBox="0 0 45 15"
        animate={isHovered ? { scale: 1.25, filter: 'brightness(1.3)' } : { scale: 1, filter: 'brightness(1)' }}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={positive ? '#10b981' : '#ef4444'} stopOpacity="1" />
            <stop offset="100%" stopColor={positive ? '#059669' : '#dc2626'} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {pathData && (
          <motion.path
            d={pathData}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 4px ${positive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'})`
            }}
          />
        )}
      </motion.svg>

      {/* Floating Glassmorphic Tooltip */}
      {isHovered && (
        <div 
          style={{
            position: 'absolute',
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 50,
          }}
          className="bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-xl whitespace-nowrap"
        >
          Vol: {volume}
        </div>
      )}
    </div>
  );
};
