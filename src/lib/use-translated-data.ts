"use client";

import { useI18n } from "./i18n-context";
import {
  products as rawProducts,
  categories as rawCategories,
  vetServices as rawVetServices,
  team as rawTeam,
  testimonials as rawTestimonials,
} from "./data";
import type { Product, Category, VetService, TeamMember, Testimonial } from "./data";

function getEntity(t: Record<string, any>, category: string, id: string, field: string, fallback: string): string {
  return t.entities?.[category]?.[id]?.[field] ?? fallback;
}

function getSubentity(t: Record<string, any>, id: string, fallback: string): string {
  return t.entities?.subcategories?.[id] ?? fallback;
}

export function useTranslatedData() {
  const { t } = useI18n();

  const categories: Category[] = rawCategories.map((cat) => ({
    ...cat,
    name: getEntity(t, "categories", cat.id, "name", cat.name),
    description: getEntity(t, "categories", cat.id, "description", cat.description),
    subcategories: cat.subcategories.map((sub) => ({
      ...sub,
      name: getSubentity(t, sub.id, sub.name),
    })),
  }));

  const products: Product[] = rawProducts.map((p) => ({
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
