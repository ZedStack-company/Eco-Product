import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PageSection from '@/components/layout/PageSection';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters, { FilterState } from '@/components/product/ProductFilters';
import SectionTitle from '@/components/ui/SectionTitle';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import productsHero from '../assets/products-hero.jpg';

const ShopPage = () => {
  const { categories } = useCategories();
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    sortBy: 'name',
    searchQuery: '',
    priceRange: [0, 1000],
    inStock: null,
  });

  const { products, loading } = useProducts({
    initialFilters: filters,
  });

  const { addToCart } = useCart();

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const recentlyViewedProducts = products.slice(0, 2);

  return (
    <div>
      {/* Hero Section */}
      <PageSection padding="xl" className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${productsHero})` }}
        />
        <div className="relative z-10 text-center">
          <h1 className="heading-xl mb-6">Shop All Products</h1>
          <p className="text-body max-w-2xl mx-auto">
            Discover our complete collection of sustainable, eco-friendly products 
            designed to help you live more consciously and beautifully.
          </p>
        </div>
      </PageSection>

      {/* Products Section */}
      <PageSection>
        <div className="space-y-8">
          {/* Filters */}
          <ProductFilters
            categories={categories}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            showSearch={true}
            showStockFilter={true}
          />

          {/* Products Grid */}
          <ProductGrid
            products={products}
            loading={loading}
            onAddToCart={addToCart}
            emptyTitle="No products found"
            emptyDescription="Try adjusting your filters or search terms to find what you're looking for."
            emptyAction={
              <Button 
                variant="outline" 
                onClick={() => handleFiltersChange({
                  category: null,
                  sortBy: 'name',
                  searchQuery: '',
                  priceRange: [0, 1000],
                  inStock: null,
                })}
              >
                Clear All Filters
              </Button>
            }
          />
        </div>
      </PageSection>

      {/* Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <PageSection background="muted">
          <div className="text-center mb-12">
            <SectionTitle 
              title="Recently viewed" 
              subtitle="Products you've recently looked at"
            />
          </div>
          
          <ProductGrid
            products={recentlyViewedProducts}
            onAddToCart={addToCart}
            className="max-w-4xl mx-auto"
          />
        </PageSection>
      )}
    </div>
  );
};

export default ShopPage;