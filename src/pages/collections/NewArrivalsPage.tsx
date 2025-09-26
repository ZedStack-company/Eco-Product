import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PageSection from '@/components/layout/PageSection';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters, { FilterState } from '@/components/product/ProductFilters';
import SectionTitle from '@/components/ui/SectionTitle';
import { useCategories } from '@/hooks/useProducts';
import { useShopProducts } from '@/hooks/useShopProducts';
import { useCart } from '@/hooks/useCart';
import heroForest from '../../assets/hero-forest.jpg';

const NewArrivalsPage = () => {
  const { categories } = useCategories();
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    sortBy: 'name',
    searchQuery: '',
    priceRange: [0, 1000],
    inStock: null,
  });

  const { products: allProducts, loading } = useShopProducts('New Arrivals');

  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  const { addToCart } = useCart();

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Filtering and sorting logic applied locally
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

  // Expanding new arrivals for demo purposes, uses filtered products
  const baseNewProducts = [...filteredProducts].reverse().slice(0, 3);
  const expandedNewArrivals = [];

  for (let i = 0; i < 5; i++) {
    baseNewProducts.forEach((product, index) => {
      expandedNewArrivals.push({
        ...product,
        id: `new-${product.id}-${i}-${index}`,
        name: `${product.name} ${i > 0 ? `- New Design ${i + 1}` : ''}`,
        price: product.price + Math.random() * 10, // Slightly varied prices
      });
    });
  }

  const newArrivals = expandedNewArrivals.slice(0, 16);

  return (
    <div>
      {/* Hero Section */}
      <PageSection padding="xl" className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroForest})` }}
        />
        <div className="relative z-10 text-center">
          <h1 className="heading-xl mb-6">New Arrivals</h1>
          <p className="text-body max-w-2xl mx-auto">
            Discover the latest additions to our sustainable collection. 
            Fresh designs and innovative eco-friendly materials.
          </p>
          <div className="mt-6">
            <span className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium uppercase tracking-wide">
              Just In
            </span>
          </div>
        </div>
      </PageSection>

      {/* Products Section */}
      <PageSection>
        <div className="space-y-8">
          <div className="text-center">
            <SectionTitle 
              title="Latest Products" 
              subtitle="Be the first to discover our newest sustainable finds"
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
            products={newArrivals}
            loading={loading}
            onAddToCart={addToCart}
            emptyTitle="No new arrivals yet"
            emptyDescription="Check back soon for the latest sustainable products."
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

      {/* Newsletter Section */}
      <PageSection background="muted">
        <div className="text-center">
          <SectionTitle 
            title="Stay Updated" 
            subtitle="Be first to know about new arrivals"
          />
          <div className="max-w-md mx-auto flex mt-8">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-border focus:outline-none focus:border-foreground"
            />
            <button className="eco-button ml-2">
              NOTIFY ME
            </button>
          </div>
        </div>
      </PageSection>
    </div>
  );
};

export default NewArrivalsPage;
