"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useProfileSettings } from "@/context/ProfileSettingsContext";

export default function UserMenu() {
  const { user } = useAuth();
  const { profile } = useProfileSettings();

  if (!user) return null;

  return (
    <Link
      href="/profile"
      className="relative w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-[1.08] focus:outline-none ring-2 ring-emerald-500/50 cursor-none block"
    >
      {profile.photoURL ? (
        <Image 
          src={profile.photoURL} 
          alt={profile.displayName || "User"} 
          width={40} 
          height={40} 
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
          <UserIcon size={18} className="text-white/80" />
        </div>
      )}
    </Link>
  );
}
