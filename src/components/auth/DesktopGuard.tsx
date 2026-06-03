'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import DesktopOnly from '@/components/ui/DesktopOnly';

const publicRoutes = ['/', '/desktop-locked'];

export default function DesktopGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isProtectedRoute = !publicRoutes.includes(pathname);

  useEffect(() => {
    setMounted(true);
    
    const checkDevice = () => {
      // 1024px is a common desktop breakpoint (Tailwind 'lg')
      if (window.innerWidth < 1024) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Initial check
    checkDevice();

    // Listen to resize
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Avoid hydration mismatch by waiting for mount
  if (!mounted) {
    return <>{children}</>;
  }

  // If mobile and on protected route, show the lock screen
  if (isMobile && isProtectedRoute) {
    return (
      <>
        {/* We still render children to maintain state, but visually block it with the full-screen overlay */}
        <DesktopOnly />
        {/* Hidden children to prevent layout shifts or unmounting issues */}
        <div className="hidden">{children}</div>
      </>
    );
  }

  return <>{children}</>;
}
