"use client";

import { Check } from "lucide-react";
import clsx from "clsx";

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: (state: boolean) => void;
  ariaLabel: string;
}

export default function ToggleSwitch({ enabled, onToggle, ariaLabel }: ToggleSwitchProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(!enabled);
    }
  };

  return (
    <button
      onClick={() => onToggle(!enabled)}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      role="switch"
      aria-checked={enabled}
      tabIndex={0}
      className={clsx(
        "relative w-12 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 focus:ring-offset-[#0a0f1c]",
        enabled ? "bg-emerald-500" : "bg-slate-700"
      )}
    >
      <span
        className={clsx(
          "absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center",
          enabled ? "translate-x-5" : "translate-x-0"
        )}
      >
        {enabled && <Check className="w-3.5 h-3.5 text-emerald-600" />}
      </span>
    </button>
  );
}
