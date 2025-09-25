-- Update products table with new schema
ALTER TABLE public.products DROP COLUMN IF EXISTS is_top_seller;
ALTER TABLE public.products DROP COLUMN IF EXISTS featured;
ALTER TABLE public.products DROP COLUMN IF EXISTS tags;

-- Add new columns
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_under_20 BOOLEAN DEFAULT false;

-- Update existing columns
ALTER TABLE public.products ALTER COLUMN image_url DROP NOT NULL;

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
FOR SELECT USING (true);

CREATE POLICY "Anyone can create reviews" ON public.reviews
FOR INSERT WITH CHECK (true);

-- Create function to automatically update is_under_20
CREATE OR REPLACE FUNCTION public.update_product_flags()
RETURNS TRIGGER AS $$
BEGIN
  -- Update is_under_20 based on price
  NEW.is_under_20 = (NEW.price < 20);
  
  -- Set is_new_arrival to true for new products
  IF TG_OP = 'INSERT' THEN
    NEW.is_new_arrival = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic flag updates
DROP TRIGGER IF EXISTS update_product_flags_trigger ON public.products;
CREATE TRIGGER update_product_flags_trigger
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_flags();

-- Create view for top sellers (products with average rating >= 4.0)
CREATE OR REPLACE VIEW public.top_sellers AS
SELECT 
  p.*,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COUNT(r.id) as review_count
FROM public.products p
LEFT JOIN public.reviews r ON p.id = r.product_id
GROUP BY p.id
HAVING COALESCE(AVG(r.rating), 0) >= 4.0;

-- Delete all existing products to start clean
DELETE FROM public.products;

-- Enable realtime for reviews table
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;