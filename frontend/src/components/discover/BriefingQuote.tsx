'use client';

import { motion } from 'framer-motion';

interface BriefingQuoteProps {
  text: string;
}

export const BriefingQuote = ({ text }: BriefingQuoteProps) => {
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const wordVariants: any = {
    hidden: { 
      opacity: 0, 
      y: 10,
      filter: 'blur(2px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-white/80 text-lg leading-relaxed max-w-3xl font-medium relative select-none"
    >
      {/* Oversized Parallax Quote Marks */}
      <span className="absolute -top-6 -left-6 text-7xl font-serif text-white/5 pointer-events-none select-none">
        “
      </span>
      
      {words.map((word, i) => (
        <motion.span 
          key={i} 
          variants={wordVariants}
          className="inline-block mr-[0.28em]"
        >
          {word}
        </motion.span>
      ))}

      <span className="absolute -bottom-10 right-10 text-7xl font-serif text-white/5 pointer-events-none select-none">
        ”
      </span>
    </motion.div>
  );
};
