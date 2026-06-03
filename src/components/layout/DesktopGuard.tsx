'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DesktopOnlyUI from '@/components/ui/DesktopOnlyUI';

export default function DesktopGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // The only route that naturally shows the lock screen without the guard wrapper.
  const isPublicRoute = pathname === '/desktop-locked';

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {/* 
        Show lock screen below 980px. 
        Mobile browsers in "Desktop Site" mode typically set viewport to 980px.
        Tablets in portrait are typically 768px/820px, which will remain blocked.
      */}
      <div className="block min-[980px]:hidden fixed inset-0 z-[99999] bg-finova-navy">
        <DesktopOnlyUI />
      </div>
      
      {/* Show app content at 980px and above */}
      <div className="hidden min-[980px]:block h-full w-full">
        {children}
      </div>
    </>
  );
}
