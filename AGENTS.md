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

## Quick orientation

- Storefront pages: `src/app/**` (homepage `page.tsx`, `products/`, `vet/`, `cart/`, `admin/`, etc.)
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
- Vet page image keys must match service IDs (`v1`…`v8`), not `vet-1`.
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

