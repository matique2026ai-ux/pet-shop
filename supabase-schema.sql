-- Supabase SQL Editor. Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'paw-print',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subcategories (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL REFERENCES categories(id),
  subcategory TEXT REFERENCES subcategories(id),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image TEXT,
  badge TEXT CHECK (badge IN ('NEW', 'SALE', NULL)),
  rating DECIMAL(2,1) NOT NULL DEFAULT 4.5,
  reviews INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  features JSONB DEFAULT '[]',
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sold_by TEXT NOT NULL DEFAULT 'piece' CHECK (sold_by IN ('piece', 'weight')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT, -- nullable: guests can check out without an email
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  city TEXT,
  delivery_area TEXT,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_eta TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery zone model (expandable: commune -> wilaya -> national -> international).
ALTER TABLE orders ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_area TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_eta TEXT;

-- Sold-by model (piece | weight). Add if table predates this column.
ALTER TABLE products ADD COLUMN IF NOT EXISTS sold_by TEXT NOT NULL DEFAULT 'piece' CHECK (sold_by IN ('piece', 'weight'));

-- Rich product page: short video + ingredients / composition.
ALTER TABLE products ADD COLUMN IF NOT EXISTS video TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ingredients TEXT;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='products' AND policyname='products_select_public') THEN
    CREATE POLICY products_select_public ON products FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='categories' AND policyname='categories_select_public') THEN
    CREATE POLICY categories_select_public ON categories FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='subcategories' AND policyname='subcategories_select_public') THEN
    CREATE POLICY subcategories_select_public ON subcategories FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='orders_insert_public') THEN
    CREATE POLICY orders_insert_public ON orders FOR INSERT WITH CHECK (coalesce(status, 'pending') = 'pending');
  END IF;
END $$;

INSERT INTO categories (id, name, icon, "order") VALUES
  ('cats', 'Cats', 'cat', 1),
  ('dogs', 'Dogs', 'dog', 2),
  ('birds', 'Birds', 'bird', 3),
  ('fish', 'Fish and Reptiles', 'fish', 4),
  ('small-pets', 'Small Pets', 'rabbit', 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO subcategories (id, category_id, name) VALUES
  ('cats-food', 'cats', 'Food'),
  ('cats-litter', 'cats', 'Litter'),
  ('cats-toys', 'cats', 'Toys'),
  ('cats-health', 'cats', 'Health'),
  ('cats-beds', 'cats', 'Beds'),
  ('cats-bowls', 'cats', 'Bowls'),
  ('cats-grooming', 'cats', 'Grooming'),
  ('dogs-food', 'dogs', 'Food'),
  ('dogs-toys', 'dogs', 'Toys'),
  ('dogs-health', 'dogs', 'Health'),
  ('dogs-accessories', 'dogs', 'Accessories'),
  ('birds-food', 'birds', 'Food'),
  ('birds-cages', 'birds', 'Cages'),
  ('birds-accessories', 'birds', 'Accessories'),
  ('fish-aquariums', 'fish', 'Aquariums'),
  ('fish-food', 'fish', 'Food'),
  ('fish-accessories', 'fish', 'Accessories'),
  ('smallpets-food', 'small-pets', 'Food'),
  ('smallpets-cages', 'small-pets', 'Cages')
ON CONFLICT (id) DO NOTHING;

-- Key/value store for admin-managed site settings, content and translations.
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default delivery config: Commune de Sétif (motorcycle). Expand later to wilayas then worldwide.
INSERT INTO site_settings (key, value) VALUES (
  'delivery',
  '{"scope":"commune","city":"Sétif","wilaya":"Sétif","country":"Algeria","fee":"200","freeThreshold":"5000","eta":"24-48h","areas":"Centre-ville,Aïn El Bey,Cité 1200 Logements,Stade 08 Mai,Zone industrielle","note":"Livraison à domicile dans la commune de Sétif (moto)."}'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- ===========================================================================
-- Customer accounts (Supabase Auth). Optional: shoppers can sign up to follow
-- shop news (newsletter) and track their order history.
-- ===========================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  newsletter BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link orders to the signed-in customer (nullable: guest checkout stays allowed).
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='profiles_select_self') THEN
    CREATE POLICY profiles_select_self ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='profiles_insert_self') THEN
    CREATE POLICY profiles_insert_self ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='profiles_update_self') THEN
    CREATE POLICY profiles_update_self ON profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='orders_select_self') THEN
    CREATE POLICY orders_select_self ON orders FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- Auto-create a profile row when a new auth user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================================================
-- Product reviews. Registered users submit a rating (1-5) + comment. Reviews
-- start as 'pending' and only appear publicly after an admin approves them.
-- ===========================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reviews_product_idx ON reviews (product_id);
CREATE INDEX IF NOT EXISTS reviews_status_idx ON reviews (status);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Anyone can read approved reviews.
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='reviews_select_approved') THEN
    CREATE POLICY reviews_select_approved ON reviews FOR SELECT USING (status = 'approved');
  END IF;
  -- A signed-in user may read their own reviews (to see pending ones).
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='reviews_select_own') THEN
    CREATE POLICY reviews_select_own ON reviews FOR SELECT USING (auth.uid() = user_id);
  END IF;
  -- A signed-in user may submit a review for themselves, always as 'pending'.
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='reviews_insert_own') THEN
    CREATE POLICY reviews_insert_own ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending');
  END IF;
END $$;

