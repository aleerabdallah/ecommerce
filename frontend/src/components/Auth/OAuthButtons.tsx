// components/Auth/CredentialForm.tsx
"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function CredentialForm() {
  const pathname = usePathname();
  const router = useRouter();
  const isSignup = pathname === "/signup";

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE;
      let res;

      if (isSignup) {
        // Step 1: Create account
        res = await fetch(`${base}/auth/register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone_number: formData.phone_number,
            password: formData.password,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Signup failed");
        }

        // Step 2: Email verification notice
        alert(
          "Account created! Check your inbox for a verification email before logging in.",
        );
        router.push("/login");
      } else {
        // Login with email & password only
        res = await fetch(`${base}/auth/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
          credentials: "include", // store session cookies
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Invalid credentials");
        }

        const data = await res.json();
        console.log("Logged in:", data);
        alert("Login successful!");
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Keep your existing inputs exactly the same */}
      {/* (This logic will respect them automatically) */}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-md bg-[#00E0B8] text-[#0B0F19] font-semibold hover:opacity-90 transition"
      >
        {loading ? "Please wait…" : isSignup ? "Sign Up" : "Login"}
      </button>
    </form>
  );
}
