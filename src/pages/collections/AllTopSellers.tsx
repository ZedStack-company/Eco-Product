import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PageSection from '@/components/layout/PageSection';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters, { FilterState } from '@/components/product/ProductFilters';
import SectionTitle from '@/components/ui/SectionTitle';
import { useCategories } from '@/hooks/useProducts';
import { useShopProducts } from '@/hooks/useShopProducts';
import { useCart } from '@/hooks/useCart';
import { Product, Review } from '@/types/product';
import { ReviewService } from '@/services/reviewService';
import blogAutumn from '../../assets/blog-autumn.jpg';

const AllTopSellers = () => {
  const { categories } = useCategories();
  const { products: allProducts, loading } = useShopProducts();
  const { addToCart } = useCart();

  const [filters, setFilters] = useState<FilterState>({
    category: null,
    sortBy: 'price',
    searchQuery: '',
    priceRange: [0, 20000000000],
    inStock: null,
  });

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const processProducts = async () => {
      // Step 1: Attach review counts to products
      const productsWithCounts = await Promise.all(
        allProducts.map(async (p) => {
          const reviews: Review[] = await ReviewService.getProductReviews(p.id);
          return { ...p, reviewCount: reviews.length };
        })
      );

      // Step 2: Only keep products with at least 1 review
      let filtered = productsWithCounts.filter((p) => p.reviewCount > 0);

      // Step 3: Filter by category
      if (filters.category) {
        filtered = filtered.filter((product) => product.category === filters.category);
      }

      // Step 4: Filter by search query
      if (filters.searchQuery.trim() !== '') {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );
      }

      // Step 5: Filter by stock
      if (filters.inStock !== null) {
        filtered = filtered.filter((product) => product.in_stock === filters.inStock);
      }

      // Step 6: Filter by price range
      filtered = filtered.filter(
        (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );

      // Step 7: Sort by review count (highest first)
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);

      // Optionally you can limit to top N (e.g., 10)
      // filtered = filtered.slice(0, 10);

      setFilteredProducts(filtered);
    };

    processProducts();
  }, [filters, allProducts]);

  return (
    <div>
      {/* Hero Section */}
      <PageSection padding="xl" className="h-screen relative overflow-hidden ">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${blogAutumn})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/70" />
        <div className="relative z-10 text-center top-36">
          <h1 className="heading-xl mb-6 text-white">All Top Sellers</h1>
          <p className="text-body max-w-2xl mx-auto text-white">
            Discover our most-reviewed, most-loved eco-friendly products chosen by real customers.
          </p>
        </div>
      </PageSection>

      {/* Products Section */}
      <PageSection>
        <div className="space-y-8">
          <div className="text-center">
            <SectionTitle
              title="Top Rated Products"
              subtitle="Sorted by number of customer reviews"
            />
          </div>

          <ProductFilters
            categories={categories}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            showSearch={true}
            showCategoryFilter={true}
          />

          <ProductGrid
            products={filteredProducts}
            loading={loading}
            onAddToCart={addToCart}
            emptyTitle="No top sellers found"
            emptyDescription="Products will appear here once they receive reviews."
            emptyAction={
              <Button
                variant="outline"
                onClick={() =>
                  handleFiltersChange({
                    category: null,
                    sortBy: 'price',
                    searchQuery: '',
                    priceRange: [0, 2000000000000],
                    inStock: null,
                  })
                }
              >
                Reset Filters
              </Button>
            }
          />
        </div>
      </PageSection>
    </div>
  );
};

export default AllTopSellers;
