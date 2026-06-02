"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Loader2, Search, Bell, Minus, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { useDashboardState } from "@/components/dashboard/DashboardContext";

interface SetAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2934.50, change: 1.2 },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3847.15, change: 0.8 },
  { symbol: "INFY", name: "Infosys Ltd", price: 1856.20, change: -0.5 },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1543.80, change: -1.1 },
  { symbol: "TATAMOTORS", name: "Tata Motors", price: 1035.75, change: 2.1 },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1120.40, change: 0.3 },
  { symbol: "SBIN", name: "State Bank of India", price: 845.60, change: -0.2 },
  { symbol: "WIPRO", name: "Wipro Ltd", price: 485.25, change: -2.3 },
];

export function SetAlertModal({ isOpen, onClose }: SetAlertModalProps) {
  const { setAlert, activeAlerts, removeAlert } = useDashboardState();
  const [search, setSearch] = useState("");
  const [selectedStock, setSelectedStock] = useState<typeof MOCK_STOCKS[0] | null>(null);
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [condition, setCondition] = useState<"ABOVE" | "BELOW">("ABOVE");
  const [methods, setMethods] = useState<string[]>(["Push Notification"]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setSelectedStock(null);
      setTargetPrice("");
      setCondition("ABOVE");
      setMethods(["Push Notification"]);
    }
  }, [isOpen]);

  const filteredStocks = useMemo(() => {
    if (!search) return MOCK_STOCKS;
    return MOCK_STOCKS.filter((s) => 
      s.symbol.toLowerCase().includes(search.toLowerCase()) || 
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleStockSelect = (stock: typeof MOCK_STOCKS[0]) => {
    setSelectedStock(stock);
    setSearch("");
    setShowDropdown(false);
  };

  const toggleMethod = (method: string) => {
    setMethods((prev) => 
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(targetPrice.replace(/,/g, ""));
    if (!selectedStock || isNaN(numPrice) || numPrice <= 0 || methods.length === 0) return;

    setIsLoading(true);
    try {
      await setAlert({
        symbol: selectedStock.symbol,
        targetPrice: numPrice,
        condition,
        methods,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Price Alert" className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Stock Selection */}
        <div className="relative z-20">
          <label className="block text-sm font-medium text-slate-400 mb-2">Search Stock</label>
          {!selectedStock ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search symbol or company name"
                className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
              />
              
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto custom-scrollbar"
                  >
                    {filteredStocks.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500">No stocks found</div>
                    ) : (
                      filteredStocks.map((stock) => (
                        <button
                          key={stock.symbol}
                          type="button"
                          onClick={() => handleStockSelect(stock)}
                          className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                        >
                          <div>
                            <div className="font-bold text-white text-sm">{stock.symbol}</div>
                            <div className="text-xs text-slate-400">{stock.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm text-white">₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                            <div className={`text-xs flex items-center justify-end gap-1 ${stock.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                              {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(stock.change)}%
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl relative group">
              <div>
                <div className="font-bold text-white">{selectedStock.symbol}</div>
                <div className="text-sm text-slate-400">{selectedStock.name}</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-semibold text-white">₹{selectedStock.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                <div className={`text-sm flex items-center justify-end gap-1 ${selectedStock.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {selectedStock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {Math.abs(selectedStock.change)}%
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStock(null)}
                className="absolute -top-2 -right-2 bg-slate-800 border border-white/10 text-slate-400 hover:text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Minus size={14} />
              </button>
            </div>
          )}
        </div>

        <div className={`space-y-6 transition-opacity duration-300 ${!selectedStock ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
          <div className="grid grid-cols-2 gap-4 relative z-10">
            {/* Condition Toggle */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Condition</label>
              <div className="flex p-1 bg-slate-800 rounded-lg border border-white/5 h-[46px]">
                {["ABOVE", "BELOW"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c as any)}
                    className={`flex-1 text-xs font-medium rounded-md transition-all ${
                      condition === c
                        ? "bg-amber-500 text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    Price {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Price */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Target Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <input
                  type="text"
                  required
                  value={targetPrice}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d.]/g, "");
                    setTargetPrice(val);
                  }}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Notification Methods */}
          <div className="relative z-10">
            <label className="block text-sm font-medium text-slate-400 mb-3">Notify via</label>
            <div className="flex flex-wrap gap-2">
              {["Push Notification", "Email", "SMS"].map((method) => {
                const isActive = methods.includes(method);
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => toggleMethod(method)}
                    className={`px-4 py-2 rounded-full border text-xs font-medium transition-colors flex items-center gap-2 ${
                      isActive 
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-400" 
                        : "bg-slate-800 border-white/10 text-slate-400 hover:text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${isActive ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" : "bg-slate-500"}`} />
                    {method}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Alerts Preview (Bonus) */}
        {activeAlerts.length > 0 && (
          <div className="pt-6 border-t border-white/10 mt-6 relative z-0">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Active Alerts</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
              {activeAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between bg-slate-800/50 border border-white/5 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <span className="text-white text-sm font-medium mr-1">{alert.symbol}</span>
                      <span className="text-slate-400 text-xs">{alert.condition.toLowerCase()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 text-sm font-mono font-medium">₹{alert.targetPrice.toLocaleString("en-IN")}</span>
                    <button type="button" onClick={() => removeAlert(alert.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 relative z-10">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="bg-transparent border border-white/10 text-slate-300 hover:bg-white/5 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !selectedStock || !targetPrice || parseFloat(targetPrice) <= 0 || methods.length === 0}
            className="flex items-center justify-center min-w-[120px] bg-amber-500 text-slate-900 font-bold hover:bg-amber-400 rounded-lg px-6 py-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Set Alert"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
