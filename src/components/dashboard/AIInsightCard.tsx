'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { HolographicCard } from './HolographicCard';

export const AIInsightCard = () => {
  const text = "Your portfolio is IT-heavy (45% allocation). Consider adding banking or FMCG stocks for stability ahead of the Union Budget.";
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const hasRendered = useRef(false);

  useEffect(() => {
    // If user prefers reduced motion, skip typing
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    if (!hasStarted) return;
    if (hasRendered.current) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        setTimeout(() => setIsTyping(false), 800);
        hasRendered.current = true;
      }
    }, 25);

    return () => clearInterval(interval);
  }, [hasStarted, text]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      onViewportEnter={() => setHasStarted(true)}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <HolographicCard levitate={true}>
        <SpotlightCard className="p-4 bg-finova-purple/10 border border-finova-purple/20">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-finova-purple/20 flex items-center justify-center shrink-0">
              <Zap size={16} className="text-finova-purple" />
            </div>
            <div className="flex-1 mt-1 text-sm font-medium text-white/90 leading-relaxed">
              {displayedText}
              {isTyping && (
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  className="inline-block w-1 h-3.5 bg-finova-purple ml-1 align-middle"
                />
              )}
            </div>
          </div>
        </SpotlightCard>
      </HolographicCard>
    </motion.div>
  );
};

