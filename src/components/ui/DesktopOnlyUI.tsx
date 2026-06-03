"use client";

import React from 'react';

export default function DesktopOnlyUI() {
  return (
    <div className="fixed inset-0 z-[9999] bg-finova-navy flex items-center justify-center p-4">
      {/* Background ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-finova-purple/10 rounded-full blur-[120px] opacity-50" />
      </div>

      {/* Main Glass Card */}
      <div className="relative w-full max-w-[500px] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center text-center">
        
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-finova-purple/80 to-finova-indigo/80 flex items-center justify-center mb-8 shadow-lg shadow-finova-purple/20 border border-white/10">
          <span className="text-3xl font-serif text-white font-bold leading-none">F</span>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
          Desktop Only
        </h1>
        <p className="text-white/60 mb-8 leading-relaxed text-sm sm:text-base">
          Finova AI Investment Copilot is optimized for desktop displays. Mobile and tablets are not supported.
        </p>

        {/* Instructions Box */}
        <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-left">
          <p className="text-white/90 font-medium mb-5 text-sm text-center">
            How to continue on this device:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 mt-0.5">
                1
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Open your browser menu (usually <span className="font-serif">⋮</span> or <span className="font-bold">Aa</span>)
              </p>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 mt-0.5">
                2
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Select <span className="text-white font-medium">"Request Desktop Site"</span> or <span className="text-white font-medium">"Desktop site"</span>
              </p>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 mt-0.5">
                3
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                The app will automatically unlock
              </p>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
