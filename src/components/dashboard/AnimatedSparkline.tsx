'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Point {
  value: number;
}

export const AnimatedSparkline = ({
  data,
  isUp,
  width = 100,
  height = 40,
}: {
  data: Point[];
  isUp: boolean;
  width?: number;
  height?: number;
}) => {
  const points = useMemo(() => {
    if (!data || data.length === 0) return '';
    const min = Math.min(...data.map(d => d.value));
    const max = Math.max(...data.map(d => d.value));
    const range = max - min || 1; // avoid div by 0

    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d.value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
  }, [data, width, height]);

  const pathD = `M ${points.replace(/ /g, ' L ')}`;

  const color = isUp ? '#34d399' : '#f87171'; // finova-green vs red

  if (!data || data.length === 0) return null;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${isUp ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <motion.path
        d={`${pathD} L ${width},${height} L 0,${height} Z`}
        fill={`url(#gradient-${isUp ? 'up' : 'down'})`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      
      {/* Line drawing */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  );
};
