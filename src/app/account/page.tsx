"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase";
import { User, Package, LogOut, Mail, Loader2, CheckCircle, Save, ShoppingBag, XCircle } from "lucide-react";
import AuthModal from "@/components/auth-modal";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-emerald-100 text-emerald-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AccountPage() {
  const { t, lang, currency } = useI18n();
  const { user, profile, loading, logout, updateProfile } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [tab, setTab] = useState<"profile" | "orders">("profile");
  const [name, setName] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [modifyingId, setModifyingId] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setNewsletter(profile.newsletter);
    }
  }, [profile]);

  useEffect(() => {
    if (user && tab === "orders") loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, tab]);

  const loadOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setOrdersLoading(false);
  };

  const cancelOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      lang === "ar" ? "هل تريد إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
      : lang === "fr" ? "Voulez-vous annuler cette commande ? Cette action est irréversible."
      : "Do you want to cancel this order? This action cannot be undone."
    );
    if (!confirmed) return;
    setCancellingId(orderId);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        await loadOrders();
      } else {
        const err = await res.json();
        alert(err.error || (lang === "ar" ? "حدث خطأ" : "Une erreur s'est produite"));
      }
    } finally {
      setCancellingId(null);
    }
  };

  const modifyOrder = async (orderId: string, deliveryType: "pickup" | "delivery") => {
    const label =
      deliveryType === "pickup"
        ? lang === "ar" ? "تحويل الطلب إلى استلام من المتجر (مجاني)؟"
          : lang === "fr" ? "Convertir en retrait en magasin (gratuit) ?"
          : "Switch to store pickup (free)?"
        : lang === "ar" ? "تحويل الطلب إلى توصيل للمنزل (250 د.ج)؟"
          : lang === "fr" ? "Convertir en livraison (250 DZD) ?"
          : "Switch to home delivery (250 DZD)?";
    if (!window.confirm(label)) return;
    setModifyingId(orderId);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`/api/orders/${orderId}/modify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ delivery_type: deliveryType }),
      });
      if (res.ok) {
        await loadOrders();
      } else {
        const err = await res.json();
        alert(err.error || (lang === "ar" ? "حدث خطأ" : "Une erreur s'est produite"));
      }
    } finally {
      setModifyingId(null);
    }
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const r = await updateProfile({ full_name: name, newsletter });
    setSaving(false);
    if (!r.error) setSaved(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.auth.title}</h1>
        <p className="text-gray-500 mb-6">{t.auth.loginRequired}</p>
        <button
          onClick={() => setAuthOpen(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
        >
          {t.auth.login}
        </button>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab="login" />
      </div>
    );
  }

  const initial = (profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.auth.myAccount}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {initial}
            </div>
            <h2 className="font-bold text-gray-900 truncate">{profile?.full_name || user.email}</h2>
            <p className="text-sm text-gray-400 truncate">{user.email}</p>
            {profile?.created_at && (
              <p className="text-xs text-gray-400 mt-2">
                {t.auth.accountSince} {new Date(profile.created_at).toLocaleDateString(lang === "ar" ? "ar-DZ" : lang === "fr" ? "fr-FR" : "en-US")}
              </p>
            )}
            <button
              onClick={() => logout()}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-emerald-600 border border-gray-200 rounded-xl py-2.5 transition-colors"
            >
              <LogOut className="w-4 h-4" /> {t.auth.logout}
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="md:col-span-2">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 w-fit">
            <button
              onClick={() => setTab("profile")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === "profile" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500"}`}
            >
              {t.auth.profile}
            </button>
            <button
              onClick={() => setTab("orders")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === "orders" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500"}`}
            >
              {t.auth.myOrders}
            </button>
          </div>

          {tab === "profile" ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.auth.name}
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={user.email || ""}
                  disabled
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <button
                  onClick={() => setNewsletter(!newsletter)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${newsletter ? "bg-emerald-600" : "bg-gray-300"}`}
                  aria-pressed={newsletter}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${newsletter ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t.auth.newsletter}</p>
                  <p className="text-xs text-gray-500">{t.auth.newsletterDesc}</p>
                  <p className="text-xs mt-1 font-medium text-emerald-600">{newsletter ? t.auth.newsletterOn : t.auth.newsletterOff}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={save}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" /> {lang === "ar" ? "حفظ" : lang === "fr" ? "Enregistrer" : "Save"}
                </button>
                {saved && (
                  <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                    <CheckCircle className="w-4 h-4" /> {lang === "ar" ? "تم الحفظ" : lang === "fr" ? "Enregistré" : "Saved"}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                  <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">{t.auth.noOrders}</p>
                  <Link href="/products" className="inline-block mt-4 text-emerald-600 font-medium hover:underline">
                    {lang === "ar" ? "تسوّق الآن" : lang === "fr" ? "Magasiner" : "Shop now"}
                  </Link>
                </div>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Package className="w-4 h-4" />
                        <span className="font-mono">{o.id.slice(0, 8)}</span>
                        {o.created_at && <span>· {new Date(o.created_at).toLocaleDateString()}</span>}
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[o.status] || "bg-gray-100 text-gray-600"}`}>
                        {o.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {(o.items || []).map((it: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-sm text-gray-600">
                          <span className="truncate">{it.name} ×{it.quantity}</span>
                          <span className="font-medium text-gray-900">{currency}{(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">{lang === "ar" ? "المجموع" : lang === "fr" ? "Total" : "Total"}</span>
                      <span className="font-bold text-gray-900">{currency}{(o.total || 0).toFixed(2)}</span>
                    </div>
                    {/* Action buttons — only for pending orders */}
                    {o.status === "pending" && (
                      <div className="mt-3 flex flex-col gap-2">
                        {/* Switch delivery type */}
                        {o.delivery_area !== "pickup" ? (
                          <button
                            onClick={() => modifyOrder(o.id, "pickup")}
                            disabled={modifyingId === o.id}
                            className="w-full inline-flex items-center justify-center gap-2 text-sm text-amber-700 border border-amber-200 rounded-xl py-2 hover:bg-amber-50 transition-colors disabled:opacity-50"
                          >
                            {modifyingId === o.id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Package className="w-4 h-4" />}
                            {lang === "ar" ? "🏪 تحويل إلى استلام من المتجر (مجاني)"
                              : lang === "fr" ? "🏪 Convertir en retrait magasin (gratuit)"
                              : "🏪 Switch to store pickup (free)"}
                          </button>
                        ) : (
                          <button
                            onClick={() => modifyOrder(o.id, "delivery")}
                            disabled={modifyingId === o.id}
                            className="w-full inline-flex items-center justify-center gap-2 text-sm text-blue-700 border border-blue-200 rounded-xl py-2 hover:bg-blue-50 transition-colors disabled:opacity-50"
                          >
                            {modifyingId === o.id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Package className="w-4 h-4" />}
                            {lang === "ar" ? "🚚 تحويل إلى توصيل للمنزل (250 د.ج)"
                              : lang === "fr" ? "🚚 Convertir en livraison (250 DZD)"
                              : "🚚 Switch to home delivery (250 DZD)"}
                          </button>
                        )}
                        {/* Cancel button */}
                        <button
                          onClick={() => cancelOrder(o.id)}
                          disabled={cancellingId === o.id}
                          className="w-full inline-flex items-center justify-center gap-2 text-sm text-red-600 border border-red-200 rounded-xl py-2 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {cancellingId === o.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <XCircle className="w-4 h-4" />}
                          {lang === "ar" ? "إلغاء الطلب" : lang === "fr" ? "Annuler la commande" : "Cancel Order"}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
