'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
}

export const MagneticButton = ({ children, strength = 8, className, onClick, ...props }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    // Core button boundaries
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Max offset capped to strength (e.g. 8px)
    let offsetX = middleX * 0.1;
    let offsetY = middleY * 0.1;
    if (Math.abs(offsetX) > strength) offsetX = Math.sign(offsetX) * strength;
    if (Math.abs(offsetY) > strength) offsetY = Math.sign(offsetY) * strength;

    setPosition({ x: offsetX, y: offsetY });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <div 
      className="relative inline-block"
      onMouseMove={handleMouse}
      onMouseLeave={reset}
    >
      {/* Invisible hover extended area (50px) */}
      <div className="absolute -inset-[50px] z-0 pointer-events-auto" />
      
      <motion.div
        ref={ref}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
        className="relative z-10"
      >
        <button 
          className={`relative overflow-hidden ${className}`} 
          onClick={handleClick}
          {...props}
        >
          {children}
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ opacity: 0.5, scale: 0 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute bg-white/30 rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 100,
                height: 100,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </button>
      </motion.div>
    </div>
  );
};
