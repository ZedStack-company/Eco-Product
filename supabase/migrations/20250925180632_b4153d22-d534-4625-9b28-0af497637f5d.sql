-- Drop the problematic view and create a function instead
DROP VIEW IF EXISTS public.top_sellers;

-- Create a function to get top sellers instead of a view
CREATE OR REPLACE FUNCTION public.get_top_sellers()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price NUMERIC,
  image_url TEXT,
  images TEXT[],
  category TEXT,
  sub_category TEXT,
  in_stock BOOLEAN,
  is_new_arrival BOOLEAN,
  is_under_20 BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  average_rating NUMERIC,
  review_count BIGINT
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.image_url,
    p.images,
    p.category,
    p.sub_category,
    p.in_stock,
    p.is_new_arrival,
    p.is_under_20,
    p.created_at,
    p.updated_at,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.id) as review_count
  FROM public.products p
  LEFT JOIN public.reviews r ON p.id = r.product_id
  GROUP BY p.id, p.name, p.description, p.price, p.image_url, p.images, p.category, p.sub_category, p.in_stock, p.is_new_arrival, p.is_under_20, p.created_at, p.updated_at
  HAVING COALESCE(AVG(r.rating), 0) >= 4.0;
$$;