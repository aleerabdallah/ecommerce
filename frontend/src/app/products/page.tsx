// app/products/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { productService, Product, ProductFilters } from "../../lib/products";
import ProductCard from "../../components/Products/ProductCard";
import Pagination from "../../components/UI/Pagination";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Get filters from URL - simplified to only title and category
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  useEffect(() => {
    loadProducts();
  }, [search, category, page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: ProductFilters = {
        search: search || undefined,
        category: category || undefined,
        page: page,
      };

      const data = await productService.getProducts(filters);
      setProducts(data.results);
      setTotalCount(data.count);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === null) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    // Reset to page 1 when filters change
    params.set("page", "1");

    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    updateFilters({ search: "", category: "" });
  };

  if (loading && products.length === 0) {
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

  return (
    <div className="min-h-screen bg-[#0B0F19] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Our Products</h1>
          <p className="text-gray-400">Discover our amazing collection</p>
        </div>

        {/* Horizontal Filters */}
        <div className="bg-[#1A1F2E] border border-[#2A3242] rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search Input */}
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  placeholder="Search products by title..."
                  className="w-full bg-[#0B0F19] border border-[#2A3242] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E0B8] transition"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-1 w-full sm:max-w-xs">
              <select
                value={category}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="w-full bg-[#0B0F19] border border-[#2A3242] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#00E0B8] transition"
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports</option>
                {/* Add more categories based on your data */}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(search || category) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-3 bg-[#2A3242] text-gray-300 rounded-lg hover:bg-[#3A4252] hover:text-white transition whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {(search || category) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#00E0B8] text-[#0B0F19]">
                  Search: "{search}"
                  <button
                    onClick={() => updateFilters({ search: "" })}
                    className="ml-1.5 hover:bg-[#00C4A6] rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#00E0B8] text-[#0B0F19]">
                  Category: {category}
                  <button
                    onClick={() => updateFilters({ category: "" })}
                    className="ml-1.5 hover:bg-[#00C4A6] rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Info and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="text-gray-400">
            Showing {products.length} of {totalCount} products
            {(search || category) && " matching your criteria"}
          </div>

          {/* Sort Options */}
          <select
            onChange={(e) => updateFilters({ ordering: e.target.value })}
            className="bg-[#1A1F2E] border border-[#2A3242] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#00E0B8] transition"
          >
            <option value="">Sort by</option>
            <option value="name">Name A-Z</option>
            <option value="-name">Name Z-A</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
          </select>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
            <button
              onClick={loadProducts}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalCount > products.length && (
              <Pagination
                currentPage={currentPage}
                totalItems={totalCount}
                itemsPerPage={12}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No products found</div>
            <p className="text-gray-500 mb-6">
              {search || category
                ? "Try adjusting your search terms or filters"
                : "No products available at the moment"}
            </p>
            {(search || category) && (
              <button
                onClick={clearAllFilters}
                className="px-6 py-2 bg-[#00E0B8] text-[#0B0F19] font-semibold rounded-md hover:opacity-90 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
