import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageSection from '@/components/layout/PageSection';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters, { FilterState } from '@/components/product/ProductFilters';
import SectionTitle from '@/components/ui/SectionTitle';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import productOils from '../../assets/product-oils.jpg';
import productCandles from '../../assets/product-candles.jpg';
import productUtensils from '../../assets/product-utensils.jpg';

const CollectionsPage = () => {
  const { categories } = useCategories();
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    sortBy: 'name',
    searchQuery: '',
    priceRange: [0, 1000],
    inStock: null,
  });

  const { products: allProducts, loading } = useProducts();

  // Local filtered products state
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  const { addToCart } = useCart();

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Filter products locally on filter or products change
  useEffect(() => {
    let filtered = allProducts;

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.searchQuery.trim() !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    if (filters.inStock !== null) {
      filtered = filtered.filter(product => product.in_stock === filters.inStock);
    }

    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
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


  const collections = [
    {
      name: 'Under $20',
      description: 'Affordable sustainable products',
      href: '/collections/under-20',
      image: productOils,
      count: filteredProducts.filter(p => p.price <= 20).length,
    },
    {
      name: 'New Arrivals',
      description: 'Latest sustainable finds',
      href: '/collections/new-arrivals',
      image: productCandles,
      count: filteredProducts.slice(0, 4).length,
    },
    {
      name: 'Seasonal Sale',
      description: 'Limited time offers',
      href: '/collections/seasonal-sale',
      image: productUtensils,
      count: filteredProducts.slice(0, 6).length,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <PageSection padding="xl" className="relative overflow-hidden text-center">
        <div className="relative z-10">
          <h1 className="heading-xl mb-6">Collections</h1>
          <p className="text-body max-w-2xl mx-auto">
            Discover our curated collections of sustainable products, 
            thoughtfully organized to help you find exactly what you're looking for.
          </p>
        </div>
      </PageSection>

      {/* Collections Grid */}
      <PageSection>
        <div className="space-y-8">
          <div className="text-center">
            <SectionTitle 
              title="Browse Collections" 
              subtitle="Explore our organized product categories"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.name}
                to={collection.href}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden bg-muted rounded-lg">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                    <div>
                      <h3 className="text-xl font-medium mb-2">{collection.name}</h3>
                      <p className="text-sm opacity-90 mb-2">{collection.description}</p>
                      <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                        {collection.count} items
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Featured Products */}
      <PageSection background="muted">
        <div className="space-y-8">
          <div className="text-center">
            <SectionTitle 
              title="Featured in Collections" 
              subtitle="Popular products across all collections"
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
            products={filteredProducts.slice(0, 8)}
            loading={loading}
            onAddToCart={addToCart}
          />

          <div className="text-center">
            <Link to="/shop" className="eco-button">
              View All Products
            </Link>
          </div>
        </div>
      </PageSection>
    </div>
  );
};

export default CollectionsPage;
