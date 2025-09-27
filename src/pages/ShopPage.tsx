import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PageSection from '@/components/layout/PageSection';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters, { FilterState } from '@/components/product/ProductFilters';
import SectionTitle from '@/components/ui/SectionTitle';
import { useCategories } from '@/hooks/useProducts';
import { useShopProducts } from '@/hooks/useShopProducts';
import { useCart } from '@/hooks/useCart';
import productsHero from '../assets/products-hero.jpg';


const ShopPage =  () => {
  const { categories } = useCategories();
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    sortBy: 'name',
    searchQuery: '',
    priceRange: [0, 200000000],
    inStock: null,
  });

  // Products from hook - initially unfiltered or passed with default filters
  const { products: allProducts, loading } = useShopProducts();

  // Local state for filtered products
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  const { addToCart } = useCart();

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Filter products locally whenever filters or allProducts change
  useEffect(() => {
    let filtered = allProducts;

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Filter by search query (case insensitive)
    if (filters.searchQuery.trim() !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Filter by stock status
    if (filters.inStock !== null) {
      filtered = filtered.filter(product => product.in_stock === filters.inStock);
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Sorting
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

  const recentlyViewedProducts = allProducts.slice(0, 2);

  return (
    <div>
      {/* Hero Section */}
      <PageSection padding="xl" className="h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${productsHero})` }}
        />

         <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/80" />
        <div className="relative z-10 text-center top-36">
          <h1 className="heading-xl mb-6 text-white">Shop All Products</h1>
          <p className="text-body max-w-2xl mx-auto text-white">
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
            showCategoryFilter = {true}
          />

          {/* Products Grid */}
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            onAddToCart={addToCart}
            emptyTitle="No products found"
            emptyDescription="Try adjusting your filters or search terms to find what you're looking for."
            emptyAction={
              <Button
                variant="outline"
                onClick={() =>
                  handleFiltersChange({
                    category: null,
                    sortBy: 'name',
                    searchQuery: '',
                    priceRange: [0, 2000000000000],
                    inStock: null,
                  })
                }
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
            <SectionTitle title="Recently viewed" subtitle="Products you've recently looked at" />
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
