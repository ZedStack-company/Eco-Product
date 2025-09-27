import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PageSection from '@/components/layout/PageSection';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters, { FilterState } from '@/components/product/ProductFilters';
import SectionTitle from '@/components/ui/SectionTitle';
import { useCategories } from '@/hooks/useProducts';
import { useShopProducts } from '@/hooks/useShopProducts';
import { useCart } from '@/hooks/useCart';
import blogCrafts from '../../assets/blog-crafts.jpg';
import { Product } from '@/types/product'; // ✅ Product type


const SeasonalSalePage = () => {
  const { categories } = useCategories();
  const [filters, setFilters] = useState<FilterState>({
    category: 'Seasonal Sale',
    sortBy: 'name',
    searchQuery: '',
    priceRange: [0, 1000],
    inStock: null,
  });

  const { products: allProducts, loading } = useShopProducts();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);


  const { addToCart } = useCart();

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Local filter and sort logic on products change
  useEffect(() => {
    let filtered =  [...allProducts];

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

  // Expand seasonal products for demo, uses filtered products
  const baseSeasonalProducts = filteredProducts.slice(0, 4);
  const expandedSeasonalProducts = [];
  for (let i = 0; i < 4; i++) {
    baseSeasonalProducts.forEach((product, index) => {
      expandedSeasonalProducts.push({
        ...product,
        id: `seasonal-${product.id}-${i}-${index}`,
        name: `${product.name} ${i > 0 ? `- Holiday Edition ${i + 1}` : ''}`,
        price: product.price * (0.7 + Math.random() * 0.3), // Sale prices
      });
    });
  }
  const seasonalProducts = expandedSeasonalProducts.slice(0, 20);

  return (
    <div>
      {/* Hero Section */}
      <PageSection padding="xl" className="h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${blogCrafts})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/80" />
        <div className="relative z-10 text-center top-36 ">
          <h1 className="heading-xl mb-6 text-white">Seasonal Sale</h1>
          <p className="text-body max-w-2xl mx-auto text-white">
            Limited time offers on handcrafted seasonal items. 
            Embrace the season with our curated collection of sustainable goods.
          </p>
          <div className="mt-6 text-white">
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
            products={filteredProducts}
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
