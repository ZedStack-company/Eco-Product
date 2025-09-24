import { supabase } from '@/integrations/supabase/client';

// Database schema setup
export const setupDatabase = async () => {
  // Products table
  const { error: productsError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        image_url TEXT,
        category TEXT NOT NULL,
        sub_category TEXT,
        tags TEXT[],
        is_top_seller BOOLEAN DEFAULT false,
        in_stock BOOLEAN DEFAULT true,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
      
      DROP TRIGGER IF EXISTS update_products_updated_at ON products;
      CREATE TRIGGER update_products_updated_at
        BEFORE UPDATE ON products
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `
  });

  if (productsError) {
    console.error('Error setting up products table:', productsError);
  }

  // Create storage bucket for product images
  const { error: bucketError } = await supabase.storage.createBucket('product-images', {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  if (bucketError && bucketError.message !== 'Bucket already exists') {
    console.error('Error creating storage bucket:', bucketError);
  }
};