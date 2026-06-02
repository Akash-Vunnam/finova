'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaveformVisualizerProps {
  isPlaying: boolean;
}

export const WaveformVisualizer = ({ isPlaying }: WaveformVisualizerProps) => {
  const [barHeights, setBarHeights] = useState<number[]>(new Array(64).fill(2));

  useEffect(() => {
    if (!isPlaying) return;

    let animationFrameId: number;
    let time = 0;

    const updateWaveform = () => {
      time += 0.08;
      const newHeights = barHeights.map((_, i) => {
        // Base sine wave movements combined with pseudo-random harmonics
        const base = Math.sin(i * 0.15 + time) * 6;
        const harmonic = Math.sin(i * 0.4 - time * 1.5) * 3;
        const noise = Math.cos(i * 0.8 + time * 2) * 2;
        const height = Math.abs(base + harmonic + noise) + 2;
        // Cap heights between 2px and 22px
        return Math.max(2, Math.min(22, height));
      });
      setBarHeights(newHeights);
      animationFrameId = requestAnimationFrame(updateWaveform);
    };

    animationFrameId = requestAnimationFrame(updateWaveform);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, barHeights]);

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm z-30 flex items-end justify-center gap-[3px] px-8 overflow-hidden pointer-events-none"
        >
          <div className="flex items-end justify-center gap-[2px] w-full max-w-4xl h-full pb-2">
            {barHeights.map((height, index) => {
              // Interpolate colors between purple and green
              const ratio = index / barHeights.length;
              const colorClass = ratio < 0.3 
                ? 'bg-finova-purple/40 shadow-[0_0_8px_rgba(139,92,246,0.3)]' 
                : ratio < 0.7 
                  ? 'bg-finova-blue/40 shadow-[0_0_8px_rgba(59,130,246,0.3)]' 
                  : 'bg-finova-green/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]';

              return (
                <div
                  key={index}
                  style={{ height: `${height}px` }}
                  className={`w-[6px] sm:w-[8px] rounded-t-full transition-all duration-75 ${colorClass}`}
                />
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
