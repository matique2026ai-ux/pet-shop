"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { useAuth } from "@/lib/auth-context";
import { X, Mail, Lock, User as UserIcon, Loader2, CheckCircle } from "lucide-react";

export default function AuthModal({
  open,
  onClose,
  initialTab = "login",
}: {
  open: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}) {
  const { t } = useI18n();
  const { login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const switchTab = (next: "login" | "register") => {
    setTab(next);
    setError(null);
    setInfo(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (tab === "login") {
        const r = await login(email, password);
        if (r.error) setError(r.error);
        else onClose();
      } else {
        const r = await register(email, password, name);
        if (r.error) setError(r.error);
        else if (r.needsConfirmation) {
          setInfo(t.auth.confirmEmail);
          switchTab("login");
        } else onClose();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-5">{t.auth.title}</h2>

        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => switchTab("login")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === "login" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500"}`}
          >
            {t.auth.loginTab}
          </button>
          <button
            type="button"
            onClick={() => switchTab("register")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === "register" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500"}`}
          >
            {t.auth.registerTab}
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</div>
        )}
        {info && (
          <div className="mb-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {info}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          {tab === "register" && (
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t.auth.name}
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t.auth.email}
              className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder={t.auth.password}
              className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {tab === "login" ? t.auth.submitLogin : t.auth.submitRegister}
          </button>
        </form>
      </div>
    </div>
  );
}
