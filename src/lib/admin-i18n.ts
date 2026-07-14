"use client";

import { useState, useEffect } from "react";

export type AdminLang = "en" | "fr" | "ar";

type AdminTranslations = {
  nav: { dashboard: string; products: string; orders: string; analytics: string; settings: string; viewStore: string };
  title: { dashboard: string; products: string; orders: string; analytics: string; settings: string };
  lang: { label: string; en: string; fr: string; ar: string };
  common: { loading: string; save: string; cancel: string; create: string; update: string; delete: string; search: string; all: string; confirm: string; close: string; add: string };
  dashboard: {
    inventoryValue: string; totalOrders: string; totalCustomers: string; totalProducts: string;
    revenueOverview: string; revenueSub: string; recentOrders: string; noRecent: string;
    sampleMode: string; sampleModeBody: string;
  };
  products: {
    title: string; addProduct: string; editProduct: string; searchPlaceholder: string;
    allCategories: string; allStock: string; inStock: string; outOfStock: string;
    stockQuantity: string; stockHelp: string; noProducts: string; addFirst: string;
    filtersNoMatch: string; clearFilters: string; name: string; category: string; price: string; oldPrice: string; stock: string; badge: string; actions: string;
  };
  orders: {
    title: string; total: string; loading: string; noOrders: string;
    order: string; customer: string; product: string; amount: string; status: string; date: string;
  };
  analytics: {
    totalProducts: string; inStock: string; outOfStock: string; categories: string;
    perCategory: string; priceDist: string; topRated: string; topRatedSub: string;
    name: string; rating: string; reviews: string; under20: string; b2050: string; b50100: string; b100: string;
  };
  settings: { title: string; subtitle: string; quickActions: string };
};

const en: AdminTranslations = {
  nav: { dashboard: "Dashboard", products: "Products", orders: "Orders", analytics: "Analytics", settings: "Settings", viewStore: "View Store" },
  title: { dashboard: "Admin Dashboard", products: "Products", orders: "Orders", analytics: "Analytics", settings: "Settings" },
  lang: { label: "Language", en: "English", fr: "Français", ar: "العربية" },
  common: { loading: "Loading...", save: "Save", cancel: "Cancel", create: "Create", update: "Update", delete: "Delete", search: "Search", all: "All", confirm: "Confirm", close: "Close", add: "Add" },
  dashboard: {
    inventoryValue: "Inventory Value", totalOrders: "Total Orders", totalCustomers: "Total Customers", totalProducts: "Total Products",
    revenueOverview: "Revenue Overview", revenueSub: "Monthly revenue & order trends", recentOrders: "Recent Orders", noRecent: "No orders yet",
    sampleMode: "Sample Data Mode", sampleModeBody: "Admin dashboard with sample data. Connect to a backend for live data.",
  },
  products: {
    title: "Products", addProduct: "Add Product", editProduct: "Edit Product", searchPlaceholder: "Search products...",
    allCategories: "All Categories", allStock: "All Stock", inStock: "In Stock", outOfStock: "Out of Stock",
    stockQuantity: "Stock Quantity", stockHelp: "0 = out of stock. Product is marked “In Stock” when quantity > 0.",
    noProducts: "No products yet", addFirst: "Add your first product to get started", filtersNoMatch: "No products match your filters", clearFilters: "Clear filters",
    name: "Name", category: "Category", price: "Price", oldPrice: "Old Price", stock: "Stock", badge: "Badge", actions: "Actions",
  },
  orders: {
    title: "All Orders", total: "orders total", loading: "Loading orders...", noOrders: "No orders yet",
    order: "Order", customer: "Customer", product: "Items", amount: "Amount", status: "Status", date: "Date",
  },
  analytics: {
    totalProducts: "Total Products", inStock: "In Stock", outOfStock: "Out of Stock", categories: "Categories",
    perCategory: "Products per Category", priceDist: "Price Distribution", topRated: "Top Rated Products", topRatedSub: "Products with highest ratings",
    name: "Name", rating: "Rating", reviews: "Reviews", under20: "Under 20", b2050: "20 - 50", b50100: "50 - 100", b100: "100+",
  },
  settings: { title: "Settings", subtitle: "Manage your store configuration", quickActions: "Quick Actions" },
};

const fr: AdminTranslations = {
  nav: { dashboard: "Tableau de bord", products: "Produits", orders: "Commandes", analytics: "Analytique", settings: "Paramètres", viewStore: "Voir la boutique" },
  title: { dashboard: "Tableau de bord admin", products: "Produits", orders: "Commandes", analytics: "Analytique", settings: "Paramètres" },
  lang: { label: "Langue", en: "English", fr: "Français", ar: "العربية" },
  common: { loading: "Chargement...", save: "Enregistrer", cancel: "Annuler", create: "Créer", update: "Mettre à jour", delete: "Supprimer", search: "Rechercher", all: "Tous", confirm: "Confirmer", close: "Fermer", add: "Ajouter" },
  dashboard: {
    inventoryValue: "Valeur du stock", totalOrders: "Commandes totales", totalCustomers: "Clients totals", totalProducts: "Produits totals",
    revenueOverview: "Aperçu des revenus", revenueSub: "Tendances mensuelles des revenus et commandes", recentOrders: "Commandes récentes", noRecent: "Aucune commande pour l'instant",
    sampleMode: "Mode données exemple", sampleModeBody: "Tableau de bord avec des données exemple. Connectez un backend pour les données en direct.",
  },
  products: {
    title: "Produits", addProduct: "Ajouter un produit", editProduct: "Modifier le produit", searchPlaceholder: "Rechercher des produits...",
    allCategories: "Toutes les catégories", allStock: "Tout le stock", inStock: "En stock", outOfStock: "Rupture de stock",
    stockQuantity: "Quantité en stock", stockHelp: "0 = rupture de stock. Le produit est « En stock » si quantité > 0.",
    noProducts: "Aucun produit pour l'instant", addFirst: "Ajoutez votre premier produit", filtersNoMatch: "Aucun produit ne correspond à vos filtres", clearFilters: "Effacer les filtres",
    name: "Nom", category: "Catégorie", price: "Prix", oldPrice: "Ancien prix", stock: "Stock", badge: "Badge", actions: "Actions",
  },
  orders: {
    title: "Toutes les commandes", total: "commandes au total", loading: "Chargement des commandes...", noOrders: "Aucune commande pour l'instant",
    order: "Commande", customer: "Client", product: "Articles", amount: "Montant", status: "Statut", date: "Date",
  },
  analytics: {
    totalProducts: "Produits totals", inStock: "En stock", outOfStock: "Rupture de stock", categories: "Catégories",
    perCategory: "Produits par catégorie", priceDist: "Répartition des prix", topRated: "Produits les mieux notés", topRatedSub: "Produits avec les meilleures notes",
    name: "Nom", rating: "Note", reviews: "Avis", under20: "Moins de 20", b2050: "20 - 50", b50100: "50 - 100", b100: "100+",
  },
  settings: { title: "Paramètres", subtitle: "Gérez la configuration de votre boutique", quickActions: "Actions rapides" },
};

const ar: AdminTranslations = {
  nav: { dashboard: "لوحة التحكم", products: "المنتجات", orders: "الطلبات", analytics: "التحليلات", settings: "الإعدادات", viewStore: "عرض المتجر" },
  title: { dashboard: "لوحة تحكم المدير", products: "المنتجات", orders: "الطلبات", analytics: "التحليلات", settings: "الإعدادات" },
  lang: { label: "اللغة", en: "English", fr: "Français", ar: "العربية" },
  common: { loading: "جارٍ التحميل...", save: "حفظ", cancel: "إلغاء", create: "إنشاء", update: "تحديث", delete: "حذف", search: "بحث", all: "الكل", confirm: "تأكيد", close: "إغلاق", add: "إضافة" },
  dashboard: {
    inventoryValue: "قيمة المخزون", totalOrders: "إجمالي الطلبات", totalCustomers: "إجمالي العملاء", totalProducts: "إجمالي المنتجات",
    revenueOverview: "نظرة عامة على الإيرادات", revenueSub: "اتجاهات الإيرادات والطلبات الشهرية", recentOrders: "أحدث الطلبات", noRecent: "لا توجد طلبات بعد",
    sampleMode: "وضع البيانات التجريبية", sampleModeBody: "لوحة تحكم ببيانات تجريبية. اتصل بقاعدة بيانات خلفية لعرض البيانات الحقيقية.",
  },
  products: {
    title: "المنتجات", addProduct: "إضافة منتج", editProduct: "تعديل المنتج", searchPlaceholder: "ابحث عن المنتجات...",
    allCategories: "كل الفئات", allStock: "كل المخزون", inStock: "متوفر", outOfStock: "غير متوفر",
    stockQuantity: "كمية المخزون", stockHelp: "0 = غير متوفر. يُعتبر المنتج «متوفر» عندما تكون الكمية > 0.",
    noProducts: "لا توجد منتجات بعد", addFirst: "أضف أول منتج لتبدأ", filtersNoMatch: "لا توجد منتجات تطابق عوامل التصفية", clearFilters: "مسح عوامل التصفية",
    name: "الاسم", category: "الفئة", price: "السعر", oldPrice: "السعر القديم", stock: "المخزون", badge: "الشارة", actions: "الإجراءات",
  },
  orders: {
    title: "كل الطلبات", total: "طلبًا إجمالاً", loading: "جارٍ تحميل الطلبات...", noOrders: "لا توجد طلبات بعد",
    order: "الطلب", customer: "العميل", product: "العناصر", amount: "المبلغ", status: "الحالة", date: "التاريخ",
  },
  analytics: {
    totalProducts: "إجمالي المنتجات", inStock: "متوفر", outOfStock: "غير متوفر", categories: "الفئات",
    perCategory: "المنتجات حسب الفئة", priceDist: "توزيع الأسعار", topRated: "المنتجات الأعلى تقييمًا", topRatedSub: "المنتجات ذات التقييمات الأعلى",
    name: "الاسم", rating: "التقييم", reviews: "التقييمات", under20: "أقل من 20", b2050: "20 - 50", b50100: "50 - 100", b100: "100+",
  },
  settings: { title: "الإعدادات", subtitle: "إدارة إعدادات متجرك", quickActions: "إجراءات سريعة" },
};

const dict: Record<AdminLang, AdminTranslations> = { en, fr, ar };

export function useAdminI18n() {
  const [adminLang, setAdminLangState] = useState<AdminLang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("admin_lang")) as AdminLang | null;
    if (saved && saved in dict) setAdminLangState(saved);
  }, []);

  const setAdminLang = (l: AdminLang) => {
    setAdminLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("admin_lang", l);
  };

  return { adminLang, setAdminLang, a: dict[adminLang], dir: adminLang === "ar" ? "rtl" : "ltr" };
}
