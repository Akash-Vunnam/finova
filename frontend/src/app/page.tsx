'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Zap, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import Hero3D from '@/components/3d/Hero3D';
import { GlassCard } from '@/components/ui/GlassCard';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { TiltCard } from '@/components/ui/TiltCard';
import { ParticleNetwork } from '@/components/ui/ParticleNetwork';
import TickerMarquee from '@/components/ui/TickerMarquee';
import { CountUpNumber } from '@/components/ui/CountUpNumber';

const OrbitingTickers = () => {
  const tickers = [
    { symbol: 'RELIANCE', price: '₹2,950' },
    { symbol: 'TCS', price: '₹3,950' },
    { symbol: 'TATAMOTORS', price: '₹1,015' },
    { symbol: 'INFY', price: '₹1,650' },
    { symbol: 'HDFCBANK', price: '₹1,450' }
  ];
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {tickers.map((item, i) => {
        const radius = 250 + i * 40;
        const duration = 20 + i * 5;
        const delay = i * -5;
        return (
          <motion.div
            key={item.symbol}
            className="absolute rounded-full border border-white/5"
            style={{ width: radius * 2, height: radius * 2 }}
            animate={{ rotate: 360 }}
            transition={{ duration, repeat: Infinity, ease: "linear", delay }}
          >
            <div
              className="absolute flex flex-col items-center justify-center bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              style={{ top: -20, left: '50%', transform: 'translateX(-50%)' }}
            >
              <span className="text-xs font-bold text-white/90">{item.symbol}</span>
              <span className="text-[10px] font-medium text-finova-green">{item.price}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Auth state
  const { isAuthenticated, loading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Welcome to Finova");
  
  const isLocked = !loading && !isAuthenticated;

  const handleLockedClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      setModalTitle("Please sign in to continue");
      setIsLoginModalOpen(true);
    }
  };
  
  // Parallax: Move floating tickers down at 0.5x speed as user scrolls
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient CSS Gradient Mesh */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-finova-purple/20 via-finova-navy to-finova-navy opacity-30 pointer-events-none animate-[mesh_20s_ease-in-out_infinite]" style={{ backgroundSize: '200% 200%' }} />
      
      {/* Particle Network */}
      <ParticleNetwork />

      {/* Hero Section Container */}
      <div ref={heroRef} className="relative min-h-[90vh]">
        {/* 3D Background */}
        <Hero3D />
        
        {/* Parallax Tickers Layer */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0 hidden md:block"
          style={{ y: parallaxY }}
        >
          <OrbitingTickers />
        </motion.div>

        {/* Hero Content */}
        <section className="relative z-10 h-full min-h-[90vh] flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 group relative">
              {/* Live Market Pulse Orb */}
              <div className="relative flex items-center justify-center">
                <span className="absolute w-3 h-3 rounded-full bg-finova-green animate-ping opacity-75" />
                <span className="relative w-2 h-2 rounded-full bg-finova-green shadow-[0_0_8px_#34d399]" />
              </div>
              <span className="text-sm font-medium text-white/80">AI Investment Copilot</span>
              
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-xs px-2 py-1 rounded border border-white/10 whitespace-nowrap pointer-events-none">
                NSE Open
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
              Invest Smarter <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="absolute -inset-2 bg-gradient-to-r from-finova-purple to-finova-green opacity-30 blur-2xl rounded-full mix-blend-screen" />
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-finova-purple via-white to-finova-green">
                  with AI
                </span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Experience the future of wealth management. Real-time insights, stunning 3D visualizations, and powerful AI analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={isLocked ? '#' : "/dashboard"} onClick={handleLockedClick}>
                <MagneticButton className={`relative group overflow-hidden rounded-full bg-white text-finova-navy font-semibold px-8 py-4 transition-all hover:scale-105 ${isLocked ? 'cursor-pointer' : ''}`}>
                  <span className="relative z-10 flex items-center gap-2">
                    Launch App 
                    {isLocked ? (
                      <Lock size={18} className="opacity-70" />
                    ) : (
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-finova-purple to-finova-green opacity-0 group-hover:opacity-10 transition-opacity" />
                </MagneticButton>
              </Link>
              
              <Link href={isLocked ? '#' : "/discover"} onClick={handleLockedClick}>
                <MagneticButton className={`rounded-full bg-white/5 border border-white/10 text-white font-medium px-8 py-4 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 flex items-center gap-2 ${isLocked ? 'cursor-pointer' : ''}`}>
                  Explore Market
                  {isLocked && <Lock size={16} className="opacity-70" />}
                </MagneticButton>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Interactive Ticker Ribbon */}
      <section className="relative z-10 bg-finova-navy border-y border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <TickerMarquee />
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 bg-finova-navy/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Real-time Tracking",
                desc: "Live market data, sub-second updates, and gorgeous charts.",
                color: "text-finova-green"
              },
              {
                icon: Zap,
                title: "AI Insights",
                desc: "Get instant Gemini-powered explanations and Buy/Hold/Sell verdicts.",
                color: "text-finova-purple"
              },
              {
                icon: Shield,
                title: "Secure Portfolio",
                desc: "Your data is encrypted and backed by enterprise-grade security.",
                color: "text-finova-red"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <TiltCard>
                  <GlassCard hoverEffect className="p-8 h-full bg-white/[0.02]">
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 shadow-inner ${feature.color}`}>
                      <feature.icon size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/60 leading-relaxed">{feature.desc}</p>
                  </GlassCard>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 px-4 bg-black/20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: 5, suffix: "L+", label: "Active Users" },
              { value: 2400, prefix: "₹", suffix: " Cr+", decimals: 0, label: "Assets Tracked" },
              { value: 99.9, suffix: "%", decimals: 1, label: "Uptime SLA" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                  <CountUpNumber 
                    value={stat.value} 
                    prefix={stat.prefix} 
                    suffix={stat.suffix} 
                    decimals={stat.decimals}
                    duration={2}
                  />
                </div>
                <div className="text-white/50 font-medium tracking-wide uppercase text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Wave Divider */}
      <div className="relative z-10 w-full overflow-hidden leading-none transform translate-y-px">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-finova-navy drop-shadow-[0_-5px_15px_rgba(139,92,246,0.1)]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.3,130.83,121.22,200.5,108.6,243.68,100.8,284.15,74.72,321.39,56.44Z" />
        </svg>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        title={modalTitle}
      />
    </div>
  );
}
