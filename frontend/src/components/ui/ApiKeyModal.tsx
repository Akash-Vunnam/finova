'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, X, CheckCircle, Loader2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
}

export default function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('finova_gemini_key') || '';
      setApiKey(storedKey);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    
    setIsSaving(true);
    // Simulate verification delay
    setTimeout(() => {
      localStorage.setItem('finova_gemini_key', apiKey.trim());
      setIsSaving(false);
      setIsSuccess(true);
      onSave(apiKey.trim());
      
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-finova-navy-light border border-white/10 rounded-2xl shadow-2xl p-6 pointer-events-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-finova-purple/20 text-finova-purple rounded-xl">
                    <Key size={24} />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Configure API Key</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-white/70">
                  Finova requires a Gemini API Key for AI features (Chat, Stock Verdict, Analysis). 
                  Your key is stored locally in your browser.
                </p>
                
                <div>
                  <label htmlFor="apiKey" className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Gemini API Key
                  </label>
                  <input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-finova-purple focus:ring-1 focus:ring-finova-purple transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSave}
                    disabled={!apiKey.trim() || isSaving || isSuccess}
                    className="w-full flex items-center justify-center gap-2 bg-finova-purple hover:bg-finova-purple/90 disabled:bg-finova-purple/50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98]"
                  >
                    {isSaving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : isSuccess ? (
                      <>
                        <CheckCircle size={18} />
                        <span>Saved</span>
                      </>
                    ) : (
                      'Save Key'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
