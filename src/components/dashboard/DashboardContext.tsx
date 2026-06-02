"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export type ActivityType = "BUY" | "SELL" | "DEPOSIT" | "DIVIDEND" | "ALERT";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
}

export interface Order {
  id: string;
  symbol: string;
  quantity: number;
  price: number;
  type: "INTRADAY" | "DELIVERY";
  timestamp: string;
}

export interface Alert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: "ABOVE" | "BELOW";
  methods: string[];
}

export interface Holding {
  symbol: string;
  shares: number;
  avgPrice: number;
}

interface DashboardState {
  walletBalance: number;
  recentOrders: Order[];
  activeAlerts: Alert[];
  recentActivity: Activity[];
  holdings: Holding[];
  addFunds: (amount: number) => Promise<void>;
  buyStock: (order: Omit<Order, "id" | "timestamp">) => Promise<void>;
  setAlert: (alert: Omit<Alert, "id">) => Promise<void>;
  removeAlert: (id: string) => void;
}

const DashboardContext = createContext<DashboardState | undefined>(undefined);

// Initial Mock Data
const initialHoldings: Holding[] = [
  { symbol: "RELIANCE", shares: 15, avgPrice: 2850.0 },
  { symbol: "TCS", shares: 10, avgPrice: 3800.0 },
  { symbol: "INFY", shares: 20, avgPrice: 1800.0 },
];

const initialActivity: Activity[] = [
  { id: "1", type: "BUY", title: "Bought TCS", description: "10 shares @ ₹3,847.15", timestamp: "2h ago" },
  { id: "2", type: "DEPOSIT", title: "Funds Added", description: "Added ₹50,000 to wallet", amount: 50000, timestamp: "Yesterday" },
  { id: "3", type: "SELL", title: "Sold TATAMOTORS", description: "50 shares @ ₹1,020.50", timestamp: "3 days ago" },
  { id: "4", type: "DIVIDEND", title: "Dividend Received", description: "RELIANCE - ₹150", amount: 150, timestamp: "1 week ago" },
];

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [walletBalance, setWalletBalance] = useState(125000);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>(initialActivity);
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);

  const addFunds = async (amount: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setWalletBalance((prev) => prev + amount);
        setRecentActivity((prev) => [
          {
            id: Date.now().toString(),
            type: "DEPOSIT",
            title: "Funds Added",
            description: `Added ₹${amount.toLocaleString("en-IN")} to wallet via UPI`,
            amount,
            timestamp: "Just now",
          },
          ...prev,
        ]);
        toast.success(`₹${amount.toLocaleString("en-IN")} added to your wallet successfully`);
        resolve();
      }, 1500);
    });
  };

  const buyStock = async (orderData: Omit<Order, "id" | "timestamp">) => {
    const totalCost = orderData.price * orderData.quantity;
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (walletBalance < totalCost) {
          toast.error("Insufficient funds in wallet");
          reject(new Error("Insufficient funds"));
          return;
        }

        const newOrder: Order = {
          ...orderData,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        };

        setWalletBalance((prev) => prev - totalCost);
        setRecentOrders((prev) => [newOrder, ...prev]);
        setRecentActivity((prev) => [
          {
            id: Date.now().toString(),
            type: "BUY",
            title: `Bought ${orderData.symbol}`,
            description: `${orderData.quantity} shares @ ₹${orderData.price.toLocaleString("en-IN")}`,
            timestamp: "Just now",
          },
          ...prev,
        ]);

        // Update Holdings
        setHoldings((prev) => {
          const existing = prev.find((h) => h.symbol === orderData.symbol);
          if (existing) {
            return prev.map((h) =>
              h.symbol === orderData.symbol
                ? {
                    ...h,
                    shares: h.shares + orderData.quantity,
                    avgPrice: (h.shares * h.avgPrice + totalCost) / (h.shares + orderData.quantity),
                  }
                : h
            );
          }
          return [...prev, { symbol: orderData.symbol, shares: orderData.quantity, avgPrice: orderData.price }];
        });

        toast.success(`Order placed for ${orderData.quantity} shares of ${orderData.symbol}`);
        resolve();
      }, 1500);
    });
  };

  const setAlert = async (alertData: Omit<Alert, "id">) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newAlert: Alert = {
          ...alertData,
          id: Date.now().toString(),
        };
        setActiveAlerts((prev) => [newAlert, ...prev]);
        toast.success(`Alert set for ${alertData.symbol} at ₹${alertData.targetPrice.toLocaleString("en-IN")}`);
        resolve();
      }, 1000);
    });
  };

  const removeAlert = (id: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
    toast.success("Alert removed");
  };

  return (
    <DashboardContext.Provider
      value={{
        walletBalance,
        recentOrders,
        activeAlerts,
        recentActivity,
        holdings,
        addFunds,
        buyStock,
        setAlert,
        removeAlert,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardState() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboardState must be used within a DashboardProvider");
  }
  return context;
}
