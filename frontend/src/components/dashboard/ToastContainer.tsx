'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, TrendingUp, AlertCircle } from 'lucide-react';

interface Toast {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
}

const mockToasts = [
  { title: "Price Alert", message: "TCS has surpassed your target price of ₹450.", type: "success" as const },
  { title: "Market Update", message: "Tech sector is showing unusually high trading volume.", type: "info" as const },
  { title: "AI Insight", message: "Portfolio volatility has increased by 12% today.", type: "alert" as const },
  { title: "Dividend Received", message: "You received ₹45.20 from RELIANCE.", type: "success" as const },
  { title: "Trending", message: "ZOMATO is trending on FinTwit with positive sentiment.", type: "info" as const },
];

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const triggerRandomToast = () => {
      const randomToast = mockToasts[Math.floor(Math.random() * mockToasts.length)];
      const newToast = { ...randomToast, id: Date.now() };
      
      setToasts(prev => [...prev, newToast]);
      
      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);

      // Schedule next toast between 25 and 45 seconds
      const nextInterval = Math.floor(Math.random() * 20000) + 25000;
      timeoutId = setTimeout(triggerRandomToast, nextInterval);
    };

    // Start the first one after 5 seconds
    timeoutId = setTimeout(triggerRandomToast, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <TrendingUp size={16} className="text-finova-green" />;
      case 'alert': return <AlertCircle size={16} className="text-finova-red" />;
      default: return <Bell size={16} className="text-finova-purple" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="w-80 bg-finova-navy-light/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl pointer-events-auto flex gap-3 group relative overflow-hidden"
          >
            {/* Type indicator line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              toast.type === 'success' ? 'bg-finova-green' : 
              toast.type === 'alert' ? 'bg-finova-red' : 'bg-finova-purple'
            }`} />

            <div className="mt-0.5 shrink-0 ml-1">
              {getIcon(toast.type)}
            </div>
            
            <div className="flex-1">
              <h4 className="text-white text-sm font-semibold mb-0.5">{toast.title}</h4>
              <p className="text-white/60 text-xs leading-relaxed">{toast.message}</p>
            </div>

            <button 
              onClick={() => removeToast(toast.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-white/40 hover:text-white rounded-md hover:bg-white/10 shrink-0 self-start"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
