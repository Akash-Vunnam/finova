"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  getIdToken as firebaseGetIdToken
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { toast } from "sonner";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (isSigningIn) return;
    
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Store or update user info in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      } else {
        await setDoc(userRef, {
          lastLoginAt: serverTimestamp(),
        }, { merge: true });
      }

      toast.success("Signed in successfully");
    } catch (error: any) {
      console.error("Auth error:", error);
      
      if (error.code === 'auth/cancelled-popup-request') {
        // User closed the popup before finishing, or we triggered a duplicate request - just silently ignore it
        return;
      }
      
      if (error.code === 'auth/popup-blocked') {
        toast.error("Popup blocked. Please allow popups for this site.");
      } else {
        toast.error("Authentication failed. Please try again.");
      }
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out");
    }
  };

  const getIdToken = async () => {
    if (user) {
      return await firebaseGetIdToken(user);
    }
    return null;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signInWithGoogle,
    logout,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
