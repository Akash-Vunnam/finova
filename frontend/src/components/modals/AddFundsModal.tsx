"use client";

import React, { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useDashboardState } from "@/components/dashboard/DashboardContext";

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFundsModal({ isOpen, onClose }: AddFundsModalProps) {
  const { addFunds } = useDashboardState();
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<"UPI" | "NET_BANKING" | "CARD">("UPI");
  const [isLoading, setIsLoading] = useState(false);

  const quickAmounts = [500, 1000, 5000, 10000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/,/g, ""));
    
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsLoading(true);
    try {
      await addFunds(numAmount);
      onClose();
      setAmount("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Funds">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Amount to add</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg">₹</span>
            <input
              type="text"
              required
              value={amount}
              onChange={(e) => {
                const val = e.target.value.replace(/[^\d]/g, "");
                setAmount(val ? Number(val).toLocaleString("en-IN") : "");
              }}
              className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono text-lg"
              placeholder="0"
            />
          </div>
        </div>

        {/* Quick Amounts */}
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmount(amt.toLocaleString("en-IN"))}
              className="bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-full px-3 py-1 text-xs text-slate-300 transition-colors"
            >
              + ₹{amt.toLocaleString("en-IN")}
            </button>
          ))}
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Payment Method</label>
          <div className="flex p-1 bg-slate-800 rounded-lg border border-white/5">
            {["UPI", "NET_BANKING", "CARD"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m as any)}
                className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                  method === m
                    ? "bg-emerald-500 text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {m.replace("_", " ")}
              </button>
            ))}
          </div>
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
            disabled={isLoading || !amount || parseFloat(amount.replace(/,/g, "")) <= 0}
            className="flex items-center justify-center min-w-[120px] bg-emerald-500 text-slate-900 font-bold hover:bg-emerald-400 rounded-lg px-6 py-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Funds"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
