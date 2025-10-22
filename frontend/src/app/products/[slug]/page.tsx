// app/products/[slug]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { productService, Product } from "../../../lib/products";
import {
  reviewService,
  Review,
  ReviewStats,
  CreateReviewData,
} from "../../../lib/reviews";
import ProductCard from "../../../components/Products/ProductCard";
import ReviewStats from "../../../components/Reviews/ReviewStats";
import ReviewList from "../../../components/Reviews/ReviewList";
import ReviewForm from "../../../components/Reviews/ReviewForm";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [productLoading, setProductLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description",
  );
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  useEffect(() => {
    if (product) {
      loadReviews();
    }
  }, [product]);

  const loadProduct = async () => {
    try {
      setProductLoading(true);
      setError(null);

      const productData = await productService.getProduct(slug);
      setProduct(productData);

      // Load related products
      const related = await productService.getRelatedProducts(slug);
      setRelatedProducts(related);
    } catch (err: any) {
      setError(err.message || "Failed to load product");
      console.error("Error loading product:", err);
    } finally {
      setProductLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!product) return;

    try {
      setReviewsLoading(true);
      const [reviewsResponse, stats] = await Promise.all([
        reviewService.getApprovedProductReviews(product.id),
        reviewService.getReviewStats(product.id),
      ]);

      setReviews(reviewsResponse.results);
      setReviewStats(stats);
    } catch (err: any) {
      console.error("Error loading reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData: CreateReviewData) => {
    if (!product) return;

    const newReview = await reviewService.createReview(reviewData);

    // Reload reviews to show the new one (if approved)
    await loadReviews();
    setShowReviewForm(false);
  };

  // Show loading state only for product data
  if (productLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-[#00E0B8] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0B0F19] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">
              {error || "Product not found"}
            </div>
            <Link
              href="/products"
              className="px-6 py-2 bg-[#00E0B8] text-[#0B0F19] font-semibold rounded-md hover:opacity-90 transition"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount =
    product.discount_price &&
    parseFloat(product.discount_price) < parseFloat(product.price);
  const finalPrice = hasDiscount
    ? parseFloat(product.discount_price!)
    : product.final_price;
  const discountPercentage = hasDiscount
    ? Math.round((1 - finalPrice / parseFloat(product.price)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0B0F19] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href="/products"
                className="text-gray-400 hover:text-white transition"
              >
                Products
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-white truncate">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images with Gallery */}
          <div className="space-y-4">
            {/* Main Image with Navigation */}
            <div className="relative bg-[#1A1F2E] border border-[#2A3242] rounded-lg overflow-hidden aspect-square">
              {product.images && product.images.length > 0 ? (
                <>
                  <Image
                    src={product.images[selectedImage].image}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedImage(
                            selectedImage === 0
                              ? product.images.length - 1
                              : selectedImage - 1,
                          )
                        }
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          setSelectedImage(
                            selectedImage === product.images.length - 1
                              ? 0
                              : selectedImage + 1,
                          )
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#2A3242] to-[#1A1F2E] flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <div className="text-lg mb-2">Product Image</div>
                    <div className="text-sm">No images available</div>
                  </div>
                </div>
              )}
            </div>

            {/* Image Thumbnails Carousel */}
            {product.images && product.images.length > 1 && (
              <div className="relative">
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#2A3242] scrollbar-track-[#0B0F19]">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                        selectedImage === index
                          ? "border-[#00E0B8] scale-105 shadow-lg shadow-[#00E0B8]/20"
                          : "border-[#2A3242] hover:border-[#00E0B8]"
                      }`}
                    >
                      <Image
                        src={image.image}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Name */}
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-white">
                ${finalPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Featured Badge */}
            {product.is_featured && (
              <div className="inline-block bg-[#00E0B8] text-[#0B0F19] text-sm font-bold px-3 py-1 rounded">
                FEATURED PRODUCT
              </div>
            )}

            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-300 text-lg">
                {product.short_description}
              </p>
            )}

            {/* Full Description Preview */}
            {product.description && (
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed line-clamp-3">
                  {product.description}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button className="flex-1 bg-[#00E0B8] text-[#0B0F19] py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition">
                Add to Cart
              </button>
              <button className="flex-1 bg-transparent border border-[#00E0B8] text-[#00E0B8] py-3 px-6 rounded-lg font-semibold hover:bg-[#00E0B8] hover:text-[#0B0F19] transition">
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-[#2A3242] pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">SKU:</span>
                  <span className="text-white ml-2">
                    {product.slug.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">UUID:</span>
                  <span className="text-gray-300 ml-2 text-xs">
                    {product.uuid}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Availability:</span>
                  <span
                    className={`ml-2 ${product.is_active ? "text-green-400" : "text-red-400"}`}
                  >
                    {product.is_active ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-gray-300 ml-2">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Review Stats */}
            {reviewStats && reviewStats.total_reviews > 0 && (
              <div className="border-t border-[#2A3242] pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= Math.round(reviewStats.average_rating)
                              ? "text-yellow-400"
                              : "text-gray-600"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-white font-semibold">
                      {reviewStats.average_rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-400">
                    ({reviewStats.total_reviews} review
                    {reviewStats.total_reviews !== 1 ? "s" : ""})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 border-t border-[#2A3242] pt-8">
          <div className="border-b border-[#2A3242] mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === "description"
                    ? "border-[#00E0B8] text-[#00E0B8]"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === "reviews"
                    ? "border-[#00E0B8] text-[#00E0B8]"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                Reviews {reviewStats && `(${reviewStats.total_reviews})`}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "description" && (
            <div className="prose prose-invert max-w-none">
              {product?.description ? (
                <div className="text-gray-300 leading-relaxed">
                  {product.description}
                </div>
              ) : (
                <p className="text-gray-400">No description available.</p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Review Stats and Form */}
              <div className="lg:col-span-1 space-y-6">
                {reviewsLoading ? (
                  <div className="bg-[#1A1F2E] border border-[#2A3242] rounded-lg p-6">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-[#00E0B8] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                ) : (
                  reviewStats && <ReviewStats stats={reviewStats} />
                )}

                {!showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full bg-[#00E0B8] text-[#0B0F19] py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Write a Review
                  </button>
                ) : (
                  <ReviewForm
                    productId={product.id}
                    productName={product.name}
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setShowReviewForm(false)}
                  />
                )}
              </div>

              {/* Review List */}
              <div className="lg:col-span-2">
                {reviewsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-[#00E0B8] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <ReviewList reviews={reviews} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-[#2A3242] pt-12">
            <h2 className="text-2xl font-bold text-white mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
