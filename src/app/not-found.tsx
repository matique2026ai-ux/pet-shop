"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-stone-900 mb-4">404</h1>
        <p className="text-xl text-stone-600 mb-8">{t.notFound.subtitle}</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-amber-500 text-stone-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t.notFound.cta}
        </Link>
      </div>
    </div>
  );
}
