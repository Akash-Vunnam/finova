'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { BarChart3, Compass, MessageSquare, PieChart, User, Lock } from 'lucide-react';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserMenu from '@/components/auth/UserMenu';
import LoginModal from '@/components/auth/LoginModal';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
  { name: 'Portfolio', path: '/portfolio', icon: PieChart },
  { name: 'Discover', path: '/discover', icon: Compass },
  { name: 'AI Chat', path: '/ai-chat', icon: MessageSquare },
];

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Welcome to Finova");

  // Clear first visit sonar after 2 seconds
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsFirstVisit(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const navHeight = useTransform(scrollY, [0, 30], [72, 60]);
  const bgOpacity = useTransform(scrollY, [0, 30], [1, 0.75]);
  const blurValue = useTransform(scrollY, [0, 30], [0, 20]);
  const borderColor = useTransform(
    scrollY, 
    [0, 30], 
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.06)']
  );
  const shadowValue = useTransform(
    scrollY,
    [0, 30],
    ['0 0 0 rgba(0,0,0,0)', '0 4px 30px rgba(0, 0, 0, 0.3)']
  );

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 hidden md:block",
        pathname !== '/ai-chat' && "border-b"
      )}
      style={{ 
        height: navHeight, 
        backgroundColor: useTransform(bgOpacity, v => `rgba(11, 14, 20, ${v})`),
        backdropFilter: useTransform(blurValue, v => `blur(₹{v}px) saturate(180%)`),
        WebkitBackdropFilter: useTransform(blurValue, v => `blur(₹{v}px) saturate(180%)`),
        borderColor: pathname === '/ai-chat' ? 'transparent' : borderColor,
        boxShadow: pathname === '/ai-chat' ? 'none' : shadowValue,
        contain: 'layout style paint',
        willChange: 'transform, height, background-color, backdrop-filter'
      }}
    >
      {/* Ambient Particles in Navbar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {mounted && [...Array(10)].map((_, i) => (
          <motion.div
            key={`nav-particle-${i}`}
            className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 50],
              y: [0, (Math.random() - 0.5) * 20],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative z-10">
        
        {/* Finova Logo Enhancement */}
        <Link href="/" className="flex items-center gap-2 group relative">
          <motion.div 
            animate={{ 
              filter: ['drop-shadow(0 0 8px rgba(99, 102, 241, 0.2))', 'drop-shadow(0 0 16px rgba(99, 102, 241, 0.4))', 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.2))']
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-finova-purple to-finova-green flex items-center justify-center transition-transform group-hover:scale-105 relative overflow-hidden"
          >
            {/* Rainbow sheen sweep on hover */}
            <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.4)_25%,transparent_30%)] bg-[length:200%_auto] bg-[position:200%_center] group-hover:bg-[position:-200%_center] transition-all duration-700" />
            <span className="font-bold text-white text-xl relative z-10">F</span>
          </motion.div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Finova
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-2 h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            const isLocked = !loading && !isAuthenticated;

            return (
               <Link
                key={item.path}
                href={isLocked ? '#' : item.path}
                onClick={(e) => {
                  if (isLocked) {
                    e.preventDefault();
                    setModalTitle("Please sign in to continue");
                    setIsLoginModalOpen(true);
                  }
                }}
                className={clsx(
                  "relative px-4 h-full flex items-center text-sm font-medium transition-colors group",
                  isLocked && "cursor-pointer"
                )}
              >
                <div className="flex items-center gap-2 relative z-10 transition-colors duration-200 group-hover:text-white text-white/60">
                  {/* Micro-bounce on hover */}
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <Icon size={16} className={clsx(isActive ? 'text-finova-purple' : 'group-hover:text-white/80 transition-colors')} />
                  </motion.div>
                  <span className={clsx(isActive ? 'text-white' : 'group-hover:text-white transition-colors')}>{item.name}</span>
                  {isLocked && <Lock size={12} className="opacity-0 group-hover:opacity-70 transition-opacity duration-300 ml-0.5" />}
                </div>

                {/* Subtle glow dot on hover */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-finova-purple opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />

                {/* First visit sonar hint */}
                {isFirstVisit && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="w-12 h-12 border border-finova-purple/30 rounded-full animate-[sonar-ring_2s_ease-out]" />
                  </div>
                )}

                {/* Active Tab Morphing Gradient Shimmer */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-finova-purple via-finova-green to-finova-purple bg-[length:200%_100%] rounded-t-full"
                    style={{ animation: 'shimmer-bg 3s linear infinite' }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth Integration */}
        {!loading && (
          isAuthenticated ? (
            <UserMenu />
          ) : (
            <button 
              onClick={() => {
                setModalTitle("Welcome to Finova");
                setIsLoginModalOpen(true);
              }}
              className="bg-white text-slate-900 hover:bg-slate-200 rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-colors cursor-none"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign In
            </button>
          )
        )}
      </div>

      {/* Scroll-Progress Indicator */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-finova-purple to-finova-green z-20"
        style={{ width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
      />
    </motion.nav>
    <LoginModal 
      isOpen={isLoginModalOpen} 
      onClose={() => setIsLoginModalOpen(false)} 
      title={modalTitle}
    />
    </>
  );
}
