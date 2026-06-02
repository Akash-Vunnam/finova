'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Activity, DollarSign, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const commands = [
  { id: 1, name: 'Search Ticker', icon: Search, shortcut: 'T', action: '/discover' },
  { id: 2, name: 'View Portfolio', icon: Activity, shortcut: 'P', action: '/portfolio' },
  { id: 3, name: 'Transfer Funds', icon: DollarSign, shortcut: 'F', action: '/dashboard' },
  { id: 4, name: 'Account Settings', icon: Settings, shortcut: 'S', action: '/profile' },
  { id: 5, name: 'Profile', icon: User, shortcut: 'U', action: '/profile' },
];

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        router.push(filteredCommands[selectedIndex].action);
        setIsOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-finova-navy/80 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-finova-navy-light/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <Search size={20} className="text-white/40" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent border-none outline-none text-white px-3 py-2 placeholder-white/40 font-medium"
                />
                <div className="flex items-center gap-1 text-[10px] font-semibold text-white/40 border border-white/10 px-1.5 py-0.5 rounded">
                  ESC
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="p-4 text-center text-white/40 text-sm">No results found.</div>
                ) : (
                  filteredCommands.map((cmd, idx) => (
                    <div
                      key={cmd.id}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => {
                        router.push(cmd.action);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                        selectedIndex === idx ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <cmd.icon size={18} className={selectedIndex === idx ? 'text-finova-purple' : ''} />
                        <span className="font-medium">{cmd.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight size={14} className={selectedIndex === idx ? 'opacity-100 text-finova-purple' : 'opacity-0'} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
