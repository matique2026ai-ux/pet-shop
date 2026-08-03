<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Paws & Wings — Project Agent Guide

Pet-shop e-commerce site (Algerian market). Next.js 16 (App Router) + React 19 + Supabase + Vercel. Full README in `README.md` — read it first.

## Critical rules (will break things if ignored)

1. **`products.id` is `TEXT`, NOT UUID.** Product translations in `src/lib/translations/*` are keyed by original demo IDs (`c1`, `d1`, `b1`…). The `seed` route preserves these IDs. If the DB column is UUID, seeding fails with `invalid input syntax for type uuid: "c1"`. Fix with `ALTER TABLE products ALTER COLUMN id TYPE TEXT USING id::text;`. Never revert to UUID.
2. **Admin password** is verified dynamically against the `ADMIN_SECRET` environment variable via the `/api/admin/verify` API route. There is no hardcoded admin password in `src/app/admin/page.tsx`. Ensure `ADMIN_SECRET` is set in Vercel settings and locally in `.env.local`.
3. **Keep translation files in sync**: The public translations in `src/lib/translations/{en,fr,ar}.ts` must have identical key structure. Similarly, the admin translations inside `src/lib/admin-i18n.ts` must maintain identical keys across its `en`, `fr`, and `ar` objects. Arabic (`ar`) sets `dir="rtl"`.
4. **Currency** is always DZD (`د.ج`) regardless of language.
5. **`.env*` and `mot de passe database supabase.txt` are git-ignored** — never commit secrets (Supabase service-role key, DB password).
6. **Demo catalog source of truth** is `src/lib/data.ts`; to change products, edit it then click **Seed** in the admin Products tab.
7. **Always commit and push** every change to `main` (Vercel auto-deploys) **without asking for confirmation**. The user prefers autonomous publishing. Still: never commit `.env*`, secrets, or the password text file.
8. **Official Circular Badge Logo is at `/logo-badge.png`**. Do not construct custom SVG code paths or attempt mock vectors to represent the logo in `LogoC1`, `LogoC4`, or `LogoFullStack` - the official transparent circle badge `/logo-badge.png` (which has the background removed and the subtitle erased) must be used directly everywhere.
9. **WhatsApp AutoResponder & Webhook**: The store uses an automated WhatsApp bot / AutoResponder (`/api/whatsapp/webhook` + Meta Webhook). All generated WhatsApp links/messages must format phone numbers via `formatWhatsAppNumber` (yielding clean digits `213XXXXXXXXX` without `+` or leading `0` after country code) and maintain structured text for automated responder triggers.

## Quick orientation

- Storefront pages: `src/app/**` (homepage `page.tsx`, `products/`, `blog/`, `cart/`, `admin/`, etc.)
- Admin dashboard: `src/app/admin/page.tsx`
- APIs: `src/app/api/**` (products, categories, orders, upload, seed)
- i18n: `src/lib/i18n-context.tsx` + `src/lib/translations/*`
- Data layer: `src/lib/data.ts` (demo), `src/lib/data-service.ts` (CRUD), `src/lib/use-translated-data.ts` (load + translate)
- DB schema: `supabase-schema.sql` (run in Supabase SQL Editor)
- Deploy: push to `main` → Vercel auto-deploys.

## Before you commit

- `npx tsc --noEmit` must pass.
- `npm run build` should succeed.
- Don't commit `.env*` or the password text file.

## Recurring pain points already solved (don't reintroduce)

- Cart checkout must not clear the cart on API failure (show error instead).
- FAQ and Shipping pages must use `t.faq.items` / `t.shipping.sections` (now translatable), not hardcoded English.
- Upload API validates file type + 5 MB size limit.
- Orders API validates required fields.
- **Card Footprints**: Footprints on product cards are rendered dynamically via `CardFootprintDecor` inside `src/components/product-card.tsx` based on `product.category`. Do not remove the `relative z-10` from the card details to avoid background overlaps.
- **Admin Multilingual UI**: Admin dashboard elements and labels must be translated using the dictionary `a` (from `useAdminI18n()`), such as `{a.dashboard.totalRevenue}`, instead of using hardcoded English text.
- **Direction & Alignment (RTL/LTR)**: Avoid manual, ad-hoc flex-direction reversals (like `flex-row-reverse` conditional on language) in pages. Let the browser's native `dir="rtl"` (or `dir="ltr"`) handle layouts. Use `dir="auto"` on dynamic user-generated content (like product names, review texts) to let the browser automatically resolve direction.
- **Branding & Theme Colors**: Do not introduce generic blue buttons or accents. Keep styling aligned with the primary brand colors: emerald green (e.g. `bg-emerald-600`, `text-emerald-800`) and warm gold/amber accents.
- **Fonts**: Use the `Cairo` font for Arabic texts and the `Outfit` font for Latin languages (English and French).
- **Bestsellers Fallback**: In bestseller/popular product collections, if no products meet the rating threshold, fallback to rendering the first 8 products to prevent a blank list.
- **Loading State Flash Avoidance**: During database product fetch loading states, return empty arrays (or loaders) instead of temporarily showing demo/placeholder products to prevent visual layout flashes.

---

## Agent Handoff Notes

> Last updated: 2026-08-03 | Commit: `bae556d` on `main`

---

### ✅ Work Completed in Last Session

#### Fix 1 — Facebook OpenGraph & `fb:app_id`
**File:** `src/app/layout.tsx`
- Added explicit `<head>` block with `<meta property="fb:app_id" content="966242223397117" />` and complete `og:site_name`, `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:image:width`, `og:image:height` properties.
- Resolves Facebook Sharing Debugger missing `fb:app_id` property requirement.

#### Fix 2 — Mobile Hero Buttons Layout Fix
**File:** `src/app/page.tsx`
- Adjusted hero container padding (`pb-36`) and updated trust features bar layout on mobile viewports so the 2nd hero CTA button ("المدونة / Blog") is no longer truncated or covered by the bottom bar.

#### Fix 3 — Cart Shipping Rules & 69 Wilayas
**Files:** `src/lib/wilayas.ts`, `src/app/cart/page.tsx`, `src/lib/translations/*.ts`
- **Shipping Fee Hold**: Shipping fee is NOT added to subtotal or calculated until the customer selects a Wilaya (`wilaya === "" => deliveryFee = 0, grandTotal = subtotal, display "-"`).
- **Sétif Motorcycle Delivery**: Automatic detection of Sétif commune/wilaya displaying `🛵 توصيل سريع بالدراجة النارية داخل مدينة سطيف (12-24 ساعة)`.
- **69 Wilayas of Algeria**: Updated `WILAYAS` data with 69 wilayas (including new administrative divisions), formatted cleanly with codes (`01 - Adrar (أدرار)` to `69 - Gouraya (قوراية)`). Updated translation files to state 69 Wilayas.

#### Fix 4 — Admin Hero Media Tab Restored
**Files:** `src/app/admin/page.tsx`, `src/lib/admin-i18n.ts`, `src/components/hero-video-manager.tsx`
- Restored **Hero Media (وسائط الهيرو 🎥)** tab in the sidebar of `/admin`.
- Allows live uploading and management of background hero videos and slider images.

---

### 📋 Known Remaining Items (Not Yet Done)

1. **`NEXT_PUBLIC_SITE_URL` env var** — Used in metadata + JSON-LD schemas. Confirm set to `https://paws-wings.vercel.app` in Vercel settings.

---

### 🏗 Architecture Reminders

- **`products.id` is `TEXT`** not UUID — never revert to UUID type
- **Admin password** is env var `ADMIN_SECRET`, verified via `/api/admin/verify`
- **Currency** is always `د.ج` (DZD)
- **Logo** is always `/logo-badge.png` — never construct SVG paths
- **WhatsApp number** format: `213XXXXXXXXX` (no `+`, no leading `0`)
- **Fonts**: `Cairo` for Arabic, `Outfit` for Latin (EN/FR)
- **Brand colors**: emerald green + warm gold/amber — no plain blue buttons
- **i18n direction**: use native `dir="rtl"` — no manual `flex-row-reverse`
- **Translation files** en/ar/fr must stay in sync at all times
- **After any change**: run `npx tsc --noEmit` + `npm run build`, then `git push origin main`

---

### 📁 Key Files Reference

| File | Purpose |
| --- | --- |
| `src/app/layout.tsx` | Global metadata, provider stack, JSON-LD components, explicit OpenGraph head |
| `src/app/page.tsx` | Homepage — hero, bestsellers, trust bar |
| `src/app/products/page.tsx` | Products listing with filtering, search, empty states |
| `src/app/products/[category]/page.tsx` | Per-category product listing |
| `src/components/footer.tsx` | Footer with newsletter form |
| `src/components/whatsapp-button.tsx` | Floating WhatsApp button |
| `src/components/schema-jsonld.tsx` | JSON-LD structured data schemas |
| `src/components/hero-video-manager.tsx` | Admin panel hero media & video manager |
| `src/lib/wilayas.ts` | 69 Wilayas data & Sétif delivery helper functions |
| `src/lib/translations/en.ts` | English translation keys |
| `src/lib/translations/ar.ts` | Arabic translations (RTL) |
| `src/lib/translations/fr.ts` | French translations |
| `src/lib/admin-i18n.ts` | Admin dashboard translations (EN/FR/AR) |
| `src/lib/data.ts` | Demo product/category data — source of truth for catalogue |
| `src/lib/data-service.ts` | Supabase CRUD operations |
| `src/lib/use-translated-data.ts` | Fetches + translates products/categories from API |
| `src/app/api/newsletter/route.ts` | Newsletter subscribe/unsubscribe API |
| `src/app/api/products/route.ts` | Products CRUD API |
| `src/app/admin/page.tsx` | Admin dashboard CRM |
