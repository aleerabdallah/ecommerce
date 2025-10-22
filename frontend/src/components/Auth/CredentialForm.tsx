// components/Auth/CredentialForm.tsx
"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signupWithCredentials } from "../../lib/api";
import Swal from "sweetalert2";
import { setAuthCookie, setUserData } from "../../lib/cookies";

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

  const showSuccessAlert = (message: string, redirectUrl: string = "/") => {
    Swal.fire({
      title: "Success!",
      text: message,
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
    }).then((result) => {
      if (result.isConfirmed) {
        router.push(redirectUrl);
        router.refresh(); // Refresh to update auth state
      }
    });
  };

  const showErrorAlert = (message: string) => {
    Swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonText: "Try Again",
      confirmButtonColor: "#FF3B30",
      background: "#0B0F19",
      color: "#FFFFFF",
      customClass: {
        popup: "bg-[#0B0F19] border border-[#2A3242]",
        confirmButton:
          "bg-[#FF3B30] text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition",
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        await signupWithCredentials(formData);
        showSuccessAlert(
          "Signup successful! Please check your email for verification.",
        );
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
            credentials: "include", // Important for backend-set cookies
          },
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Invalid credentials");
        }

        const data = await res.json();

        // Store only access token in frontend cookie
        if (data.access) {
          setAuthCookie(data.access);
        }

        // Store user data if available
        if (data.user) {
          setUserData(data.user);
        }

        showSuccessAlert("Login successful! Redirecting to home page...", "/");
      }
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      showErrorAlert(errorMessage);
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
              disabled={loading}
              className="w-1/2 px-3 py-2 bg-[#0B0F19] border border-[#2A3242] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-1/2 px-3 py-2 bg-[#0B0F19] border border-[#2A3242] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-3 py-2 bg-[#0B0F19] border border-[#2A3242] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
        disabled={loading}
        className="w-full px-3 py-2 bg-[#0B0F19] border border-[#2A3242] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        disabled={loading}
        className="w-full px-3 py-2 bg-[#0B0F19] border border-[#2A3242] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {error && !loading && (
        <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded-md border border-red-500/20">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-md bg-[#00E0B8] text-[#0B0F19] font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-[#0B0F19] border-t-transparent rounded-full animate-spin"></div>
            {isSignup ? "Creating Account..." : "Signing In..."}
          </>
        ) : isSignup ? (
          "Sign Up"
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
}
