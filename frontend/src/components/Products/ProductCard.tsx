// components/Products/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Product } from "../../lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount =
    product.discount_price &&
    parseFloat(product.discount_price) < parseFloat(product.price);
  const finalPrice = hasDiscount
    ? parseFloat(product.discount_price!)
    : product.final_price;

  return (
    <div className="bg-[#1A1F2E] border border-[#2A3242] rounded-lg overflow-hidden hover:border-[#00E0B8] transition-all duration-300 group">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-w-1 aspect-h-1 bg-[#0B0F19] relative overflow-hidden">
          {/* Product Image - using first image or placeholder */}
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0].image} // Adjust based on your image structure
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-[#2A3242] to-[#1A1F2E] flex items-center justify-center">
              <div className="text-gray-500 text-sm">No Image</div>
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              SALE
            </div>
          )}

          {/* Featured Badge */}
          {product.is_featured && (
            <div className="absolute top-2 left-2 bg-[#00E0B8] text-[#0B0F19] text-xs font-bold px-2 py-1 rounded">
              FEATURED
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#00E0B8] transition">
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        {product.short_description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {product.short_description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-white">
              ${finalPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ${parseFloat(product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button className="bg-[#00E0B8] text-[#0B0F19] px-3 py-1 rounded text-sm font-semibold hover:opacity-90 transition opacity-0 group-hover:opacity-100">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
