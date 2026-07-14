"use client";

import { useState, useEffect } from "react";

export type AdminLang = "en" | "fr" | "ar";

type AdminTranslations = {
  nav: { dashboard: string; products: string; orders: string; analytics: string; categories: string; settings: string; translations: string; viewStore: string };
  title: { dashboard: string; products: string; orders: string; analytics: string; categories: string; settings: string; translations: string };
  lang: { label: string; en: string; fr: string; ar: string };
  common: { loading: string; save: string; cancel: string; create: string; update: string; delete: string; search: string; all: string; confirm: string; close: string; add: string; name: string; id: string; icon: string; order: string; required: string };
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
    soldBy: string; soldByPiece: string; soldByWeight: string; weightHelp: string;
    video: string; videoHelp: string; ingredients: string; ingredientsHelp: string;
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
  settings: {
    title: string; subtitle: string; quickActions: string;
    store: string; content: string; translations: string; delivery: string;
    phone: string; email: string; whatsapp: string; address: string; facebook: string; instagram: string;
    currencyLabel: string; deliveryFee: string; freeThreshold: string; storeName: string;
    heroTitle: string; heroSubtitle: string; heroCta1: string; heroCta2: string; footerText: string; about: string;
    saved: string;
    deliveryCity: string; deliveryWilaya: string; deliveryScope: string;
    deliveryEta: string; deliveryNote: string; deliveryAreas: string;
    scopeCommune: string; scopeWilaya: string; scopeNational: string; scopeInternational: string;
  };
  cats: {
    title: string; subtitle: string; addCategory: string; editCategory: string; addSub: string; editSub: string;
    idHelp: string; noCats: string; subOf: string; subcount: string; manage: string; deleteConfirm: string;
  };
};

const en: AdminTranslations = {
  nav: { dashboard: "Dashboard", products: "Products", orders: "Orders", analytics: "Analytics", categories: "Categories", settings: "Settings", translations: "Translations", viewStore: "View Store" },
  title: { dashboard: "Admin Dashboard", products: "Products", orders: "Orders", analytics: "Analytics", categories: "Categories", settings: "Settings", translations: "Translations" },
  lang: { label: "Language", en: "English", fr: "Français", ar: "العربية" },
  common: { loading: "Loading...", save: "Save", cancel: "Cancel", create: "Create", update: "Update", delete: "Delete", search: "Search", all: "All", confirm: "Confirm", close: "Close", add: "Add", name: "Name", id: "ID", icon: "Icon", order: "Order", required: "is required" },
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
    soldBy: "Sold By", soldByPiece: "Piece (each)", soldByWeight: "Weight (kg)", weightHelp: "Price is per kg. Customer chooses the weight (e.g. 0.5 kg).",
    video: "Product Video URL", videoHelp: "Optional. YouTube, Vimeo, or a direct .mp4 link. Shown on the product page.", ingredients: "Ingredients & Composition", ingredientsHelp: "Optional. List the ingredients / composition (supports multiple lines).",
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
  settings: {
    title: "Settings", subtitle: "Manage your store configuration", quickActions: "Quick Actions",
    store: "Store Information", content: "Site Content", translations: "Translations", delivery: "Delivery",
    phone: "Phone", email: "Email", whatsapp: "WhatsApp", address: "Address", facebook: "Facebook", instagram: "Instagram",
    currencyLabel: "Currency Label", deliveryFee: "Delivery Fee", freeThreshold: "Free Delivery Threshold", storeName: "Store Name",
    heroTitle: "Hero Title", heroSubtitle: "Hero Subtitle", heroCta1: "Hero Button 1", heroCta2: "Hero Button 2", footerText: "Footer Text", about: "About Snippet",
    saved: "Saved successfully",
    deliveryCity: "City", deliveryWilaya: "Wilaya", deliveryScope: "Coverage Scope",
    deliveryEta: "Delivery Time (ETA)", deliveryNote: "Public Note", deliveryAreas: "Covered Areas (comma-separated)",
    scopeCommune: "Commune (e.g. Sétif)", scopeWilaya: "Wilaya", scopeNational: "National", scopeInternational: "International",
  },
  cats: {
    title: "Categories", subtitle: "Manage product categories and subcategories", addCategory: "Add Category", editCategory: "Edit Category",
    addSub: "Add Subcategory", editSub: "Edit Subcategory", idHelp: "Unique ID (slug), e.g. cats", noCats: "No categories yet",
    subOf: "Subcategory of", subcount: "{n} subcategories", manage: "Manage", deleteConfirm: "Delete this category and all its subcategories?",
  },
};

const fr: AdminTranslations = {
  nav: { dashboard: "Tableau de bord", products: "Produits", orders: "Commandes", analytics: "Analytique", categories: "Catégories", settings: "Paramètres", translations: "Traductions", viewStore: "Voir la boutique" },
  title: { dashboard: "Tableau de bord admin", products: "Produits", orders: "Commandes", analytics: "Analytique", categories: "Catégories", settings: "Paramètres", translations: "Traductions" },
  lang: { label: "Langue", en: "English", fr: "Français", ar: "العربية" },
  common: { loading: "Chargement...", save: "Enregistrer", cancel: "Annuler", create: "Créer", update: "Mettre à jour", delete: "Supprimer", search: "Rechercher", all: "Tous", confirm: "Confirmer", close: "Fermer", add: "Ajouter", name: "Nom", id: "ID", icon: "Icône", order: "Ordre", required: "est requis" },
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
    soldBy: "Vendu par", soldByPiece: "Pièce", soldByWeight: "Poids (kg)", weightHelp: "Le prix est au kg. Le client choisit le poids (ex. 0,5 kg).",
    video: "URL de la vidéo produit", videoHelp: "Facultatif. YouTube, Vimeo ou un lien .mp4 direct. Affiché sur la page produit.", ingredients: "Ingrédients & Composition", ingredientsHelp: "Facultatif. Listez les ingrédients / la composition (plusieurs lignes possibles).",
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
  settings: {
    title: "Paramètres", subtitle: "Gérez la configuration de votre boutique", quickActions: "Actions rapides",
    store: "Informations du magasin", content: "Contenu du site", translations: "Traductions", delivery: "Livraison",
    phone: "Téléphone", email: "E-mail", whatsapp: "WhatsApp", address: "Adresse", facebook: "Facebook", instagram: "Instagram",
    currencyLabel: "Libellé de la devise", deliveryFee: "Frais de livraison", freeThreshold: "Seuil de livraison gratuite", storeName: "Nom du magasin",
    heroTitle: "Titre de l'accueil", heroSubtitle: "Sous-titre de l'accueil", heroCta1: "Bouton 1", heroCta2: "Bouton 2", footerText: "Texte du pied de page", about: "À propos",
    saved: "Enregistré avec succès",
    deliveryCity: "Ville", deliveryWilaya: "Wilaya", deliveryScope: "Zone de couverture",
    deliveryEta: "Délai de livraison (ETA)", deliveryNote: "Note publique", deliveryAreas: "Zones couvertes (séparées par virgule)",
    scopeCommune: "Commune (ex. Sétif)", scopeWilaya: "Wilaya", scopeNational: "National", scopeInternational: "International",
  },
  cats: {
    title: "Catégories", subtitle: "Gérez les catégories et sous-catégories", addCategory: "Ajouter une catégorie", editCategory: "Modifier la catégorie",
    addSub: "Ajouter une sous-catégorie", editSub: "Modifier la sous-catégorie", idHelp: "ID unique (slug), ex. cats", noCats: "Aucune catégorie pour l'instant",
    subOf: "Sous-catégorie de", subcount: "{n} sous-catégories", manage: "Gérer", deleteConfirm: "Supprimer cette catégorie et toutes ses sous-catégories ?",
  },
};

const ar: AdminTranslations = {
  nav: { dashboard: "لوحة التحكم", products: "المنتجات", orders: "الطلبات", analytics: "التحليلات", categories: "الفئات", settings: "الإعدادات", translations: "الترجمات", viewStore: "عرض المتجر" },
  title: { dashboard: "لوحة تحكم المدير", products: "المنتجات", orders: "الطلبات", analytics: "التحليلات", categories: "الفئات", settings: "الإعدادات", translations: "الترجمات" },
  lang: { label: "اللغة", en: "English", fr: "Français", ar: "العربية" },
  common: { loading: "جارٍ التحميل...", save: "حفظ", cancel: "إلغاء", create: "إنشاء", update: "تحديث", delete: "حذف", search: "بحث", all: "الكل", confirm: "تأكيد", close: "إغلاق", add: "إضافة", name: "الاسم", id: "المعرّف", icon: "الأيقونة", order: "الترتيب", required: "مطلوب" },
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
    soldBy: "يُباع بـ", soldByPiece: "قطعة", soldByWeight: "الوزن (كغ)", weightHelp: "السعر للكيلوغرام. يختار الزبون الوزن (مثلاً 0.5 كغ).",
    video: "رابط فيديو المنتج", videoHelp: "اختياري. YouTube أو Vimeo أو رابط .mp4 مباشر. يُعرض في صفحة المنتج.", ingredients: "المكوّنات والتركيبة", ingredientsHelp: "اختياري. اذكر المكوّنات/التركيبة (أسطر متعددة).",
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
  settings: {
    title: "الإعدادات", subtitle: "إدارة إعدادات متجرك", quickActions: "إجراءات سريعة",
    store: "معلومات المتجر", content: "محتوى الموقع", translations: "الترجمات", delivery: "التوصيل",
    phone: "الهاتف", email: "البريد الإلكتروني", whatsapp: "واتساب", address: "العنوان", facebook: "فيسبوك", instagram: "إنستغرام",
    currencyLabel: "رمز العملة", deliveryFee: "رسوم التوصيل", freeThreshold: "حد التوصيل المجاني", storeName: "اسم المتجر",
    heroTitle: "عنوان الواجهة", heroSubtitle: "العنوان الفرعي للواجهة", heroCta1: "الزر الأول", heroCta2: "الزر الثاني", footerText: "نص التذييل", about: "نبذة عنا",
    saved: "تم الحفظ بنجاح",
    deliveryCity: "المدينة", deliveryWilaya: "الولاية", deliveryScope: "نطاق التغطية",
    deliveryEta: "مدة التوصيل (الوقت المقدر)", deliveryNote: "ملاحظة عامة", deliveryAreas: "المناطق المغطاة (مفصولة بفاصلة)",
    scopeCommune: "بلدية (مثل سطيف)", scopeWilaya: "ولاية", scopeNational: "وطني", scopeInternational: "دولي",
  },
  cats: {
    title: "الفئات", subtitle: "إدارة فئات المنتجات والفئات الفرعية", addCategory: "إضافة فئة", editCategory: "تعديل الفئة",
    addSub: "إضافة فئة فرعية", editSub: "تعديل الفئة الفرعية", idHelp: "معرّف فريد (slug)، مثل cats", noCats: "لا توجد فئات بعد",
    subOf: "فئة فرعية من", subcount: "{n} فئات فرعية", manage: "إدارة", deleteConfirm: "حذف هذه الفئة وكل فئاتها الفرعية؟",
  },
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
