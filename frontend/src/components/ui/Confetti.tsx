'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const COLORS = ['#8b5cf6', '#34d399', '#60a5fa', '#f87171', '#ffffff'];

export const Confetti = ({ active }: { active: boolean }) => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: -100 - Math.random() * 200,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.2,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: p.scale,
            rotate: p.rotation + 360,
            opacity: 0,
          }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: p.delay }}
          className="absolute w-2 h-2 rounded-sm shadow-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
};
