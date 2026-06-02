'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Routes that do not require authentication
const publicRoutes = ['/'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isProtectedRoute = !publicRoutes.includes(pathname);

  useEffect(() => {
    if (!loading && !isAuthenticated && isProtectedRoute) {
      router.push('/');
    }
  }, [loading, isAuthenticated, isProtectedRoute, router, pathname]);

  if (isProtectedRoute && (loading || !isAuthenticated)) {
    // Return a minimal loading state to prevent flash of protected content
    return (
      <div className="min-h-screen flex items-center justify-center bg-finova-navy">
        <div className="w-8 h-8 border-2 border-finova-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
