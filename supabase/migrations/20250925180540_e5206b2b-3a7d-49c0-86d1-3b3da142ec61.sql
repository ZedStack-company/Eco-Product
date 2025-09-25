-- Fix security definer view issue
DROP VIEW IF EXISTS public.top_sellers;

-- Create a regular view (not security definer) for top sellers
CREATE VIEW public.top_sellers AS
SELECT 
  p.*,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COUNT(r.id) as review_count
FROM public.products p
LEFT JOIN public.reviews r ON p.id = r.product_id
GROUP BY p.id
HAVING COALESCE(AVG(r.rating), 0) >= 4.0;

-- Fix function search path issue by setting search_path
CREATE OR REPLACE FUNCTION public.update_product_flags()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update is_under_20 based on price
  NEW.is_under_20 = (NEW.price < 20);
  
  -- Set is_new_arrival to true for new products
  IF TG_OP = 'INSERT' THEN
    NEW.is_new_arrival = true;
  END IF;
  
  RETURN NEW;
END;
$$;