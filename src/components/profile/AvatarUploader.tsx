"use client";

import { useState, useRef } from "react";
import { Camera, Trash, User } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileSettings } from "@/context/ProfileSettingsContext";
import { toast } from "sonner";

export default function AvatarUploader() {
  const { profile, updateProfile } = useProfileSettings();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error("Image must be smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateProfile({ photoURL: event.target.result as string });
        toast.success("Profile photo updated successfully!");
        setIsOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    updateProfile({ photoURL: "" });
    toast.success("Profile photo removed.");
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change profile photo"
        className="relative group focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-full transition-transform hover:scale-105"
      >
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-emerald-500/50 transition-colors">
          {profile.photoURL ? (
            <Image
              src={profile.photoURL}
              alt="Profile avatar"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <User size={24} className="text-white/80" />
            </div>
          )}
        </div>
        <div className="absolute bottom-0 right-0 bg-emerald-500 text-slate-900 rounded-full p-1 shadow-lg pointer-events-none">
          <Camera size={14} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Invisible backdrop to close popover */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl p-2 shadow-2xl z-50 w-48 flex flex-col gap-1"
            >
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <Camera size={16} />
                Upload New Photo
              </button>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <button
                onClick={handleRemovePhoto}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              >
                <Trash size={16} />
                Remove Photo
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
