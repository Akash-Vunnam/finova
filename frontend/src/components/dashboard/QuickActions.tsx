"use client";

import { useState } from "react";
import { Plus, TrendingUp, Bell, FileText } from "lucide-react";
import { AddFundsModal } from "@/components/modals/AddFundsModal";
import { BuyStockModal } from "@/components/modals/BuyStockModal";
import { SetAlertModal } from "@/components/modals/SetAlertModal";
import { ViewReportDrawer } from "@/components/drawers/ViewReportDrawer";

export const QuickActions = () => {
  const [activeModal, setActiveModal] = useState<"ADD_FUNDS" | "BUY_STOCK" | "SET_ALERT" | "VIEW_REPORT" | null>(null);

  const actions = [
    { 
      id: "ADD_FUNDS" as const,
      name: "Add Funds", 
      icon: Plus, 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/20" 
    },
    { 
      id: "BUY_STOCK" as const,
      name: "Buy Stock", 
      icon: TrendingUp, 
      color: "text-blue-400", 
      bg: "bg-blue-500/20" 
    },
    { 
      id: "SET_ALERT" as const,
      name: "Set Alert", 
      icon: Bell, 
      color: "text-amber-400", 
      bg: "bg-amber-500/20" 
    },
    { 
      id: "VIEW_REPORT" as const,
      name: "View Report", 
      icon: FileText, 
      color: "text-purple-400", 
      bg: "bg-purple-500/20" 
    },
  ];

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
        <h3 className="mb-4 text-lg font-semibold text-white">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => setActiveModal(action.id)}
              className="flex flex-col items-center justify-center gap-2 bg-slate-700/40 hover:bg-slate-700/60 border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 group active:scale-95"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${action.bg}`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <span className="text-slate-300 text-xs font-medium group-hover:text-white transition-colors">
                {action.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AddFundsModal isOpen={activeModal === "ADD_FUNDS"} onClose={() => setActiveModal(null)} />
      <BuyStockModal isOpen={activeModal === "BUY_STOCK"} onClose={() => setActiveModal(null)} />
      <SetAlertModal isOpen={activeModal === "SET_ALERT"} onClose={() => setActiveModal(null)} />
      <ViewReportDrawer isOpen={activeModal === "VIEW_REPORT"} onClose={() => setActiveModal(null)} />
    </>
  );
};
