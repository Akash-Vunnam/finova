'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, User, Settings, X, PieChart, Clock, Building2 } from 'lucide-react';

const POPULAR_STOCKS = [
  { symbol: 'RELIANCE', name: 'Apple Inc.', sector: 'Technology' },
  { symbol: 'INFY', name: 'Microsoft Corp.', sector: 'Technology' },
  { symbol: 'TCS', name: 'NVIDIA Corp.', sector: 'Technology' },
  { symbol: 'TATAMOTORS', name: 'Tesla Inc.', sector: 'Automotive' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication Services' },
  { symbol: 'HDFCBANK', name: 'Meta Platforms Inc.', sector: 'Communication Services' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financials' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials' },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financials' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<typeof POPULAR_STOCKS>([]);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    
    try {
      const stored = localStorage.getItem('finova_recent_searches');
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) {}

    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const handleSelectStock = (stock: typeof POPULAR_STOCKS[0]) => {
    const newRecent = [stock, ...recentSearches.filter(s => s.symbol !== stock.symbol)].slice(0, 3);
    setRecentSearches(newRecent);
    try {
      localStorage.setItem('finova_recent_searches', JSON.stringify(newRecent));
    } catch (e) {}
    
    runCommand(() => router.push(`/stock/${stock.symbol.toLowerCase()}`));
  };

  return (
    <AnimatePresence>
      {open && (
        <Command.Dialog
          open={open}
          onOpenChange={setOpen}
          label="Global Command Menu"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-[10vh]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-finova-navy/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-finova-navy-light/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <Command className="w-full flex flex-col" shouldFilter={true}>
              <div className="flex items-center px-4 border-b border-white/10">
                <Search className="w-5 h-5 text-white/50" />
                <Command.Input
                  placeholder="Search stocks, navigate, or ask AI..."
                  className="w-full bg-transparent p-4 text-white placeholder-white/40 focus:outline-none focus:ring-0"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                <Command.Empty className="py-6 text-center text-sm text-white/50">
                  No results found.
                </Command.Empty>

                {recentSearches.length > 0 && (
                  <Command.Group heading="Recent Searches" className="text-xs text-white/40 px-2 py-1">
                    {recentSearches.map((stock) => (
                      <Command.Item
                        key={`recent-${stock.symbol}`}
                        value={stock.symbol + " " + stock.name}
                        onSelect={() => handleSelectStock(stock)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-sm text-white/80 aria-selected:bg-finova-purple/20 aria-selected:text-white transition-colors"
                      >
                        <Clock className="w-4 h-4 text-white/40" />
                        <div className="flex flex-col flex-1">
                          <span className="font-medium text-white">{stock.name}</span>
                          <span className="text-xs text-white/50">{stock.symbol} &middot; {stock.sector}</span>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                <Command.Group heading="Stocks" className="text-xs text-white/40 px-2 py-1 mt-2">
                  {POPULAR_STOCKS.map((stock) => (
                    <Command.Item
                      key={stock.symbol}
                      value={stock.symbol + " " + stock.name}
                      onSelect={() => handleSelectStock(stock)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-sm text-white/80 aria-selected:bg-finova-purple/20 aria-selected:text-white transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white font-medium text-[10px]">
                        {stock.symbol}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="font-medium text-white">{stock.name}</span>
                        <span className="text-xs text-white/50">{stock.sector}</span>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Separator className="h-[1px] bg-white/10 my-2 mx-2" />

                <Command.Group heading="Navigation" className="text-xs text-white/40 px-2 py-1">
                  <Command.Item
                    value="dashboard home"
                    onSelect={() => runCommand(() => router.push('/dashboard'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-white/80 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Command.Item>
                  <Command.Item
                    value="portfolio investments"
                    onSelect={() => runCommand(() => router.push('/portfolio'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-white/80 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                  >
                    <PieChart className="w-4 h-4" />
                    <span>Portfolio</span>
                  </Command.Item>
                  <Command.Item
                    value="profile user account"
                    onSelect={() => runCommand(() => router.push('/profile'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-white/80 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Command.Item>
                  <Command.Item
                    value="settings configuration"
                    onSelect={() => runCommand(() => router.push('/settings'))}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-white/80 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </Command.Dialog>
      )}
    </AnimatePresence>
  );
}
