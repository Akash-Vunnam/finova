'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Compass, MessageSquare, PieChart, User } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
  { name: 'Portfolio', path: '/portfolio', icon: PieChart },
  { name: 'Discover', path: '/discover', icon: Compass },
  { name: 'AI Chat', path: '/ai-chat', icon: MessageSquare },
  { name: 'Profile', path: '/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show bottom nav on landing page or stock detail on mobile maybe? 
  // Let's show it everywhere except landing page.
  if (pathname === '/') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-finova-navy/90 backdrop-blur-lg border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around h-20 px-2 pb-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path === '/dashboard' && pathname === '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={clsx(
                "relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors z-10",
                isActive ? "text-white" : "text-white/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 mx-2 my-2 bg-finova-purple/20 border border-finova-purple/30 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
              <Icon size={22} className={isActive ? "text-finova-purple-light" : ""} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
