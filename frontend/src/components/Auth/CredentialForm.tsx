// components/Auth/CredentialForm.tsx
"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { signupWithCredentials } from "../../lib/api";

export default function CredentialForm() {
  const pathname = usePathname();
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
      if (isSignup) {
        await signupWithCredentials(formData);
        alert("Signup successful! Please check your email for verification.");
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/auth/login/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error("Invalid credentials");
        alert("Login successful!");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignup && (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-1/2 px-3 py-2 bg-[#0B0F19] border border-[#2A3242] rounded-md"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-1/2 px-3 py-2 bg-[#0B0F19] border border-[#2A3242] rounded-md"
            />
          </div>

          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-[#0B0F19] border border-[#2A3242] rounded-md"
          />
        </>
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 bg-[#0B0F19] border border-[#2A3242] rounded-md"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 bg-[#0B0F19] border border-[#2A3242] rounded-md"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-md bg-[#00E0B8] text-[#0B0F19] font-semibold hover:opacity-90 transition"
      >
        {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
      </button>
    </form>
  );
}
