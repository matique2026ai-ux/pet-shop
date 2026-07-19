const STORAGE_KEY = "pet_shop_products";

export interface ProductData {
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
  stock_quantity?: number;
  sold_by?: string;
  video?: string;
  ingredients?: string;
  created_at?: string;
  images?: string[];
  variants?: string[];
}

function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_url_here");
}

function getLocalProducts(): ProductData[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalProducts(products: ProductData[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

async function apiFetch(url: string, options?: RequestInit) {
  const secret = typeof window !== "undefined" ? sessionStorage.getItem("admin_secret") : null;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "x-admin-secret": secret } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getProducts(): Promise<ProductData[]> {
  if (isSupabaseConfigured()) {
    try {
      return await apiFetch("/api/products");
    } catch {
      return getLocalProducts();
    }
  }
  return getLocalProducts();
}

export async function createProduct(product: Omit<ProductData, "id" | "created_at">): Promise<ProductData> {
  if (isSupabaseConfigured()) {
    return apiFetch("/api/products", { method: "POST", body: JSON.stringify(product) });
  }
  const products = getLocalProducts();
  const newProduct = { ...product, id: crypto.randomUUID(), created_at: new Date().toISOString() };
  saveLocalProducts([newProduct, ...products]);
  return newProduct;
}

export async function updateProduct(id: string, product: Partial<ProductData>): Promise<ProductData> {
  if (isSupabaseConfigured()) {
    return apiFetch(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(product) });
  }
  const products = getLocalProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  products[idx] = { ...products[idx], ...product };
  saveLocalProducts(products);
  return products[idx];
}

export async function deleteProduct(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    await apiFetch(`/api/products/${id}`, { method: "DELETE" });
    return;
  }
  const products = getLocalProducts();
  saveLocalProducts(products.filter((p) => p.id !== id));
}
