// components/Reviews/ReviewList.tsx
import { Review } from "../../lib/reviews";

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < rating ? "text-yellow-400" : "text-gray-600"
        }`}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400">No reviews yet.</div>
        <p className="text-gray-500 text-sm mt-2">
          Be the first to review this product!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-[#1A1F2E] border border-[#2A3242] rounded-lg p-6"
        >
          {/* Review Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-white">{review.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-400">
                  by {review.user.first_name} {review.user.last_name}
                </span>
              </div>
            </div>
            <span className="text-sm text-gray-400">
              {formatDate(review.created_at)}
            </span>
          </div>

          {/* Review Comment */}
          <p className="text-gray-300 leading-relaxed">{review.comment}</p>

          {/* Approval Status (for admin) */}
          {!review.is_approved && (
            <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              Pending Approval
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
