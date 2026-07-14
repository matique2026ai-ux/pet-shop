"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n-context";
import { SHIMMER_BLUR } from "@/lib/blur";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "related";
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
    <Link
      href={`/products/${product.category}/${product.id}`}
      className="group block"
    >
      <div className="relative transition-all duration-500 ease-out group-hover:-translate-y-1.5">
        <div
          className="relative overflow-hidden rounded-2xl transition-all duration-[600ms] ease-out bg-white border border-gray-100/80 shadow-sm shadow-blue-500/10 group-hover:shadow-md group-hover:shadow-blue-500/20 group-hover:border-blue-200/60"
        >
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              placeholder="blur"
              blurDataURL={SHIMMER_BLUR}
              className="object-cover transition-all duration-[800ms] ease-out group-hover:scale-110 group-hover:rotate-2"
              sizes={isRelated ? "(max-width: 640px) 50vw, 25vw" : "(max-width: 640px) 100vw, 25vw"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {product.badge && (
              <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/30 shadow-lg ${
                product.badge === "NEW"
                  ? "bg-emerald-600/90 text-white"
                  : "bg-[#F97316] text-white"
              }`}>
                {product.badge === "NEW" ? t.products?.new || "NEW" : t.products?.sale || "SALE"}
              </span>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {t.products?.outOfStock || "Out of Stock"}
                </span>
              </div>
            )}
          </div>

          <div className={`${isRelated ? "p-3" : "p-4"} relative z-10 transition-all duration-300`}>
            <h3 className={`font-bold text-gray-900 ${isRelated ? "text-sm" : ""} leading-tight mb-1 transition-colors duration-300 group-hover:text-emerald-700`}>
              {product.name}
            </h3>

            {!isRelated && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3 h-3 fill-[#E5B25A] text-[#E5B25A]" />
                <span className="text-xs text-gray-500">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviews})</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className={`font-bold text-gray-900 ${isRelated ? "text-sm" : "text-lg"}`}>
                {currency}{product.price}
                {product.sold_by === "weight" && <span className="text-xs font-normal text-gray-400"> /{lang === "ar" ? "كغ" : "kg"}</span>}
              </span>
              {product.originalPrice && (
                <span className={`text-gray-400 line-through ${isRelated ? "text-xs" : "text-sm"}`}>
                  {currency}{product.originalPrice}
                </span>
              )}
            </div>

              <button
                onClick={handleAddToCart}
                className="add-cart-pill mt-2 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              >
              <ShoppingCart className="w-3.5 h-3.5" />
              {t.products.addToCart}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
