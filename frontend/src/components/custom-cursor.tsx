"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const [clicking, setClicking] = useState(false);

  // Smooth position tracking with lerp
  const pos = useRef({ x: 0, y: 0 });
  const ghostPos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = () => setClicking(true);
    const onMouseUp = () => setClicking(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    let raf: number;

    const animate = () => {
      // Lerp for smooth trailing (0.15 = smooth, 0.3 = snappy)
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;

      ghostPos.current.x += (target.current.x - ghostPos.current.x) * 0.08;
      ghostPos.current.y += (target.current.y - ghostPos.current.y) * 0.08;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%) scale(${clicking ? 1.8 : 1})`;
      }

      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate(${ghostPos.current.x}px, ${ghostPos.current.y}px) translate(-50%, -50%)`;
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [clicking]);

  return (
    <>
      {/* Ghost trailing dot */}
      <div
        ref={ghostRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none hidden md:block"
        style={{ willChange: "transform" }}
      >
        <div className="h-3 w-3 rounded-full bg-white/20 blur-sm" />
      </div>

      {/* Main white dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
        style={{ willChange: "transform" }}
      >
        <div
          className={`
            h-3 w-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]
            transition-transform duration-75 ease-out
            ${clicking ? "opacity-80" : "opacity-100"}
          `}
        />
      </div>

      {/* Click ripple effect */}
      <ClickRipple />
    </>
  );
}

// Separate click ripple component
function ClickRipple() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const id = idRef.current++;
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-[9998] hidden md:block"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="h-4 w-4 rounded-full border border-white/60 animate-ripple" />
        </div>
      ))}
    </>
  );
}
