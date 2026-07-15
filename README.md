# Paws & Wings — Pet Shop & Veterinary Clinic

A multilingual (EN / FR / AR) e-commerce site for a pet shop serving the **Algerian market**, built with Next.js (App Router) + Supabase + Vercel. Includes a full storefront, a password-protected admin CRM dashboard, image/video uploads, multi-image product galleries, and a real PostgreSQL backend.

> **Live site:** https://pet-cat.vercel.app
> **Admin:** https://pet-cat.vercel.app/admin  (password: `admin123`)
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
| UI           | React 19, Tailwind-style utility CSS (`globals.css`), lucide-react icons, recharts |
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
    admin/page.tsx         # Admin dashboard CRM (login + CRUD + analytics + settings)
    products/
      page.tsx             # Product listing + filters + sort
      [category]/page.tsx  # Per-category listing
      [category]/[id]/page.tsx  # Product detail (multi-image gallery + video player)
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
      subcategories/route.ts       # GET subcategories
      orders/route.ts              # GET (admin) / POST (public checkout)
      orders/[id]/route.ts         # PATCH (status) / DELETE
      reviews/route.ts             # GET / POST reviews
      reviews/[id]/route.ts        # PATCH (status) / DELETE
      upload/route.ts              # POST image/video → Supabase Storage (admin)
      settings/route.ts            # GET (public) / PUT (admin) site settings
      hero-videos/route.ts         # GET hero video playlist
      seed/route.ts                # POST → bulk-import demo products from data.ts
      admin/verify/route.ts        # POST → verify admin password
  components/
    navbar.tsx, footer.tsx, product-card.tsx, vet-card.tsx,
    whatsapp-button.tsx, animated-section.tsx, schema-jsonld.tsx,
    brand-logo.tsx, hero-video-manager.tsx, admin-settings-panel.tsx
  lib/
    data.ts                 # Source of truth for demo products/categories/vet/team/testimonials
    data-service.ts         # Product CRUD abstraction (Supabase OR localStorage fallback)
    use-translated-data.ts  # Loads API data + applies i18n translations
    i18n-context.tsx        # Language provider (en/fr/ar), dir (rtl for ar), currency
    admin-i18n.ts           # Admin panel i18n (EN/FR/AR) separate from storefront i18n
    cart-context.tsx        # Cart state (localStorage)
    use-recently-viewed.ts  # Recently viewed (localStorage)
    supabase.ts             # Supabase client (anon + service-role)
    site-settings.ts        # Hook to load site settings from DB
    translations/{en,fr,ar}.ts   # All UI string translations
supabase-schema.sql        # DB schema + seed (categories/subcategories) + migration notes
```

---

## Environment Variables

Set these in **Vercel → Project → Settings → Environment Variables** (and in `.env.local` for local dev):

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Used by public client (reads) |
| `SUPABASE_SERVICE_ROLE_KEY` | Used by admin client (bypasses RLS). Never expose publicly. |
| `ADMIN_SECRET` | Must match the password verified by `/api/admin/verify`. Required by all admin API routes (`x-admin-secret` header). |

> ⚠️ `.env*` and `mot de passe database supabase.txt` are git-ignored. Never commit secrets.

### Changing the Admin Password

1. **Locally:** Edit `.env.local` → set `ADMIN_SECRET=your_new_password`
2. **In production:** Go to Vercel → Project → Settings → Environment Variables → update `ADMIN_SECRET` → Redeploy.

---

## Database (Supabase)

Run `supabase-schema.sql` in the Supabase SQL Editor once. It creates:

- **`categories`** (id TEXT PK, name, icon, order, `image_url`)
- **`subcategories`** (id TEXT PK, category_id FK, name)
- **`products`** (id **TEXT** PK, name, category, subcategory, price, original_price, image, `images` JSONB, badge, rating, reviews, description, features JSONB, in_stock, video, `stock_quantity`, `sold_by`, ingredients, timestamps)
- **`orders`** (id, customer_name, customer_email, customer_phone, delivery_address, city, delivery_area, delivery_fee, delivery_eta, items JSONB, total, status, notes, timestamps)
- **`reviews`** (id, product_id, user_name, rating, comment, status, timestamps)
- **`site_settings`** (key TEXT PK, value JSONB, updated_at) — stores store info, content, delivery settings, and translation overrides
- Storage bucket **`products`** (public) for uploaded images & videos
- RLS policies: public read on products/categories/subcategories; inserts on orders/reviews are public; product writes gated by service-role key.

### ⚠️ CRITICAL: products.id must be TEXT, not UUID

Product **translations are keyed by the original product ID** (`c1`, `d1`, `b1`, …). The `seed` route inserts products preserving these IDs. Therefore `products.id` **must be TEXT**.

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

A full-featured professional CRM panel with:

- **Login:** Verified via `/api/admin/verify` against the `ADMIN_SECRET` env var.
- **Dashboard:** Live KPIs (orders, revenue, customers, inventory), revenue bar chart, category pie chart, recent orders, top products.
- **Products:** Full CRUD with file image upload (Supabase Storage), multi-image gallery upload, video file upload (up to 30 MB), category/subcategory filters, sort by name/category/price/stock, search.
- **Orders:** Full order list with expandable details (phone click-to-call, WhatsApp link, address, items, notes), status update, delete.
- **Analytics:** Inventory value, in/out-of-stock counts, products-per-category chart, price distribution, top-rated table.
- **Categories:** View, add, edit, delete categories + subcategories. Category image upload directly from device.
- **Reviews:** Approve / reject / delete product reviews.
- **Settings:** Fully isolated settings panel for Store Info, Site Content, and Delivery config. Inputs use uncontrolled refs — typing never loses focus.
- **Translations:** Live override of any storefront text for EN/FR/AR without code changes.
- **Seed:** Bulk-imports demo products from `src/lib/data.ts` into Supabase.

### How product data flows

1. Storefront first tries `GET /api/products` (Supabase).
2. If that returns data → use it (translated via `use-translated-data.ts`).
3. If empty/fails → falls back to `src/lib/data.ts` (hardcoded demo data).
4. Admin uses `data-service.ts` (Supabase API, or localStorage fallback).

> After **Seed**, the storefront shows DB products. Before Seed, it shows the `data.ts` fallback.

---

## Internationalization (i18n)

- Languages: **English (en)**, **French (fr)**, **Arabic (ar)**. Arabic switches the layout to RTL (`dir="rtl"`).
- Auto-detects browser language on first visit (`ar`→Arabic, `fr`→French, else English), overridable via the language switcher in the navbar.
- All UI strings live in `src/lib/translations/{en,fr,ar}.ts`. **All three files must stay in sync** (same keys).
- Entity content (product names, descriptions, category/subcategory names, vet services, team, testimonials) is translated in the `entities` section of each file, keyed by the entity's ID.
- Admin panel has its own i18n in `src/lib/admin-i18n.ts` (EN/FR/AR), fully translatable including order details, reviews, and all settings labels.
- **Currency is DZD (د.ج)** for all languages (Algerian market).
- The admin panel displays the current month dynamically in the selected language locale (e.g. "juillet 2026" in French, "يوليو 2026" in Arabic).

---

## Dynamic Theme & Media Management

### Logo Components

The brand system uses the official transparent circular logo badge `/logo-badge.png` defined in [brand-logo.tsx](src/components/brand-logo.tsx):
- **`LogoC1`**: Used as favicon and admin panel header icon.
- **`LogoC4`**: Used in the public Navbar and admin sidebar.
- **`LogoFullStack`**: Complete stacked logo, used in product detail cards.

> ⚠️ Never construct custom SVG paths or mock vectors for the logo — always use `/logo-badge.png` directly.

### Dynamic Hero Backgrounds

All page heroes load their background media from the **Admin Settings** database:
- **Homepage Hero**: `heroBackground` key (supports video URLs `.mp4/.webm` or image URLs)
- **Contact Page**: `contactHeroImage`
- **Veterinary Clinic Page**: `vetHeroImage`
- **About Page**: `aboutHeroImage`

*To change: `/admin` → Settings → Site Content.*

### Multi-Image Product Gallery & Video

Each product supports:
- A **primary cover image** (upload or URL)
- Up to N **additional gallery images** (stored in `images` JSONB column)
- A **product video** (upload .mp4/.webm directly from device, up to 30 MB, or paste a URL)

The product detail page shows an interactive thumbnail gallery. Clicking a thumbnail switches the main view. Videos play inline.

### Dynamic Category Images

The `categories` table has an `image_url` column. In the Admin **Categories** tab, you can upload or set a URL for each category's image. The Homepage category grid and `/categories` page display these, with a fallback to Unsplash presets.

---

## Icons

The entire site uses **Lucide React** icons exclusively — no emoji. Lucide is the same icon library used by Vercel, Linear, and Notion. All icons are consistent, scalable SVG, and RTL-compatible.

---

## Common Tasks

### Run locally
```bash
npm install
# create .env.local with the 4 vars above
npm run dev                        # http://localhost:3000
```

### Build / typecheck
```bash
npm run build      # full production build
npx tsc --noEmit   # type-check only
```

### Deploy
Push to `main` → Vercel auto-deploys. No manual build step needed.

### Add a product image
Admin → Add/Edit Product → "Choose Image" (uploads to Supabase Storage `products` bucket). Upload validates type (JPEG/PNG/WebP/GIF/AVIF) and size (max 5 MB). Videos: max 30 MB, .mp4/.webm/.mov.

### Clear all products from DB
Use the Supabase SQL Editor: `DELETE FROM products;` — or use the admin panel to delete individually.

### Change the admin password
1. Update `ADMIN_SECRET` in `.env.local`
2. Update `ADMIN_SECRET` in Vercel Environment Variables
3. Redeploy on Vercel

---

## Known Gotchas / Things to Watch

1. **products.id = TEXT**, not UUID (see above). Don't "fix" it back to UUID or translations break.
2. **Admin password** must match `ADMIN_SECRET` env var. Verified server-side via `/api/admin/verify`.
3. **Settings Panel focus bug** was permanently fixed by using uncontrolled inputs backed by refs in `admin-settings-panel.tsx`. Typing in settings fields never loses focus.
4. **Currency** is hardcoded to DZD in `i18n-context.tsx` regardless of language.
5. **RLS**: product write policies use the service-role key (bypasses RLS). The `SUPABASE_SERVICE_ROLE_KEY` must be set in Vercel env vars.
6. **Orders API** is public POST (intended for checkout) but validates required fields server-side.
7. **Vet page images** must use keys `v1`…`v8`, not `vet-1`.
8. **Card Footprints**: rendered via `CardFootprintDecor` inside `product-card.tsx` based on `product.category`. Do not remove `relative z-10` from card details.

---

## File Cheat-Sheet (where to change what)

| Want to change… | Edit |
|-----------------|------|
| Store name / branding | Admin → Settings → Store Information |
| Store phone / email / social | Admin → Settings → Store Information |
| Homepage hero title/subtitle | Admin → Settings → Site Content |
| Hero background video/image | Admin → Settings → Site Content |
| Delivery fee / city / wilaya | Admin → Settings → Delivery |
| Any visible text (storefront) | Admin → Translations tab OR `lib/translations/{en,fr,ar}.ts` |
| Product list / detail UI | `components/product-card.tsx`, `app/products/**` |
| Admin CRM UI | `app/admin/page.tsx` + `components/admin-settings-panel.tsx` |
| Demo catalog data | `lib/data.ts` (then re-Seed from admin) |
| Language behavior | `lib/i18n-context.tsx` |
| API behavior | `app/api/**/route.ts` |
| DB schema | `supabase-schema.sql` (re-run in Supabase) |
| Navbar / footer | `components/navbar.tsx`, `components/footer.tsx` |
| Contact form endpoint | `app/contact/page.tsx` (Formspree `xjkyqkdr`) |
| WhatsApp number/message | `components/whatsapp-button.tsx` |
| Logo | `/public/logo-badge.png` + `components/brand-logo.tsx` |
