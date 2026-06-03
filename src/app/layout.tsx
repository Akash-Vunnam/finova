import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import NextTopLoader from 'nextjs-toploader';
import { headers } from "next/headers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import CommandPalette from "@/components/ui/CommandPalette";
import ConstellationBackground from "@/components/ui/ConstellationBackground";
import DesktopGuard from "@/components/layout/DesktopGuard";

export const metadata: Metadata = {
  title: "Finova - AI Investment Copilot",
  description: "Invest smarter with AI-powered insights, real-time data, and a stunning UI.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-finova-navy text-foreground selection:bg-finova-purple/30">
        <NextTopLoader color="#8b5cf6" showSpinner={false} height={3} />
        
        {/* Global ambient background */}
        <ConstellationBackground />
        
        <Providers>
          <DesktopGuard>
            <Navbar />
            <CommandPalette />
            <main className="flex-1 pb-16 md:pb-0 md:pt-16 relative z-10 page-content">
              {children}
            </main>
            <BottomNav />
          </DesktopGuard>
        </Providers>
      </body>
    </html>
  );
}
