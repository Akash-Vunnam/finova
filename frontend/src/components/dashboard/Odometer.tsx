'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

function usePrevious(value: number) {
  const ref = useRef<number>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const Digit = ({ place, value }: { place: number; value: number }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  let mv = useSpring(value, {
    stiffness: 100,
    damping: 20,
    mass: 1,
  });

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  const y = useTransform(mv, (v) => {
    // 10 digits (0-9) taking up height space
    return `-${(v % 10) * 10}%`;
  });

  if (!isClient) {
    return <span className="inline-block relative overflow-hidden" style={{ height: '1em' }}>{value % 10}</span>;
  }

  return (
    <span className="inline-block relative overflow-hidden align-bottom" style={{ height: '1em', lineHeight: '1em' }}>
      <motion.div style={{ y }} className="absolute left-0 right-0 top-0 flex flex-col">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="h-[1em] flex items-center justify-center leading-none">{i}</span>
        ))}
      </motion.div>
      {/* Invisible spacer to set width/height */}
      <span className="invisible text-transparent" aria-hidden="true">0</span>
    </span>
  );
};

export const Odometer = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) => {
  const strValue = value.toFixed(decimals);
  const parts = strValue.split('.');
  const intPart = parts[0];
  const decPart = parts[1] || '';

  const chars = [];
  
  // Format integer part with commas
  let commaCounter = 0;
  let isFirstComma = true;
  for (let i = intPart.length - 1; i >= 0; i--) {
    const char = intPart[i];
    if (char === '-') {
      chars.unshift({ type: 'char', val: char, key: `minus-${i}` });
      continue;
    }
    
    chars.unshift({ type: 'digit', val: parseInt(char, 10), key: `int-${i}` });
    commaCounter++;
    
    const targetLength = isFirstComma ? 3 : 2;
    if (commaCounter === targetLength && i > 0 && intPart[i-1] !== '-') {
      chars.unshift({ type: 'char', val: ',', key: `comma-${i}` });
      commaCounter = 0;
      isFirstComma = false;
    }
  }

  if (decimals > 0) {
    chars.push({ type: 'char', val: '.', key: 'dot' });
    for (let i = 0; i < decPart.length; i++) {
      chars.push({ type: 'digit', val: parseInt(decPart[i], 10), key: `dec-${i}` });
    }
  }

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      {prefix && <span>{prefix}</span>}
      {chars.map((c) => {
        if (c.type === 'digit') {
          return <Digit key={c.key} place={1} value={c.val as number} />;
        }
        return <span key={c.key}>{c.val}</span>;
      })}
      {suffix && <span>{suffix}</span>}
    </span>
  );
};
