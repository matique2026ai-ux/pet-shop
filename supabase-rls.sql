-- ============================================================================
--  RLS LOCKDOWN  (run this in Supabase → SQL Editor)
--  Makes the database secure even if someone has the public anon key.
--  Safe to run multiple times (uses DROP POLICY IF EXISTS).
--  Requires NO service-role key — the SQL editor already runs as admin.
-- ============================================================================

-- 1) Make sure RLS is on for every table.
ALTER TABLE products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories   ENABLE ROW LEVEL SECURITY;

-- 2) Remove any old / loose policies.
DROP POLICY IF EXISTS "Allow public read products"      ON products;
DROP POLICY IF EXISTS "Allow public read categories"    ON categories;
DROP POLICY IF EXISTS "Allow public read subcategories" ON subcategories;
DROP POLICY IF EXISTS "Allow authenticated insert products" ON products;
DROP POLICY IF EXISTS "Allow authenticated update products" ON products;
DROP POLICY IF EXISTS "Allow authenticated delete products" ON products;
DROP POLICY IF EXISTS "Allow authenticated read orders"     ON orders;
DROP POLICY IF EXISTS "Allow authenticated update orders"   ON orders;
DROP POLICY IF EXISTS "Allow public insert orders"          ON orders;

-- 3) Public read for storefront data (anon key is public — this is intended).
CREATE POLICY "Allow public read products"      ON products      FOR SELECT USING (true);
CREATE POLICY "Allow public read categories"    ON categories    FOR SELECT USING (true);
CREATE POLICY "Allow public read subcategories" ON subcategories FOR SELECT USING (true);

-- 4) Customers may ONLY create orders, and only with status 'pending'.
--    They can never read, update, or delete orders, nor touch products.
CREATE POLICY "Allow public insert orders" ON orders
  FOR INSERT WITH CHECK (coalesce(status, 'pending') = 'pending');

-- 5) No INSERT/UPDATE/DELETE policy is created for the anon role on
--    products / categories / subcategories, so anonymous writes are DENIED.
--    Admin writes happen via the SERVICE-ROLE key (bypasses RLS) inside the
--    API routes that are gated by the x-admin-secret header.

-- Verify:
--   SELECT * FROM pg_policies WHERE tablename IN ('products','orders','categories','subcategories');
