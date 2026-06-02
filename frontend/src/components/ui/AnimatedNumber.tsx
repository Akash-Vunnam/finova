'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  format?: (val: number) => string;
  duration?: number;
  className?: string;
}

export default function AnimatedNumber({
  value,
  format = (val) => val.toFixed(2),
  duration = 1500,
  className = "",
}: AnimatedNumberProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1,
    duration,
  });
  
  const display = useTransform(spring, (current) => format(current));

  useEffect(() => {
    setHasMounted(true);
    spring.set(value);
  }, [spring, value]);

  if (!hasMounted) {
    return <span className={className}>{format(value)}</span>;
  }

  return <motion.span className={className}>{display}</motion.span>;
}
