'use client';

import { motion } from 'framer-motion';

export default function DesktopOnly() {
  return (
    <div className="fixed inset-0 z-[9999] bg-finova-navy flex flex-col items-center justify-center p-6 text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full"
      >
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl relative overflow-hidden flex flex-col items-center">
          {/* Subtle gradient glow behind the logo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-finova-purple/20 rounded-full blur-[80px] pointer-events-none" />

          {/* Finova Logo */}
          <motion.div
            animate={{
              filter: [
                'drop-shadow(0 0 8px rgba(99, 102, 241, 0.2))',
                'drop-shadow(0 0 16px rgba(99, 102, 241, 0.4))',
                'drop-shadow(0 0 8px rgba(99, 102, 241, 0.2))',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-finova-purple to-finova-green flex items-center justify-center relative overflow-hidden mb-8"
          >
            <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.4)_25%,transparent_30%)] bg-[length:200%_auto] bg-[position:200%_center] animate-[shimmer_3s_infinite]" />
            <span className="font-bold text-white text-4xl font-serif relative z-10">
              F
            </span>
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-4 tracking-tight">
            Desktop Only
          </h1>
          
          <p className="text-white/60 mb-8 leading-relaxed text-sm">
            Finova AI Investment Copilot is optimized for desktop displays. Mobile and tablets are not supported.
          </p>

          <div className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-left">
            <h2 className="text-white/80 font-medium text-sm mb-4 text-center">
              How to continue on this device:
            </h2>
            
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 font-medium mt-0.5">
                  1
                </div>
                <p className="text-white/60 text-sm">
                  Open your browser menu (usually <strong className="text-white/80 font-medium">⋮</strong> or <strong className="text-white/80 font-medium">Aa</strong>)
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 font-medium mt-0.5">
                  2
                </div>
                <p className="text-white/60 text-sm">
                  Select "<strong className="text-white/80 font-medium">Request Desktop Site</strong>" or "<strong className="text-white/80 font-medium">Desktop site</strong>"
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 font-medium mt-0.5">
                  3
                </div>
                <p className="text-white/60 text-sm">
                  The app will automatically unlock
                </p>
              </li>
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
