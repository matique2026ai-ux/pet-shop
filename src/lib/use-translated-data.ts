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
}

interface ApiCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: { id: string; name: string }[];
}

function getEntity(t: Record<string, any>, category: string, id: string, field: string, fallback: string): string {
  return t.entities?.[category]?.[id]?.[field] ?? fallback;
}

function getSubentity(t: Record<string, any>, id: string, fallback: string): string {
  return t.entities?.subcategories?.[id] ?? fallback;
}

function mapApiProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory || "",
    price: p.price,
    originalPrice: p.original_price,
    image: p.image || "https://picsum.photos/seed/default/400/400",
    badge: p.badge || undefined,
    rating: p.rating,
    reviews: p.reviews,
    description: p.description || "",
    features: Array.isArray(p.features) ? p.features : [],
    inStock: p.in_stock,
    sold_by: p.sold_by,
    video: p.video,
    ingredients: p.ingredients,
  };
}

function mapApiCategory(c: ApiCategory): Category {
  const iconMap: Record<string, string> = { cat: "cat", dog: "dog", bird: "bird", fish: "fish", rabbit: "rabbit" };
  return {
    id: c.id,
    name: c.name,
    icon: iconMap[c.icon] || "paw-print",
    description: "",
    subcategories: c.subcategories.map((s: any) => ({ id: s.id, name: s.name, slug: s.id })),
  };
}

export function useTranslatedData() {
  const { t } = useI18n();
  const [apiProducts, setApiProducts] = useState<Product[] | null>(null);
  const [apiCategories, setApiCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    fetch("/api/products").then((r) => r.ok ? r.json() : null).then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setApiProducts(data.map(mapApiProduct));
      }
    }).catch(() => {});
    fetch("/api/categories").then((r) => r.ok ? r.json() : null).then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setApiCategories(data.map(mapApiCategory));
      }
    }).catch(() => {});
  }, []);

  const categories: Category[] = (apiCategories || rawCategories).map((cat) => ({
    ...cat,
    name: getEntity(t, "categories", cat.id, "name", cat.name),
    description: getEntity(t, "categories", cat.id, "description", "description" in cat ? (cat as any).description || "" : ""),
    subcategories: cat.subcategories.map((sub) => ({
      ...sub,
      name: getSubentity(t, sub.id, sub.name),
    })),
  }));

  const raw = apiProducts || rawProducts;
  const products: Product[] = raw.map((p: Product) => ({
    ...p,
    name: getEntity(t, "products", p.id, "name", p.name),
    description: getEntity(t, "products", p.id, "description", p.description),
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

  return { categories, products, vetServices, team, testimonials };
}
