// hooks/useAuth.ts
"use client";
import { useState, useEffect } from "react";
import { getAccessToken, getUserData } from "../lib/cookies";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const checkAuth = () => {
    const token = getAccessToken();
    const userData = getUserData();

    setIsAuthenticated(!!token);
    setUser(userData);
    setLoading(false);
  };

  return { isAuthenticated, user, loading, checkAuth };
};
