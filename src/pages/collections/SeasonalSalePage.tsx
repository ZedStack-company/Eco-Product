import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PageSection from '@/components/layout/PageSection';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters, { FilterState } from '@/components/product/ProductFilters';
import SectionTitle from '@/components/ui/SectionTitle';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import blogCrafts from '../../assets/blog-crafts.jpg';

const SeasonalSalePage = () => {
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

  // Featured seasonal products (first 6 for demo)
  const seasonalProducts = products.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <PageSection padding="xl" className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: `url(${blogCrafts})` }}
        />
        <div className="relative z-10 text-center">
          <h1 className="heading-xl mb-6">Seasonal Sale</h1>
          <p className="text-body max-w-2xl mx-auto">
            Limited time offers on handcrafted seasonal items. 
            Embrace the season with our curated collection of sustainable goods.
          </p>
          <div className="mt-6">
            <span className="bg-accent text-accent-foreground px-4 py-2 text-sm font-medium uppercase tracking-wide">
              Up to 30% Off
            </span>
          </div>
        </div>
      </PageSection>

      {/* Products Section */}
      <PageSection>
        <div className="space-y-8">
          <div className="text-center">
            <SectionTitle 
              title="Seasonal Favorites" 
              subtitle="Handpicked items perfect for the current season"
            />
          </div>

          <ProductFilters
            categories={categories}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            showSearch={true}
            showStockFilter={true}
          />

          <ProductGrid
            products={seasonalProducts}
            loading={loading}
            onAddToCart={addToCart}
            emptyTitle="No seasonal products available"
            emptyDescription="Check back soon for new seasonal offerings."
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
                View All Products
              </Button>
            }
          />
        </div>
      </PageSection>

      {/* Sale Banner */}
      <PageSection background="muted" padding="lg">
        <div className="text-center">
          <h3 className="heading-md mb-4">Don't Miss Out</h3>
          <p className="text-body mb-6">
            Sale ends soon. Shop now to save on your favorite sustainable products.
          </p>
          <Button size="lg" className="eco-button">
            Shop Sale Now
          </Button>
        </div>
      </PageSection>
    </div>
  );
};

export default SeasonalSalePage;