'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Link as LinkIcon, RefreshCw, Unlink, Building2, CheckCircle2 } from 'lucide-react';
import BrokerLinkModal from './BrokerLinkModal';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface LinkedAccount {
  id: string;
  brokerId: string;
  brokerName: string;
  lastSynced: Date;
}

export default function ConnectedAccounts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleLinkSuccess = (brokerId: string, brokerName: string) => {
    // Check if already linked
    if (accounts.some(a => a.brokerId === brokerId)) {
      toast.error(`${brokerName} is already linked.`);
      return;
    }

    const newAccount: LinkedAccount = {
      id: Math.random().toString(36).substr(2, 9),
      brokerId,
      brokerName,
      lastSynced: new Date(),
    };
    
    setAccounts(prev => [...prev, newAccount]);
    toast.success(`Successfully linked ${brokerName}`);
  };

  const handleUnlink = (id: string, brokerName: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    toast.info(`Unlinked ${brokerName}`);
  };

  const handleSync = (id: string, brokerName: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setAccounts(prev => 
        prev.map(a => a.id === id ? { ...a, lastSynced: new Date() } : a)
      );
      setSyncingId(null);
      toast.success(`Synced ${brokerName} successfully`);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white/90 px-1 mt-8 mb-4">Broker Integrations</h2>
      
      <GlassCard className="p-5 flex flex-col gap-4">
        {accounts.length > 0 && (
          <div className="space-y-3 mb-2">
            {accounts.map((account) => (
              <div 
                key={account.id} 
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                    <Building2 className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium">{account.brokerName}</h4>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Linked
                      </span>
                    </div>
                    <p className="text-white/40 text-xs mt-0.5">
                      Last synced: {account.lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSync(account.id, account.brokerName)}
                    disabled={syncingId === account.id}
                    className="p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 focus:outline-none"
                    title="Sync Now"
                  >
                    <RefreshCw size={16} className={syncingId === account.id ? "animate-spin text-teal-400" : ""} />
                  </button>
                  <button
                    onClick={() => handleUnlink(account.id, account.brokerName)}
                    className="p-2 rounded-lg text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors focus:outline-none"
                    title="Unlink Account"
                  >
                    <Unlink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="w-full p-4 flex items-center justify-center gap-2 rounded-xl bg-[#0B0E14] border border-white/10 text-white/90 hover:bg-white/5 hover:border-teal-500/30 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)] font-medium transition-all group focus:outline-none relative overflow-hidden"
        >
          {/* Subtle glowing hover effect from prompt */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <LinkIcon size={18} className="text-teal-400 group-hover:animate-pulse relative z-10" />
          <span className="relative z-10">Link External Account</span>
        </motion.button>
      </GlassCard>

      <BrokerLinkModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLinkSuccess={handleLinkSuccess}
      />
    </div>
  );
}
