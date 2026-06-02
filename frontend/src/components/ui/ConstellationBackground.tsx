'use client';

import { useEffect, useRef } from 'react';

interface ConstellationProps {
  dualLayer?: boolean;
}

export default function ConstellationBackground({ dualLayer = true }: ConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let stars: Star[] = [];
    let mouse = { x: -1000, y: -1000 };
    let scrollY = 0;
    
    let lastTime = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      initParticles();
    };
    
    class Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
      twinkleOffset: number;

      color?: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.opacity = Math.random() * 0.1 + 0.05; // 0.05 - 0.15
        this.twinkleSpeed = Math.random() * 0.002 + 0.0005; // very slow twinkle
        this.twinkleOffset = Math.random() * Math.PI * 2;
        this.color = Math.random() > 0.5 ? 'rgba(224, 231, 255,' : 'rgba(196, 181, 253,'; // #e0e7ff or #c4b5fd prefix
      }

      draw(time: number) {
        if (!ctx) return;
        
        // Static background, no parallax for stars, but gentle twinkle
        const twinkle = Math.sin(time * this.twinkleSpeed + this.twinkleOffset);
        const alpha = this.opacity + twinkle * 0.08; 
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color || (Math.random() > 0.5 ? 'rgba(224, 231, 255,' : 'rgba(196, 181, 253,') + Math.max(0.02, alpha) + ')';
        ctx.fill();
      }
    }

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      baseX: number;
      baseY: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.baseX = this.x;
        this.baseY = this.y;
        
        // Random velocity if motion is allowed, else 0
        const vMultiplier = prefersReducedMotion ? 0 : 1;
        this.vx = (Math.random() - 0.5) * 0.4 * vMultiplier;
        this.vy = (Math.random() - 0.5) * 0.4 * vMultiplier;
        
        this.size = Math.random() * 1.5 + 0.5;
        this.color = ['#818cf8', '#2dd4bf', '#e0e7ff'][Math.floor(Math.random() * 3)];
      }

      update(deltaTime: number) {
        if (!prefersReducedMotion) {
          const speedAdjust = deltaTime / 16.66;
          this.x += this.vx * speedAdjust;
          this.y += this.vy * speedAdjust;

          // Bounce off walls
          if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

          // Mouse repulsion
          if (!isTouchDevice) {
            const dx = this.x - mouse.x;
            const dy = (this.y - scrollY * 0.3) - mouse.y; 
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100 && dist > 0) {
              const force = ((100 - dist) / 100) * 0.5;
              this.x += (dx / dist) * force * 2 * speedAdjust;
              this.y += (dy / dist) * force * 2 * speedAdjust;
            }
          }
        }
      }

      draw() {
        if (!ctx) return;
        const parallaxY = this.y - scrollY * 0.3;
        let renderY = parallaxY % canvas!.height;
        if (renderY < 0) renderY += canvas!.height;

        ctx.beginPath();
        ctx.arc(this.x, renderY, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.45; 
        ctx.fill();
      }
    }
    
    const initStars = () => {
      if (!dualLayer) { stars = []; return; }
      const count = window.innerWidth < 768 ? 60 : 150;
      stars = Array.from({ length: count }, () => new Star());
    };

    const initParticles = () => {
      const count = window.innerWidth < 768 ? 50 : 120;
      particles = Array.from({ length: count }, () => new Particle());
    };
    
    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      if (document.hidden) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Stars Layer (Background)
      if (dualLayer) {
        stars.forEach(star => star.draw(time));
      }

      // Draw Particles Layer (Foreground)
      particles.forEach((p, i) => {
        p.update(deltaTime);
        p.draw();
        
        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const p1Y = (p.y - scrollY * 0.3) % canvas.height;
          const renderP1Y = p1Y < 0 ? p1Y + canvas.height : p1Y;
          
          const p2Y = (particles[j].y - scrollY * 0.3) % canvas.height;
          const renderP2Y = p2Y < 0 ? p2Y + canvas.height : p2Y;

          const dy = renderP1Y - renderP2Y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, renderP1Y);
            ctx.lineTo(particles[j].x, renderP2Y);
            ctx.strokeStyle = '#818cf8'; 
            ctx.globalAlpha = 0.12 * (1 - dist / 150); 
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    
    resize();
    lastTime = performance.now();
    animate(lastTime);
    
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dualLayer]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0, 
        pointerEvents: 'none',
        opacity: 0,
        animation: 'fadeIn 1.5s ease forwards',
        contain: 'layout style paint', 
      }}
    />
  );
}
