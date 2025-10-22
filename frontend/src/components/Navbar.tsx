// components/Navbar.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Example: fetch session from backend
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/user/`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
      <h1 className="text-4xl font-bold tracking-tight text-[#00E0B8]">
        Shoply
      </h1>
      {user ? (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 bg-[#141A26] px-4 py-2 rounded-md border border-[#2A3242] hover:border-[#00E0B8]/50"
          >
            <User size={18} /> {user.first_name || "Account"}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-[#141A26] border border-[#2A3242] rounded-md shadow-lg w-40 text-sm z-50">
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-[#1A2234]"
              >
                Profile
              </Link>
              <button
                onClick={async () => {
                  await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE}/auth/logout/`,
                    {
                      method: "POST",
                      credentials: "include",
                    },
                  );
                  setUser(null);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-[#1A2234]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <nav className="flex gap-4 text-sm">
          <Link
            href="/login"
            className="px-4 py-2 rounded-md bg-[#00E0B8] text-[#0B0F19] font-medium hover:opacity-90 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-md border border-[#2A3242] hover:bg-[#141A26]"
          >
            Signup
          </Link>
        </nav>
      )}
    </header>
  );
}
