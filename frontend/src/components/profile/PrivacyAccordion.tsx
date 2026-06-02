"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown, Lock, Key, Clock, AlertTriangle, History, ArrowUpRight, ShieldCheck, Loader2 } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { deleteUser } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function PrivacyAccordion() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const isGoogleUser = user?.providerData?.some(p => p.providerId === "google.com") ?? false;
  const isPasswordUser = user?.providerData?.some(p => p.providerId === "password") ?? false;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }
    
    if (!user) return;

    setIsDeleting(true);
    try {
      await deleteUser(user);
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        toast.error("Please re-authenticate before deleting your account");
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-4 bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-xl hover:bg-slate-800/60 hover:border-white/10 transition-all group focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center">
            <Shield className="w-5 h-5 text-slate-300" />
          </div>
          <div className="text-left">
            <p className="text-white font-medium">Privacy & Security</p>
            <p className="text-slate-400 text-xs">Password, 2FA, login history</p>
          </div>
        </div>
        <ChevronDown
          className={clsx(
            "w-5 h-5 text-slate-500 transition-transform duration-300",
            isOpen ? "rotate-180 text-white" : "group-hover:text-white"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 mt-2 space-y-4 bg-white/[0.02] border border-white/5 rounded-xl">
              
              {/* Password Section */}
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="text-slate-400" size={18} />
                  <div>
                    <p className="text-sm font-medium text-white">Password</p>
                    <p className="text-xs text-slate-400">
                      {isGoogleUser ? "Managed by Google Authentication" : "Change your password"}
                    </p>
                  </div>
                </div>
                {isGoogleUser ? (
                  <span className="text-xs font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md">GOOGLE AUTH</span>
                ) : isPasswordUser ? (
                  <button 
                    onClick={() => toast.info("Password change flow would open here")}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    Change
                  </button>
                ) : (
                  <span className="text-xs font-bold bg-slate-500/20 text-slate-400 px-2 py-1 rounded-md">EXTERNAL AUTH</span>
                )}
              </div>

              {/* 2FA Section */}
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {isGoogleUser ? <ShieldCheck className="text-emerald-400" size={18} /> : <Key className="text-slate-400" size={18} />}
                  <div>
                    <p className="text-sm font-medium text-white">Two-Factor Auth</p>
                    <p className="text-xs text-slate-400">
                      {isGoogleUser ? "Secured by your Google Account" : "Add extra security to your account"}
                    </p>
                  </div>
                </div>
                {isGoogleUser ? (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-3 py-1 text-xs font-bold">ACTIVE</span>
                ) : (
                  <button 
                    onClick={() => toast.info("2FA Setup coming soon")}
                    className="bg-emerald-500 text-slate-900 font-semibold rounded-lg px-4 py-1.5 text-xs hover:bg-emerald-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    Enable
                  </button>
                )}
              </div>

              {/* Login History */}
              <div className="flex flex-col items-center justify-center py-6 text-center bg-slate-800/50 rounded-lg">
                <History className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-slate-400 text-sm">Login history is managed by your authentication provider.</p>
                <p className="text-slate-500 text-xs mt-1">
                  {isGoogleUser 
                    ? "View active sessions in your Google Account." 
                    : "Session tracking coming soon."}
                </p>
                {isGoogleUser && (
                  <a 
                    href="https://myaccount.google.com/security" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-3 text-emerald-400 text-xs font-medium hover:text-emerald-300 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-1"
                  >
                    Open Google Security <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Danger Zone */}
              <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-rose-400">
                  <AlertTriangle size={18} />
                  <p className="text-sm font-bold uppercase tracking-wider">Danger Zone</p>
                </div>
                <p className="text-xs text-rose-400/80 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type DELETE"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="flex-1 bg-rose-950/50 border border-rose-500/30 rounded-lg px-3 py-2 text-sm text-rose-200 placeholder-rose-500/50 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                  <button
                    disabled={deleteConfirmText !== "DELETE" || isDeleting}
                    onClick={handleDelete}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50 flex items-center justify-center min-w-[140px]"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete My Account"}
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
