import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setProducts } from '../store/slices/productsSlice';
import { mockProducts } from '../data/products';
import { useCart } from '../hooks/useCart';
import HeroSlider from '../components/ui/HeroSlider';
import ProductGrid from '../components/product/ProductGrid';
import SectionTitle from '../components/ui/SectionTitle';
import productsHero from '../assets/products-hero.jpg';
import ecoHome from '../assets/eco-home.jpg';
import blogAutumn from '../assets/blog-autumn.jpg';
import blogCrafts from '../assets/blog-crafts.jpg';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products.items);
  const { addToCart } = useCart();

  useEffect(() => {
    dispatch(setProducts(mockProducts));
  }, [dispatch]);

  const featuredProducts = products.slice(0, 8);

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Best Sellers Section */}
      <section className="section-eco">
        <div className="container-eco">
          <SectionTitle 
            title="Best sellers" 
            className="mb-16"
          />
          <ProductGrid products={featuredProducts.slice(0, 4)} onAddToCart={addToCart} />
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="section-eco bg-muted/30">
        <div className="container-eco">
          <SectionTitle 
            title="BESTSELLERS" 
            className="mb-16"
          />
          <ProductGrid products={featuredProducts} onAddToCart={addToCart} />
          <div className="text-center mt-12">
            <Link to="/shop" className="eco-button">
              VIEW ALL
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section 
        className="relative py-24 text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${blogAutumn})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container-eco">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-lg mb-6">Special Offers</h2>
            <p className="text-xl mb-8">Discover sustainable living with our curated collection</p>
            <Link to="/shop" className="eco-button-inverse">
              EXPLORE DEALS
            </Link>
          </div>
        </div>
      </section>

      {/* All time Picks Section */}
      <section className="section-eco">
        <div className="container-eco">
          <SectionTitle 
            title="All time picks" 
            className="mb-16"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="image-zoom-slow">
              <img 
                src={blogCrafts} 
                alt="Handcrafted artisanal items" 
                className="w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <h3 className="heading-md">
                Created with care, crafted with purpose
              </h3>
              <p className="text-body">
                Handcrafted items that tell a story and enrich your life.
              </p>
              <Link to="/about" className="eco-button">
                LEARN MORE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-eco bg-muted/30">
        <div className="container-eco">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="font-medium mb-2">Free Shipping</h4>
              <p className="text-sm text-muted-foreground">On orders over $100</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Sustainable</h4>
              <p className="text-sm text-muted-foreground">Eco-friendly materials</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Handcrafted</h4>
              <p className="text-sm text-muted-foreground">Made with care</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Support</h4>
              <p className="text-sm text-muted-foreground">24/7 customer service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-eco">
        <div className="container-eco text-center">
          <SectionTitle 
            title="Stay Connected" 
            subtitle="Be the first to know about new arrivals and special offers"
            className="mb-8"
          />
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-border focus:outline-none focus:border-foreground"
            />
            <button className="eco-button ml-2">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;