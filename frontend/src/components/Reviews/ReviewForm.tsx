// components/Reviews/ReviewForm.tsx
"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { CreateReviewData } from "../../lib/reviews";

interface ReviewFormProps {
  productId: number;
  productName: string;
  onSubmit: (reviewData: CreateReviewData) => Promise<void>;
  onCancel: () => void;
}

export default function ReviewForm({
  productId,
  productName,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError("Please login to submit a review");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!title.trim() || !comment.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await onSubmit({
        product: productId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });

      // Reset form
      setRating(0);
      setTitle("");
      setComment("");
      setHoverRating(0);
    } catch (err: any) {
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (forRating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setRating(i + 1)}
        onMouseEnter={() => setHoverRating(i + 1)}
        onMouseLeave={() => setHoverRating(0)}
        className={`text-2xl transition-transform hover:scale-110 ${
          i < (hoverRating || rating) ? "text-yellow-400" : "text-gray-600"
        }`}
        disabled={loading}
      >
        ★
      </button>
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-[#1A1F2E] border border-[#2A3242] rounded-lg p-6 text-center">
        <div className="text-gray-400 mb-2">Please login to write a review</div>
        <p className="text-gray-500 text-sm">
          You need to be logged in to share your experience with this product.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1F2E] border border-[#2A3242] rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Write a Review</h3>
      <p className="text-gray-400 mb-6">
        Share your thoughts about {productName}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Rating *
          </label>
          <div className="flex items-center gap-1">
            {renderStars(rating)}
            <span className="ml-2 text-gray-400">
              {rating > 0
                ? `${rating} star${rating !== 1 ? "s" : ""}`
                : "Select rating"}
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Review Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            className="w-full bg-[#0B0F19] border border-[#2A3242] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E0B8] transition"
            disabled={loading}
          />
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Your Review *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details of your experience with this product..."
            rows={4}
            className="w-full bg-[#0B0F19] border border-[#2A3242] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E0B8] transition resize-none"
            disabled={loading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#00E0B8] text-[#0B0F19] py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-transparent border border-[#2A3242] text-gray-300 py-3 px-6 rounded-lg font-semibold hover:border-[#00E0B8] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
