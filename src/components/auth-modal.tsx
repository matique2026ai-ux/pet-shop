"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { useAuth } from "@/lib/auth-context";
import { X, Mail, Lock, User as UserIcon, Loader2, CheckCircle } from "lucide-react";

function translateAuthError(msg: string, lang: string): string {
  const m = msg.toLowerCase();
  if (m.includes("already registered") || m.includes("user_already_exists")) {
    return lang === "ar"
      ? "هذا البريد الإلكتروني مسجل بالفعل. يرجى اختيار تسجيل الدخول."
      : lang === "fr"
      ? "Cet e-mail est déjà inscrit. Veuillez vous connecter."
      : "This email is already registered. Please log in.";
  }
  if (m.includes("invalid login credentials") || m.includes("invalid_credentials")) {
    return lang === "ar"
      ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
      : lang === "fr"
      ? "E-mail ou mot de passe incorrect."
      : "Invalid email or password.";
  }
  if (m.includes("email not confirmed")) {
    return lang === "ar"
      ? "لم يتم تأكيد البريد الإلكتروني بعد. يرجى مراجعة البريد الوارد أو طلب إعادة إرسال التفعيل."
      : lang === "fr"
      ? "E-mail non confirmé. Veuillez vérifier votre boîte de réception."
      : "Email not confirmed. Please check your inbox.";
  }
  if (m.includes("at least 6 characters") || m.includes("password should be")) {
    return lang === "ar"
      ? "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل."
      : lang === "fr"
      ? "Le mot de passe doit contenir au moins 6 caractères."
      : "Password must be at least 6 characters.";
  }
  return msg;
}

export default function AuthModal({
  open,
  onClose,
  initialTab = "login",
}: {
  open: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}) {
  const { t, lang, dir } = useI18n();
  const { login, register, resendConfirmation } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

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
        if (r.error) setError(translateAuthError(r.error, lang));
        else onClose();
      } else {
        const r = await register(email, password, name);
        if (r.error) setError(translateAuthError(r.error, lang));
        else if (r.needsConfirmation) {
          setAwaitingConfirmation(true);
        } else onClose();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose} dir={dir}>
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 end-4 text-gray-400 hover:text-gray-700" aria-label={t.auth.close}>
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-5">{t.auth.title}</h2>

        {awaitingConfirmation ? (
          <div className="text-center py-2">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t.auth.checkEmailTitle}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{t.auth.checkEmailDesc.replace("{email}", email)}</p>
            <button
              type="button"
              onClick={() => { setAwaitingConfirmation(false); switchTab("login"); }}
              className="mt-5 text-sm text-emerald-600 font-medium hover:underline"
            >
              {t.auth.checkEmailBack}
            </button>
          </div>
        ) : (
          <>
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
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                {error}
                {tab === "login" && /confirm|تأكيد/i.test(error) && (
                  <button
                    type="button"
                    onClick={async () => {
                      const r = await resendConfirmation(email);
                      if (r.error) setError(translateAuthError(r.error, lang));
                      else { setError(null); setInfo(t.auth.resendConfirmSent); }
                    }}
                    className="block mt-2 text-emerald-700 font-medium hover:underline"
                  >
                    {t.auth.resendConfirm}
                  </button>
                )}
              </div>
            )}
            {info && (
              <div className="mb-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-2.5">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {info}
              </div>
            )}

            <form onSubmit={submit} className="space-y-3">
              {tab === "register" && (
                <div className="relative">
                  <UserIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder={t.auth.name}
                    className="w-full ps-9 pe-3 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t.auth.email}
                  className="w-full ps-9 pe-3 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder={t.auth.password}
                  className="w-full ps-9 pe-3 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 shadow-md shadow-emerald-900/10"
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {tab === "login" ? t.auth.submitLogin : t.auth.submitRegister}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              {tab === "login" ? (
                <button type="button" onClick={() => switchTab("register")} className="text-emerald-600 font-medium hover:underline">
                  {t.auth.orRegister}
                </button>
              ) : (
                <button type="button" onClick={() => switchTab("login")} className="text-emerald-600 font-medium hover:underline">
                  {t.auth.orLogin}
                </button>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
