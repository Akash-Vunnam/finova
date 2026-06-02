"use client";

import React, { useMemo } from "react";
import { Download, PieChart, TrendingUp, Activity, IndianRupee } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { useDashboardState } from "@/components/dashboard/DashboardContext";

interface ViewReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ViewReportDrawer({ isOpen, onClose }: ViewReportDrawerProps) {
  const { walletBalance, holdings, recentActivity, recentOrders } = useDashboardState();

  const totalInvested = useMemo(() => {
    return holdings.reduce((acc, h) => acc + h.shares * h.avgPrice, 0);
  }, [holdings]);

  const portfolioValue = totalInvested * 1.08; // Mock 8% return
  const totalValue = walletBalance + portfolioValue;
  const dayPnL = portfolioValue * 0.012; // Mock 1.2% day change

  // Calculate mock asset allocation
  const allocation = useMemo(() => {
    const total = holdings.reduce((acc, h) => acc + h.shares * h.avgPrice, 0);
    if (total === 0) return [];
    
    // Sort by largest holding
    const sorted = [...holdings].sort((a, b) => (b.shares * b.avgPrice) - (a.shares * a.avgPrice));
    
    // Map to percentage and color
    const colors = ["bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"];
    return sorted.slice(0, 5).map((h, i) => ({
      symbol: h.symbol,
      percent: Math.round(((h.shares * h.avgPrice) / total) * 100),
      color: colors[i % colors.length],
    }));
  }, [holdings]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Portfolio Report">
      <div className="space-y-6 pb-24">
        
        {/* Summary Card */}
        <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] rounded-full" />
          
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <IndianRupee size={16} />
            <span className="text-sm font-medium">Net Worth</span>
          </div>
          <div className="text-3xl font-bold text-white mb-4">
            ₹{totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
          
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <div>
              <div className="text-xs text-slate-400 mb-1">Day's P&L</div>
              <div className="text-emerald-400 font-semibold text-sm flex items-center gap-1">
                <TrendingUp size={14} /> +₹{dayPnL.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Total Return</div>
              <div className="text-emerald-400 font-semibold text-sm flex items-center gap-1">
                <TrendingUp size={14} /> +8.00%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Wallet</div>
              <div className="text-white font-semibold text-sm">
                ₹{walletBalance.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={18} className="text-blue-400" />
            <h3 className="text-white font-semibold">Asset Allocation</h3>
          </div>
          
          {allocation.length > 0 ? (
            <>
              <div className="h-4 w-full flex rounded-full overflow-hidden mb-4">
                {allocation.map((item) => (
                  <div key={item.symbol} className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {allocation.map((item) => (
                  <div key={item.symbol} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-slate-300 text-sm">{item.symbol}</span>
                    <span className="text-slate-400 text-xs ml-auto">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-slate-500 text-sm text-center py-4">No holdings yet.</div>
          )}
        </div>

        {/* Top Performers (Mocked) */}
        <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-emerald-400" />
            <h3 className="text-white font-semibold">Top Performers</h3>
          </div>
          <div className="space-y-3">
            {[
              { symbol: "TATAMOTORS", return: "+14.5%" },
              { symbol: "TCS", return: "+8.2%" },
              { symbol: "RELIANCE", return: "+5.1%" },
            ].map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <span className="text-slate-300 font-medium">{stock.symbol}</span>
                <span className="text-emerald-400 text-sm font-semibold">{stock.return}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-purple-400" />
            <h3 className="text-white font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {recentActivity.slice(0, 4).map((activity) => (
              <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/10 bg-slate-800 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                  <div className={`w-1.5 h-1.5 rounded-full ${activity.type === 'BUY' ? 'bg-emerald-400' : activity.type === 'DEPOSIT' ? 'bg-blue-400' : 'bg-slate-400'}`} />
                </div>
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] pl-4 md:pl-0 md:group-odd:pr-4 md:group-even:pl-4">
                  <div className="flex flex-col bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <span className="text-white text-sm font-medium">{activity.title}</span>
                    <span className="text-slate-400 text-xs">{activity.description}</span>
                    <span className="text-slate-500 text-[10px] mt-1">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Fixed Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 z-10">
        <button 
          onClick={() => {
            // Placeholder for PDF generation
            alert("PDF Generation would trigger here.");
          }}
          className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-xl px-6 py-3 transition-colors"
        >
          <Download size={18} />
          Download PDF Report
        </button>
      </div>
    </Drawer>
  );
}
