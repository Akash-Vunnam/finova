'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Bell, Settings, LogOut, Loader2, MailCheck, MailWarning, Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';
import { TiltCard } from '@/components/ui/TiltCard';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';
import { useProfileSettings } from '@/context/ProfileSettingsContext';
import AvatarUploader from '@/components/profile/AvatarUploader';
import EditableName from '@/components/profile/EditableName';
import ToggleSwitch from '@/components/profile/ToggleSwitch';
import PrivacyAccordion from '@/components/profile/PrivacyAccordion';
import ConnectedAccounts from '@/components/profile/ConnectedAccounts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Magnetic Button Wrapper
const MagneticButton = ({ children, onClick, className }: any) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.2; // 20px radius pull roughly
    const y = (clientY - (top + height / 2)) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={clsx("relative", className)}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      {isHovered && (
        <motion.div 
          className="absolute inset-0 rounded-2xl border border-red-500/20 shadow-[0_0_20px_rgba(248,113,113,0.1)] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.button>
  );
};

export default function ProfilePage() {
  const { logout, user } = useAuth();
  const { profile, updateProfile } = useProfileSettings();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      toast.success("Signed out successfully.");
      router.push("/");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleTestNotification = () => {
    toast.info("This is a test notification from Finova!", {
      icon: <Bell className="w-4 h-4 text-emerald-400" />
    });
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Portfolio analysis complete! Check your Dashboard for insights.");
    }, 2000);
  };

  return (
    <motion.div 
      className="min-h-screen bg-transparent pb-24 relative overflow-hidden iris-wipe-enter"
    >
      {/* Volumetric Fog & Ceiling Ambient Light */}
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-[radial-gradient(ellipse_at_bottom,rgba(11,14,20,1)_0%,transparent_100%)] pointer-events-none z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="pt-24 px-4 md:px-8 max-w-3xl mx-auto relative z-10">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        </motion.div>

        {/* Profile Hero Card - STATIC GLASSMORPHISM, NO HOVER BLUR CHANGES */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-12"
        >
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)]">
            
            {/* Optional: subtle inner gradient glow - static only */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b]/50 via-[#0f172a]/50 to-[#020617]/50 pointer-events-none" />
            
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                {/* Plan Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-slate-300 text-sm font-bold tracking-[0.2em]">FINOVA</span>
                  <span className="bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 tracking-wider uppercase">
                    {profile.plan}
                  </span>
                </div>
                
                {/* Name - editable, NO hover blur on parent */}
                <div className="mb-2">
                  <EditableName />
                </div>
                
                {/* Email */}
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-white/40 text-xs font-medium tracking-widest truncate max-w-[200px]">{profile.email}</p>
                  {user?.emailVerified ? (
                    <MailCheck size={12} className="text-emerald-500" />
                  ) : (
                    <MailWarning size={12} className="text-amber-500" />
                  )}
                </div>
                
                {/* Member Since */}
                <p className="text-white/40 text-xs font-medium tracking-widest mt-1 uppercase">
                  MEMBER SINCE {new Date(profile.memberSince).getFullYear()}
                </p>
              </div>
              
              {/* Avatar - static, no hover blur */}
              <div className="relative flex-shrink-0">
                <AvatarUploader />
              </div>
            </div>
            
            {/* Active Badge */}
            <div className="absolute bottom-6 right-6 md:absolute md:bottom-8 md:right-8">
              <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                ACTIVE
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings Stack Entrance */}
        <motion.div 
          initial={{ opacity: 0, rotateX: 45, y: 50 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
          style={{ transformPerspective: 1000 }}
          className="space-y-4"
        >
          <GlassCard className="p-0 overflow-hidden divide-y divide-white/10">
            
            <div 
              className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors relative overflow-hidden"
              onMouseEnter={() => setHoveredRow(1)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {/* Holographic scanline */}
              {hoveredRow === 1 && (
                <div className="absolute inset-0 bg-[linear-gradient(transparent,rgba(255,255,255,0.1),transparent)] h-full w-full pointer-events-none animate-[scanline_0.4s_linear]" />
              )}
              <div className="flex items-center justify-between gap-4 relative z-10 w-full pr-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-finova-purple/20 transition-colors">
                    <Bell size={18} className="text-white" />
                  </div>
                  <div>
                    <div className={clsx("text-white font-medium", hoveredRow === 1 && "chromatic-aberration")}>Push Notifications</div>
                    <div className="text-white/50 text-sm">Price alerts & news</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <ToggleSwitch 
                    enabled={profile.pushNotifications} 
                    onToggle={(v) => {
                      updateProfile({ pushNotifications: v });
                      toast(v ? "Push notifications enabled" : "Push notifications disabled");
                    }} 
                    ariaLabel="Toggle push notifications" 
                  />
                  {profile.pushNotifications && (
                    <button 
                      onClick={() => {
                        toast.info("This is a test notification from Finova!", {
                          icon: <Bell className="w-4 h-4 text-emerald-400" />
                        });
                      }}
                      className="text-emerald-400 text-xs hover:text-emerald-300 transition-colors mt-1 flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-1"
                    >
                      <Bell className="w-3 h-3" /> Test
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div 
              className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors relative overflow-hidden"
              onMouseEnter={() => setHoveredRow(2)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {hoveredRow === 2 && (
                <div className="absolute inset-0 bg-[linear-gradient(transparent,rgba(255,255,255,0.1),transparent)] h-full w-full pointer-events-none animate-[scanline_0.4s_linear]" />
              )}
              <div className="flex items-center justify-between gap-4 relative z-10 w-full pr-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-finova-green/20 transition-colors">
                    <Settings size={18} className="text-white" />
                  </div>
                  <div>
                    <div className={clsx("text-white font-medium", hoveredRow === 2 && "chromatic-aberration")}>Auto AI Analysis</div>
                    <div className="text-white/50 text-sm">Analyze portfolio daily</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <ToggleSwitch 
                    enabled={profile.autoAIAnalysis} 
                    onToggle={(v) => {
                      updateProfile({ autoAIAnalysis: v });
                      toast(v ? "Auto AI Analysis enabled" : "Auto AI Analysis disabled");
                    }} 
                    ariaLabel="Toggle auto AI analysis" 
                  />
                  <button 
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="text-emerald-400 text-xs hover:text-emerald-300 transition-colors mt-1 flex items-center gap-1 disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-1"
                  >
                    {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    {isAnalyzing ? "Analyzing..." : "Run Now"}
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Accordion Row */}
            <PrivacyAccordion />

          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <ConnectedAccounts />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <MagneticButton 
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full p-4 flex items-center justify-center gap-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 font-medium transition-all group focus:outline-none focus:ring-2 focus:ring-rose-500/30 active:scale-[0.98] disabled:opacity-50"
            tabIndex={0}
          >
            {isSigningOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut size={18} className="group-hover:animate-pulse" />
            )}
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </MagneticButton>
        </motion.div>

      </div>
    </motion.div>
  );
}
