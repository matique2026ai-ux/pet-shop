-- ============================================================
-- RUN THIS IN SUPABASE SQL EDITOR (Dashboard → SQL Editor)
-- Fixes: missing video_url in categories + expand sold_by units
-- ============================================================

-- 1. Add video_url column to categories (if missing)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 2. Add image_url column to categories (if missing)  
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 3. Update sold_by CHECK constraint to allow all 10 unit types
--    First drop the old constraint, then convert existing 'weight' value to 'kg' to prevent check violation
DO $$ BEGIN
  ALTER TABLE products DROP CONSTRAINT IF EXISTS products_sold_by_check;
EXCEPTION WHEN others THEN NULL;
END $$;

UPDATE products SET sold_by = 'kg' WHERE sold_by = 'weight';
UPDATE products SET sold_by = 'piece' WHERE sold_by IS NULL OR sold_by NOT IN ('piece', 'bag', 'box', 'bottle', 'pack', 'dose', 'kg', 'g', 'l', 'ml');

ALTER TABLE products ADD CONSTRAINT products_sold_by_check
  CHECK (sold_by IN ('piece', 'bag', 'box', 'bottle', 'pack', 'dose', 'kg', 'g', 'l', 'ml'));

-- 4. Also add extra product columns if missing
ALTER TABLE products ADD COLUMN IF NOT EXISTS video TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ingredients TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sold_by TEXT NOT NULL DEFAULT 'piece';
