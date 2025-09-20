import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setProducts, setSelectedCategory } from '../store/slices/productsSlice';
import { mockProducts } from '../data/products';
import ProductGrid from '../components/ui/ProductGrid';
import SectionTitle from '../components/ui/SectionTitle';
import productsHero from '../assets/products-hero.jpg';

const ShopPage = () => {
  const dispatch = useAppDispatch();
  const { items: products, categories, selectedCategory } = useAppSelector(state => state.products);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    dispatch(setProducts(mockProducts));
  }, [dispatch]);

  const filteredProducts = selectedCategory && selectedCategory !== 'All'
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative h-64 flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${productsHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container-eco">
          <h1 className="heading-lg">Popular Products</h1>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-muted/30">
        <div className="container-eco">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => dispatch(setSelectedCategory(category === 'All' ? null : category))}
                  className={`px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors ${
                    (selectedCategory === category) || (category === 'All' && !selectedCategory)
                      ? 'text-foreground border-b-2 border-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-eco">
        <div className="container-eco">
          <SectionTitle 
            title={`${selectedCategory || 'All'} Products`}
            subtitle={`Showing ${sortedProducts.length} products`}
            className="mb-16"
          />
          
          {sortedProducts.length > 0 ? (
            <ProductGrid products={sortedProducts} />
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recently Viewed Section */}
      <section className="section-eco bg-muted/30">
        <div className="container-eco">
          <SectionTitle 
            title="Recently viewed" 
            className="mb-16"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.slice(0, 2).map((product) => (
              <div key={product.id} className="bg-background p-6">
                <div className="flex gap-6">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-24 h-24 object-cover"
                  />
                  <div>
                    <h3 className="font-medium mb-2">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">${product.price}</p>
                    <button className="eco-button">VIEW PRODUCT</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;