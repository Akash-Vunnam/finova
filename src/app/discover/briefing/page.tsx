"use client";

import React, { useMemo } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowLeft, BarChart3, Zap, Brain, Headphones, Download, Pause, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TiltCard } from '@/components/briefing/TiltCard';
import { SectorHeatmap } from '@/components/briefing/SectorHeatmap';
import { TopMovers } from '@/components/briefing/TopMovers';
import { GlobalMarkets } from '@/components/briefing/GlobalMarkets';
import { EconomicCalendar } from '@/components/briefing/EconomicCalendar';
import { InstitutionalFlows } from '@/components/briefing/InstitutionalFlows';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useGeneratePDF } from '@/hooks/useGeneratePDF';

export default function AIBriefingPage() {
  const router = useRouter();
  const { scrollYProgress, scrollY } = useScroll();
  
  // Parallax effects
  const bgY1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const bgY2 = useTransform(scrollY, [0, 1000], [0, -150]);

  const insights = [
    "Nifty 50 closed at 23,450, up 0.85% with IT and Banking leading",
    "TCS Q4 results beat estimates: Revenue up 8.2% YoY, margins expand to 26.4%",
    "RBI maintains repo rate at 6.5%; stance remains 'withdrawal of accommodation'",
    "FII net buying at ₹2,340 Cr today; DIIs remain net sellers at ₹890 Cr"
  ];

  const fullTextToRead = useMemo(() => {
    return `
      Welcome to your AI Daily Briefing for May 30, 2026.
      Market Summary: Indian markets are rallying pre-market, driven by stronger than expected IT earnings from TCS and Infosys. Infrastructure stocks are gaining momentum ahead of the Union Budget. However, FMCG stocks remain under pressure amid rural inflation concerns.
      Key Insights:
      ${insights.join(". ")}
      AI Recommendation: Based on current momentum, consider increasing allocation to large-cap IT and private banking. Maintain 15 to 20 percent cash for opportunistic buying on dips.
    `;
  }, [insights]);

  const { play, pause, isPlaying, isSupported } = useTextToSpeech(fullTextToRead);
  const { generatePDF, isGenerating } = useGeneratePDF("briefing-report-content", "Finova-AI-Briefing-May-30-2026.pdf");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white overflow-hidden relative selection:bg-emerald-500/30">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button 
          onClick={() => router.push('/discover')}
          className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-sm font-medium text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all cursor-none group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Discover
        </button>
      </div>

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Orbs */}
        <motion.div 
          style={{ y: bgY1 }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen"
        />
        <motion.div 
          style={{ y: bgY2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full mix-blend-screen"
        />
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />
        {/* Extra Teal Orb for balance with new content */}
        <div className="absolute top-[60%] left-[-5%] w-[450px] h-[450px] bg-teal-500/10 blur-[120px] rounded-full mix-blend-screen animate-[pulse_10s_ease-in-out_infinite]" />
        
        {/* Grid & Noise */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
        <div className="absolute inset-0 bg-[url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;)] opacity-[0.03]" />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${i % 3 === 0 ? 'bg-emerald-400' : i % 2 === 0 ? 'bg-purple-400' : 'bg-white'} opacity-20`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, -200],
                x: [0, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content wrapper for PDF Generation */}
      <div id="briefing-report-content" className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-40">
        
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20 flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI GENERATED
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-emerald-100 to-white/70 bg-clip-text text-transparent drop-shadow-2xl"
            style={{ transform: "perspective(1000px) rotateX(5deg)" }}
          >
            AI Daily Briefing
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-slate-400 text-lg md:text-xl mb-8 font-medium">
            Your AI-curated market intelligence • May 30, 2026
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <span className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-sm text-emerald-400 font-medium">
              Nifty 50: 23,450.85 <span className="ml-1">▲</span>
            </span>
            <span className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-sm text-emerald-400 font-medium">
              Sensex: 77,342.30 <span className="ml-1">▲</span>
            </span>
            <span className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-sm text-slate-400">
              Generated: Just now
            </span>
          </motion.div>
        </motion.div>

        {/* Content Cards */}
        <div className="space-y-8">
          
          {/* Section 1: Market Summary */}
          <TiltCard id="market-summary" className="hover:border-emerald-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <BarChart3 className="text-emerald-400" size={20} />
              </div>
              <h2 className="text-2xl font-semibold text-white">Market Summary</h2>
            </div>
            <div className="text-slate-300 text-lg leading-relaxed font-medium">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Indian markets are rallying pre-market, driven by stronger-than-expected IT earnings from TCS and Infosys. Infrastructure stocks are gaining momentum ahead of the Union Budget. However, FMCG stocks remain under pressure amid rural inflation concerns.
              </motion.p>
            </div>
          </TiltCard>

          {/* Section 2: Key Insights */}
          <TiltCard id="key-insights" className="hover:border-amber-500/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Zap className="text-amber-400" size={20} />
              </div>
              <h2 className="text-2xl font-semibold text-white">Key Insights</h2>
            </div>
            
            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * idx }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="mt-2 w-2 h-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse" />
                  <p className="text-slate-300 text-base leading-relaxed">{insight}</p>
                </motion.div>
              ))}
            </div>
          </TiltCard>

          {/* New Sections */}
          <SectorHeatmap />
          <TopMovers />
          <GlobalMarkets />
          <EconomicCalendar />
          <InstitutionalFlows />

          {/* Final Section: AI Recommendation */}
          <TiltCard id="ai-recommendation" className="border-purple-500/30 shadow-[0_10px_40px_rgba(139,92,246,0.15),inset_0_0_40px_rgba(139,92,246,0.1)] relative">
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none rounded-3xl" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <Brain className="text-purple-400" size={20} />
                </div>
                <h2 className="text-2xl font-semibold text-white">AI Recommendation</h2>
              </div>
              
              <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5">
                {/* SVG Progress Ring */}
                <div className="relative w-6 h-6">
                  <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                    <path className="text-purple-900/30" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <motion.path 
                      className="text-purple-400" 
                      strokeWidth="3" 
                      strokeDasharray="100, 100" 
                      stroke="currentColor" 
                      fill="none" 
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 100 }}
                      whileInView={{ strokeDashoffset: 8 }} // 92%
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    />
                  </svg>
                </div>
                <span className="text-xs font-bold text-purple-300">CONFIDENCE: 92%</span>
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-slate-300 text-xl font-medium leading-relaxed">
                Based on current momentum, consider increasing allocation to large-cap IT (TCS, Infosys) and private banking (HDFC Bank, ICICI Bank). Maintain 15-20% cash for opportunistic buying on dips.
              </p>
            </div>
          </TiltCard>

        </div>
      </div>

      {/* Floating Action Bar */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 md:px-8 py-4 shadow-2xl shadow-black/50 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 z-50 w-[95%] max-w-3xl"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400 text-sm font-medium whitespace-nowrap">
            Last updated: 12:40 PM IST
          </span>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button 
            onClick={isPlaying ? pause : play}
            className="bg-white/10 border border-white/10 text-white rounded-full px-5 py-2.5 hover:bg-white/20 transition-all flex items-center gap-2 text-sm font-semibold cursor-none group"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 flex items-center gap-1">
                  Pause Audio
                  {/* Waveform Animation */}
                  <div className="flex items-end gap-[2px] h-3 ml-1">
                    <motion.div animate={{ height: ["4px", "10px", "4px"] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-0.5 bg-emerald-400" />
                    <motion.div animate={{ height: ["12px", "4px", "12px"] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-0.5 bg-emerald-400" />
                    <motion.div animate={{ height: ["6px", "14px", "6px"] }} transition={{ duration: 0.4, repeat: Infinity }} className="w-0.5 bg-emerald-400" />
                  </div>
                </span>
              </>
            ) : (
              <>
                <Headphones className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
                <span className="group-hover:text-emerald-400 transition-colors">Play Audio Version</span>
              </>
            )}
          </button>
          
          <button 
            onClick={generatePDF}
            disabled={isGenerating}
            className="bg-emerald-500 text-slate-950 font-bold rounded-full px-6 py-2.5 hover:bg-emerald-400 hover:scale-105 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all flex items-center gap-2 text-sm cursor-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isGenerating ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </motion.div>

    </div>
  );
}
