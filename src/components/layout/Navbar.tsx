
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleCart } from '../../store/slices/cartSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const shopDropdownCategories = {
  shopEverything: [
    { name: 'Shop Everything', href: '/shop' },
    // { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Under $20', href: '/under-20' },
    { name: 'Seasonal Sale', href: '/seasonal-sale' },
  ],
  featured: [
    { name: 'Blankets', href: '/blankets' },
    { name: 'Spring Feeling', href: '/spring-feeling' },
    { name: 'Plant Lovers', href: '/plant-lovers' },
    { name: 'Home Decor', href: '/home-decor' },
    { name: 'Cruelty-Free Beauty', href: '/cruelty-free-beauty' },
  ],
  collections: [
    { name: 'Art & Prints', href: '/art-prints' },
    { name: 'Books & Magazines', href: '/books-magazines' },
    { name: 'Candles & Incense', href: '/candles-incense' },
    { name: 'Food & Drink', href: '/food-drink' },
    { name: 'Garden', href: '/garden' },
  ],
};

// Placeholder image path - replace with your actual image URL or import
const shopDropdownImage = "/path-to-your-image.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const topSellersDropdownItems = [
    { name: 'All Top Sellers', href: '/top-sellers' },
    // { name: 'Candles', href: '/shop?category=Candles' },
    // { name: 'Kitchen', href: '/shop?category=Kitchen' },
    // { name: 'Body Care', href: '/shop?category=Body Care' },
  ];

  const navigation = [
    { name: 'ABOUT', href: '/about' },
    { name: 'JOURNAL', href: '/journal' },
    { name: 'THEME FEATURES', href: '/theme-features' },
  ];

  const handleCartClick = () => {
    dispatch(toggleCart());
  };

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY >= window.innerHeight) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);

  return (
    <nav className={`fixed top-0 w-full z-50 bg-transparent hover:bg-background transition-all duration-300 group border-b border-black/20 ${
      isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}
    style={{ transition: 'opacity 0.3s ease' }}>
      <div className="container-eco">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-3xl font-extrabold tracking-widest text-white group-hover:text-foreground transition-colors">
            ECO
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Shop Dropdown - multi-column with image */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium tracking-widest uppercase hover:text-muted-foreground transition-colors text-white group-hover:text-foreground">
                SHOP
                <ChevronDown className="ml-1 h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border shadow-lg rounded-lg p-6 w-[720px] grid grid-cols-4 gap-6">
                
                {/* Column 1: Shop Everything */}
                <div>
             
                  {shopDropdownCategories.shopEverything.map(item => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link 
                        to={item.href} 
                        className="block text-sm font-medium tracking-wide hover:text-foreground cursor-pointer mb-1"
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* Column 2: Featured */}
                <div>
                 
                  {shopDropdownCategories.featured.map(item => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link 
                        to={item.href} 
                        className="block text-sm font-medium tracking-wide hover:text-foreground cursor-pointer mb-1"
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* Column 3: Collections */}
                <div>
                 
                  {shopDropdownCategories.collections.map(item => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link 
                        to={item.href} 
                        className="block text-sm font-medium tracking-wide hover:text-foreground cursor-pointer mb-1"
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* Column 4: Image */}
                <div className="rounded-lg overflow-hidden">
                  <img src={shopDropdownImage} alt="Shop Preview" className="w-full h-full object-cover rounded-lg" />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Top Sellers Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium tracking-wide hover:text-muted-foreground transition-colors text-white group-hover:text-foreground">
                TOP SELLERS
                <ChevronDown className="ml-1 h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border shadow-lg">
                {topSellersDropdownItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link 
                      to={item.href}
                      className="w-full text-sm font-medium tracking-wide hover:bg-muted cursor-pointer"
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Regular Navigation Items */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium tracking-wide uppercase hover:text-muted-foreground transition-colors ${
                  location.pathname === item.href ? 'text-white group-hover:text-foreground' : 'text-white group-hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:text-muted-foreground transition-colors text-white group-hover:text-foreground">
              <Search size={20} />
            </button>
            <button 
              onClick={handleCartClick}
              className="p-2 hover:text-muted-foreground transition-colors relative text-white group-hover:text-foreground"
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white group-hover:bg-foreground text-foreground group-hover:text-background text-xs rounded-full h-5 w-5 flex items-center justify-center transition-colors">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-white group-hover:text-foreground transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <div className="flex flex-col space-y-4">
              {/* Mobile Shop Items */}
              <div className="space-y-2">
                <span className="text-sm font-medium tracking-wide text-foreground">SHOP</span>
                {shopDropdownCategories.shopEverything.concat(shopDropdownCategories.featured).concat(shopDropdownCategories.collections).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block pl-4 text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* Mobile Top Sellers Items */}
              <div className="space-y-2">
                <span className="text-sm font-medium tracking-wide text-foreground">TOP SELLERS</span>
                {topSellersDropdownItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block pl-4 text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Regular Navigation Items */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium tracking-wide hover:text-muted-foreground transition-colors ${
                    location.pathname === item.href ? 'text-foreground' : 'text-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
