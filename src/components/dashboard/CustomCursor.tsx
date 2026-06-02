'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoverState, setHoverState] = useState<'default' | 'clickable' | 'text'>('default');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Main cursor coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Trailing springs (Main dot + 5 lagging dots)
  const springConfigMain = { damping: 25, stiffness: 400, mass: 0.2 };
  const mainX = useSpring(cursorX, springConfigMain);
  const mainY = useSpring(cursorY, springConfigMain);

  // Create 5 lagging springs
  const trails = Array.from({ length: 5 }).map((_, i) => {
    const config = { damping: 25 + i * 2, stiffness: 300 - i * 40, mass: 0.5 + i * 0.1 };
    return {
      x: useSpring(cursorX, config),
      y: useSpring(cursorY, config),
    };
  });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a');
        
      const isText = 
        ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'].includes(target.tagName.toLowerCase());

      if (isClickable) {
        setHoverState('clickable');
      } else if (isText) {
        setHoverState('text');
      } else {
        setHoverState('default');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouchDevice) return null;

  // Determine styles based on context
  const getCursorStyles = () => {
    switch (hoverState) {
      case 'clickable':
        return {
          width: 40,
          height: 40,
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
          border: '1px solid rgba(255,255,255,0.4)',
          opacity: 1
        };
      case 'text':
        return {
          width: 20,
          height: 20,
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.8)',
          opacity: 1
        };
      default:
        return {
          width: 8,
          height: 8,
          background: 'rgba(255, 255, 255, 0.8)',
          border: 'none',
          opacity: 0.8
        };
    }
  };

  const styles = getCursorStyles();

  return (
    <>
      {/* 5 Lagging trail dots */}
      {trails.map((trail, index) => (
        <motion.div
          key={`trail-${index}`}
          className="fixed top-0 left-0 rounded-full pointer-events-none mix-blend-screen z-[9998]"
          style={{
            x: trail.x,
            y: trail.y,
            width: 4,
            height: 4,
            translateX: '-50%',
            translateY: '-50%',
            background: 'rgba(255, 255, 255, 1)',
            opacity: isVisible && hoverState === 'default' ? 0.4 - index * 0.08 : 0,
            contain: 'layout style paint',
          }}
        />
      ))}

      {/* Main Contextual Cursor */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none mix-blend-screen z-[9999]"
        style={{
          x: mainX,
          y: mainY,
          translateX: '-50%',
          translateY: '-50%',
          contain: 'layout style paint',
        }}
        initial={false}
        animate={{
          width: styles.width,
          height: styles.height,
          background: styles.background,
          border: styles.border,
          opacity: isVisible ? styles.opacity : 0,
          scale: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
    </>
  );
};
