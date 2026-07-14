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
  customer_email TEXT NOT NULL,
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
