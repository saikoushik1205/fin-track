import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";
import { AuthContext } from "./createAuthContext";
import { 
  saveUser, 
  getUser, 
  userExists,
  saveUserProfile as saveProfile,
  getUserProfile as getProfile
} from "../services/localStorage";

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
      // Simple localStorage authentication
      const userData = getUser(email, password);
      
      if (!userData) {
        throw new Error("Invalid email or password");
      }

      setUser(userData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      console.log("✅ Email login successful");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      if (userExists(email)) {
        throw new Error("User with this email already exists");
      }

      // Create user data
      const userData: User = {
        id: `user_${Date.now()}`,
        email: email,
        name: name,
        provider: "email",
        createdAt: new Date().toISOString(),
      };

      // Save user and profile
      saveUser(userData, password);
      saveProfile(userData);
      
      console.log("✅ New user registered successfully");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
