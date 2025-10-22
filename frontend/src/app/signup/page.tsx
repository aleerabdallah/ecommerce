"use client";
import React from "react";
import Link from "next/link";
import CredentialForm from "../../components/Auth/CredentialForm";
import OAuthButtons from "../../components/Auth/OAuthButtons";

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto mt-12 bg-[#141A26] p-8 rounded-2xl border border-[#2A3242] shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Create an Account 🛍️</h2>
        <p className="text-[#8A94A6] text-sm">
          Sign up easily with Google or using your details below.
        </p>
      </div>
      <div className="space-y-6">
        <OAuthButtons />
        <div className="relative flex items-center justify-center">
          <span className="absolute bg-[#141A26] px-2 text-xs text-[#8A94A6]">
            or
          </span>
          <hr className="w-full border-[#2A3242]" />
        </div>
        <CredentialForm />
      </div>
      <div className="mt-6 text-center text-sm text-[#8A94A6]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#00E0B8] hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
