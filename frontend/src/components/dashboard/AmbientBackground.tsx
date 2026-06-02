'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';

export const AmbientBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLowPower, setIsLowPower] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 100]); // Subtly move down when scrolling down (parallax depth)

  useEffect(() => {
    // Check for low power or prefers-reduced-motion
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
    ) {
      setIsLowPower(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000); // Responsive count
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(10, 14, 26, 1)'; // Base background color match

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Emerald/Teal tint to particles
        ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity * 0.3})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resize);
    resize();
    drawParticles();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-transparent">
      {/* Dynamic Ambient Lighting (Glow behind Total Balance) */}
      <motion.div 
        className="absolute top-[20%] left-[20%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.8) 0%, rgba(16, 185, 129, 0) 70%)',
          y
        }}
      />
      <motion.div 
        className="absolute top-[40%] right-[10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0) 70%)',
          y
        }}
      />

      {/* Particle Canvas */}
      {!isLowPower && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{ contain: 'layout style' }}
        />
      )}

      {/* Vignette Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)'
        }}
      />
    </div>
  );
};
