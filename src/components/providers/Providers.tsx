'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';

import { ProfileSettingsProvider } from '@/context/ProfileSettingsContext';
import DesktopGuard from '@/components/auth/DesktopGuard';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfileSettingsProvider>
          <DesktopGuard>
            <AuthGuard>
              {children}
            </AuthGuard>
          </DesktopGuard>
          <Toaster theme="dark" position="top-right" richColors />
        </ProfileSettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
