// components/Reviews/ReviewStats.tsx
import { ReviewStats as ReviewStatsType } from "../../lib/reviews";

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

export default function ReviewStats({ stats }: ReviewStatsProps) {
  const { average_rating, total_reviews, rating_breakdown } = stats;

  const getStarPercentage = (rating: number) => {
    if (total_reviews === 0) return 0;
    return (
      (rating_breakdown[rating as keyof typeof rating_breakdown] /
        total_reviews) *
      100
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? "text-yellow-400" : "text-gray-600"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-[#1A1F2E] border border-[#2A3242] rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">
        Customer Reviews
      </h3>

      {/* Overall Rating */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">
            {average_rating.toFixed(1)}
          </div>
          <div className="flex justify-center mt-1">
            {renderStars(Math.round(average_rating))}
          </div>
          <div className="text-gray-400 text-sm mt-1">
            {total_reviews} review{total_reviews !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-2">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm text-gray-400 w-4">{rating}</span>
              <span className="text-yellow-400">★</span>
            </div>
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${getStarPercentage(rating)}%` }}
              />
            </div>
            <span className="text-sm text-gray-400 w-12 text-right">
              {rating_breakdown[rating as keyof typeof rating_breakdown]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
