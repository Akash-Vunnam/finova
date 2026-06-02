'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Shield, Link as LinkIcon, Loader2, Building2 } from 'lucide-react';
import clsx from 'clsx';

const BROKERS = [
  { id: 'groww', name: 'Groww', color: 'text-emerald-400' },
  { id: 'indmoney', name: 'INDmoney', color: 'text-blue-400' },
  { id: 'angelone', name: 'Angel One', color: 'text-orange-400' },
  { id: 'zerodha', name: 'Zerodha', color: 'text-sky-400' },
  { id: 'upstox', name: 'Upstox', color: 'text-purple-400' },
  { id: '5paisa', name: '5paisa', color: 'text-green-500' },
  { id: 'hdfcsky', name: 'HDFC SKY', color: 'text-red-500' },
  { id: 'icicidirect', name: 'ICICI Direct', color: 'text-orange-500' },
];

interface BrokerLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkSuccess: (brokerId: string, brokerName: string) => void;
}

export default function BrokerLinkModal({ isOpen, onClose, onLinkSuccess }: BrokerLinkModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBroker, setSelectedBroker] = useState<typeof BROKERS[0] | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedBroker(null);
      setIsLinking(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const filteredBrokers = BROKERS.filter((broker) =>
    broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProceed = () => {
    if (!selectedBroker) return;
    setIsLinking(true);
    // Simulate API call to link account
    setTimeout(() => {
      setIsLinking(false);
      onLinkSuccess(selectedBroker.id, selectedBroker.name);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0B0E14] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto flex flex-col overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glowing accent top border */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-5 relative z-10">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-teal-400" />
                  Link Your Broker Account
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col min-h-[300px] relative z-10">
                <AnimatePresence mode="wait">
                  {!selectedBroker ? (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col"
                    >
                      {/* Search */}
                      <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search brokers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 sm:text-sm transition-all"
                        />
                      </div>

                      {/* Broker List */}
                      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2 max-h-[40vh]">
                        {filteredBrokers.length > 0 ? (
                          filteredBrokers.map((broker) => (
                            <button
                              key={broker.id}
                              onClick={() => setSelectedBroker(broker)}
                              className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-teal-400/30 transition-all group"
                              style={{ transform: 'translateZ(0)' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className={clsx('w-10 h-10 rounded-full bg-white/10 flex items-center justify-center', broker.color)}>
                                  <Building2 className="w-5 h-5" />
                                </div>
                                <span className="text-white font-medium group-hover:text-teal-50 transition-colors">
                                  {broker.name}
                                </span>
                              </div>
                              <span className="text-xs font-semibold text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                                Connect
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                            No brokers found.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex-1 flex flex-col justify-center text-center"
                    >
                      <div className={clsx('w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg', selectedBroker.color)}>
                        <Building2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Connect {selectedBroker.name}</h3>
                      <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
                        Finova will securely import your portfolio holdings and transaction history to power AI-driven performance analytics and unified dashboard tracking.
                      </p>
                      <div className="flex flex-col gap-3 mt-auto">
                        <button
                          onClick={handleProceed}
                          disabled={isLinking}
                          className="w-full py-3 px-4 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/50 text-teal-300 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          {isLinking ? <Loader2 className="w-5 h-5 animate-spin" /> : <LinkIcon className="w-5 h-5" />}
                          {isLinking ? 'Linking Account...' : 'Proceed to Link'}
                        </button>
                        <button
                          onClick={() => setSelectedBroker(null)}
                          disabled={isLinking}
                          className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Security Footer */}
              <div className="bg-black/20 border-t border-white/5 p-4 flex items-start gap-3 relative z-10">
                <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-tight">
                  Your credentials are never stored on our servers. We use read-only, encrypted APIs to securely access your portfolio data.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
