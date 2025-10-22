// components/Layout/Navbar.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken, getUserData, clearAuthData } from "../../lib/cookies";
import { logout } from "../../lib/api";
import Swal from "sweetalert2";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = getAccessToken();
    const userData = getUserData();

    setIsAuthenticated(!!token);
    setUser(userData);
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();

      Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#00E0B8",
        background: "#0B0F19",
        color: "#FFFFFF",
        customClass: {
          popup: "bg-[#0B0F19] border border-[#2A3242]",
          confirmButton:
            "bg-[#00E0B8] text-[#0B0F19] font-semibold px-4 py-2 rounded-md hover:opacity-90 transition",
        },
      }).then(() => {
        setIsAuthenticated(false);
        setUser(null);
        setShowDropdown(false);
        router.push("/");
        router.refresh();
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Force clear auth data even if API call fails
      clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
      setShowDropdown(false);
      router.push("/");
    }
  };

  const confirmLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF3B30",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
      background: "#0B0F19",
      color: "#FFFFFF",
      customClass: {
        popup: "bg-[#0B0F19] border border-[#2A3242]",
        confirmButton:
          "bg-[#FF3B30] text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition",
        cancelButton:
          "bg-[#6B7280] text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  if (loading) {
    return (
      <nav className="bg-[#0B0F19] border-b border-[#2A3242] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-white">
                Your Logo
              </Link>
            </div>
            <div className="w-8 h-8 border-2 border-[#00E0B8] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#0B0F19] border-b border-[#2A3242] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-[#00E0B8] transition"
            >
              Shop
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition ${
                pathname === "/"
                  ? "text-[#00E0B8]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium transition ${
                pathname === "/products"
                  ? "text-[#00E0B8]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Products
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition ${
                pathname === "/about"
                  ? "text-[#00E0B8]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className={`text-sm font-medium px-4 py-2 rounded-md transition ${
                    pathname === "/login"
                      ? "bg-[#00E0B8] text-[#0B0F19]"
                      : "text-gray-300 hover:text-white border border-[#2A3242] hover:border-[#00E0B8]"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`text-sm font-medium px-4 py-2 rounded-md transition ${
                    pathname === "/signup"
                      ? "bg-[#00E0B8] text-[#0B0F19]"
                      : "bg-[#00E0B8] text-[#0B0F19] hover:opacity-90"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md border border-[#2A3242] hover:border-[#00E0B8] transition"
                >
                  {user?.first_name || user?.email ? (
                    <>
                      <div className="w-8 h-8 bg-[#00E0B8] rounded-full flex items-center justify-center text-[#0B0F19] text-sm font-bold">
                        {getInitials(
                          user.first_name || "",
                          user.last_name || "",
                        )}
                      </div>
                      <span className="text-sm text-white hidden sm:block">
                        {user.first_name || user.email}
                      </span>
                    </>
                  ) : (
                    <div className="w-8 h-8 bg-[#00E0B8] rounded-full flex items-center justify-center text-[#0B0F19] text-sm font-bold">
                      U
                    </div>
                  )}
                  <svg
                    className={`w-4 h-4 text-gray-300 transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1F2E] border border-[#2A3242] rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-[#2A3242]">
                      <p className="text-sm text-white font-medium">
                        {user?.first_name && user?.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user?.email}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2A3242] hover:text-white transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>

                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2A3242] hover:text-white transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      My Orders
                    </Link>

                    <div className="border-t border-[#2A3242]">
                      <button
                        onClick={confirmLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2A3242] hover:text-red-300 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4">
          <div className="flex space-x-4">
            <Link
              href="/"
              className={`text-sm font-medium transition ${
                pathname === "/"
                  ? "text-[#00E0B8]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium transition ${
                pathname === "/products"
                  ? "text-[#00E0B8]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Products
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition ${
                pathname === "/about"
                  ? "text-[#00E0B8]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </nav>
  );
}
