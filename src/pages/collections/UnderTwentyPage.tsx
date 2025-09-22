import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PageSection from '@/components/layout/PageSection';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters, { FilterState } from '@/components/product/ProductFilters';
import SectionTitle from '@/components/ui/SectionTitle';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import blogAutumn from '../../assets/blog-autumn.jpg';

const UnderTwentyPage = () => {
  const { categories } = useCategories();
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    sortBy: 'price',
    searchQuery: '',
    priceRange: [0, 20],
    inStock: null,
  });

  const { products, loading } = useProducts({
    initialFilters: filters,
  });

  const { addToCart } = useCart();

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Filter products under $20 and expand with duplicates for demo
  const baseAffordableProducts = products.filter(product => product.price <= 20);
  const expandedProducts = [];
  
  // Create more variety by duplicating products with slight variations
  for (let i = 0; i < 5; i++) {
    baseAffordableProducts.forEach((product, index) => {
      expandedProducts.push({
        ...product,
        id: `${product.id}-${i}-${index}`,
        name: `${product.name} ${i > 0 ? `- Variant ${i + 1}` : ''}`,
        price: Math.max(5, product.price - Math.random() * 5), // Ensure under $20
      });
    });
  }
  
  const affordableProducts = expandedProducts.slice(0, 24); // Show up to 24 products

  return (
    <div>
      {/* Hero Section */}
      <PageSection padding="xl" className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${blogAutumn})` }}
        />
        <div className="relative z-10 text-center">
          <h1 className="heading-xl mb-6">Under $20</h1>
          <p className="text-body max-w-2xl mx-auto">
            Discover affordable sustainable products that don't compromise on quality. 
            Great eco-friendly finds all under $20.
          </p>
        </div>
      </PageSection>

      {/* Products Section */}
      <PageSection>
        <div className="space-y-8">
          <div className="text-center">
            <SectionTitle 
              title="Affordable Eco Products" 
              subtitle="Quality sustainable items that fit any budget"
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
            products={affordableProducts}
            loading={loading}
            onAddToCart={addToCart}
            emptyTitle="No products found under $20"
            emptyDescription="Check back soon for more affordable options."
            emptyAction={
              <Button 
                variant="outline" 
                onClick={() => handleFiltersChange({
                  category: null,
                  sortBy: 'price',
                  searchQuery: '',
                  priceRange: [0, 20],
                  inStock: null,
                })}
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

export default UnderTwentyPage;