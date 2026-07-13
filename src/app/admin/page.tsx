"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import type { ProductData } from "@/lib/data-service";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Users, ShoppingBag, DollarSign, Package, TrendingUp, TrendingDown,
  MoreHorizontal, Eye, Edit, Trash2, ArrowUpRight, Calendar, Menu, X, Lock,
  LayoutDashboard, Package2, ShoppingCart, BarChart3, Settings, Plus, ImageIcon, Upload, ChevronDown,
} from "lucide-react";

const COLORS = ["#059669", "#10B981", "#34D399", "#6EE7B7", "#A7F3D0"];

const sidebarTabs = [
  { label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { label: "Products", icon: Package2, key: "products" },
  { label: "Orders", icon: ShoppingCart, key: "orders" },
  { label: "Analytics", icon: BarChart3, key: "analytics", soon: true },
  { label: "Settings", icon: Settings, key: "settings", soon: true },
];

interface Category {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

interface Order {
  id: string;
  customer_name?: string;
  product_name?: string;
  total?: number;
  status?: string;
  created_at?: string;
}

const sampleRevenue = [
  { month: "Jan", revenue: 12400, orders: 45 },
  { month: "Feb", revenue: 15200, orders: 52 },
  { month: "Mar", revenue: 18100, orders: 68 },
  { month: "Apr", revenue: 16900, orders: 58 },
  { month: "May", revenue: 22400, orders: 78 },
  { month: "Jun", revenue: 27800, orders: 92 },
  { month: "Jul", revenue: 31500, orders: 105 },
  { month: "Aug", revenue: 28900, orders: 98 },
  { month: "Sep", revenue: 34200, orders: 120 },
  { month: "Oct", revenue: 37100, orders: 132 },
  { month: "Nov", revenue: 42800, orders: 156 },
  { month: "Dec", revenue: 52300, orders: 189 },
];

const sampleCategoryDist = [
  { name: "Cats", value: 35 },
  { name: "Dogs", value: 30 },
  { name: "Birds", value: 15 },
  { name: "Fish", value: 12 },
  { name: "Others", value: 8 },
];

const sampleRecentOrders = [
  { id: "#ORD-001", customer: "Sarah M.", product: "Premium Dry Cat Food", amount: 32.99, status: "Completed", date: "2024-12-15" },
  { id: "#ORD-002", customer: "Ahmed K.", product: "Adjustable Dog Harness", amount: 34.99, status: "Processing", date: "2024-12-14" },
  { id: "#ORD-003", customer: "Lisa R.", product: "Cat Tree Tower 6-Level", amount: 139.99, status: "Completed", date: "2024-12-14" },
  { id: "#ORD-004", customer: "Carlos D.", product: "Aquarium Starter Kit", amount: 89.99, status: "Pending", date: "2024-12-13" },
  { id: "#ORD-005", customer: "Emma J.", product: "Grooming Package - Full", amount: 65.00, status: "Completed", date: "2024-12-13" },
];

const sampleTopProducts = [
  { name: "Premium Dry Cat Food 2kg", sales: 342, revenue: 11288, growth: "+12%" },
  { name: "Cat Tree Tower 6-Level", sales: 189, revenue: 26458, growth: "+24%" },
  { name: "Adjustable Dog Harness", sales: 276, revenue: 9657, growth: "+8%" },
  { name: "Aquarium Starter Kit 20L", sales: 145, revenue: 13048, growth: "+18%" },
  { name: "Orthopedic Cat Bed - Large", sales: 198, revenue: 11878, growth: "+32%" },
];

function StatCard({ icon: Icon, label, value, trend, trendUp, color }: {
  icon: React.ElementType; label: string; value: string; trend?: string; trendUp?: boolean; color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
              {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color || "bg-emerald-100 text-emerald-600"}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: "bg-emerald-100 text-emerald-700",
    Processing: "bg-amber-100 text-amber-700",
    Pending: "bg-orange-100 text-orange-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function ProductBadge({ badge }: { badge?: string | null }) {
  if (!badge) return null;
  const styles: Record<string, string> = { NEW: "bg-blue-100 text-blue-700", SALE: "bg-red-100 text-red-700" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${styles[badge] || "bg-gray-100 text-gray-600"}`}>
      {badge}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm" style={{ color: p.color }}>
            {p.name}: {p.name === "Revenue" ? `$${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

type FormState = {
  name: string;
  category: string;
  subcategory: string;
  price: string;
  originalPrice: string;
  image: string;
  badge: "" | "NEW" | "SALE";
  rating: string;
  reviews: string;
  description: string;
  features: string;
  inStock: boolean;
};

const emptyForm: FormState = {
  name: "",
  category: "",
  subcategory: "",
  price: "",
  originalPrice: "",
  image: "",
  badge: "",
  rating: "4.5",
  reviews: "0",
  description: "",
  features: "",
  inStock: true,
};

export default function AdminDashboard() {
  const { t } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [productsError, setProductsError] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ProductData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "1") setAuthed(true);
  }, []);

  const getSecret = useCallback(() => sessionStorage.getItem("admin_secret") || "", []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("admin_auth", "1");
      sessionStorage.setItem("admin_secret", password);
    }
  };

  const apiFetch = useCallback(async (url: string, options?: RequestInit) => {
    const secret = getSecret();
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "x-admin-secret": secret } : {}),
        ...options?.headers,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
  }, [getSecret]);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductsError(false);
    try {
      const data = await apiFetch("/api/products");
      setProducts(data);
    } catch {
      setProductsError(true);
    } finally {
      setLoadingProducts(false);
    }
  }, [apiFetch]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetch("/api/categories").then((r) => r.json());
      setCategories(data);
    } catch {
      // fallback empty
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const data = await apiFetch("/api/orders");
      setOrders(data);
    } catch {
      // fallback to sample
    } finally {
      setLoadingOrders(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    if (!authed) return;
    loadCategories();
  }, [authed, loadCategories]);

  useEffect(() => {
    if (!authed) return;
    if (activeTab === "dashboard") loadOrders();
    if (activeTab === "products" || activeTab === "dashboard") loadProducts();
  }, [authed, activeTab, loadOrders, loadProducts]);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (product: ProductData) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || "",
      price: String(product.price),
      originalPrice: product.original_price ? String(product.original_price) : "",
      image: product.image || "",
      badge: (product.badge as "" | "NEW" | "SALE") || "",
      rating: String(product.rating),
      reviews: String(product.reviews),
      description: product.description || "",
      features: product.features?.join(", ") || "",
      inStock: product.in_stock,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errors.name = "Required";
    if (!form.category) errors.category = "Required";
    if (!form.subcategory) errors.subcategory = "Required";
    if (!form.price || isNaN(Number(form.price))) errors.price = "Required";
    if (form.originalPrice && isNaN(Number(form.originalPrice))) errors.originalPrice = "Invalid number";
    if (form.rating && (isNaN(Number(form.rating)) || Number(form.rating) < 1 || Number(form.rating) > 5)) errors.rating = "Must be 1-5";
    if (form.reviews && isNaN(Number(form.reviews))) errors.reviews = "Invalid number";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const body: Omit<ProductData, "id" | "created_at"> & { original_price?: number } = {
        name: form.name.trim(),
        category: form.category,
        subcategory: form.subcategory,
        price: Number(form.price),
        image: form.image || undefined,
        badge: form.badge || null,
        rating: Number(form.rating),
        reviews: Number(form.reviews),
        description: form.description || undefined,
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
        in_stock: form.inStock,
      };
      if (form.originalPrice) body.original_price = Number(form.originalPrice);

      if (editingProduct) {
        await apiFetch(`/api/products/${editingProduct.id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await apiFetch("/api/products", { method: "POST", body: JSON.stringify(body) });
      }
      closeModal();
      await loadProducts();
    } catch (e) {
      alert("Failed to save product: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      await loadProducts();
    } catch (e) {
      alert("Failed to delete: " + (e as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const secret = getSecret();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: secret ? { "x-admin-secret": secret } : {},
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setForm({ ...form, image: data.url });
    } catch (e) {
      alert("Upload failed: " + (e as Error).message);
    } finally {
      setUploadingImage(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Admin Access</h1>
          <p className="text-sm text-gray-500 mb-6">Enter password to access the dashboard</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
            <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const productCount = products.length;
  const totalRevenue = products.reduce((s, p) => s + p.price, 0);
  const catDist = categories.map((c) => ({
    name: c.name,
    value: products.filter((p) => p.category === c.id).length || 1,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#1a1512] to-[#3a220a] text-white
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  P
                </div>
                <div>
                  <p className="font-bold text-white text-lg leading-tight">Paws & Wings</p>
                  <p className="text-xs text-emerald-300/60">Admin Panel</p>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    if (!tab.soon) {
                      setActiveTab(tab.key);
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : tab.soon
                        ? "text-white/30 cursor-not-allowed"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.soon && (
                    <span className="ml-auto text-[10px] uppercase tracking-wider text-white/20 bg-white/5 px-2 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-all">
              <ArrowUpRight className="w-4 h-4" />
              <span>View Store</span>
            </Link>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">
                  {activeTab === "dashboard" && "Admin Dashboard"}
                  {activeTab === "products" && "Products"}
                  {activeTab === "orders" && "Orders"}
                  {activeTab === "analytics" && "Analytics"}
                  {activeTab === "settings" && "Settings"}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Dec 1 - Dec 31, 2024</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* ===== DASHBOARD ===== */}
            {activeTab === "dashboard" && (
              <>
                {productsError && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Sample Data Mode</p>
                      <p className="text-xs text-amber-700/70 mt-0.5">
                        Admin dashboard with sample data. Connect to a backend for live data.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    icon={DollarSign}
                    label="Total Revenue"
                    value={productsError ? "$124,500" : `$${totalRevenue.toLocaleString()}`}
                    trend="+12.5% from last month"
                    trendUp
                    color="bg-emerald-100 text-emerald-600"
                  />
                  <StatCard
                    icon={ShoppingBag}
                    label="Total Orders"
                    value={loadingOrders ? "..." : String(orders.length || "1,893")}
                    trend="+8.2% from last month"
                    trendUp
                    color="bg-blue-100 text-blue-600"
                  />
                  <StatCard
                    icon={Users}
                    label="Total Customers"
                    value={productsError ? "1,247" : "1,247"}
                    trend="+5.4% from last month"
                    trendUp
                    color="bg-purple-100 text-purple-600"
                  />
                  <StatCard
                    icon={Package}
                    label="Total Products"
                    value={loadingProducts ? "..." : String(productCount || "168")}
                    trend="+3 new this month"
                    trendUp
                    color="bg-rose-100 text-rose-600"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Monthly revenue & order trends</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                          <span>Revenue</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                          <span>Orders</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sampleRevenue} barGap={2}>
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                          <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={24} />
                          <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#6EE7B7" radius={[4, 4, 0, 0]} maxBarSize={24} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Category Sales</h2>
                      <p className="text-sm text-gray-500 mt-0.5">Distribution by pet</p>
                    </div>
                    <div className="h-64 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={catDist.length ? catDist : sampleCategoryDist}
                            cx="50%"
                            cy="50%"
                            innerRadius={52}
                            outerRadius={88}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {(catDist.length ? catDist : sampleCategoryDist).map((_, i) => (
                              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2.5 mt-2">
                      {(catDist.length ? catDist : sampleCategoryDist).map((item, i) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                            <span className="text-gray-700">{item.name}</span>
                          </div>
                          <span className="font-semibold text-gray-900">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Latest transactions</p>
                      </div>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-sm text-emerald-600 font-medium hover:text-emerald-700"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-y border-gray-100 bg-gray-50/50">
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(orders.length ? orders.slice(0, 5) : sampleRecentOrders).map((order: any, i: number) => (
                          <tr key={order.id || i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-900">{order.id || `#ORD-${i + 1}`}</td>
                            <td className="px-6 py-4 text-gray-700">{order.customer || order.customer_name || "-"}</td>
                            <td className="px-6 py-4 text-gray-700 max-w-[200px] truncate">{order.product || order.product_name || "-"}</td>
                            <td className="px-6 py-4 font-semibold text-gray-900">${(order.amount || order.total || 0).toFixed(2)}</td>
                            <td className="px-6 py-4"><StatusBadge status={order.status || "Pending"} /></td>
                            <td className="px-6 py-4 text-gray-500">{order.date || order.created_at?.slice(0, 10) || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
                      <p className="text-sm text-gray-500 mt-0.5">Best performing products this month</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("products")}
                      className="text-sm text-emerald-600 font-medium hover:text-emerald-700"
                    >
                      View Products
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {sampleTopProducts.map((product, i) => (
                      <div key={i} className="relative bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all group">
                        <div className="absolute top-3 right-3 w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center text-xs font-bold text-emerald-600">
                          {i + 1}
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Package className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between text-gray-500">
                            <span>Sales</span>
                            <span className="font-medium text-gray-900">{product.sales}</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>Revenue</span>
                            <span className="font-medium text-gray-900">${product.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>Growth</span>
                            <span className="font-medium text-emerald-600">{product.growth}</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-emerald-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${(product.sales / 342) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ===== PRODUCTS ===== */}
            {activeTab === "products" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">All Products</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{productCount} products total</p>
                  </div>
                  <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  {loadingProducts ? (
                    <div className="flex items-center justify-center py-16 text-gray-400">
                      <div className="animate-spin w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full mr-3" />
                      Loading products...
                    </div>
                  ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <Package2 className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-sm font-medium text-gray-500">No products yet</p>
                      <p className="text-xs text-gray-400 mt-1">Add your first product to get started</p>
                      <button
                        onClick={openAddModal}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Product
                      </button>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-y border-gray-100 bg-gray-50/50">
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Badge</th>
                          <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => {
                          const cat = categories.find((c) => c.id === product.category);
                          return (
                            <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                    <ImageIcon className="w-5 h-5" />
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 font-semibold text-gray-900 max-w-[200px] truncate">{product.name}</td>
                              <td className="px-6 py-4 text-gray-700">{cat?.name || product.category}</td>
                              <td className="px-6 py-4 font-semibold text-gray-900">${product.price.toFixed(2)}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  product.in_stock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                }`}>
                                  {product.in_stock ? "In Stock" : "Out of Stock"}
                                </span>
                              </td>
                              <td className="px-6 py-4"><ProductBadge badge={product.badge} /></td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => openEditModal(product)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget(product)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ===== ORDERS ===== */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 pb-4">
                  <h2 className="text-lg font-bold text-gray-900">All Orders</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {loadingOrders ? "Loading..." : `${orders.length} orders total`}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-16 text-gray-400">
                      <div className="animate-spin w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full mr-3" />
                      Loading orders...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <ShoppingCart className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-sm font-medium text-gray-500">No orders yet</p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-y border-gray-100 bg-gray-50/50">
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order: any) => (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-900">{order.id}</td>
                            <td className="px-6 py-4 text-gray-700">{order.customer_name || "-"}</td>
                            <td className="px-6 py-4 text-gray-700 max-w-[200px] truncate">{order.product_name || "-"}</td>
                            <td className="px-6 py-4 font-semibold text-gray-900">${(order.total || 0).toFixed(2)}</td>
                            <td className="px-6 py-4"><StatusBadge status={order.status || "Pending"} /></td>
                            <td className="px-6 py-4 text-gray-500">{order.created_at?.slice(0, 10) || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ===== ANALYTICS / SETTINGS ===== */}
            {(activeTab === "analytics" || activeTab === "settings") && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                <BarChart3 className="w-16 h-16 text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  This section is under development. Check back later for updates.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ===== ADD/EDIT MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.name ? "border-red-300" : "border-gray-200"}`}
                />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: "" })}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.category ? "border-red-300" : "border-gray-200"}`}
                  >
                    <option value="">Select...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {formErrors.category && <p className="text-xs text-red-500 mt-1">{formErrors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory *</label>
                  <select
                    value={form.subcategory}
                    onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.subcategory ? "border-red-300" : "border-gray-200"}`}
                  >
                    <option value="">Select...</option>
                    {categories
                      .find((c) => c.id === form.category)
                      ?.subcategories.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                  </select>
                  {formErrors.subcategory && <p className="text-xs text-red-500 mt-1">{formErrors.subcategory}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.price ? "border-red-300" : "border-gray-200"}`}
                  />
                  {formErrors.price && <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                {!useUrlInput ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <label className={`px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors ${uploadingImage ? "bg-gray-100 text-gray-400" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                        {uploadingImage ? (
                          <span className="inline-flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full" />
                            Uploading...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Choose Image
                          </span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingImage}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setUseUrlInput(true)}
                        className="text-xs text-gray-400 hover:text-gray-600 underline"
                      >
                        Or paste URL
                      </button>
                    </div>
                    {form.image && (
                      <div className="flex items-center gap-3">
                        <img src={form.image} alt="preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, image: "" })}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setUseUrlInput(false)}
                      className="text-xs text-gray-400 hover:text-gray-600 underline whitespace-nowrap"
                    >
                      Upload instead
                    </button>
                    {form.image && (
                      <img src={form.image} alt="preview" className="w-10 h-10 rounded-lg object-cover" />
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Advanced Options
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
              </button>

              {showAdvanced && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.originalPrice ? "border-red-300" : "border-gray-200"}`}
                    />
                    {formErrors.originalPrice && <p className="text-xs text-red-500 mt-1">{formErrors.originalPrice}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                      <select
                        value={form.badge}
                        onChange={(e) => setForm({ ...form, badge: e.target.value as "" | "NEW" | "SALE" })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">None</option>
                        <option value="NEW">NEW</option>
                        <option value="SALE">SALE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: e.target.value })}
                        className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.rating ? "border-red-300" : "border-gray-200"}`}
                      />
                      {formErrors.rating && <p className="text-xs text-red-500 mt-1">{formErrors.rating}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reviews</label>
                      <input
                        type="number"
                        step="1"
                        value={form.reviews}
                        onChange={(e) => setForm({ ...form, reviews: e.target.value })}
                        className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.reviews ? "border-red-300" : "border-gray-200"}`}
                      />
                      {formErrors.reviews && <p className="text-xs text-red-500 mt-1">{formErrors.reviews}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
                    <input
                      type="text"
                      value={form.features}
                      onChange={(e) => setForm({ ...form, features: e.target.value })}
                      placeholder="Feature 1, Feature 2, Feature 3"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">In Stock</span>
              </label>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {saving && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                {editingProduct ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION ===== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {deleting && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
