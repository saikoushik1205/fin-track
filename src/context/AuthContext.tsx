import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";
import { AuthContext } from "./createAuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { getUserProfile, saveUserProfile } from "../services/firestore";
import { waitForFirestoreConnection } from "../utils/firestoreConnection";

const AUTH_STORAGE_KEY = "fintrack_auth_user";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear any stored session on app start - user must login fresh
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication - In production, validate against backend
      const storedUsers = JSON.parse(
        localStorage.getItem("fintrack_users") || "[]"
      );
      const foundUser = storedUsers.find(
        (u: { email: string; password: string }) =>
          u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error("Invalid email or password");
      }

      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        provider: "email",
      };

      setUser(userData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock registration - In production, send to backend
      const storedUsers = JSON.parse(
        localStorage.getItem("fintrack_users") || "[]"
      );

      // Check if user already exists
      if (storedUsers.some((u: { email: string }) => u.email === email)) {
        throw new Error("User already exists");
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In production, never store plain passwords
        name,
      };

      storedUsers.push(newUser);
      localStorage.setItem("fintrack_users", JSON.stringify(storedUsers));

      // Don't auto-login after registration - user will be redirected to login page
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      console.log("Starting Google sign-in...");
      // Real Google OAuth using Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      console.log("Firebase user authenticated:", firebaseUser.uid);

      // Create user data immediately from Firebase Auth - INSTANT LOGIN
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || "User",
        avatar: firebaseUser.photoURL || undefined,
        provider: "google",
        createdAt: new Date().toISOString(),
      };

      // Login user immediately - no waiting!
      setUser(userData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      console.log("✅ User logged in successfully (instant)");

      // Load/sync profile in background (non-blocking)
      syncUserProfile(firebaseUser.uid, userData);
    } catch (error: unknown) {
      console.error("Google sign-in error:", error);
      // Handle specific error cases
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === "auth/popup-closed-by-user") {
        throw new Error("Sign-in cancelled");
      } else if (firebaseError.code === "auth/popup-blocked") {
        throw new Error("Popup blocked. Please allow popups for this site.");
      } else {
        throw new Error(
          `Failed to sign in with Google: ${
            firebaseError.message || "Unknown error"
          }`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Background profile sync - doesn't block login
  const syncUserProfile = async (userId: string, fallbackData: User) => {
    try {
      console.log("🔄 Syncing profile in background...");
      const isConnected = await waitForFirestoreConnection(1);

      if (isConnected) {
        // Try to load existing profile
        const existingProfile = await getUserProfile(userId);

        if (existingProfile) {
          // Update with stored profile (preserves createdAt date)
          setUser(existingProfile);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(existingProfile));
          console.log("✅ Loaded existing profile from Firestore");
        } else {
          // Save new profile
          await saveUserProfile(fallbackData);
          console.log("✅ Saved new profile to Firestore");
        }
      } else {
        console.warn("⚠️ Firestore offline - will sync when online");
      }
    } catch (error) {
      console.warn("⚠️ Background profile sync failed:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
