"use client";

import { useState, useEffect } from "react";
import { useI18n } from "./i18n-context";
import {
  products as rawProducts,
  categories as rawCategories,
  vetServices as rawVetServices,
  team as rawTeam,
  testimonials as rawTestimonials,
} from "./data";
import type { Product, Category, VetService, TeamMember, Testimonial } from "./data";

interface ApiProduct {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  original_price?: number;
  image?: string;
  badge?: "NEW" | "SALE" | null;
  rating: number;
  reviews: number;
  description?: string;
  features: string[];
  in_stock: boolean;
  sold_by?: string;
  video?: string;
  ingredients?: string;
  images?: string[];
  variants?: string[];
}

interface ApiCategory {
  id: string;
  name: string;
  icon: string;
  image_url?: string;
  video_url?: string;
  subcategories: { id: string; name: string }[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: Record<string, string>;
  content: Record<string, string>;
  image_url?: string;
  author: string;
  published: boolean;
  created_at: string;
}

function getEntity(t: Record<string, any>, category: string, id: string, field: string, fallback: string): string {
  return t.entities?.[category]?.[id]?.[field] ?? fallback;
}

function getSubentity(t: Record<string, any>, id: string, fallback: string): string {
  return t.entities?.subcategories?.[id] ?? fallback;
}

function cleanPlaceholderImage(imgUrl: string | undefined): string {
  if (!imgUrl) return "/logo-badge.png";
  if (
    imgUrl.includes("picsum.photos") ||
    imgUrl.includes("unsplash.com") ||
    imgUrl.includes("placeholder") ||
    imgUrl.includes("default")
  ) {
    return "/logo-badge.png";
  }
  return imgUrl;
}

function mapApiProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory || "",
    price: p.price,
    originalPrice: p.original_price,
    image: cleanPlaceholderImage(p.image),
    badge: p.badge || undefined,
    rating: p.rating,
    reviews: p.reviews,
    description: p.description || "",
    features: Array.isArray(p.features) ? p.features : [],
    inStock: p.in_stock,
    sold_by: p.sold_by as import("@/lib/units").UnitType | undefined,
    video: p.video,
    ingredients: p.ingredients,
    images: Array.isArray(p.images) ? p.images : [],
    variants: Array.isArray(p.variants) ? p.variants : [],
  };
}

function mapApiCategory(c: ApiCategory): Category {
  const iconMap: Record<string, string> = { cat: "cat", dog: "dog", bird: "bird", fish: "fish", rabbit: "rabbit" };
  return {
    id: c.id,
    name: c.name,
    icon: iconMap[c.icon] || "paw-print",
    description: "",
    image_url: c.image_url ? cleanPlaceholderImage(c.image_url) : undefined,
    video_url: c.video_url,
    subcategories: c.subcategories.map((s: any) => ({ id: s.id, name: s.name, slug: s.id })),
  };
}

export function useTranslatedData() {
  const { t } = useI18n();
  const [apiProducts, setApiProducts] = useState<Product[] | null>(null);
  const [apiCategories, setApiCategories] = useState<Category[] | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("pet_shop_categories");
        return cached ? JSON.parse(cached) : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  // true = fetch completed (even if result is empty array), false = still loading
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/products").then((r) => r.ok ? r.json() : null).then((data) => {
      if (data && Array.isArray(data)) {
        // Respect the DB result even if it's empty — do NOT fall back to demo data
        setApiProducts(data.map(mapApiProduct));
      }
      setProductsLoaded(true);
    }).catch(() => { setProductsLoaded(true); });
    
    fetch("/api/categories").then((r) => r.ok ? r.json() : null).then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapApiCategory);
        setApiCategories(mapped);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("pet_shop_categories", JSON.stringify(mapped));
          } catch {}
        }
      }
    }).catch(() => {});

    fetch("/api/blog").then((r) => r.ok ? r.json() : null).then((data) => {
      if (data && Array.isArray(data)) {
        setBlogPosts(data);
      }
    }).catch(() => {});
  }, []);

  const categories: Category[] = (apiCategories || rawCategories).map((cat) => ({
    ...cat,
    name: getEntity(t, "categories", cat.id, "name", cat.name),
    description: getEntity(t, "categories", cat.id, "description", "description" in cat ? (cat as any).description || "" : ""),
    image_url: cat.image_url ? cleanPlaceholderImage(cat.image_url) : undefined,
    video_url: cat.video_url,
    subcategories: cat.subcategories.map((sub) => ({
      ...sub,
      name: getSubentity(t, sub.id, sub.name),
    })),
  }));

  // If the DB fetch is still in progress, return an empty array to avoid flashes of dummy products.
  // Once the fetch finishes (productsLoaded=true), use the DB result (even if empty).
  const raw = productsLoaded
    ? (apiProducts ?? [])          // DB answered → use its result (may be [])
    : [];                          // Still loading → return empty array to prevent flashes!

  const products: Product[] = raw.map((p: Product) => ({
    ...p,
    name: getEntity(t, "products", p.id, "name", p.name),
    description: getEntity(t, "products", p.id, "description", p.description),
    image: cleanPlaceholderImage(p.image),
  }));

  const vetServices: VetService[] = rawVetServices.map((s) => ({
    ...s,
    title: getEntity(t, "vetServices", s.id, "title", s.title),
    description: getEntity(t, "vetServices", s.id, "description", s.description),
  }));

  const team: TeamMember[] = rawTeam.map((m) => ({
    ...m,
    name: getEntity(t, "team", m.id, "name", m.name),
    role: getEntity(t, "team", m.id, "role", m.role),
    bio: getEntity(t, "team", m.id, "bio", m.bio),
  }));

  const testimonials: Testimonial[] = rawTestimonials.map((rev) => ({
    ...rev,
    name: getEntity(t, "testimonials", rev.id, "name", rev.name),
    text: getEntity(t, "testimonials", rev.id, "text", rev.text),
  }));

  return { categories, products, vetServices, team, testimonials, productsLoaded, blogPosts };
}

