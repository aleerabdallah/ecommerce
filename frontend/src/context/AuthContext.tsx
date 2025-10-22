// context/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAccessToken,
  getUserData,
  clearAuthData,
  setAuthCookie,
  setUserData,
} from "../lib/cookies";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (token: string, userData: any) => void;
  googleLogin: (accessToken: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = getAccessToken();
    const userData = getUserData();

    setIsAuthenticated(!!token);
    setUser(userData);
    setLoading(false);
  };

  const login = (token: string, userData: any) => {
    setAuthCookie(token);
    setUserData(userData);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const googleLogin = async (accessToken: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/google/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            access_token: accessToken,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.non_field_errors?.[0] || "Google login failed",
        );
      }

      const data = await response.json();

      // Store access token in frontend cookie
      if (data.access) {
        setAuthCookie(data.access);
      }

      // Store user data if available
      if (data.user) {
        setUserData(data.user);
      }

      setIsAuthenticated(true);
      setUser(data.user);

      return data;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        googleLogin,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
