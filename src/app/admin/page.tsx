"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { useAdminI18n } from "@/lib/admin-i18n";
import type { ProductData } from "@/lib/data-service";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Users, ShoppingBag, DollarSign, Package, TrendingUp, TrendingDown,
  Edit, Trash2, ArrowUpRight, Calendar, Menu, X, Lock, Phone,
  LayoutDashboard, Package2, ShoppingCart, BarChart3, Settings, Plus, ImageIcon, Upload, ChevronDown, Search, Filter, Tag, Languages, Video, Star, Check, ChevronRight,
} from "lucide-react";
import HeroVideoManager from "@/components/hero-video-manager";
import AdminSettingsPanel from "@/components/admin-settings-panel";
import { en } from "@/lib/translations/en";
import type { TranslationOverrides } from "@/lib/i18n-context";
import { LogoC1, LogoC4 } from "@/components/brand-logo";
import { type UnitType, UNIT_OPTIONS, isContinuousUnit, unitLabel } from "@/lib/units";

const COLORS = ["#059669", "#10B981", "#34D399", "#6EE7B7", "#A7F3D0"];

function flattenKeys(obj: any, prefix = "", out: { path: string }[] = []): { path: string }[] {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flattenKeys(v, path, out);
    else if (typeof v === "string") out.push({ path });
  }
  return out;
}

function getByPath(obj: any, path: string): string {
  return path.split(".").reduce((o, k) => (o ? o[k] : ""), obj) ?? "";
}

const TRANS_KEYS = flattenKeys(en);

const sidebarTabs = [
  { label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { label: "Products", icon: Package2, key: "products" },
  { label: "Orders", icon: ShoppingCart, key: "orders" },
  { label: "Analytics", icon: BarChart3, key: "analytics" },
   { label: "Categories", icon: Tag, key: "categories" },
   { label: "Reviews", icon: Star, key: "reviews" },
   { label: "Settings", icon: Settings, key: "settings" },
   { label: "Translations", icon: Languages, key: "translations" },
];

interface Category {
  id: string;
  name: string;
  icon?: string;
  order?: number;
  image_url?: string;
  subcategories: { id: string; name: string }[];
}

interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  products?: { name: string } | null;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email?: string | null;
  customer_phone: string;
  delivery_address: string;
  city?: string | null;
  delivery_area?: string | null;
  delivery_fee?: number;
  delivery_eta?: string | null;
  items: { id: string; name: string; price: number; quantity: number; image?: string }[];
  total: number;
  status: string;
  notes?: string | null;
  created_at: string;
  user_id?: string | null;
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

const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm" style={{ color: p.color }}>
            {p.name}: {p.name === "Revenue" ? `${p.value.toLocaleString()} ${currency}` : p.value}
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
  images: string[];
  badge: "" | "NEW" | "SALE";
  rating: string;
  reviews: string;
  description: string;
  features: string;
  stockQuantity: string;
  soldBy: UnitType;

  video: string;
  ingredients: string;
};

const emptyForm: FormState = {
  name: "",
  category: "",
  subcategory: "",
  price: "",
  originalPrice: "",
  image: "",
  images: [],
  badge: "",
  rating: "4.5",
  reviews: "0",
  description: "",
  features: "",
  stockQuantity: "0",
  soldBy: "piece" as UnitType,
  video: "",
  ingredients: "",
};

function OrderDetailRow({
  order, currency, ORDER_STATUSES, getStatusColor, onStatusChange, onDelete, a,
}: {
  order: Order;
  currency: string;
  ORDER_STATUSES: { value: string; label: string; color: string }[];
  getStatusColor: (s: string) => string;
  onStatusChange: (id: string, s: string) => void;
  onDelete: (id: string) => void;
  a: any;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <div className="grid grid-cols-12 gap-2 items-center px-6 py-4 hover:bg-gray-50/50 transition-colors">
        <button
          onClick={() => setExpanded(!expanded)}
          className="col-span-1 flex items-center gap-1 text-xs font-mono font-semibold text-gray-500 hover:text-gray-800"
          title="Show/hide details"
        >
          {expanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
          <span className="truncate">{order.id.slice(-6)}</span>
        </button>
        <div className="col-span-2 text-sm font-medium text-gray-900 truncate">{order.customer_name}</div>
        <div className="col-span-2 text-sm text-gray-500">{order.created_at?.slice(0, 10)}</div>
        <div className="col-span-2 text-sm font-semibold text-gray-900">{Number(order.total).toLocaleString()} {currency}</div>
        <div className="col-span-3">
          <select
            className={`w-full text-xs font-semibold px-2 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${getStatusColor(order.status)}`}
            value={order.status}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2 flex justify-end">
          <button
            onClick={() => onDelete(order.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-6 py-5 bg-blue-50/30 border-t border-blue-100 text-sm space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-xs uppercase mb-1">{a.orders.phone}</p>
              <div className="flex flex-wrap items-center gap-2">
                <a href={`tel:${order.customer_phone}`} className="font-semibold text-emerald-750 hover:underline flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> {order.customer_phone}
                </a>
                <a
                  href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-[#20ba56] transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
            {order.customer_email && (
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">{a.orders.email}</p>
                <p className="font-medium text-gray-900">{order.customer_email}</p>
              </div>
            )}
            <div className="sm:col-span-2">
              <p className="text-gray-400 text-xs uppercase mb-1">{a.orders.address}</p>
              <p className="font-medium text-gray-900">{order.delivery_address}{order.city ? `, ${order.city}` : ""}</p>
            </div>
          </div>

          {Array.isArray(order.items) && order.items.length > 0 && (
            <div className="border-t border-blue-100 pt-4">
              <p className="text-gray-400 text-xs uppercase mb-3">{a.orders.items}</p>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 shadow-sm">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                      )}
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-gray-400 text-xs">× {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{(item.price * item.quantity).toLocaleString()} {currency}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-3 pt-3 border-t border-blue-100">
                <span className="text-sm font-bold text-gray-900">
                  Total: {Number(order.total).toLocaleString()} {currency}
                  {Number(order.delivery_fee) > 0 && (
                    <span className="ml-2 text-xs font-normal text-gray-500">(incl. {Number(order.delivery_fee).toLocaleString()} {currency} delivery)</span>
                  )}
                </span>
              </div>
            </div>
          )}

          {order.notes && (
            <div className="border-t border-blue-100 pt-3">
              <p className="text-gray-400 text-xs uppercase mb-1">{a.orders.notes}</p>
              <p className="text-gray-700 italic">{order.notes}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

interface StoreSettingsFieldProps {
  label: string;
  k: string;
  type?: string;
  storeSettings: Record<string, string>;
  setStoreSettings: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}
function StoreSettingsField({ label, k, type = "text", storeSettings, setStoreSettings }: StoreSettingsFieldProps) {
  return (
    <div className={k === "address" ? "sm:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={storeSettings[k] || ""}
        onChange={(e) => setStoreSettings((prev) => ({ ...prev, [k]: e.target.value }))}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
}

interface ContentSettingsFieldProps {
  label: string;
  k: string;
  contentSettings: Record<string, string>;
  setContentSettings: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}
function ContentSettingsField({ label, k, contentSettings, setContentSettings }: ContentSettingsFieldProps) {
  return (
    <div className="sm:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        value={contentSettings[k] || ""}
        onChange={(e) => setContentSettings((prev) => ({ ...prev, [k]: e.target.value }))}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
}

interface DeliverySettingsFieldProps {
  label: string;
  k: string;
  type?: string;
  deliverySettings: Record<string, string>;
  setDeliverySettings: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}
function DeliverySettingsField({ label, k, type = "text", deliverySettings, setDeliverySettings }: DeliverySettingsFieldProps) {
  return (
    <div className={k === "areas" || k === "note" ? "sm:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {k === "areas" ? (
        <textarea
          value={deliverySettings[k] || ""}
          onChange={(e) => setDeliverySettings((prev) => ({ ...prev, [k]: e.target.value }))}
          rows={2}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      ) : (
        <input
          type={type}
          value={deliverySettings[k] || ""}
          onChange={(e) => setDeliverySettings((prev) => ({ ...prev, [k]: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { t, currency, reloadOverrides } = useI18n();
  const { a, adminLang, setAdminLang, dir } = useAdminI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
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
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [useVideoUrlInput, setUseVideoUrlInput] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [sortBy, setSortBy] = useState<"name" | "category" | "price" | "stock">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [prodSearch, setProdSearch] = useState("");
  const [prodCat, setProdCat] = useState<string>("all");
  const [prodStock, setProdStock] = useState<"all" | "in" | "out">("all");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const toggleCat = (id: string) =>
    setOpenCats((p) => ({ ...p, [id]: !(p[id] ?? true) }));

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const getVal = (p: ProductData) => {
      switch (sortBy) {
        case "name": return p.name.toLowerCase();
        case "category": return categories.find((c) => c.id === p.category)?.name || p.category;
        case "price": return p.price;
        case "stock": return p.in_stock ? 0 : 1;
        default: return p.name.toLowerCase();
      }
    };
    const va = getVal(a);
    const vb = getVal(b);
    if (typeof va === "string" && typeof vb === "string") {
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    }
    return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
  });

  const SortArrow = ({ field }: { field: typeof sortBy }) =>
    sortBy === field ? (
      <span className="ml-1 inline-block text-[10px]">{sortDir === "asc" ? "▲" : "▼"}</span>
    ) : null;

  const [deleteTarget, setDeleteTarget] = useState<ProductData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "1") setAuthed(true);
  }, []);

  const getSecret = useCallback(() => sessionStorage.getItem("admin_secret") || "", []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setLoginError(t.admin.invalidPassword);
        return;
      }
      const data = await res.json();
      setAuthed(true);
      sessionStorage.setItem("admin_auth", "1");
      sessionStorage.setItem("admin_secret", data.secret);
    } catch {
      setLoginError(t.admin.invalidPassword);
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

  // ----- Translations editor -----
  const [transOverride, setTransOverride] = useState<TranslationOverrides>({ en: {}, fr: {}, ar: {} });
  const [transFilter, setTransFilter] = useState("");
  const [savingTrans, setSavingTrans] = useState(false);

  const loadTrans = useCallback(async () => {
    try {
      const data = await fetch("/api/settings?key=translations").then((r) => r.json());
      if (data && data.value && typeof data.value === "object") {
        setTransOverride({
          en: data.value.en || {},
          fr: data.value.fr || {},
          ar: data.value.ar || {},
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const setTrans = (lang: "en" | "fr" | "ar", path: string, value: string) => {
    setTransOverride((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [path]: value },
    }));
  };

  const saveTrans = async () => {
    setSavingTrans(true);
    try {
      await apiFetch("/api/settings", { method: "PUT", body: JSON.stringify({ key: "translations", value: transOverride }) });
      alert(a.settings.saved);
      reloadOverrides();
    } catch (e) {
      alert("Failed to save: " + (e as Error).message);
    } finally {
      setSavingTrans(false);
    }
  };

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
      if (typeof window !== "undefined" && Array.isArray(data)) {
        try {
          const iconMap: Record<string, string> = { cat: "cat", dog: "dog", bird: "bird", fish: "fish", rabbit: "rabbit" };
          const mapped = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            icon: iconMap[c.icon] || "paw-print",
            description: "",
            image_url: c.image_url,
            video_url: c.video_url,
            subcategories: Array.isArray(c.subcategories) 
              ? c.subcategories.map((s: any) => ({ id: s.id, name: s.name, slug: s.id }))
              : []
          }));
          localStorage.setItem("pet_shop_categories", JSON.stringify(mapped));
        } catch (e) {
          console.error("Failed to cache categories:", e);
        }
      }
    } catch {
      // fallback empty
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const data = await apiFetch("/api/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [apiFetch]);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const updated = await apiFetch(`/api/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: updated.status } : o)));
    } catch (e) {
      alert("Failed to update status: " + (e as Error).message);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟\nAre you sure you want to delete this order?")) return;
    try {
      await apiFetch(`/api/orders/${id}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (e) {
      alert("Failed to delete order: " + (e as Error).message);
    }
  };

  const loadReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const data = await apiFetch("/api/reviews");
      setReviews(data);
    } catch {
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }, [apiFetch]);

  const setReviewStatus = async (id: string, status: "approved" | "rejected" | "pending") => {
    try {
      await apiFetch(`/api/reviews/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (e) {
      alert("Failed: " + (e as Error).message);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm(a.reviews.deleteConfirm)) return;
    try {
      await apiFetch(`/api/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert("Failed: " + (e as Error).message);
    }
  };

  // loadSettings removed – settings are loaded inside AdminSettingsPanel

  useEffect(() => {
    if (!authed) return;
    loadCategories();
  }, [authed, loadCategories]);

  useEffect(() => {
    if (!authed) return;
    if (activeTab === "dashboard" || activeTab === "orders") loadOrders();
    if (activeTab === "products" || activeTab === "dashboard") loadProducts();
    if (activeTab === "translations") loadTrans();
    if (activeTab === "reviews") loadReviews();
  }, [authed, activeTab, loadOrders, loadProducts, loadTrans, loadReviews]);

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
      images: product.images || [],
      badge: (product.badge as "" | "NEW" | "SALE") || "",
      rating: String(product.rating),
      reviews: String(product.reviews),
      description: product.description || "",
        features: product.features?.join(", ") || "",
        stockQuantity: product.stock_quantity != null ? String(product.stock_quantity) : (product.in_stock ? "1" : "0"),
        soldBy: (product.sold_by as UnitType) || "piece",
        video: product.video || "",
        ingredients: product.ingredients || "",
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
        images: form.images,
        badge: form.badge || null,
        rating: Number(form.rating),
        reviews: Number(form.reviews),
        description: form.description || undefined,
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
        stock_quantity: Number(form.stockQuantity) || 0,
        in_stock: Number(form.stockQuantity) > 0,
        sold_by: form.soldBy,
        video: form.video || undefined,
        ingredients: form.ingredients || undefined,
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

  // ----- Category & Subcategory management -----
  const [catModal, setCatModal] = useState<{ id: string; name: string; icon: string; order: string; imageUrl: string; videoUrl: string; editingId: string | null; open: boolean }>({ id: "", name: "", icon: "paw-print", order: "0", imageUrl: "", videoUrl: "", editingId: null, open: false });
  const [subModal, setSubModal] = useState<{ id: string; name: string; category_id: string; editingId: string | null; open: boolean }>({ id: "", name: "", category_id: "", editingId: null, open: false });
  const [uploadingCatImg, setUploadingCatImg] = useState(false);
  const [uploadingCatVid, setUploadingCatVid] = useState(false);

  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCatImg(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const secret = getSecret();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { ...(secret ? { "x-admin-secret": secret } : {}) },
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text() || "Upload failed");
      const data = await res.json();
      setCatModal((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      alert("Failed to upload category image: " + (err as Error).message);
    } finally {
      setUploadingCatImg(false);
    }
  };

  const handleCategoryVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCatVid(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const secret = getSecret();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { ...(secret ? { "x-admin-secret": secret } : {}) },
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text() || "Upload failed");
      const data = await res.json();
      setCatModal((prev) => ({ ...prev, videoUrl: data.url }));
    } catch (err) {
      alert("Failed to upload category video: " + (err as Error).message);
    } finally {
      setUploadingCatVid(false);
    }
  };

  const openCatModal = (cat?: any) => {
    if (cat) setCatModal({ id: cat.id, name: cat.name, icon: cat.icon || "paw-print", order: String(cat.order ?? 0), imageUrl: cat.image_url || "", videoUrl: cat.video_url || "", editingId: cat.id, open: true });
    else setCatModal({ id: "", name: "", icon: "paw-print", order: "0", imageUrl: "", videoUrl: "", editingId: null, open: true });
  };
  const openSubModal = (categoryId: string, sub?: any) => {
    if (sub) setSubModal({ id: sub.id, name: sub.name, category_id: categoryId, editingId: sub.id, open: true });
    else setSubModal({ id: "", name: "", category_id: categoryId, editingId: null, open: true });
  };
  const closeCatModal = () => setCatModal({ id: "", name: "", icon: "paw-print", order: "0", imageUrl: "", videoUrl: "", editingId: null, open: false });
  const closeSubModal = () => setSubModal({ id: "", name: "", category_id: "", editingId: null, open: false });

  const saveCategory = async () => {
    if (!catModal.id.trim() || !catModal.name.trim()) return alert(a.common.name + " / " + a.common.id + " " + a.common.required);
    try {
      if (catModal.editingId) {
        await apiFetch("/api/categories", { method: "PUT", body: JSON.stringify({ id: catModal.editingId, name: catModal.name, icon: catModal.icon, order: Number(catModal.order), image_url: catModal.imageUrl, video_url: catModal.videoUrl }) });
      } else {
        await apiFetch("/api/categories", { method: "POST", body: JSON.stringify({ id: catModal.id.trim(), name: catModal.name, icon: catModal.icon, order: Number(catModal.order), image_url: catModal.imageUrl, video_url: catModal.videoUrl }) });
      }
      closeCatModal();
      await loadCategories();
    } catch (e) {
      alert("Failed to save category: " + (e as Error).message);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm(a.cats.deleteConfirm)) return;
    try {
      await apiFetch(`/api/categories?id=${id}`, { method: "DELETE" });
      await loadCategories();
    } catch (e) {
      alert("Failed to delete: " + (e as Error).message);
    }
  };

  const saveSub = async () => {
    if (!subModal.id.trim() || !subModal.name.trim()) return alert(a.common.name + " / " + a.common.id + " " + a.common.required);
    try {
      if (subModal.editingId) {
        await apiFetch("/api/subcategories", { method: "PUT", body: JSON.stringify({ id: subModal.editingId, name: subModal.name, category_id: subModal.category_id }) });
      } else {
        await apiFetch("/api/subcategories", { method: "POST", body: JSON.stringify({ id: subModal.id.trim(), name: subModal.name, category_id: subModal.category_id }) });
      }
      closeSubModal();
      await loadCategories();
    } catch (e) {
      alert("Failed to save subcategory: " + (e as Error).message);
    }
  };

  const deleteSub = async (id: string) => {
    if (!confirm(a.cats.deleteConfirm)) return;
    try {
      await apiFetch(`/api/subcategories?id=${id}`, { method: "DELETE" });
      await loadCategories();
    } catch (e) {
      alert("Failed to delete: " + (e as Error).message);
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

  const handleAdditionalImageUpload = async (file: File) => {
    setUploadingAdditional(true);
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
      setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }));
    } catch (e) {
      alert("Upload failed: " + (e as Error).message);
    } finally {
      setUploadingAdditional(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    setUploadingVideo(true);
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
      setForm((prev) => ({ ...prev, video: data.url }));
    } catch (e) {
      alert("Upload failed: " + (e as Error).message);
    } finally {
      setUploadingVideo(false);
    }
  };

  // ----- Site settings handled by AdminSettingsPanel (isolated component) -----

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-[#0B1E36] mb-2">Admin Access</h1>
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
            {loginError && (
              <p className="text-sm text-red-600 text-left">{loginError}</p>
            )}
            <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const productCount = products.length;
  const inventoryValue = products.reduce((s, p) => s + p.price, 0);

  const orderTotalRevenue = orders.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0);
  const customerCount = orders.length
    ? new Set(orders.map((o: any) => o.customer_email || o.customer_phone || o.customer_name)).size
    : 0;
  const monthlyRevenue = (() => {
    if (!orders.length) return sampleRevenue;
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const map: Record<string, { month: string; revenue: number; orders: number }> = {};
    for (const o of orders) {
      if (!o.created_at) continue;
      const d = new Date(o.created_at);
      if (isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map[key]) map[key] = { month: months[d.getMonth()], revenue: 0, orders: 0 };
      map[key].revenue += Number(o.total) || 0;
      map[key].orders += 1;
    }
    return Object.values(map).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
  })();
  const catDist = categories.map((c) => ({
    name: c.name,
    value: products.filter((p) => p.category === c.id).length,
  }));

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      <div className="flex">
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#050D1A] to-[#0B1E36] text-white
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <LogoC4 light={true} />
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
              const isOrdersTab = tab.key === "orders";
              const pendingCount = isOrdersTab ? orders.filter((o) => o.status === "pending").length : 0;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{a.nav[tab.key as keyof typeof a.nav]}</span>
                  </div>
                  {isOrdersTab && pendingCount > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-all">
              <ArrowUpRight className="w-4 h-4" />
              <span>{a.nav.viewStore}</span>
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
                <h1 className="text-lg font-bold text-[#0B1E36]">
                  {a.title[activeTab as keyof typeof a.title] ?? activeTab}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="capitalize">
                    {new Date().toLocaleDateString(adminLang === "ar" ? "ar-DZ" : adminLang === "fr" ? "fr-FR" : "en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#0B1E36] hover:bg-[#112540] text-[#DFB96A] border border-[#DFB96A]/20 hover:border-[#DFB96A]/40 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{a.nav.viewStore}</span>
                </Link>
                <select
                  value={adminLang}
                  onChange={(e) => setAdminLang(e.target.value as typeof adminLang)}
                  title={a.lang.label}
                  className="px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 cursor-pointer"
                >
                  <option value="en">{a.lang.en}</option>
                  <option value="fr">{a.lang.fr}</option>
                  <option value="ar">{a.lang.ar}</option>
                </select>
                <div className="w-9 h-9 rounded-full bg-[#0B1E36] flex items-center justify-center border border-white/20 overflow-hidden shrink-0">
                  <LogoC1 className="w-6 h-6" />
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
                    label={a.dashboard.inventoryValue}
                    value={productsError ? `124,500 ${currency}` : `${inventoryValue.toLocaleString()} ${currency}`}
                    trend="+12.5% from last month"
                    trendUp
                    color="bg-emerald-100 text-emerald-600"
                  />
                  <StatCard
                    icon={ShoppingBag}
                    label={a.dashboard.totalOrders}
                    value={loadingOrders ? "..." : String(orders.length)}
                    trend="+8.2% from last month"
                    trendUp
                    color="bg-blue-100 text-blue-600"
                  />
                  <StatCard
                    icon={Users}
                    label={a.dashboard.totalCustomers}
                    value={String(customerCount)}
                    trend="+5.4% from last month"
                    trendUp
                    color="bg-purple-100 text-purple-600"
                  />
                  <StatCard
                    icon={Package}
                    label={a.dashboard.totalProducts}
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
                        <h2 className="text-lg font-bold text-[#0B1E36]">{a.dashboard.revenueOverview}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{a.dashboard.revenueSub}</p>
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
                        <BarChart data={monthlyRevenue} barGap={2}>
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                          <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                           <Tooltip content={(props: any) => <CustomTooltip {...props} currency={currency} />} />
                           <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={24} />
                          <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#6EE7B7" radius={[4, 4, 0, 0]} maxBarSize={24} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div>
                      <h2 className="text-lg font-bold text-[#0B1E36]">Category Sales</h2>
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
                          <Tooltip content={(props: any) => <CustomTooltip {...props} currency={currency} />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2.5 mt-2">
                      {(catDist.length ? catDist : sampleCategoryDist).map((item, i) => {
                        const total = (catDist.length ? catDist : sampleCategoryDist).reduce((s: number, d: any) => s + d.value, 0) || 1;
                        const pct = Math.round((item.value / total) * 100);
                        return (
                          <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                              <span className="text-gray-700">{item.name}</span>
                            </div>
                            <span className="font-semibold text-gray-900">{item.value} ({pct}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-[#0B1E36]">{a.dashboard.recentOrders}</h2>
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
                          <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{a.orders.order}</th>
                          <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{a.orders.customer}</th>
                          <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{a.orders.product}</th>
                          <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{a.orders.amount}</th>
                          <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{a.orders.status}</th>
                          <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{a.orders.date}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(orders.length ? orders.slice(0, 5) : sampleRecentOrders).map((order: any, i: number) => (
                          <tr key={order.id || i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-900">{order.id || `#ORD-${i + 1}`}</td>
                            <td className="px-6 py-4 text-gray-700">{order.customer_name || "-"}</td>
                            <td className="px-6 py-4 text-gray-700 max-w-[200px] truncate">
                              {Array.isArray(order.items) ? `${order.items.length} item${order.items.length === 1 ? "" : "s"}` : "-"}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900">{(Number(order.total) || 0).toLocaleString()} {currency}</td>
                            <td className="px-6 py-4"><StatusBadge status={order.status || "Pending"} /></td>
                            <td className="px-6 py-4 text-gray-500">{order.created_at?.slice(0, 10) || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-lg font-bold text-[#0B1E36]">Top Products</h2>
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

            {/* ===== PRODUCTS (CRM) ===== */}
            {activeTab === "products" && (() => {
              const filtered = sortedProducts.filter((p) => {
                if (prodCat !== "all" && p.category !== prodCat) return false;
                if (prodStock === "in" && !p.in_stock) return false;
                if (prodStock === "out" && p.in_stock) return false;
                if (prodSearch && !p.name.toLowerCase().includes(prodSearch.toLowerCase())) return false;
                return true;
              });
              const inStockCount = products.filter((p) => p.in_stock).length;
              const outStockCount = products.length - inStockCount;
              const hasFilter = prodSearch || prodCat !== "all" || prodStock !== "all";
              const groups =
                categories.length > 0
                  ? categories
                  : [...new Set(sortedProducts.map((p) => p.category))].map((id) => ({ id, name: id, subcategories: [] as { id: string; name: string }[] }));

              const ProductRow = ({ product }: { product: ProductData }) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-emerald-50/40 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-11 h-11 rounded-lg object-cover ring-1 ring-gray-100" />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate max-w-[160px] sm:max-w-[220px]">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.id}</p>
                        <p className="sm:hidden mt-0.5 text-xs font-semibold text-gray-700">
                          {currency}{product.price.toFixed(2)}
                          <span className={`ms-2 font-medium ${product.in_stock ? "text-emerald-600" : "text-red-500"}`}>
                            {product.in_stock ? `• ${product.stock_quantity ?? 0}` : "• Out"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                      {categories.find((c) => c.id === product.category)?.name || product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap hidden sm:table-cell">
                    {currency}{product.price.toFixed(2)}
                    {product.sold_by && product.sold_by !== "piece" && <span className="text-xs font-normal text-gray-400"> /{unitLabel(product.sold_by, "en")}</span>}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {product.original_price ? (
                      <span className="text-xs text-gray-400 line-through">{currency}{product.original_price.toFixed(2)}</span>
                    ) : <span className="text-xs text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      product.in_stock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${product.in_stock ? "bg-emerald-500" : "bg-red-500"}`} />
                      {product.in_stock ? `In Stock (${product.stock_quantity ?? 0})` : "Out"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell"><ProductBadge badge={product.badge} /></td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );

              return (
                <div className="space-y-5">
                  {/* Stat tiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <p className="text-xs font-medium text-gray-400">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <p className="text-xs font-medium text-gray-400">In Stock</p>
                      <p className="text-2xl font-bold text-emerald-600 mt-1">{inStockCount}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <p className="text-xs font-medium text-gray-400">Out of Stock</p>
                      <p className="text-2xl font-bold text-red-500 mt-1">{outStockCount}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <p className="text-xs font-medium text-gray-400">Categories</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          value={prodSearch}
                          onChange={(e) => setProdSearch(e.target.value)}
                          placeholder={a.products.searchPlaceholder}
                          className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-500 transition-colors"
                        />
                        {prodSearch && (
                          <button
                            onClick={() => setProdSearch("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          value={prodCat}
                          onChange={(e) => setProdCat(e.target.value)}
                          className="pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="all">{a.products.allCategories}</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <select
                        value={prodStock}
                        onChange={(e) => setProdStock(e.target.value as "all" | "in" | "out")}
                        className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                      >
                          <option value="all">{a.products.allStock}</option>
                          <option value="in">{a.products.inStock}</option>
                          <option value="out">{a.products.outOfStock}</option>
                      </select>

                      <button
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20"
                      >
                        <Plus className="w-4 h-4" />
                        {a.products.addProduct}
                      </button>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loadingProducts ? (
                      <div className="flex items-center justify-center py-16 text-gray-400">
                        <div className="animate-spin w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full mr-3" />
                        Loading products…
                      </div>
                    ) : products.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Package2 className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">{a.products.noProducts}</p>
                        <p className="text-xs text-gray-400 mt-1">{a.products.addFirst}</p>
                        <div className="mt-4 flex items-center gap-3">
                          <button
                            onClick={openAddModal}
                            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                          >
                            <Plus className="w-4 h-4 inline-block mr-1" />
                            {a.products.addProduct}
                          </button>
                        </div>
                      </div>
                    ) : filtered.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Search className="w-10 h-10 mb-3 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">{a.products.filtersNoMatch}</p>
                        <button
                          onClick={() => { setProdSearch(""); setProdCat("all"); setProdStock("all"); }}
                          className="mt-3 text-sm text-emerald-600 hover:underline"
                        >
                          {a.products.clearFilters}
                        </button>
                      </div>
                    ) : !hasFilter ? (
                      /* Grouped by category when no filter active */
                      <div className="divide-y divide-gray-100">
                        {groups.map((cat) => {
                          const catProducts = sortedProducts.filter((p) => p.category === cat.id);
                          if (catProducts.length === 0) return null;
                          const isOpen = openCats[cat.id] ?? true;
                          return (
                            <div key={cat.id}>
                              <button
                                onClick={() => toggleCat(cat.id)}
                                className="w-full flex items-center justify-between px-5 py-3 bg-gray-50/60 hover:bg-gray-100/70 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
                                  <span className="font-bold text-gray-900">{cat.name}</span>
                                  <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">{catProducts.length}</span>
                                </div>
                                <span className="text-xs text-gray-400">{isOpen ? "Hide" : "Show"}</span>
                              </button>
                              {isOpen && (
                                <table className="w-full text-sm">
                                  <tbody>
                                    {catProducts.map((product) => <ProductRow key={product.id} product={product} />)}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Flat filtered list when searching/filtering */
                      <div>
                        <div className="px-5 py-2.5 text-xs text-gray-400 border-b border-gray-100">
                          {filtered.length} result{filtered.length === 1 ? "" : "s"} found
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50/40 text-gray-400">
                                <th className="text-start px-4 py-2.5 text-xs font-semibold uppercase tracking-wider">{a.products.name}</th>
                                <th className="text-start px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">{a.products.category}</th>
                                <th className="text-start px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">{a.products.price}</th>
                                <th className="text-start px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">{a.products.oldPrice}</th>
                                <th className="text-start px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">{a.products.stock}</th>
                                <th className="text-start px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">{a.products.badge}</th>
                                <th className="text-end px-4 py-2.5 text-xs font-semibold uppercase tracking-wider">{a.products.actions}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filtered.map((product) => <ProductRow key={product.id} product={product} />)}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ===== ORDERS ===== */}
            {activeTab === "orders" && (() => {
              const ORDER_STATUSES = [
                { value: "pending",    label: "Pending",    color: "bg-orange-100 text-orange-700" },
                { value: "confirmed",  label: "Confirmed",  color: "bg-blue-100 text-blue-700" },
                { value: "processing", label: "Processing", color: "bg-purple-100 text-purple-700" },
                { value: "shipped",    label: "Shipped",    color: "bg-indigo-100 text-indigo-700" },
                { value: "delivered",  label: "Delivered",  color: "bg-emerald-100 text-emerald-700" },
                { value: "cancelled",  label: "Cancelled",  color: "bg-red-100 text-red-700" },
              ];
              const getStatusColor = (s: string) => ORDER_STATUSES.find((x) => x.value === s)?.color || "bg-gray-100 text-gray-600";

              const pendingCount   = orders.filter((o) => o.status === "pending").length;
              const inProgressCount = orders.filter((o) => o.status === "confirmed" || o.status === "processing" || o.status === "shipped").length;
              const deliveredCount = orders.filter((o) => o.status === "delivered").length;
              const cancelledCount = orders.filter((o) => o.status === "cancelled").length;
              const totalRevenue   = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + (Number(o.total) || 0), 0);

              return (
                <div className="space-y-5">
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm">
                      <p className="text-xs font-medium text-orange-400">Pending</p>
                      <p className="text-2xl font-bold text-orange-600 mt-1">{pendingCount}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
                      <p className="text-xs font-medium text-blue-400">In Progress</p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{inProgressCount}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
                      <p className="text-xs font-medium text-emerald-400">Delivered</p>
                      <p className="text-2xl font-bold text-emerald-600 mt-1">{deliveredCount}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm">
                      <p className="text-xs font-medium text-red-400">Cancelled</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">{cancelledCount}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm sm:col-span-1 col-span-2">
                      <p className="text-xs font-medium text-gray-400">Revenue</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{totalRevenue.toLocaleString()} {currency}</p>
                    </div>
                  </div>

                  {/* Orders list */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold text-gray-900">{a.orders.title}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {loadingOrders ? a.common.loading : `${orders.length} ${a.orders.total}`}
                        </p>
                      </div>
                      <button onClick={loadOrders} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                        ↻ Refresh
                      </button>
                    </div>

                    {/* Header row */}
                    {!loadingOrders && orders.length > 0 && (
                      <div className="grid grid-cols-12 gap-2 px-6 py-2 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        <div className="col-span-1">ID</div>
                        <div className="col-span-2">{a.orders.customer}</div>
                        <div className="col-span-2">{a.orders.date}</div>
                        <div className="col-span-2">{a.orders.amount}</div>
                        <div className="col-span-3">{a.orders.status}</div>
                        <div className="col-span-2 text-right">{a.products.actions}</div>
                      </div>
                    )}

                    {loadingOrders ? (
                      <div className="flex items-center justify-center py-16 text-gray-400">
                        <div className="animate-spin w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full mr-3" />
                        Loading orders...
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <ShoppingCart className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">{a.orders.noOrders}</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {orders.map((order) => (
                          <OrderDetailRow
                            key={order.id}
                            order={order}
                            currency={currency}
                            ORDER_STATUSES={ORDER_STATUSES}
                            getStatusColor={getStatusColor}
                            onStatusChange={updateOrderStatus}
                            onDelete={deleteOrder}
                            a={a}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ===== ANALYTICS ===== */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                    <p className="text-sm text-gray-500">{a.analytics.totalProducts}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{products.filter((p) => p.in_stock).length}</p>
                    <p className="text-sm text-gray-500">{a.analytics.inStock}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-3">
                      <Package className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{products.filter((p) => !p.in_stock).length}</p>
                    <p className="text-sm text-gray-500">{a.analytics.outOfStock}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                      <LayoutDashboard className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                    <p className="text-sm text-gray-500">{a.analytics.categories}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-[#0B1E36] mb-4">{a.analytics.perCategory}</h2>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categories.map((c) => ({ name: c.name, count: products.filter((p) => p.category === c.id).length }))}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                          <Tooltip />
                          <Bar dataKey="count" name="Products" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-[#0B1E36] mb-4">{a.analytics.priceDist}</h2>
                    <div className="space-y-3">
                      {[
                        { label: a.analytics.under20, range: [0, 20] },
                        { label: a.analytics.b2050, range: [20, 50] },
                        { label: a.analytics.b50100, range: [50, 100] },
                        { label: a.analytics.b100, range: [100, Infinity] },
                      ].map((b) => {
                        const count = products.filter((p) => p.price >= b.range[0] && p.price < b.range[1]).length;
                        const pct = products.length ? (count / products.length) * 100 : 0;
                        return (
                          <div key={b.label}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-700">{b.label}</span>
                              <span className="font-semibold text-gray-900">{count} ({pct.toFixed(0)}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 pb-4">
                    <h2 className="text-lg font-bold text-[#0B1E36]">{a.analytics.topRated}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{a.analytics.topRatedSub}</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-y border-gray-100 bg-gray-50/50">
                          <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{a.analytics.name}</th>
                          <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{a.products.category}</th>
                          <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{a.analytics.rating}</th>
                          <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{a.analytics.reviews}</th>
                          <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{a.products.price}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...products].sort((a, b) => (b.reviews > 0 ? b.rating : 0) - (a.reviews > 0 ? a.rating : 0)).slice(0, 10).map((product) => {
                          const cat = categories.find((c) => c.id === product.category);
                          return (
                            <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-gray-900">{product.name}</td>
                              <td className="px-6 py-4 text-gray-700">{cat?.name || product.category}</td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1 text-amber-500">
                                  ★ {product.reviews > 0 ? product.rating : 0}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-700">{product.reviews}</td>
                              <td className="px-6 py-4 font-semibold text-gray-900">{product.price.toLocaleString()} {currency}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===== CATEGORIES ===== */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#0B1E36]">{a.cats.title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{a.cats.subtitle}</p>
                  </div>
                  <button
                    onClick={() => openCatModal()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20"
                  >
                    <Plus className="w-4 h-4" /> {a.cats.addCategory}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {categories.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                      <Tag className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-sm font-medium text-gray-500">{a.cats.noCats}</p>
                    </div>
                  ) : (
                    categories.map((cat) => (
                      <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <Tag className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{cat.name}</p>
                              <p className="text-xs text-gray-400">{cat.id} · {a.cats.subcount.replace("{n}", String(cat.subcategories?.length || 0))}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => openCatModal(cat)} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title={a.common.update}>
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteCategory(cat.id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title={a.common.delete}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          {(cat.subcategories || []).map((s: any) => (
                            <div key={s.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                              <span className="text-sm text-gray-700">{s.name}</span>
                              <div className="flex items-center gap-1">
                                <button onClick={() => openSubModal(cat.id, s)} className="p-1.5 rounded bg-white text-emerald-600 hover:bg-emerald-50 transition-colors" title={a.common.update}>
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => deleteSub(s.id)} className="p-1.5 rounded bg-white text-red-600 hover:bg-red-50 transition-colors" title={a.common.delete}>
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => openSubModal(cat.id)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-gray-200 text-sm text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> {a.cats.addSub}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ===== REVIEWS ===== */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{a.reviews.title}</h3>
                    <p className="text-sm text-gray-500">{a.reviews.subtitle}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {(["pending", "approved", "rejected", "all"] as const).map((f) => {
                      const cnt = f === "all" ? reviews.length : reviews.filter((r) => r.status === f).length;
                      return (
                        <button
                          key={f}
                          onClick={() => setReviewFilter(f)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            reviewFilter === f
                              ? "bg-emerald-500/20 text-emerald-700 border border-emerald-500/30"
                              : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"
                          }`}
                        >
                          {a.reviews[f]} ({cnt})
                        </button>
                      );
                    })}
                  </div>

                  {loadingReviews ? (
                    <div className="text-gray-400 text-sm py-8 text-center">{a.reviews.loading}</div>
                  ) : (() => {
                    const list = reviews.filter((r) => reviewFilter === "all" || r.status === reviewFilter);
                    if (list.length === 0) {
                      return <div className="text-gray-400 text-sm py-8 text-center">{a.reviews.noReviews}</div>;
                    }
                    return (
                      <div className="space-y-3">
                        {list.map((r) => (
                          <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-900">{r.user_name}</span>
                                  <span className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                      <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? "fill-[#E5B25A] text-[#E5B25A]" : "fill-gray-200 text-gray-200"}`} />
                                    ))}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                    r.status === "approved" ? "bg-emerald-100 text-emerald-700"
                                    : r.status === "rejected" ? "bg-red-100 text-red-600"
                                    : "bg-amber-100 text-amber-700"
                                  }`}>
                                    {a.reviews[r.status]}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mb-1">
                                  {r.products?.name ?? r.product_id} · {new Date(r.created_at).toLocaleDateString()}
                                </p>
                                {r.comment && <p className="text-sm text-gray-600 whitespace-pre-line">{r.comment}</p>}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {r.status !== "approved" && (
                                  <button
                                    onClick={() => setReviewStatus(r.id, "approved")}
                                    title={a.reviews.approve}
                                    className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                {r.status !== "rejected" && (
                                  <button
                                    onClick={() => setReviewStatus(r.id, "rejected")}
                                    title={a.reviews.reject}
                                    className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteReview(r.id)}
                                  title={a.reviews.delete}
                                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* ===== SETTINGS ===== */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <AdminSettingsPanel
                  adminSecret={getSecret()}
                  a={a}
                  onSaved={() => {}}
                />

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-[#0B1E36] mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Link href="/" className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors">
                      <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-900">View Store</p>
                        <p className="text-xs text-emerald-700">Open public site</p>
                      </div>
                    </Link>
                    <Link href="/products" className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors">
                      <Package2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Browse Products</p>
                        <p className="text-xs text-blue-700">View product catalog</p>
                      </div>
                    </Link>
                  </div>
                </div>

                <HeroVideoManager />
              </div>
            )}

            {/* ===== TRANSLATIONS ===== */}
            {activeTab === "translations" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-[#0B1E36]">{a.settings.translations}</h2>
                      <p className="text-sm text-gray-500 mt-0.5">{a.cats.manage}</p>
                    </div>
                    <button
                      onClick={saveTrans}
                      disabled={savingTrans}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {savingTrans && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                      {a.common.save}
                    </button>
                  </div>
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={transFilter}
                      onChange={(e) => setTransFilter(e.target.value)}
                      placeholder={a.common.search}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="grid grid-cols-[minmax(180px,1fr)_1fr_1fr_1fr] gap-px bg-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="bg-gray-50 px-4 py-3">Key</div>
                    <div className="bg-gray-50 px-4 py-3">EN</div>
                    <div className="bg-gray-50 px-4 py-3">FR</div>
                    <div className="bg-gray-50 px-4 py-3">AR</div>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
                    {TRANS_KEYS.filter((k) => k.path.toLowerCase().includes(transFilter.toLowerCase())).map((k) => {
                      const def = getByPath(en, k.path);
                      return (
                        <div key={k.path} className="grid grid-cols-[minmax(180px,1fr)_1fr_1fr_1fr] gap-px bg-gray-100 items-start">
                          <div className="bg-white px-4 py-3 text-sm font-mono text-gray-600 break-all">{k.path}</div>
                          {(["en", "fr", "ar"] as const).map((lang) => (
                            <div key={lang} className="bg-white px-2 py-2">
                              <input
                                value={transOverride[lang][k.path] || ""}
                                onChange={(e) => setTrans(lang, k.path, e.target.value)}
                                placeholder={def}
                                dir={lang === "ar" ? "rtl" : "ltr"}
                                className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
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
              <h2 className="text-lg font-bold text-[#0B1E36]">
                {editingProduct ? a.products.editProduct : a.products.addProduct}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{a.products.soldBy}</label>
                  <select
                    value={form.soldBy}
                    onChange={(e) => setForm({ ...form, soldBy: e.target.value as UnitType })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {adminLang === "ar" ? u.labelAr : adminLang === "fr" ? u.labelFr : u.labelEn}
                      </option>
                    ))}
                  </select>
                  {isContinuousUnit(form.soldBy) && (
                    <p className="text-xs text-gray-400 mt-1">{a.products.weightHelp}</p>
                  )}
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

              {/* Additional Images (Gallery) */}
              <div className="border-t border-gray-100 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images (Gallery)</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${uploadingAdditional ? "bg-gray-100 text-gray-400" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                      {uploadingAdditional ? (
                        <span className="inline-flex items-center gap-1.5">
                          <div className="animate-spin w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full" />
                          Uploading...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          Add Gallery Image
                        </span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingAdditional}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAdditionalImageUpload(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {form.images && form.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                      {form.images.map((imgUrl, index) => (
                        <div key={index} className="relative group w-16 h-16 rounded-lg border border-gray-200 bg-white overflow-hidden">
                          <img src={imgUrl} alt="gallery-preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...form.images];
                              newImages.splice(index, 1);
                              setForm({ ...form, images: newImages });
                            }}
                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{a.products.video}</label>
                {!useVideoUrlInput ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <label className={`px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors ${uploadingVideo ? "bg-gray-100 text-gray-400" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                        {uploadingVideo ? (
                          <span className="inline-flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full" />
                            Uploading...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Upload Video File
                          </span>
                        )}
                        <input
                          type="file"
                          accept="video/*"
                          disabled={uploadingVideo}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleVideoUpload(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setUseVideoUrlInput(true)}
                        className="text-xs text-gray-400 hover:text-gray-600 underline"
                      >
                        Or paste URL
                      </button>
                    </div>
                    {form.video && (
                      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs text-gray-600 truncate flex-1">{form.video}</span>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, video: "" })}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
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
                      value={form.video}
                      onChange={(e) => setForm({ ...form, video: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setUseVideoUrlInput(false)}
                      className="text-xs text-gray-400 hover:text-gray-600 underline whitespace-nowrap"
                    >
                      Upload instead
                    </button>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{a.products.ingredients}</label>
                    <textarea
                      rows={4}
                      value={form.ingredients}
                      onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                      placeholder={"• Chicken 40%\n• Rice 20%\n• ..."}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{a.products.ingredientsHelp}</p>
                  </div>
                </div>
              )}

              <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {a.products.stockQuantity}
                      </label>
                <input
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                />
                <p className="text-xs text-gray-400 mt-1">{a.products.stockHelp}</p>
              </div>
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
                {editingProduct ? a.common.update : a.common.create}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CATEGORY MODAL ===== */}
      {catModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeCatModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#0B1E36]">{catModal.editingId ? a.cats.editCategory : a.cats.addCategory}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{a.common.id}</label>
              <input
                value={catModal.id}
                disabled={!!catModal.editingId}
                onChange={(e) => setCatModal({ ...catModal, id: e.target.value })}
                placeholder="cats"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-400 mt-1">{a.cats.idHelp}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{a.common.name}</label>
              <input
                value={catModal.name}
                onChange={(e) => setCatModal({ ...catModal, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">صورة القسم (Category Image)</label>
              <div className="flex gap-2">
                <input
                  value={catModal.imageUrl}
                  onChange={(e) => setCatModal({ ...catModal, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <label className="cursor-pointer bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap text-gray-700">
                  {uploadingCatImg ? (
                    <div className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full" />
                  ) : (
                    <Upload className="w-4 h-4 text-gray-500" />
                  )}
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleCategoryImageUpload} className="hidden" />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">فيديو قصير للقسم (Category Video)</label>
              <div className="flex gap-2">
                <input
                  value={catModal.videoUrl}
                  onChange={(e) => setCatModal({ ...catModal, videoUrl: e.target.value })}
                  placeholder="https://cdn.pixabay.com/..."
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <label className="cursor-pointer bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap text-gray-700">
                  {uploadingCatVid ? (
                    <div className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full" />
                  ) : (
                    <Upload className="w-4 h-4 text-gray-500" />
                  )}
                  <span>Upload</span>
                  <input type="file" accept="video/*" onChange={handleCategoryVideoUpload} className="hidden" />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{a.common.icon}</label>
                <input
                  value={catModal.icon}
                  onChange={(e) => setCatModal({ ...catModal, icon: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{a.common.order}</label>
                <input
                  type="number"
                  value={catModal.order}
                  onChange={(e) => setCatModal({ ...catModal, order: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={closeCatModal} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">{a.common.cancel}</button>
              <button onClick={saveCategory} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">{a.common.save}</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUBCATEGORY MODAL ===== */}
      {subModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeSubModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#0B1E36]">{subModal.editingId ? a.cats.editSub : a.cats.addSub}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{a.cats.subOf}</label>
              <input
                value={categories.find((c) => c.id === subModal.category_id)?.name || subModal.category_id}
                disabled
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{a.common.id}</label>
              <input
                value={subModal.id}
                disabled={!!subModal.editingId}
                onChange={(e) => setSubModal({ ...subModal, id: e.target.value })}
                placeholder="cats-food"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-400 mt-1">{a.cats.idHelp}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{a.common.name}</label>
              <input
                value={subModal.name}
                onChange={(e) => setSubModal({ ...subModal, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={closeSubModal} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">{a.common.cancel}</button>
              <button onClick={saveSub} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">{a.common.save}</button>
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
