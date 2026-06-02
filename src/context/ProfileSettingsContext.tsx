"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type UserProfile = {
  displayName: string;
  email: string;
  photoURL: string;
  memberSince: string;
  plan: "BLACK" | "GOLD" | "SILVER" | "FREE";
  pushNotifications: boolean;
  autoAIAnalysis: boolean;
  theme: "dark" | "light";
};

type ProfileSettingsContextType = {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
};

const defaultProfile: UserProfile = {
  displayName: "User",
  email: "",
  photoURL: "",
  memberSince: "2024-01-01T00:00:00Z",
  plan: "BLACK",
  pushNotifications: true,
  autoAIAnalysis: true,
  theme: "dark",
};

const ProfileSettingsContext = createContext<ProfileSettingsContextType | undefined>(undefined);

export const ProfileSettingsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage and sync with Firebase Auth
  useEffect(() => {
    const saved = localStorage.getItem("finova_profile_settings");
    let initialProfile = { ...defaultProfile };

    if (saved) {
      try {
        initialProfile = { ...initialProfile, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Failed to parse saved profile settings", e);
      }
    }

    if (user) {
      // Auth overrides if not set locally, or if email changes
      if (!initialProfile.displayName || initialProfile.displayName === "User") {
        initialProfile.displayName = user.displayName || "Finova User";
      }
      if (!initialProfile.photoURL) {
        initialProfile.photoURL = user.photoURL || "";
      }
      initialProfile.email = user.email || "";
      if (user.metadata.creationTime) {
        initialProfile.memberSince = user.metadata.creationTime;
      }
    }

    setProfile(initialProfile);
    setIsLoaded(true);
  }, [user]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("finova_profile_settings", JSON.stringify(next));
      return next;
    });
  };

  return (
    <ProfileSettingsContext.Provider value={{ profile, updateProfile }}>
      {/* Wait for initial load to avoid hydration mismatch if needed, but for context we can provide immediately */}
      {children}
    </ProfileSettingsContext.Provider>
  );
};

export const useProfileSettings = () => {
  const context = useContext(ProfileSettingsContext);
  if (context === undefined) {
    throw new Error("useProfileSettings must be used within a ProfileSettingsProvider");
  }
  return context;
};
