import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, Review } from '@/types/product';
import { ReviewService } from '@/services/reviewService';
import ProductGrid from '@/components/product/ProductGrid';
import SectionTitle from '@/components/ui/SectionTitle';
import { useShopProducts } from '@/hooks/useShopProducts';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';

const BestSellerSection = () => {
  const { addToCart } = useCart();
  const { products: allProducts, loading } = useShopProducts(); // fetch all products
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchTopSellers = async () => {
      // Attach review counts
      const productsWithCounts = await Promise.all(
        allProducts.map(async (p) => {
          const reviews: Review[] = await ReviewService.getProductReviews(p.id);
          return { ...p, reviewCount: reviews.length };
        })
      );

      // Filter only products with reviews and sort by review count
      const sorted = productsWithCounts
        .filter((p) => p.reviewCount > 0)
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, 4); // take top 4

      setTopProducts(sorted);
    };

    fetchTopSellers();
  }, [allProducts]);

  return (
    <section className="section-eco">
      <div className="container-eco">
        <SectionTitle 
          title="Top Sellers" 
          subtitle="Our most-reviewed and loved products"
          className="mb-10"
        />
        
        <ProductGrid products={topProducts} loading={loading} onAddToCart={addToCart} />

        <div className="text-center mt-6">
          <Link to="/top-sellers">
            <Button variant="outline" size="lg">
              View More Top Sellers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellerSection;
