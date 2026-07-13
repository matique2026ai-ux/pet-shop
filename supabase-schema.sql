-- Run this in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/_/sql/new

-- === MIGRATION (run if products table already exists with UUID id) ===
-- ALTER TABLE products ALTER COLUMN id TYPE TEXT USING id::text;
-- ======================================================================

-- Categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'paw-print',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subcategories table
CREATE TABLE subcategories (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read subcategories" ON subcategories FOR SELECT USING (true);

-- Only authenticated admin can write
CREATE POLICY "Allow authenticated insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow public insert orders (customers can place orders)
CREATE POLICY "Allow public insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Insert default categories
INSERT INTO categories (id, name, icon, "order") VALUES
  ('cats', 'Cats', 'cat', 1),
  ('dogs', 'Dogs', 'dog', 2),
  ('birds', 'Birds', 'bird', 3),
  ('fish', 'Fish & Reptiles', 'fish', 4),
  ('small-pets', 'Small Pets', 'rabbit', 5);

-- Insert default subcategories
INSERT INTO subcategories (id, category_id, name) VALUES
  ('cats-food', 'cats', 'Food'), ('cats-litter', 'cats', 'Litter'), ('cats-toys', 'cats', 'Toys'),
  ('cats-health', 'cats', 'Health'), ('cats-beds', 'cats', 'Beds'), ('cats-bowls', 'cats', 'Bowls'),
  ('cats-grooming', 'cats', 'Grooming'),
  ('dogs-food', 'dogs', 'Food'), ('dogs-toys', 'dogs', 'Toys'), ('dogs-health', 'dogs', 'Health'),
  ('dogs-accessories', 'dogs', 'Accessories'),
  ('birds-food', 'birds', 'Food'), ('birds-cages', 'birds', 'Cages'), ('birds-accessories', 'birds', 'Accessories'),
  ('fish-aquariums', 'fish', 'Aquariums'), ('fish-food', 'fish', 'Food'), ('fish-accessories', 'fish', 'Accessories'),
   ('smallpets-food', 'small-pets', 'Food'), ('smallpets-cages', 'small-pets', 'Cages');
