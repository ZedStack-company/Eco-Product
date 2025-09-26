import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PageSection from '@/components/layout/PageSection';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters, { FilterState } from '@/components/product/ProductFilters';
import SectionTitle from '@/components/ui/SectionTitle';
import { useCategories } from '@/hooks/useProducts';
import { useShopProducts } from '@/hooks/useShopProducts';
import { useCart } from '@/hooks/useCart';
import blogAutumn from '../../assets/blog-autumn.jpg';

const Cruelty = () => {
  const { categories } = useCategories();
  const { products: allProducts, loading } = useShopProducts('Cruelty-Free Beauty');
  const { addToCart } = useCart();

  const [filters, setFilters] = useState<FilterState>({
    category: null,
    sortBy: 'price',
    searchQuery: '',
    priceRange: [0, 20],
    inStock: null,
  });

  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Local filtering and sorting effect
  useEffect(() => {
    let filtered = allProducts;

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.searchQuery.trim() !== '') {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    if (filters.inStock !== null) {
      filtered = filtered.filter(p => p.in_stock === filters.inStock);
    }

    filtered = filtered.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    switch (filters.sortBy) {
      case 'name':
        filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered = filtered.slice().sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price':
        filtered = filtered.slice().sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = filtered.slice().sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered = filtered.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredProducts(filtered);
  }, [filters, allProducts]);

  return (
    <div>
      {/* Hero Section */}
      <PageSection padding="xl" className="h-screen relative overflow-hidden ">
        <div 
          className=" absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${blogAutumn})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/70" />
        <div className="relative z-10 text-center top-36">
          <h1 className="heading-xl mb-6 text-white">Cruelty Free Beauty</h1>
          <p className="text-body max-w-2xl mx-auto text-white">
            Discover our complete collection of sustainable, eco-friendly products
            designed to help you live more consciously and beautifully.
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
            products={filteredProducts}
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

export default Cruelty;
