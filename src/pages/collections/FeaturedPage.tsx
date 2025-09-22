import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PageSection from '@/components/layout/PageSection';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters, { FilterState } from '@/components/product/ProductFilters';
import SectionTitle from '@/components/ui/SectionTitle';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import productBlanket from '../../assets/product-blanket.jpg';

const FeaturedPage = () => {
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

  // Featured products (top picks)
  const featuredProducts = products.slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <PageSection padding="xl" className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: `url(${productBlanket})` }}
        />
        <div className="relative z-10 text-center">
          <h1 className="heading-xl mb-6">Featured Products</h1>
          <p className="text-body max-w-2xl mx-auto">
            Our handpicked selection of the finest sustainable products. 
            Curated for quality, crafted with care.
          </p>
          <div className="mt-6">
            <span className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium uppercase tracking-wide">
              Editor's Choice
            </span>
          </div>
        </div>
      </PageSection>

      {/* Products Section */}
      <PageSection>
        <div className="space-y-8">
          <div className="text-center">
            <SectionTitle 
              title="Hand-Selected Favorites" 
              subtitle="Premium products chosen by our sustainability experts"
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
            products={featuredProducts}
            loading={loading}
            onAddToCart={addToCart}
            emptyTitle="No featured products available"
            emptyDescription="Check back soon for our latest featured selections."
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
                Browse All Products
              </Button>
            }
          />
        </div>
      </PageSection>

      {/* Why Featured Section */}
      <PageSection background="muted" padding="lg">
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="heading-md mb-4">Why These Products?</h3>
          <p className="text-body mb-6">
            Each featured product is carefully selected based on sustainability impact, 
            quality craftsmanship, and customer satisfaction. These are the items our 
            community loves most.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <h4 className="font-medium mb-2">Sustainability</h4>
              <p className="text-sm text-muted-foreground">Eco-friendly materials and ethical production</p>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Quality</h4>
              <p className="text-sm text-muted-foreground">Durable, well-made products that last</p>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Community Loved</h4>
              <p className="text-sm text-muted-foreground">Top-rated by our eco-conscious customers</p>
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
};

export default FeaturedPage;