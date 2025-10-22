// components/Auth/OAuthButtons.tsx
"use client";
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

export default function OAuthButtons() {
  const router = useRouter();
  const { googleLogin } = useAuth();

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
        router.refresh();
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

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await googleLogin(tokenResponse.access_token);
        showSuccessAlert(
          "Google login successful! Redirecting to home page...",
          "/",
        );
      } catch (err: any) {
        const errorMessage = err.message || "Google login failed";
        console.error("Google login error:", err);
        showErrorAlert(errorMessage);
      }
    },
    onError: () => {
      showErrorAlert("Google login failed. Please try again.");
    },
    scope: "openid email profile",
    flow: "implicit",
  });

  return (
    <div className="flex justify-center">
      <button
        onClick={() => googleLoginHandler()}
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#0B0F19] border border-[#2A3242] rounded-md hover:bg-[#1A1F2E] transition-colors duration-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span className="text-sm font-medium text-white">
          Continue with Google
        </span>
      </button>
    </div>
  );
}
