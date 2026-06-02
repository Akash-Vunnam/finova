"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface DeviceBlockerProps {
  children: React.ReactNode;
  isMobileServer: boolean;
}

export default function DeviceBlocker({
  children,
  isMobileServer,
}: DeviceBlockerProps) {
  // Initialize with server state to prevent hydration mismatches
  const [isMobile, setIsMobile] = useState(isMobileServer);

  useEffect(() => {
    const checkDevice = () => {
      const isMobileWidth = window.innerWidth < 1024;
      const isMobileUA =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
          navigator.userAgent
        );

      // If either check is true, it's considered mobile/tablet
      setIsMobile(isMobileWidth || isMobileUA);
    };

    // Run check on mount to catch any differences from server state
    // (e.g. if the user enabled desktop mode but the server didn't catch it)
    checkDevice();

    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0a0e1a] flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-auto flex flex-col items-center">
          {/* Finova Logo */}
          <div className="w-16 h-16 bg-gradient-to-br from-finova-purple to-finova-blue rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-finova-purple/20">
            <span className="text-3xl font-bold text-white tracking-tighter">F</span>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Desktop Only
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Finova AI Investment Copilot is optimized for desktop displays. Mobile and tablets are not supported.
          </p>

          <div className="w-full bg-white/5 rounded-xl p-4 border border-white/5">
            <h2 className="text-white text-sm font-medium mb-3 text-center">
              How to continue on this device:
            </h2>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white mt-0.5">1</span>
                <span>Open your browser menu (usually <strong>⋮</strong> or <strong>Aa</strong>)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white mt-0.5">2</span>
                <span>Select <strong>"Request Desktop Site"</strong> or <strong>"Desktop site"</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white mt-0.5">3</span>
                <span>The app will automatically unlock</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // If desktop, render normal app
  return <>{children}</>;
}
