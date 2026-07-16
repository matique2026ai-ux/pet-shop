"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, StarHalf } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n-context";
import { SHIMMER_BLUR } from "@/lib/blur";
import { unitLabel, isContinuousUnit } from "@/lib/units";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "related";
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
      ))}
      {half && <StarHalf className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className="w-3.5 h-3.5 text-[#E2DDD4]" />
      ))}
    </div>
  );
}

/* ─── Card Background Footprints ─── */
function CardFootprintDecor({ category }: { category: string }) {
  if (category === "cats") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute -bottom-2 -right-2 w-16 h-16 text-[#C4933F]/12 pointer-events-none transform rotate-12 select-none z-0"
        aria-hidden="true"
      >
        <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-4.5-3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm9 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-6.5-3.5C9.17 7.5 8.5 8.17 8.5 9s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm4 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
      </svg>
    );
  }
  if (category === "birds") {
    return (
      <svg
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className="absolute -bottom-2 -right-2 w-16 h-16 text-[#C4933F]/15 pointer-events-none transform rotate-45 select-none z-0"
        aria-hidden="true"
      >
        <line x1="12" y1="4" x2="12" y2="20" />
        <line x1="12" y1="12" x2="6" y2="8" />
        <line x1="12" y1="12" x2="18" y2="8" />
        <line x1="12" y1="16" x2="8" y2="19" />
        <line x1="12" y1="16" x2="16" y2="19" />
      </svg>
    );
  }
  if (category === "dogs") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute -bottom-2 -right-2 w-20 h-20 text-[#C4933F]/10 pointer-events-none transform -rotate-12 select-none z-0"
        aria-hidden="true"
      >
        <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-4.5-3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm9 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-6.5-3.5C9.17 7.5 8.5 8.17 8.5 9s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm4 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
      </svg>
    );
  }
  // Hoof footprint for horse or generic categories
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="absolute -bottom-2 -right-2 w-14 h-14 text-[#C4933F]/10 pointer-events-none transform rotate-12 select-none z-0"
      aria-hidden="true"
    >
      <path d="M12 3C8.5 3 5 6.5 5 11c0 4.5 3.5 7.5 5.5 8.5C11 19.8 11.5 20 12 20s1-.2 1.5-.5c2-1 5.5-4 5.5-8.5 0-4.5-3.5-8-7-8zm-2 14c-1.5-1-3.5-3-3.5-6 0-3 2-5 3.5-5 .5 0 1 .5 1 1 0 1.5-1 3-1 5 0 1 .5 2 1 2.5-.5.5-1 1.5-1 2.5zm4.5-2.5c.5-.5 1-1.5 1-2.5 0-2-1-3.5-1-5 0-.5.5-1 1-1 1.5 0 3.5 2 3.5 5 0 3-2 5-3.5 6 0-1-.5-2-1-2.5z" />
    </svg>
  );
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const isRelated = variant === "related";
  const { addItem } = useCart();
  const { t, currency, lang } = useI18n();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Link href={`/products/${product.category}/${product.id}`} className="group block">
      <div className="product-card-hover">
        <div className="relative bg-white rounded-2xl overflow-hidden border border-[#F0EDE6] shadow-md shadow-[#C4933F]/8 group-hover:border-[#DFB96A]/40">

          {/* Image */}
          <div className="relative aspect-square bg-white overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              placeholder="blur"
              blurDataURL={SHIMMER_BLUR}
              className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-108"
              sizes={isRelated ? "(max-width: 640px) 50vw, 25vw" : "(max-width: 640px) 100vw, 25vw"}
            />
            {/* Warm overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#C4933F]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badge */}
            {product.badge && (
              <span className={`absolute top-3 ${lang === "ar" ? "right-3" : "left-3"} px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                product.badge === "NEW"
                  ? "bg-gradient-to-r from-[#C4933F] to-[#DFB96A] text-white"
                  : "bg-gradient-to-r from-[#C4933F] to-[#8A6022] text-white"
              }`}>
                {product.badge === "NEW" ? (t.products?.new || "NEW") : (t.products?.sale || "SALE")}
              </span>
            )}

            {/* Out of stock */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-semibold text-sm bg-black/30 px-3 py-1.5 rounded-full">
                  {t.products?.outOfStock || "Out of Stock"}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className={`${isRelated ? "p-3" : "p-4"} relative overflow-hidden`}>
            {/* Background Footprint Decoration */}
            <CardFootprintDecor category={product.category} />

            {/* Product name */}
            <h3 className={`relative z-10 font-bold text-[#1A1A2E] ${isRelated ? "text-sm" : "text-sm lg:text-base"} leading-tight mb-2 line-clamp-2 group-hover:text-[#C4933F] transition-colors duration-200`}>
              {product.name}
            </h3>

            {/* Stars + review count */}
            {!isRelated && (
              <div className="relative z-10 flex items-center gap-1.5 mb-3">
                <StarRating rating={product.rating} />
                <span className="text-xs text-[#7A6F61] font-medium">
                  {product.rating}
                </span>
                <span className="text-xs text-[#9E9282]">({product.reviews})</span>
              </div>
            )}

            {/* Price row */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-[#1A1A2E] ${isRelated ? "text-sm" : "text-lg"}`}>
                  {currency}{product.price.toLocaleString()}
                  {product.sold_by && product.sold_by !== "piece" && (
                    <span className="text-xs font-normal text-[#9E9282]"> /{unitLabel(product.sold_by, lang)}</span>
                  )}
                </span>
                {product.originalPrice && (
                  <span className={`text-[#9E9282] line-through ${isRelated ? "text-xs" : "text-sm"}`}>
                    {currency}{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Discount badge */}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] font-bold bg-[#FBF8F3] text-[#C4933F] px-1.5 py-0.5 rounded-full border border-[#ECDCAE] shrink-0">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Add to cart button */}
            {product.inStock && (
              <button
                onClick={handleAddToCart}
                className="relative z-10 add-cart-btn mt-3 w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold"
              >
                <ShoppingCart className="w-4 h-4" />
                {t.products.addToCart}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
