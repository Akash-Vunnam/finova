'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  levitate?: boolean;
}

export const HolographicCard = ({ children, className = '', levitate = false }: HolographicCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Spring physics for smooth tilt recovery
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), springConfig);
  const gradientX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), springConfig);
  const gradientY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), springConfig);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) {
      setIsLowPower(true);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isLowPower) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Normalize coordinates (0 to 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset to center
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={levitate && !isLowPower ? { y: [-2, 2, -2] } : {}}
      transition={levitate && !isLowPower ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : {}}
      style={{
        perspective: isLowPower ? 'none' : 1000,
        transformStyle: 'preserve-3d',
      }}
      className={`relative w-full h-full group ${className}`}
    >
      <motion.div
        style={{
          rotateX: isLowPower ? 0 : rotateX,
          rotateY: isLowPower ? 0 : rotateY,
        }}
        className="w-full h-full relative"
      >
        {/* The Card Content */}
        {children}

        {/* Holographic Sheen Overlay */}
        {!isLowPower && (
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none rounded-[inherit] mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)`,
            }}
          />
        )}
        
        {/* Glow border on hover */}
        {!isLowPower && (
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              boxShadow: '0 0 10px 1px rgba(16, 185, 129, 0.2)'
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};
