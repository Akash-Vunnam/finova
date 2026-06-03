'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import DesktopOnlyUI from '@/components/ui/DesktopOnlyUI';

export default function DesktopGuard({ children }: { children: React.ReactNode }) {
  // Start with false to prevent SSR hydration mismatch.
  // We'll update it immediately on the client if it's a mobile viewport.
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      // 1024px is standard desktop breakpoint (Tailwind lg)
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkScreenSize();

    // Listen for window resize
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Allowed public routes where mobile is permitted
  const isPublicRoute = pathname === '/' || pathname === '/desktop-locked';

  if (isMobile && !isPublicRoute) {
    return <DesktopOnlyUI />;
  }

  return <>{children}</>;
}
