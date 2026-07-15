<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Paws & Wings — Project Agent Guide

Pet-shop e-commerce site (Algerian market). Next.js 16 (App Router) + React 19 + Supabase + Vercel. Full README in `README.md` — read it first.

## Critical rules (will break things if ignored)

1. **`products.id` is `TEXT`, NOT UUID.** Product translations in `src/lib/translations/*` are keyed by original demo IDs (`c1`, `d1`, `b1`…). The `seed` route preserves these IDs. If the DB column is UUID, seeding fails with `invalid input syntax for type uuid: "c1"`. Fix with `ALTER TABLE products ALTER COLUMN id TYPE TEXT USING id::text;`. Never revert to UUID.
2. **Admin password** is hardcoded `admin123` in `src/app/admin/page.tsx` (`ADMIN_PASSWORD`) and MUST equal the `ADMIN_SECRET` env var used by all admin API routes. Change both together.
3. **Keep the 3 translation files in sync**: `src/lib/translations/{en,fr,ar}.ts` must have identical key structure. Arabic (`ar`) sets `dir="rtl"`.
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

