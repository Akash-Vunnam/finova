"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useProfileSettings } from "@/context/ProfileSettingsContext";
import { toast } from "sonner";

export default function EditableName() {
  const { profile, updateProfile } = useProfileSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setValue(profile.displayName);
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed.length < 2 || trimmed.length > 30) {
      toast.error("Name must be between 2 and 30 characters.");
      return;
    }
    updateProfile({ displayName: trimmed });
    setIsEditing(false);
    toast.success("Display name updated!");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-slate-800 border border-emerald-500/50 rounded-lg px-3 py-1 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 w-64"
        />
        <button
          onClick={handleSave}
          aria-label="Save name"
          className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <Check size={18} />
        </button>
        <button
          onClick={handleCancel}
          aria-label="Cancel editing"
          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <h2 className="text-2xl font-bold text-white tracking-widest drop-shadow-md uppercase">
        {profile.displayName}
      </h2>
      <button
        onClick={handleStartEdit}
        aria-label="Edit display name"
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      >
        <Pencil size={16} />
      </button>
    </div>
  );
}
