"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Loader2, Search, TrendingUp, TrendingDown, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { useDashboardState } from "@/components/dashboard/DashboardContext";

interface BuyStockModalProps {
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

export function BuyStockModal({ isOpen, onClose }: BuyStockModalProps) {
  const { buyStock, walletBalance } = useDashboardState();
  const [search, setSearch] = useState("");
  const [selectedStock, setSelectedStock] = useState<typeof MOCK_STOCKS[0] | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [orderType, setOrderType] = useState<"INTRADAY" | "DELIVERY">("DELIVERY");
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setSelectedStock(null);
      setQuantity(1);
      setOrderType("DELIVERY");
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

  const totalEstimate = selectedStock ? selectedStock.price * quantity : 0;
  const isInsufficientFunds = totalEstimate > walletBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock || quantity <= 0 || isInsufficientFunds) return;

    setIsLoading(true);
    try {
      await buyStock({
        symbol: selectedStock.symbol,
        quantity,
        price: selectedStock.price,
        type: orderType,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buy Stock" className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Stock Selection */}
        <div className="relative">
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
                className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
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
            <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl relative group">
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

        {/* Order Details */}
        <div className={`grid grid-cols-2 gap-4 transition-opacity duration-300 ${!selectedStock ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Quantity</label>
            <div className="flex items-center bg-slate-800 border border-white/10 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-transparent text-center font-mono text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Order Type</label>
            <div className="flex p-1 bg-slate-800 rounded-lg border border-white/5 h-[46px]">
              {["DELIVERY", "INTRADAY"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setOrderType(t as any)}
                  className={`flex-1 text-xs font-medium rounded-md transition-all ${
                    orderType === t
                      ? "bg-blue-500 text-slate-900 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Available Balance</span>
            <span className="text-white font-mono font-medium">₹{walletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Estimated Cost</span>
            <span className="text-emerald-400 font-mono font-bold text-lg">₹{totalEstimate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          {isInsufficientFunds && selectedStock && (
            <p className="text-rose-400 text-xs mt-2 text-right">Insufficient funds</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
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
            disabled={isLoading || !selectedStock || quantity <= 0 || isInsufficientFunds}
            className="flex items-center justify-center min-w-[120px] bg-emerald-500 text-slate-900 font-bold hover:bg-emerald-400 rounded-lg px-6 py-2.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buy Now"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
