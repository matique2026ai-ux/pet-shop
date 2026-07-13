# Paws & Wings — Pet Shop & Veterinary Clinic

A multilingual (EN / FR / AR) e-commerce site for a pet shop serving the **Algerian market**, built with Next.js (App Router) + Supabase + Vercel. Includes a full storefront, a password-protected admin dashboard, image uploads, and a real PostgreSQL backend.

> **Live site:** https://pet-shop-mu-roan.vercel.app
> **Admin:** https://pet-shop-mu-roan.vercel.app/admin  (password: `admin123`)
> **Repo:** https://github.com/matique2026ai-ux/pet-shop

---

## ⚠️ Read this before coding (Next.js 16 breaking changes)

This project uses **Next.js 16.x** (React 19). Next 16 has breaking changes vs. older versions and vs. most training data. Per the agent rules in `AGENTS.md`:

> **This is NOT the Next.js you know.** Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Pay special attention to: route handler signatures, `params`/`searchParams` being async (Promises) in some contexts, and image config in `next.config.ts`.

---

## Tech Stack

| Layer        | Tech |
|--------------|------|
| Framework    | Next.js 16 (App Router, TypeScript) |
| UI           | React 19, Tailwind-style utility CSS (`globals.css`), framer-motion, lucide-react icons, recharts |
| Backend/DB   | Supabase (PostgreSQL + Storage), accessed via Supabase JS client |
| Auth         | Simple shared-secret (`x-admin-secret` header) for admin API routes |
| Hosting      | Vercel (auto-deploys from `main` branch) |
| i18n         | Custom lightweight context (`src/lib/i18n-context.tsx`) with 3 translation files |

---

## Project Structure

```
src/
  app/
    layout.tsx              # Root layout: Navbar, Footer, WhatsApp, JSON-LD, fonts
    page.tsx               # Homepage
    admin/page.tsx         # Admin dashboard (login + CRUD + analytics + settings)
    products/
      page.tsx             # Product listing + filters + sort
      [category]/page.tsx  # Per-category listing
      [category]/[id]/page.tsx  # Product detail
    categories/page.tsx    # All categories grid
    cart/page.tsx          # Cart + checkout form
    vet/page.tsx           # Veterinary services + team
    about/page.tsx
    contact/page.tsx       # Contact form (Formspree)
    faq/page.tsx           # FAQ (translatable)
    shipping/page.tsx      # Shipping & returns (translatable)
    not-found.tsx
    robots.ts / sitemap.ts
    api/
      products/route.ts            # GET (list) / POST (create)
      products/[id]/route.ts       # GET / PUT / DELETE one product
      categories/route.ts          # GET categories + subcategories
      orders/route.ts              # GET (admin) / POST (public checkout)
      upload/route.ts              # POST image -> Supabase Storage (admin)
      seed/route.ts                # POST -> bulk-import demo products from data.ts
  components/
    navbar.tsx, footer.tsx, product-card.tsx, vet-card.tsx,
    whatsapp-button.tsx, animated-section.tsx, schema-jsonld.tsx
  lib/
    data.ts                 # Source of truth for demo products/categories/vet/team/testimonials
    data-service.ts         # Product CRUD abstraction (Supabase OR localStorage fallback)
    use-translated-data.ts  # Loads API data + applies i18n translations
    i18n-context.tsx        # Language provider (en/fr/ar), dir (rtl for ar), currency
    cart-context.tsx        # Cart state (localStorage)
    use-recently-viewed.ts  # Recently viewed (localStorage)
    supabase.ts             # Supabase client (anon key)
    translations/{en,fr,ar}.ts   # All UI string translations
supabase-schema.sql        # DB schema + seed (categories/subcategories) + migration note
```

---

## Environment Variables

Set these in **Vercel -> Project -> Settings -> Environment Variables** (and in `.env.local` for local dev):

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://yqcfgafscvgpdvvlspvy.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (Supabase anon/public key) | Used by client |
| `ADMIN_SECRET` | `admin123` | **Must match** the hardcoded `ADMIN_PASSWORD` in `src/app/admin/page.tsx`. Required by all admin API routes (`x-admin-secret` header). |

> ⚠️ `.env*` and `mot de passe database supabase.txt` are git-ignored. The Supabase **service-role** key and DB password live only locally and must never be committed.

---

## Database (Supabase)

Run `supabase-schema.sql` in the Supabase SQL Editor once. It creates:

- **`categories`** (id TEXT PK, name, icon, order)
- **`subcategories`** (id TEXT PK, category_id FK, name)
- **`products`** (id **TEXT** PK, name, category, subcategory, price, original_price, image, badge, rating, reviews, description, features JSONB, in_stock, timestamps)
- **`orders`** (id, customer_*, delivery_address, items JSONB, total, status, notes, timestamps)
- Storage bucket **`products`** (public) for uploaded images
- RLS policies: public read on products/categories/subcategories; inserts on orders are public (checkout); product writes gated by `auth.role() = 'authenticated'`.

### ⚠️ CRITICAL: products.id must be TEXT, not UUID

Product **translations are keyed by the original product ID** (`c1`, `d1`, `b1`, …) in `src/lib/translations/*`. The `seed` route inserts products **preserving these original IDs** so translations work. Therefore `products.id` is `TEXT`.

If you created the table with the original `UUID` type, the Seed will fail with:
```
invalid input syntax for type uuid: "c1"
```
**Fix — run this once in the Supabase SQL Editor:**
```sql
ALTER TABLE products ALTER COLUMN id TYPE TEXT USING id::text;
```

---

## Admin Dashboard (`/admin`)

- **Login:** password `admin123` (stored in `ADMIN_PASSWORD` constant in `admin/page.tsx`). The same value must be `ADMIN_SECRET` env var.
- **Tabs:** Dashboard, Products, Orders, Analytics, Settings.
- **Add/Edit Product:** file upload (drag/choose -> uploads to Supabase Storage) **or** paste image URL. Advanced fields (original price, badge, rating, reviews, description, features) are in a collapsible section.
- **Seed:** the **Seed** button (Products tab) bulk-imports all 41 demo products from `src/lib/data.ts` into Supabase. After importing, products are editable and translatable.
- **Analytics:** inventory value, in/out of stock counts, products-per-category chart, price distribution, top-rated table.
- **Settings:** read-only store info + quick actions.

### How product data flows

1. Storefront first tries `GET /api/products` (Supabase).
2. If that returns data -> use it (translated via `use-translated-data.ts`).
3. If empty/fails -> falls back to `src/lib/data.ts` (hardcoded demo data).
4. Admin uses `data-service.ts` (Supabase API, or localStorage fallback).

> After **Seed**, the storefront shows DB products. Before Seed, it shows the `data.ts` fallback. Either way, i18n translations are applied by entity ID.

---

## Internationalization (i18n)

- Languages: **English (en)**, **French (fr)**, **Arabic (ar)**. Arabic switches the layout to RTL (`dir="rtl"`).
- Auto-detects browser language on first visit (`ar`->Arabic, `fr`->French, else English), overridable via the language switcher in the navbar.
- All UI strings live in `src/lib/translations/{en,fr,ar}.ts`. **All three files must stay in sync** (same keys).
- Entity content (product names, descriptions, category/subcategory names, vet services, team, testimonials) is translated in the `entities` section of each file, keyed by the entity's ID.
- **Currency is DZD (د.ج)** for all languages (Algerian market).

### Adding/editing a translation
Edit the corresponding `*.ts` file. Keep key structure identical across all three files. Product/vet/team keys must match the IDs in `src/lib/data.ts`.

---

## Common Tasks

### Run locally
```bash
npm install
# create .env.local with the 3 vars above
npm run dev                        # http://localhost:3000
```

### Build / typecheck
```bash
npm run build      # also runs tsc
npx tsc --noEmit   # type-check only
```

### Deploy
Push to `main` -> Vercel auto-deploys. No manual build step needed.

### Add a product image
In admin -> Add/Edit Product -> "Choose Image" (uploads to Supabase Storage `products` bucket, returns public URL). Or paste a URL. Upload route validates type (JPEG/PNG/WebP/GIF/AVIF) and size (max 5 MB).

---

## Known Gotchas / Things to Watch

1. **products.id = TEXT**, not UUID (see above). Don't "fix" it back to UUID or translations break.
2. **Admin password** is hardcoded (`admin123`) in `admin/page.tsx` AND must equal `ADMIN_SECRET` env. Change both together.
3. **Phone / WhatsApp** are hardcoded (`+213555123456`) in navbar, whatsapp-button, footer, and schema — several different numbers exist across files; centralize if refactoring.
4. **Currency** is hardcoded to DZD in `i18n-context.tsx` regardless of language.
5. **Demo data** in `src/lib/data.ts` uses English names/prices (USD-style numbers) but displays with `د.ج`. Translations override display names; numbers stay as-is.
6. **JSON-LD** schema is injected client-side (works but not ideal for SEO crawlers).
7. **RLS**: product write policies require `authenticated` role, but the app uses the anon key with a custom `x-admin-secret` header — verify write operations actually succeed in production; the API uses the anon client.
8. **Orders API** is public POST (intended for checkout) but validates required fields server-side.
9. The `entities.testimonials.rev3.text` Arabic string still contains the word "تمثيل" in one place (cosmetic) — fix if noticed.

---

## File Cheat-Sheet (where to change what)

| Want to change… | Edit |
|-----------------|------|
| Store name / branding | `layout.tsx`, `translations/*` `footer`/`nav` |
| Product list / detail UI | `components/product-card.tsx`, `app/products/**` |
| Admin UI | `app/admin/page.tsx` |
| Demo catalog data | `lib/data.ts` (then re-Seed) |
| Any visible text | `lib/translations/{en,fr,ar}.ts` |
| Language behavior | `lib/i18n-context.tsx` |
| API behavior | `app/api/**/route.ts` |
| DB schema | `supabase-schema.sql` (re-run in Supabase) |
| Navbar / footer | `components/navbar.tsx`, `components/footer.tsx` |
| Contact form endpoint | `app/contact/page.tsx` (Formspree `xjkyqkdr`) |
| WhatsApp number/message | `components/whatsapp-button.tsx` |
