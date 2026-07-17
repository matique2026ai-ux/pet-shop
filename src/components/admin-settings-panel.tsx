"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Users, Download, Trash2 } from "lucide-react";
import { invalidateSettingsCache } from "@/lib/site-settings";

// ────────────────────────────────────────────────────────────────────────────────
// Completely isolated settings panel – lives in its own React subtree so that
// heavy AdminDashboard re-renders never unmount / remount the inputs here.
// ────────────────────────────────────────────────────────────────────────────────

interface AdminSettingsPanelProps {
  adminSecret: string;
  a: any;        // admin i18n object
  onSaved?: () => void;
}

// ── Single input field (fully uncontrolled-style via local ref) ──────────────
interface FieldProps {
  label: string;
  fieldKey: string;
  initialValue: string;
  type?: string;
  isTextarea?: boolean;
  rows?: number;
  onChange: (key: string, value: string) => void;
}

function SettingsField({ label, fieldKey, initialValue, type = "text", isTextarea = false, rows = 3, onChange }: FieldProps) {
  // Use an uncontrolled input backed by a ref so typing never causes a re-render
  // of any parent component – focus is never lost.
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync the DOM value when the data first arrives from the server
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== initialValue) {
      inputRef.current.value = initialValue;
    }
    // Only run when initialValue changes (i.e. after server load), not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(fieldKey, e.target.value);
  };

  const cls =
    "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";

  return (
    <div className={fieldKey === "address" || fieldKey === "areas" || fieldKey === "note" || fieldKey === "about" ? "sm:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isTextarea ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          defaultValue={initialValue}
          rows={rows}
          onChange={handleChange}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={type}
          defaultValue={initialValue}
          onChange={handleChange}
          className={cls}
        />
      )}
    </div>
  );
}

// ── One card section (store / content / delivery) ────────────────────────────
interface SectionCardProps {
  title: string;
  onSave: () => Promise<void>;
  saving: boolean;
  saveLabel: string;
  children: React.ReactNode;
}

function SectionCard({ title, onSave, saving, saveLabel, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#0B1E36]">{title}</h2>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
        >
          {saving && (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          )}
          {saveLabel}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function AdminSettingsPanel({ adminSecret, a, onSaved }: AdminSettingsPanelProps) {
  // Each section keeps its own plain-object "current values" map.
  // We only store these in refs to avoid re-renders while typing.
  const storeRef = useRef<Record<string, string>>({});
  const contentRef = useRef<Record<string, string>>({});
  const deliveryRef = useRef<Record<string, string>>({});

  // We need one piece of real state: the initial values read from the server
  // (used to populate inputs via SettingsField.initialValue).
  const [initialStore, setInitialStore] = useState<Record<string, string>>({});
  const [initialContent, setInitialContent] = useState<Record<string, string>>({});
  const [initialDelivery, setInitialDelivery] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  const [savingStore, setSavingStore] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [savingDelivery, setSavingDelivery] = useState(false);

  const [subscribers, setSubscribers] = useState<{ id: string; email: string; created_at: string }[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);

  const fetchSubscribers = useCallback(async () => {
    try {
      const res = await fetch("/api/newsletter", {
        headers: {
          "x-admin-secret": adminSecret,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubscribers(false);
    }
  }, [adminSecret]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm(a.common?.confirm ?? "Are you sure?")) return;
    try {
      const res = await fetch(`/api/newsletter?id=${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": adminSecret,
        },
      });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((sub) => sub.id !== id));
      } else {
        alert("Failed to delete subscriber");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Email,Subscribed At"].concat(subscribers.map((s) => `"${s.id}","${s.email}","${s.created_at}"`)).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Load settings once on mount ─────────────────────────────────────────
  const load = useCallback(async () => {
    try {
      const data = await fetch("/api/settings").then((r) => r.json());
      if (data?.store) {
        const s = { ...data.store };
        if (s.name && !s.storeName) s.storeName = s.name;
        storeRef.current = s;
        setInitialStore(s);
      }
      if (data?.content) {
        contentRef.current = { ...data.content };
        setInitialContent({ ...data.content });
      }
      if (data?.delivery) {
        deliveryRef.current = { ...data.delivery };
        setInitialDelivery({ ...data.delivery });
      }
      setLoaded(true);
    } catch {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── Generic save helper ──────────────────────────────────────────────────
  const save = async (
    key: string,
    valuesRef: React.MutableRefObject<Record<string, string>>,
    setSaving: (b: boolean) => void,
  ) => {
    setSaving(true);
    try {
      let body = { ...valuesRef.current };
      if (key === "store") {
        if (body.storeName) body.name = body.storeName;
        else if (body.name) body.storeName = body.name;
      }
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ key, value: body }),
      });
      if (!res.ok) throw new Error(await res.text());
      alert(a.settings?.saved ?? "Saved!");
      invalidateSettingsCache();
      onSaved?.();
    } catch (e) {
      alert("Failed: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Store Info ── */}
      <SectionCard
        title={a.settings?.store ?? "Store Information"}
        saveLabel={a.common?.save ?? "Save"}
        saving={savingStore}
        onSave={() => save("store", storeRef, setSavingStore)}
      >
        <SettingsField label={a.settings?.storeName ?? "Store Name"} fieldKey="storeName" initialValue={initialStore.storeName ?? ""} onChange={(k, v) => { storeRef.current[k] = v; }} />
        <SettingsField label={a.settings?.phone ?? "Phone"} fieldKey="phone" initialValue={initialStore.phone ?? ""} onChange={(k, v) => { storeRef.current[k] = v; }} />
        <SettingsField label={a.settings?.email ?? "Email"} fieldKey="email" type="email" initialValue={initialStore.email ?? ""} onChange={(k, v) => { storeRef.current[k] = v; }} />
        <SettingsField label={a.settings?.whatsapp ?? "WhatsApp"} fieldKey="whatsapp" initialValue={initialStore.whatsapp ?? ""} onChange={(k, v) => { storeRef.current[k] = v; }} />
        <SettingsField label={a.settings?.facebook ?? "Facebook"} fieldKey="facebook" initialValue={initialStore.facebook ?? ""} onChange={(k, v) => { storeRef.current[k] = v; }} />
        <SettingsField label={a.settings?.instagram ?? "Instagram"} fieldKey="instagram" initialValue={initialStore.instagram ?? ""} onChange={(k, v) => { storeRef.current[k] = v; }} />
        <SettingsField label={a.settings?.tiktok ?? "TikTok"} fieldKey="tiktok" initialValue={initialStore.tiktok ?? ""} onChange={(k, v) => { storeRef.current[k] = v; }} />
        <SettingsField label={a.settings?.currencyLabel ?? "Currency Label"} fieldKey="currencyLabel" initialValue={initialStore.currencyLabel ?? ""} onChange={(k, v) => { storeRef.current[k] = v; }} />
        <SettingsField label={a.settings?.deliveryFee ?? "Delivery Fee"} fieldKey="deliveryFee" initialValue={initialStore.deliveryFee ?? ""} onChange={(k, v) => { storeRef.current[k] = v; }} />
        <SettingsField label={a.settings?.freeThreshold ?? "Free Delivery Threshold"} fieldKey="freeThreshold" initialValue={initialStore.freeThreshold ?? ""} onChange={(k, v) => { storeRef.current[k] = v; }} />
        <SettingsField label={a.settings?.address ?? "Address"} fieldKey="address" initialValue={initialStore.address ?? ""} onChange={(k, v) => { storeRef.current[k] = v; }} />
      </SectionCard>

      {/* ── Content ── */}
      <SectionCard
        title={a.settings?.content ?? "Site Content"}
        saveLabel={a.common?.save ?? "Save"}
        saving={savingContent}
        onSave={() => save("content", contentRef, setSavingContent)}
      >
        <SettingsField label={a.settings?.heroTitle ?? "Hero Title"} fieldKey="heroTitle" initialValue={initialContent.heroTitle ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />
        <SettingsField label={a.settings?.heroSubtitle ?? "Hero Subtitle"} fieldKey="heroSubtitle" initialValue={initialContent.heroSubtitle ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />
        <SettingsField label={a.settings?.heroCta1 ?? "Button 1"} fieldKey="heroCta1" initialValue={initialContent.heroCta1 ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />
        <SettingsField label={a.settings?.heroCta2 ?? "Button 2"} fieldKey="heroCta2" initialValue={initialContent.heroCta2 ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />
        <SettingsField label={a.settings?.footerText ?? "Footer Text"} fieldKey="footerText" initialValue={initialContent.footerText ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />
        <SettingsField label={a.settings?.about ?? "About"} fieldKey="about" initialValue={initialContent.about ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />
        <SettingsField label="Homepage Hero Background (Video/Image URL)" fieldKey="heroBackground" initialValue={initialContent.heroBackground ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />
        <SettingsField label="Contact Page Hero Background URL" fieldKey="contactHeroImage" initialValue={initialContent.contactHeroImage ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />
        <SettingsField label="Veterinary Page Hero Background URL" fieldKey="vetHeroImage" initialValue={initialContent.vetHeroImage ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />
        <SettingsField label="About Page Hero Background URL" fieldKey="aboutHeroImage" initialValue={initialContent.aboutHeroImage ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />
      </SectionCard>

      {/* ── Delivery ── */}
      <SectionCard
        title={a.settings?.delivery ?? "Delivery"}
        saveLabel={a.common?.save ?? "Save"}
        saving={savingDelivery}
        onSave={() => save("delivery", deliveryRef, setSavingDelivery)}
      >
        {/* Scope select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{a.settings?.deliveryScope ?? "Coverage Area"}</label>
          <select
            defaultValue={initialDelivery.scope ?? "commune"}
            onChange={(e) => { deliveryRef.current.scope = e.target.value; }}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="commune">{a.settings?.scopeCommune ?? "Commune (ex. Sétif)"}</option>
            <option value="wilaya">{a.settings?.scopeWilaya ?? "Wilaya"}</option>
            <option value="national">{a.settings?.scopeNational ?? "National"}</option>
            <option value="international">{a.settings?.scopeInternational ?? "International"}</option>
          </select>
        </div>
        <SettingsField label={a.settings?.deliveryCity ?? "City"} fieldKey="city" initialValue={initialDelivery.city ?? ""} onChange={(k, v) => { deliveryRef.current[k] = v; }} />
        <SettingsField label={a.settings?.deliveryWilaya ?? "Wilaya"} fieldKey="wilaya" initialValue={initialDelivery.wilaya ?? ""} onChange={(k, v) => { deliveryRef.current[k] = v; }} />
        <SettingsField label={a.settings?.deliveryFee ?? "Delivery Fee"} fieldKey="fee" type="number" initialValue={initialDelivery.fee ?? ""} onChange={(k, v) => { deliveryRef.current[k] = v; }} />
        <SettingsField label={a.settings?.freeThreshold ?? "Free Threshold"} fieldKey="freeThreshold" type="number" initialValue={initialDelivery.freeThreshold ?? ""} onChange={(k, v) => { deliveryRef.current[k] = v; }} />
        <SettingsField label={a.settings?.deliveryEta ?? "Delivery ETA"} fieldKey="eta" initialValue={initialDelivery.eta ?? ""} onChange={(k, v) => { deliveryRef.current[k] = v; }} />
        <SettingsField label={a.settings?.deliveryNote ?? "Note"} fieldKey="note" initialValue={initialDelivery.note ?? ""} onChange={(k, v) => { deliveryRef.current[k] = v; }} />
        <SettingsField label={a.settings?.deliveryAreas ?? "Coverage Areas"} fieldKey="areas" isTextarea rows={2} initialValue={initialDelivery.areas ?? ""} onChange={(k, v) => { deliveryRef.current[k] = v; }} />
      </SectionCard>

      {/* ── Newsletter Subscribers ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0B1E36]">{a.settings?.subscribers ?? "Newsletter Subscribers"}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {(a.settings?.subscriberCount ?? "Total Subscribers")}: <span className="font-semibold text-emerald-600">{subscribers.length}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 disabled:opacity-50 disabled:pointer-events-none transition-colors inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {a.settings?.exportCsv ?? "Export CSV"}
          </button>
        </div>

        {loadingSubscribers ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-400">{a.settings?.noSubscribers ?? "No subscribers yet"}</p>
          </div>
        ) : (
          <div className="border border-gray-100 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{sub.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteSubscriber(sub.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
