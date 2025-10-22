"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EmailConfirmPage() {
  const { key } = useParams<{ key: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );

  useEffect(() => {
    async function verifyEmail() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/auth/verify-email/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
          },
        );

        if (!res.ok) throw new Error("Verification failed");
        setStatus("success");

        setTimeout(() => router.push("/login"), 3000);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }

    if (key) verifyEmail();
  }, [key, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      {status === "verifying" && (
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-[#00E0B8]">
            Verifying your email...
          </h2>
          <p className="text-[#8A94A6]">Please wait a moment.</p>
        </div>
      )}

      {status === "success" && (
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-green-400">
            Email verified successfully!
          </h2>
          <p className="text-[#8A94A6]">Redirecting you to login...</p>
        </div>
      )}

      {status === "error" && (
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-red-400">
            Verification failed.
          </h2>
          <p className="text-[#8A94A6]">
            The link may be invalid or expired. Please try signing up again.
          </p>
        </div>
      )}
    </div>
  );
}
