"use client";
import { useEffect, useState } from "react";
import { getProductById, addReview, addToCart } from "../../../lib/api";
import Image from "next/image";

export default function ProductDetail({ params }: any) {
  const [product, setProduct] = useState<any>(null);
  const [review, setReview] = useState("");

  useEffect(() => {
    getProductById(params.id).then(setProduct);
  }, [params.id]);

  if (!product) return <div>Loading...</div>;

  async function handleReviewSubmit(e: any) {
    e.preventDefault();
    await addReview(product.id, review);
    setReview("");
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <Image
        src={product.image}
        alt={product.name}
        className="rounded-xl w-full h-96 object-cover border border-[#2A3242]"
      />
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">{product.name}</h2>
        <p className="text-lg text-[#8A94A6]">{product.description}</p>
        <div className="text-xl font-semibold">${product.price}</div>
        <button
          onClick={() => addToCart(product.id)}
          className="px-5 py-2 rounded-md bg-[#00E0B8] text-[#0B0F19] font-semibold hover:opacity-90 transition"
        >
          Add to Cart
        </button>

        <form onSubmit={handleReviewSubmit} className="mt-6 space-y-3">
          <h3 className="font-medium">Leave a Review</h3>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full px-3 py-2 rounded-md bg-[#0B0F19] border border-[#2A3242] h-24"
          />
          <button className="px-4 py-2 rounded-md bg-[#00E0B8] text-[#0B0F19] font-semibold">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
