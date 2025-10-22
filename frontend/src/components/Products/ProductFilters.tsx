// components/Products/ProductFilters.tsx
"use client";
import { useState } from "react";
import { ProductFilters as ProductFiltersType } from "../../lib/products";

interface ProductFiltersProps {
  filters: Partial<ProductFiltersType>;
  onFilterChange: (filters: Partial<ProductFiltersType>) => void;
}

export default function ProductFilters({
  filters,
  onFilterChange,
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState({
    min: filters.min_price || "",
    max: filters.max_price || "",
  });

  const handlePriceRangeApply = () => {
    onFilterChange({
      min_price: priceRange.min ? Number(priceRange.min) : undefined,
      max_price: priceRange.max ? Number(priceRange.max) : undefined,
    });
  };

  const handlePriceRangeReset = () => {
    setPriceRange({ min: "", max: "" });
    onFilterChange({
      min_price: undefined,
      max_price: undefined,
    });
  };

  const clearAllFilters = () => {
    setPriceRange({ min: "", max: "" });
    onFilterChange({});
  };

  return (
    <div className="bg-[#1A1F2E] border border-[#2A3242] rounded-lg p-6 sticky top-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-[#00E0B8] hover:text-[#00C4A6] transition"
        >
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Search
        </label>
        <input
          type="text"
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search products..."
          className="w-full bg-[#0B0F19] border border-[#2A3242] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E0B8]"
        />
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Price Range
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, min: e.target.value }))
            }
            className="w-full bg-[#0B0F19] border border-[#2A3242] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E0B8]"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, max: e.target.value }))
            }
            className="w-full bg-[#0B0F19] border border-[#2A3242] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E0B8]"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePriceRangeApply}
            className="flex-1 bg-[#00E0B8] text-[#0B0F19] py-2 rounded text-sm font-semibold hover:opacity-90 transition"
          >
            Apply
          </button>
          <button
            onClick={handlePriceRangeReset}
            className="flex-1 bg-[#2A3242] text-gray-300 py-2 rounded text-sm font-semibold hover:bg-[#3A4252] transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Featured Filter */}
      <div className="mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.featured || false}
            onChange={(e) =>
              onFilterChange({ featured: e.target.checked || undefined })
            }
            className="w-4 h-4 text-[#00E0B8] bg-[#0B0F19] border-[#2A3242] rounded focus:ring-[#00E0B8] focus:ring-2"
          />
          <span className="text-sm text-gray-300">Featured Products</span>
        </label>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Category
        </label>
        <input
          type="text"
          value={filters.category || ""}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          placeholder="Filter by category..."
          className="w-full bg-[#0B0F19] border border-[#2A3242] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E0B8]"
        />
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Brand
        </label>
        <input
          type="text"
          value={filters.brand || ""}
          onChange={(e) => onFilterChange({ brand: e.target.value })}
          placeholder="Filter by brand..."
          className="w-full bg-[#0B0F19] border border-[#2A3242] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#00E0B8]"
        />
      </div>
    </div>
  );
}
