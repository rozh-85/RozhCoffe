
-- SCHEMA FOR ROZH MENU --

-- 1. Create Categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Products table
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Product Prices table
CREATE TABLE IF NOT EXISTS product_prices (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    size TEXT NOT NULL, -- "Small", "Medium", "Large", or "Price" for single priced items
    price_value TEXT NOT NULL, -- Format: "IQD 4,000"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Enable Row Level Security (RLS) - Optional but recommended
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;

-- Note: You can create storage bucket 'product-images' in Supabase Storage.
