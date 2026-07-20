"use client";

import { useFavorites } from "@/lib/favorites-context";
import { useI18n } from "@/lib/i18n-context";
import ProductCard from "@/components/product-card";
import Link from "next/link";
import { Heart, ArrowLeft, ShoppingBag } from "lucide-react";
import AnimatedSection, { StaggerSection, FadeIn } from "@/components/animated-section";

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();
  const { lang, dir } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 text-rose-500 mb-1">
              <Heart className="w-5 h-5 fill-current animate-heartbeat" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {lang === "ar" ? "قائمتك المفضلة" : "Vos Favoris"}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {lang === "ar" ? "المنتجات المفضلة" : "Produits Favoris"}
              <span className="text-sm font-normal text-gray-500 mr-2 ml-2">
                ({favorites.length})
              </span>
            </h1>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors"
            >
              {lang === "ar" ? "مسح القائمة" : "Vider la liste"}
            </button>
          )}
        </AnimatedSection>

        {favorites.length === 0 ? (
          <AnimatedSection className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {lang === "ar" ? "قائمة المفضلة فارغة" : "Votre liste de favoris est vide"}
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
              {lang === "ar"
                ? "انقر على أيقونة القلب على أي منتج يعجبك لحفظه هنا والرجوع إليه بسهولة."
                : "Cliquez sur le cœur de n'importe quel produit pour le sauvegarder ici."}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-colors shadow-lg shadow-emerald-900/10"
            >
              <ShoppingBag className="w-5 h-5" />
              {lang === "ar" ? "تصفح المنتجات" : "Explorer le magasin"}
            </Link>
          </AnimatedSection>
        ) : (
          <StaggerSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <FadeIn key={product.id}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </StaggerSection>
        )}
      </div>
    </div>
  );
}
