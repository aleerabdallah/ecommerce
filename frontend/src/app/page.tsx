"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1 grid gap-16">
      <section className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h2 className="text-5xl font-extrabold leading-tight text-white">
            Discover. Shop. Enjoy.
          </h2>
          <p className="text-[#8A94A6] text-lg max-w-lg">
            Your next favorite store, redefined — minimal, fast, and powered by
            a Django backend. Experience smooth shopping, secure checkout, and
            effortless reviews.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/products"
              className="px-6 py-3 rounded-lg bg-[#00E0B8] text-[#0B0F19] font-semibold hover:opacity-90 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-3xl bg-gradient-to-br from-[#141A26] to-[#1B2333] border border-[#2A3242] shadow-xl p-8 flex items-center justify-center">
            <Image
              width={500}
              height={200}
              src="/hero-dark-shop.png"
              alt="Hero showcase"
              className="rounded-2xl w-full max-w-md"
            />
          </div>
        </div>
      </section>

      <section id="features" className="grid md:grid-cols-3 gap-8 mt-10">
        {[
          {
            title: "Fast Delivery",
            desc: "Quick global shipping with trusted partners.",
          },
          {
            title: "Secure Payments",
            desc: "Protected transactions with encrypted gateways.",
          },
          {
            title: "Customer Reviews",
            desc: "Honest feedback to guide your next purchase.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="p-6 rounded-2xl bg-[#141A26] border border-[#2A3242] hover:border-[#00E0B8]/40 transition"
          >
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-sm text-[#8A94A6]">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
