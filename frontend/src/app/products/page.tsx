"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getProducts } from "../../lib/api";
import Image from "next/image";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div className="grid gap-8">
      <h2 className="text-3xl font-bold mb-4">Products</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="p-4 rounded-2xl bg-[#141A26] border border-[#2A3242] hover:border-[#00E0B8]/40 transition block"
          >
            <Image
              src={p.image}
              alt={p.name}
              width={200}
              height={100}
              className="rounded-lg mb-3 w-full h-48 object-cover"
            />
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-[#8A94A6] text-sm">${p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
